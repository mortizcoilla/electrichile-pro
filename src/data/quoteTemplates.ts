/**
 * Catálogo de items típicos con precios sugeridos para cotizaciones.
 * Los precios son referenciales en CLP (pesos chilenos, sin IVA).
 * Cada usuario puede ajustarlos desde la pantalla de cotización.
 */

import type { QuoteItem, QuoteTemplate } from '@/types';

export interface CatalogItem {
  id: string;
  description: string;
  category: QuoteItem['category'];
  unit: string;
  unitPrice: number; // CLP sin IVA
}

export const CATALOG: CatalogItem[] = [
  // ── Cables ──────────────────────────────────────────────────────────────
  { id: 'c-cu-1.5', description: 'Cable Cu 1,5 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 980 },
  { id: 'c-cu-2.5', description: 'Cable Cu 2,5 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 1480 },
  { id: 'c-cu-4',   description: 'Cable Cu 4 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 2350 },
  { id: 'c-cu-6',   description: 'Cable Cu 6 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 3520 },
  { id: 'c-cu-10',  description: 'Cable Cu 10 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 5890 },
  { id: 'c-cu-16',  description: 'Cable Cu 16 mm² THW/90', category: 'cable', unit: 'm', unitPrice: 9120 },
  { id: 'c-cu-2x12', description: 'Cable Cu 2×12 AWG (≈4 mm²) RV-K', category: 'cable', unit: 'm', unitPrice: 2900 },
  { id: 'c-cu-3x6', description: 'Cable Cu 3×6 mm² RV-K multiconductor', category: 'cable', unit: 'm', unitPrice: 11200 },

  // ── Protecciones ────────────────────────────────────────────────────────
  { id: 'p-itm-10c', description: 'Interruptor termomagnético 1×10A curva C', category: 'proteccion', unit: 'un', unitPrice: 8900 },
  { id: 'p-itm-16c', description: 'Interruptor termomagnético 1×16A curva C', category: 'proteccion', unit: 'un', unitPrice: 8900 },
  { id: 'p-itm-20c', description: 'Interruptor termomagnético 1×20A curva C', category: 'proteccion', unit: 'un', unitPrice: 9200 },
  { id: 'p-itm-25c', description: 'Interruptor termomagnético 1×25A curva C', category: 'proteccion', unit: 'un', unitPrice: 11500 },
  { id: 'p-itm-32c', description: 'Interruptor termomagnético 1×32A curva C', category: 'proteccion', unit: 'un', unitPrice: 13500 },
  { id: 'p-itm-40c', description: 'Interruptor termomagnético 1×40A curva C', category: 'proteccion', unit: 'un', unitPrice: 17800 },
  { id: 'p-id-25-30', description: 'Interruptor diferencial 2×25A 30mA', category: 'proteccion', unit: 'un', unitPrice: 24500 },
  { id: 'p-id-40-30', description: 'Interruptor diferencial 2×40A 30mA', category: 'proteccion', unit: 'un', unitPrice: 28900 },
  { id: 'p-id-63-30', description: 'Interruptor diferencial 2×63A 30mA', category: 'proteccion', unit: 'un', unitPrice: 36500 },

  // ── Canalización ───────────────────────────────────────────────────────
  { id: 'cn-conduit-20', description: 'Tubería conduit PVC 20 mm (3/4")', category: 'canalizacion', unit: 'm', unitPrice: 1290 },
  { id: 'cn-conduit-25', description: 'Tubería conduit PVC 25 mm (1")', category: 'canalizacion', unit: 'm', unitPrice: 1890 },
  { id: 'cn-caja-pas', description: 'Caja de paso 100×100×50 mm', category: 'canalizacion', unit: 'un', unitPrice: 2950 },
  { id: 'cn-caja-deriv', description: 'Caja de derivación octogonal 75 mm', category: 'canalizacion', unit: 'un', unitPrice: 1890 },

  // ── Tableros ───────────────────────────────────────────────────────────
  { id: 't-6', description: 'Tablero 6 módulos embutido', category: 'tablero', unit: 'un', unitPrice: 18900 },
  { id: 't-12', description: 'Tablero 12 módulos embutido', category: 'tablero', unit: 'un', unitPrice: 28900 },
  { id: 't-24', description: 'Tablero 24 módulos embutido', category: 'tablero', unit: 'un', unitPrice: 48500 },

  // ── Conectores ─────────────────────────────────────────────────────────
  { id: 'k-bornera', description: 'Bornera de conexión', category: 'conector', unit: 'un', unitPrice: 950 },
  { id: 'k-prensa', description: 'Prensastopa para cable', category: 'conector', unit: 'un', unitPrice: 1250 },

  // ── Artefactos ─────────────────────────────────────────────────────────
  { id: 'a-enchufe', description: 'Enchufe 10/16A doble', category: 'artefacto', unit: 'un', unitPrice: 4500 },
  { id: 'a-interruptor', description: 'Interruptor 9/12 simple', category: 'artefacto', unit: 'un', unitPrice: 3200 },
  { id: 'a-combinacion', description: 'Combinación interruptor-enchufe', category: 'artefacto', unit: 'un', unitPrice: 5800 },

  // ── Mano de obra ───────────────────────────────────────────────────────
  { id: 'mo-hora', description: 'Mano de obra calificada', category: 'mano-obra', unit: 'h', unitPrice: 15000 },
  { id: 'mo-visita', description: 'Visita técnica / diagnóstico', category: 'mano-obra', unit: 'un', unitPrice: 25000 },
];

/** Busca un item del catálogo por su id. */
export function findCatalogItem(id: string): CatalogItem | undefined {
  return CATALOG.find((c) => c.id === id);
}

// ─── Plantillas de cotización ─────────────────────────────────────────────

export interface QuoteTemplateInfo {
  id: QuoteTemplate;
  name: string;
  description: string;
  /** Ids de items del catálogo que sugiere la plantilla */
  suggestedItemIds: string[];
  estimatedHours: number;
}

export const QUOTE_TEMPLATES: QuoteTemplateInfo[] = [
  {
    id: 'residential-basic',
    name: 'Residencial básica',
    description: 'Instalación eléctrica de un departamento o casa pequeña (hasta 80 m²)',
    suggestedItemIds: ['t-12', 'p-itm-20c', 'p-itm-16c', 'p-id-40-30', 'c-cu-2.5', 'c-cu-4', 'c-cu-6', 'cn-conduit-20', 'cn-caja-deriv', 'a-enchufe', 'a-interruptor', 'mo-hora'],
    estimatedHours: 16,
  },
  {
    id: 'residential-extension',
    name: 'Ampliación residencial',
    description: 'Ampliación o modificación de instalación existente',
    suggestedItemIds: ['t-6', 'p-itm-20c', 'p-id-25-30', 'c-cu-2.5', 'c-cu-4', 'cn-conduit-20', 'a-enchufe', 'a-interruptor', 'mo-hora'],
    estimatedHours: 8,
  },
  {
    id: 'commercial-small',
    name: 'Local comercial',
    description: 'Local comercial pequeño (< 100 m²) con enchufes e iluminación',
    suggestedItemIds: ['t-24', 'p-itm-32c', 'p-itm-20c', 'p-itm-16c', 'p-id-63-30', 'c-cu-2.5', 'c-cu-4', 'c-cu-6', 'c-cu-10', 'cn-conduit-25', 'a-enchufe', 'a-combinacion', 'mo-hora'],
    estimatedHours: 24,
  },
  {
    id: 'industrial',
    name: 'Industrial / taller',
    description: 'Instalación trifásica industrial con maquinaria',
    suggestedItemIds: ['t-24', 'p-itm-40c', 'p-itm-32c', 'p-id-63-30', 'c-cu-6', 'c-cu-10', 'c-cu-3x6', 'cn-conduit-25', 'a-enchufe', 'mo-hora'],
    estimatedHours: 40,
  },
  {
    id: 'maintenance',
    name: 'Mantención',
    description: 'Mantención preventiva o correctiva',
    suggestedItemIds: ['mo-visita', 'mo-hora'],
    estimatedHours: 2,
  },
  {
    id: 'custom',
    name: 'Personalizada',
    description: 'Empezar desde cero con items a elección',
    suggestedItemIds: [],
    estimatedHours: 0,
  },
];

export function getTemplate(id: QuoteTemplate): QuoteTemplateInfo {
  return QUOTE_TEMPLATES.find((t) => t.id === id) ?? QUOTE_TEMPLATES[QUOTE_TEMPLATES.length - 1];
}
