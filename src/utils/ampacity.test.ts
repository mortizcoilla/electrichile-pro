import { describe, it, expect } from 'vitest';
import { calculateAmpacity } from './ampacity';

describe('calculateAmpacity — IEC 60364-5-523 / RIC N°04', () => {
  it('devuelve null con corriente de diseño ≤ 0', () => {
    expect(calculateAmpacity({
      designCurrent: 0, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    })).toBeNull();
  });

  it('caso típico: 25A, cobre XLPE, método B1, 30°C, 1 circuito → sección mínima 6 mm²', () => {
    // 6 mm² B1 cobre XLPE → 41A
    // 4 mm² B1 cobre XLPE → 32A (también cumple)
    // Buscamos la primera que cumple: 4 mm² con 32A
    const r = calculateAmpacity({
      designCurrent: 25, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    expect(r).not.toBeNull();
    expect(r!.minSection).toBe(4);
    expect(r!.correctedAmpacity).toBeCloseTo(32, 1);
  });

  it('caso: 40A monofásico, 2 circuitos agrupados → debe subir la sección', () => {
    // 1 circuito: 10mm² B1 cobre → 57A ✓
    // 2 circuitos agrupados (factor 0.80): 57 × 0.80 = 45.6A → sigue 10mm²
    // 50A: necesita 16mm² (76 × 0.80 = 60.8A)
    const r = calculateAmpacity({
      designCurrent: 50, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 2,
    });
    expect(r!.minSection).toBe(16);
  });

  it('factor de temperatura reduce ampacidad a 40°C', () => {
    // A 30°C: factor 1.00
    // A 40°C XLPE: factor 0.91
    const r30 = calculateAmpacity({
      designCurrent: 35, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const r40 = calculateAmpacity({
      designCurrent: 35, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 40, groupedCircuits: 1,
    });
    expect(r30!.correctedAmpacity).toBeGreaterThan(r40!.correctedAmpacity);
    expect(r40!.temperatureFactor).toBeCloseTo(0.91, 2);
  });

  it('aluminio tiene menor ampacidad que cobre', () => {
    const cu = calculateAmpacity({
      designCurrent: 30, method: 'B1', material: 'cobre', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    const al = calculateAmpacity({
      designCurrent: 30, method: 'B1', material: 'aluminio', insulation: 'xlpe', ambientC: 30, groupedCircuits: 1,
    });
    expect(al!.correctedAmpacity).toBeLessThan(cu!.correctedAmpacity);
  });
});
