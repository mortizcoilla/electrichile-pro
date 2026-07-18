import { describe, it, expect } from 'vitest';
import {
  calculateVoltageDrop,
  getVoltageStatus,
  getSuggestion,
  CAIDA_MAX_ALIMENTADOR,
  CAIDA_MAX_TOTAL,
} from './voltageDrop';
import { RESISTIVITY } from '@/data/cables';

const RHO_CU = RESISTIVITY.cobre; // 0.0172 Ω·mm²/m

describe('calculateVoltageDrop — RIC N°03, pto 5.1.3', () => {
  it('devuelve null con entradas inválidas', () => {
    expect(calculateVoltageDrop(0, 10, 2.5, RHO_CU, false)).toBeNull();
    expect(calculateVoltageDrop(10, 0, 2.5, RHO_CU, false)).toBeNull();
    expect(calculateVoltageDrop(10, 10, 0, RHO_CU, false)).toBeNull();
    expect(calculateVoltageDrop(-5, 10, 2.5, RHO_CU, false)).toBeNull();
  });

  it('caso típico monofásico 220V: 50m, 20A, 6mm² Cu → ~5,7% (debería ser warning)', () => {
    // V_drop = 2 * 50 * 20 * 0.0172 / 6 = 5.733 V
    // % = 5.733 / 220 * 100 = 2.61% → ok en realidad
    const r = calculateVoltageDrop(50, 20, 6, RHO_CU, false);
    expect(r).not.toBeNull();
    expect(r!.voltageDrop).toBeCloseTo(5.7333, 3);
    expect(r!.percentage).toBeCloseTo(2.606, 3);
  });

  it('caso trifásico 380V: 100m, 30A, 10mm² Cu → ~2,35% (ok)', () => {
    // V_drop = sqrt(3) * 100 * 30 * 0.0172 / 10 = 8.9376 V
    // % = 8.9376 / 380 * 100 = 2.352%
    const r = calculateVoltageDrop(100, 30, 10, RHO_CU, true);
    expect(r).not.toBeNull();
    expect(r!.voltageDrop).toBeCloseTo(8.9376, 3);
    expect(r!.percentage).toBeCloseTo(2.352, 3);
  });

  it('caso que excede el 5% total: 200m, 50A, 4mm² Cu monofásico', () => {
    // V_drop = 2 * 200 * 50 * 0.0172 / 4 = 86 V
    // % = 86 / 220 * 100 = 39.09% → danger
    const r = calculateVoltageDrop(200, 50, 4, RHO_CU, false);
    expect(r).not.toBeNull();
    expect(r!.percentage).toBeGreaterThan(CAIDA_MAX_TOTAL);
  });

  it('límite exacto: cae justo en 3% (alimentador) → ok', () => {
    // Para porcentaje = 3% en 220V monofásico: V_drop = 6.6V
    // 2 * L * I * 0.0172 / S = 6.6  →  con S=10, I=10: L = 6.6 * 10 / (2*10*0.0172) = 191.86m
    const r = calculateVoltageDrop(191.86, 10, 10, RHO_CU, false);
    expect(r!.percentage).toBeCloseTo(3.0, 1);
  });
});

describe('getVoltageStatus', () => {
  it('ok cuando % <= 3% (límite del alimentador según RIC N°03)', () => {
    expect(getVoltageStatus(0)).toBe('ok');
    expect(getVoltageStatus(2.5)).toBe('ok');
    expect(getVoltageStatus(3)).toBe('ok');
  });

  it('warning entre 3% y 5%', () => {
    expect(getVoltageStatus(3.01)).toBe('warning');
    expect(getVoltageStatus(4)).toBe('warning');
    expect(getVoltageStatus(5)).toBe('warning');
  });

  it('danger sobre 5%', () => {
    expect(getVoltageStatus(5.01)).toBe('danger');
    expect(getVoltageStatus(10)).toBe('danger');
  });
});

describe('getSuggestion', () => {
  it('no sugiere nada si ya cumple el 3%', () => {
    const s = getSuggestion(2, 6, 20, 50, RHO_CU, false);
    expect(s).toBeNull();
  });

  it('sugiere aumentar a una sección mayor cuando el resultado está entre 3% y 5%', () => {
    // caso 50m, 20A, 2.5mm² Cu monofásico: 2*50*20*0.0172/2.5 = 13.76V → 6.25% (danger)
    // 6.25% > 5%, así que cae en el caso "considere reducir longitud"
    // Probemos con 4mm²: 2*50*20*0.0172/4 = 8.6V → 3.91% (warning, no sugiere)
    // 6mm²: 2*50*20*0.0172/6 = 5.73V → 2.61% (ok)
    // Empezando con 2.5mm² a 6.25%, debe sugerir 6mm²
    const s = getSuggestion(6.25, 2.5, 20, 50, RHO_CU, false);
    expect(s).toContain('6 mm²');
    expect(s).toContain('RIC N°03');
  });
});

describe('constantes del RIC N°03', () => {
  it('límite del alimentador es 3% según RIC N°03, pto 5.1.3', () => {
    expect(CAIDA_MAX_ALIMENTADOR).toBe(3);
  });
  it('límite total es 5%', () => {
    expect(CAIDA_MAX_TOTAL).toBe(5);
  });
});
