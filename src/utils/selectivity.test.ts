import { describe, it, expect } from 'vitest';
import { recommendProtection, selectCurve } from './selectivity';

describe('selectCurve', () => {
  it('iluminación → curva B', () => {
    expect(selectCurve('iluminacion')).toBe('B');
  });
  it('enchufes → curva C', () => {
    expect(selectCurve('enchufes')).toBe('C');
  });
  it('motor → curva D', () => {
    expect(selectCurve('motor')).toBe('D');
  });
  it('electrónica → curva C', () => {
    expect(selectCurve('electronica')).toBe('C');
  });
});

describe('recommendProtection', () => {
  it('devuelve null con corriente nominal ≤ 0', () => {
    expect(recommendProtection({
      nominalCurrent: 0, loadType: 'enchufes', iccMaxKA: 5,
    })).toBeNull();
  });

  it('enchufes 16A con Icc 5kA → recomienda In 16A, curva C, PdC 10kA', () => {
    const r = recommendProtection({
      nominalCurrent: 16, loadType: 'enchufes', iccMaxKA: 5,
    });
    expect(r).not.toBeNull();
    expect(r!.in).toBe(16);
    expect(r!.curve).toBe('C');
    expect(r!.breakingCapacity).toBe(10);
  });

  it('motor con Inrush 80A → curva D y debe sugerir In superior', () => {
    // 80A inrush sobre curva C (factor 5-10) requiere In ≥ 80/5 = 16A
    // Si nominalCurrent = 6, debe sugerir 16A por Inrush
    const r = recommendProtection({
      nominalCurrent: 6, loadType: 'motor', inrushCurrent: 80, iccMaxKA: 5,
    });
    expect(r!.curve).toBe('D');
    expect(r!.in).toBeGreaterThanOrEqual(16);
  });

  it('iluminación 10A con Icc 1kA → curva B, PdC 3kA', () => {
    const r = recommendProtection({
      nominalCurrent: 10, loadType: 'iluminacion', iccMaxKA: 1,
    });
    expect(r!.curve).toBe('B');
    expect(r!.breakingCapacity).toBe(3);
  });

  it('Icc alta (15 kA) → PdC recomendado debe ser ≥ 15', () => {
    const r = recommendProtection({
      nominalCurrent: 32, loadType: 'enchufes', iccMaxKA: 15,
    });
    expect(r!.breakingCapacity).toBeGreaterThanOrEqual(15);
  });

  it('In seleccionado es un valor normalizado de la serie estándar', () => {
    const standard = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];
    const r = recommendProtection({
      nominalCurrent: 23, loadType: 'enchufes', iccMaxKA: 5,
    });
    expect(standard).toContain(r!.in);
  });
});
