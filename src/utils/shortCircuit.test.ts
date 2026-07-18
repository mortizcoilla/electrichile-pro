import { describe, it, expect } from 'vitest';
import { calculateShortCircuit } from './shortCircuit';

describe('calculateShortCircuit — IEC 60909', () => {
  it('devuelve null con entradas inválidas', () => {
    expect(calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 0, section: 10, material: 'cobre',
    })).toBeNull();
  });

  it('caso típico BT chileno: 380V, 250 MVA, 50m, 10mm² Cu → Icc máx < 10kA', () => {
    // Red: Z = 380²/250M = 0.578 mΩ, Icc_red = 380/(√3·0.578) = 379.5 kA
    // Cable: R = 0.0172 × 50 / 10 = 86 mΩ, X ≈ 4 mΩ
    // Icc = 380/(√3 · √(86² + 8²)) ≈ 2.55 kA
    const r = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 50, section: 10, material: 'cobre',
    });
    expect(r).not.toBeNull();
    expect(r!.iccRedKA).toBeGreaterThan(300);
    expect(r!.iccMaxKA).toBeGreaterThan(2);
    expect(r!.iccMaxKA).toBeLessThan(10);
    expect(r!.enoughWith10kA).toBe(true);
  });

  it('sección mayor → mayor Icc (mismo cable)', () => {
    const r10 = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 50, section: 10, material: 'cobre',
    });
    const r25 = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 50, section: 25, material: 'cobre',
    });
    expect(r25!.iccMaxKA).toBeGreaterThan(r10!.iccMaxKA);
  });

  it('mayor longitud → menor Icc', () => {
    const r10m = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 10, section: 10, material: 'cobre',
    });
    const r100m = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 100, section: 10, material: 'cobre',
    });
    expect(r10m!.iccMaxKA).toBeGreaterThan(r100m!.iccMaxKA);
  });

  it('Icc máxima siempre > Icc mínima', () => {
    const r = calculateShortCircuit({
      type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
      length: 50, section: 10, material: 'cobre',
    });
    expect(r!.iccMaxKA).toBeGreaterThan(r!.iccMinKA);
  });
});
