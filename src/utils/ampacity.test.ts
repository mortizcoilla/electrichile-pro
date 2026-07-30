import { describe, it, expect } from 'vitest';
import { calculateAmpacity } from './ampacity';

describe('calculateAmpacity — RIC N°04, Tabla 4.4', () => {
  it('devuelve null con corriente de diseño ≤ 0', () => {
    expect(calculateAmpacity({
      designCurrent: 0, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    })).toBeNull();
  });

  it('caso típico: 25A, cobre XLPE, método B1, 30°C, 1 circuito → sección mínima 4 mm²', () => {
    // RIC N°04 Tabla 4.4 (90°C):
    //   2.5 mm² B1 XLPE → 24A (no cumple 25A)
    //   4 mm² B1 XLPE → 37A (cumple)
    const r = calculateAmpacity({
      designCurrent: 25, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    expect(r).not.toBeNull();
    expect(r!.minSection).toBe(4);
    expect(r!.correctedAmpacity).toBeCloseTo(37, 1);
  });

  it('caso: 50A cobre XLPE B1, 2 circuitos agrupados → sección mínima 10 mm²', () => {
    // RIC N°04 Tabla 4.4: 10mm² B1 XLPE → 66A
    // Tabla 4.6: 4-6 circuitos factor 0.80 → 66 × 0.80 = 52.8A → 10mm² ✓
    // 16mm² B1 XLPE → 88A × 0.80 = 70.4A → 16mm² ✓
    // La primera que cumple es 10mm².
    const r = calculateAmpacity({
      designCurrent: 50, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 2,
    });
    expect(r!.minSection).toBe(10);
  });

  it('factor de temperatura reduce ampacidad corregida (RIC N°04 Tabla 4.7)', () => {
    // Verificamos que para la misma corriente de diseño (10A), la temperatura
    // más alta requiere una sección mayor (porque la ampacidad corregida baja).
    // RIC N°04 Tabla 4.7: XLPE en métodos A1/A2/B1/B2/E
    //   30°C → 1.00
    //   40°C → 0.91
    const r30 = calculateAmpacity({
      designCurrent: 10, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const r40 = calculateAmpacity({
      designCurrent: 10, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 40, groupedCircuits: 1,
    });
    // A 30°C, 1.5mm² XLPE B1 = 18A → 1.5mm² alcanza
    // A 40°C, 1.5mm² XLPE B1 = 18 * 0.91 = 16.4A → 1.5mm² sigue alcanzando
    // Pero verificamos el factor: el factor a 40°C debe ser 0.91
    expect(r40!.temperatureFactor).toBeCloseTo(0.91, 2);

    // Para 17A: a 30°C 1.5mm² (18A) alcanza, pero a 40°C 1.5mm² (16.4A) no.
    // Necesitamos subir a 2.5mm².
    const rBig30 = calculateAmpacity({
      designCurrent: 17, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const rBig40 = calculateAmpacity({
      designCurrent: 17, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 40, groupedCircuits: 1,
    });
    expect(rBig30!.minSection).toBe(1.5);
    expect(rBig40!.minSection).toBe(2.5);
  });

  it('aluminio tiene menor ampacidad que cobre (factor empírico 0.78, no del RIC)', () => {
    // Comparamos con corriente baja donde ambas secciones mínimas son iguales
    // (1.5mm²), así la diferencia de ampacidad corregida es solo por el factor 0.78.
    const cu = calculateAmpacity({
      designCurrent: 5, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const al = calculateAmpacity({
      designCurrent: 5, method: 'B1', material: 'aluminio', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    // Ambas usan 1.5mm² como minSection (18A Cu vs 14A Al)
    expect(cu!.minSection).toBe(1.5);
    expect(al!.minSection).toBe(1.5);
    // Pero la ampacidad corregida del aluminio debe ser ~78% de la del cobre
    expect(al!.correctedAmpacity).toBeCloseTo(cu!.correctedAmpacity * 0.78, 0);
  });

  it('PVC a 70°C: 4mm² B1 → 28A base (RIC N°04 Tabla 4.4, 70°C)', () => {
    const r = calculateAmpacity({
      designCurrent: 25, method: 'B1', material: 'cobre', insulation: 'pvc', ambientC: 30, groupedCircuits: 1,
    });
    expect(r!.minSection).toBe(4);
    expect(r!.correctedAmpacity).toBeCloseTo(28, 1);
  });

  it('método E (bandeja al aire): mayor ampacidad que método A1 (embutido)', () => {
    // RIC N°04 Tabla 4.4 (90°C): mismo conductor, mayor ampacidad al aire
    const a1 = calculateAmpacity({
      designCurrent: 30, method: 'A1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const e = calculateAmpacity({
      designCurrent: 30, method: 'E', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    // E generalmente permite menor sección que A1
    expect(e!.minSection).toBeLessThanOrEqual(a1!.minSection);
  });
});
