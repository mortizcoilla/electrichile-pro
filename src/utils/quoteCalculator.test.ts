import { describe, it, expect } from 'vitest';
import {
  calculateItemTotal,
  calculateLaborTotal,
  calculateQuoteTotals,
  recomputeQuote,
} from './quoteCalculator';
import type { Quote } from '@/types';

describe('calculateItemTotal', () => {
  it('caso simple: 10 unidades × 1000 CLP = 10000', () => {
    expect(calculateItemTotal({ quantity: 10, unitPrice: 1000, discountPct: 0 })).toBe(10000);
  });

  it('aplica descuento correctamente', () => {
    expect(calculateItemTotal({ quantity: 10, unitPrice: 1000, discountPct: 10 })).toBe(9000);
  });

  it('descuento 100% → 0', () => {
    expect(calculateItemTotal({ quantity: 5, unitPrice: 2000, discountPct: 100 })).toBe(0);
  });
});

describe('calculateLaborTotal', () => {
  it('horas × tarifa sin factor de dificultad', () => {
    expect(calculateLaborTotal({ hours: 8, hourlyRate: 15000, difficultyFactor: 1 })).toBe(120000);
  });

  it('factor 1.5x para trabajo complejo', () => {
    expect(calculateLaborTotal({ hours: 4, hourlyRate: 15000, difficultyFactor: 1.5 })).toBe(90000);
  });
});

describe('calculateQuoteTotals', () => {
  it('caso completo: 2 items + mano de obra + IVA 19%', () => {
    const items = [
      { quantity: 10, unitPrice: 1000, discountPct: 0 },
      { quantity: 2,  unitPrice: 5000, discountPct: 0 },
    ];
    const labor = { hours: 8, hourlyRate: 15000, difficultyFactor: 1 };
    const t = calculateQuoteTotals(items, labor, 0, 19);
    // materiales: 10000 + 10000 = 20000
    expect(t.subtotalMaterials).toBe(20000);
    // mano obra: 8 × 15000 = 120000
    expect(t.subtotalLabor).toBe(120000);
    // subtotal: 140000
    expect(t.subtotal).toBe(140000);
    // IVA 19% sobre 140000 = 26600
    expect(t.taxAmount).toBe(26600);
    // total: 166600
    expect(t.total).toBe(166600);
  });

  it('descuento global 10% se aplica antes del IVA', () => {
    const t = calculateQuoteTotals(
      [{ quantity: 1, unitPrice: 100000, discountPct: 0 }],
      { hours: 0, hourlyRate: 0, difficultyFactor: 1 },
      10,
      19
    );
    expect(t.globalDiscountAmount).toBe(10000);
    expect(t.taxBase).toBe(90000);
    expect(t.taxAmount).toBe(17100);
    expect(t.total).toBe(107100);
  });
});

describe('recomputeQuote', () => {
  it('recalcula todos los totales de una Quote completa', () => {
    const q: Quote = {
      id: 'test',
      number: 'COT-2026-001',
      createdAt: new Date(),
      updatedAt: new Date(),
      validUntil: new Date(),
      status: 'draft',
      template: 'residential-basic',
      clientName: 'Test',
      clientRut: '',
      address: '',
      commune: '',
      region: 'RM',
      items: [
        { id: 'i1', description: 'Cable', category: 'cable', unit: 'm', quantity: 50, unitPrice: 1500, discountPct: 0, total: 0 },
      ],
      labor: { hours: 8, hourlyRate: 15000, difficultyFactor: 1, total: 0 },
      subtotalMaterials: 0,
      subtotalLabor: 0,
      discountPct: 0,
      taxPct: 19,
      taxAmount: 0,
      total: 0,
      notes: '',
    };
    const result = recomputeQuote(q);
    expect(result.subtotalMaterials).toBe(75000);
    expect(result.subtotalLabor).toBe(120000);
    expect(result.taxAmount).toBe(37050);
    expect(result.total).toBe(232050);
  });
});
