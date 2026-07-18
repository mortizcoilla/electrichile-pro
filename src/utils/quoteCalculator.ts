/**
 * @file Cálculo de totales de cotizaciones.
 *
 * @description
 * Lógica pura para calcular subtotales, mano de obra, descuentos, IVA
 * y total final de una cotización.
 *
 * Los precios se manejan en CLP (pesos chilenos) sin IVA por defecto.
 * El IVA por defecto es 19% según la normativa chilena.
 *
 * Fórmulas:
 *   - Subtotal materiales = Σ (qty × unitPrice × (1 - discount/100))
 *   - Subtotal mano de obra = hours × hourlyRate × difficultyFactor
 *   - Descuento global = subtotal × globalDiscountPct/100
 *   - Base imponible = subtotal - descuento global
 *   - IVA = base imponible × taxPct/100
 *   - Total = base imponible + IVA
 */

import type { Quote, QuoteItem, QuoteLabor } from '@/types';

/** Porcentaje de IVA por defecto en Chile. */
export const DEFAULT_TAX_PCT = 19;

/**
 * Calcula el total de un item aplicando cantidad, precio unitario y descuento.
 *
 * @param item - Item con quantity, unitPrice y discountPct.
 * @returns Total redondeado al entero (CLP no usa decimales).
 *
 * @example
 * calculateItemTotal({ quantity: 10, unitPrice: 1000, discountPct: 0 });  // 10000
 * calculateItemTotal({ quantity: 10, unitPrice: 1000, discountPct: 10 }); // 9000
 */
export function calculateItemTotal(item: Pick<QuoteItem, 'quantity' | 'unitPrice' | 'discountPct'>): number {
  const gross = item.quantity * item.unitPrice;
  return Math.round(gross * (1 - (item.discountPct ?? 0) / 100));
}

/**
 * Calcula el total de mano de obra con su factor de dificultad.
 *
 * @param labor - Datos de mano de obra con hours, hourlyRate y difficultyFactor.
 * @returns Total en CLP.
 *
 * @example
 * calculateLaborTotal({ hours: 8, hourlyRate: 15000, difficultyFactor: 1 });   // 120000
 * calculateLaborTotal({ hours: 4, hourlyRate: 15000, difficultyFactor: 1.5 }); // 90000
 */
export function calculateLaborTotal(labor: Pick<QuoteLabor, 'hours' | 'hourlyRate' | 'difficultyFactor'>): number {
  return Math.round(labor.hours * labor.hourlyRate * (labor.difficultyFactor ?? 1));
}

/** Resultado completo del cálculo de totales. */
export interface QuoteTotals {
  /** Suma de los totales de todos los items (con descuento por item). */
  subtotalMaterials: number;
  /** Total de la mano de obra. */
  subtotalLabor: number;
  /** Suma de materiales + mano de obra. */
  subtotal: number;
  /** Monto del descuento global aplicado. */
  globalDiscountAmount: number;
  /** Base sobre la que se calcula el IVA (subtotal - descuento global). */
  taxBase: number;
  /** Monto del IVA. */
  taxAmount: number;
  /** Total final a pagar (base imponible + IVA). */
  total: number;
}

/**
 * Calcula todos los totales de una cotización a partir de los items, mano de obra,
 * descuento global y porcentaje de IVA.
 *
 * @param items            - Lista de items de la cotización.
 * @param labor            - Datos de mano de obra.
 * @param globalDiscountPct- Porcentaje de descuento global (0-100).
 * @param taxPct           - Porcentaje de IVA (default 19%).
 *
 * @returns Objeto con todos los subtotales, descuentos, IVA y total.
 *
 * @example
 * const t = calculateQuoteTotals(
 *   [{ quantity: 10, unitPrice: 1000, discountPct: 0 }],
 *   { hours: 8, hourlyRate: 15000, difficultyFactor: 1 },
 *   0, 19
 * );
 * // → { subtotalMaterials: 10000, subtotalLabor: 120000, taxAmount: 26600, total: 156600, ... }
 */
export function calculateQuoteTotals(
  items: Pick<QuoteItem, 'quantity' | 'unitPrice' | 'discountPct'>[],
  labor: Pick<QuoteLabor, 'hours' | 'hourlyRate' | 'difficultyFactor'>,
  globalDiscountPct: number,
  taxPct: number = DEFAULT_TAX_PCT
): QuoteTotals {
  const subtotalMaterials = items.reduce((acc, it) => acc + calculateItemTotal(it), 0);
  const subtotalLabor = calculateLaborTotal(labor);
  const subtotal = subtotalMaterials + subtotalLabor;
  const globalDiscountAmount = Math.round(subtotal * (globalDiscountPct / 100));
  const taxBase = subtotal - globalDiscountAmount;
  const taxAmount = Math.round(taxBase * (taxPct / 100));
  const total = taxBase + taxAmount;
  return { subtotalMaterials, subtotalLabor, subtotal, globalDiscountAmount, taxBase, taxAmount, total };
}

/**
 * Recalcula todos los totales de una Quote completa, incluyendo el total de cada item
 * (útil para persistir en Dexie).
 *
 * @param quote - Cotización completa.
 * @returns Objeto con los totales recalculados, listos para asignar al quote.
 */
export function recomputeQuote(quote: Quote): QuoteTotals & Pick<Quote, 'subtotalMaterials' | 'subtotalLabor' | 'taxAmount' | 'total'> {
  const t = calculateQuoteTotals(quote.items, quote.labor, quote.discountPct, quote.taxPct);
  return {
    ...t,
    subtotalMaterials: t.subtotalMaterials,
    subtotalLabor: t.subtotalLabor,
    taxAmount: t.taxAmount,
    total: t.total,
  };
}
