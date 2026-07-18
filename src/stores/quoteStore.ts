import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote, QuoteItem, QuoteLabor, QuoteStatus, QuoteTemplate } from '@/types';
import { recomputeQuote } from '@/utils/quoteCalculator';
import { getNextQuoteNumber, addQuote, updateQuote, deleteQuote, getAllQuotes } from '@/database/db';
import { getTemplate, findCatalogItem, type CatalogItem } from '@/data/quoteTemplates';

interface QuoteStoreState {
  // Cache local
  currentQuote: Quote | null;
  loaded: boolean;
  // Acciones
  newQuote: (template: QuoteTemplate) => Promise<Quote>;
  loadQuote: (id: string) => Promise<Quote | null>;
  loadAllQuotes: () => Promise<Quote[]>;
  saveCurrent: () => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  setStatus: (status: QuoteStatus) => void;
  updateCurrent: (changes: Partial<Quote>) => void;
  addItemFromCatalog: (item: CatalogItem) => void;
  addCustomItem: () => void;
  updateItem: (id: string, changes: Partial<QuoteItem>) => void;
  removeItem: (id: string) => void;
  updateLabor: (changes: Partial<QuoteLabor>) => void;
  setTemplate: (template: QuoteTemplate) => void;
  setClientSignature: (dataUrl: string | undefined) => void;
  reset: () => void;
}

function buildEmptyQuote(template: QuoteTemplate, number: string): Quote {
  const now = new Date();
  const valid = new Date();
  valid.setDate(valid.getDate() + 15); // 15 días de validez
  const tpl = getTemplate(template);

  const items: QuoteItem[] = tpl.suggestedItemIds
    .map((id) => findCatalogItem(id))
    .filter((c): c is CatalogItem => Boolean(c))
    .map((c, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      description: c.description,
      category: c.category,
      unit: c.unit,
      quantity: 1,
      unitPrice: c.unitPrice,
      discountPct: 0,
      total: c.unitPrice,
    }));

  const labor: QuoteLabor = {
    hours: tpl.estimatedHours,
    hourlyRate: 15000,
    difficultyFactor: 1,
    total: tpl.estimatedHours * 15000,
  };

  const quote: Quote = {
    id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    number,
    createdAt: now,
    updatedAt: now,
    validUntil: valid,
    status: 'draft',
    template,
    clientName: '',
    clientRut: '',
    address: '',
    commune: '',
    region: 'RM',
    items,
    labor,
    subtotalMaterials: 0,
    subtotalLabor: labor.total,
    discountPct: 0,
    taxPct: 19,
    taxAmount: 0,
    total: 0,
    notes: '',
  };
  return recomputeAndFill(quote);
}

function recomputeAndFill(quote: Quote): Quote {
  const totals = recomputeQuote(quote);
  return {
    ...quote,
    items: quote.items.map((it) => ({ ...it, total: Math.round(it.quantity * it.unitPrice * (1 - (it.discountPct || 0) / 100)) })),
    subtotalMaterials: totals.subtotalMaterials,
    subtotalLabor: totals.subtotalLabor,
    taxAmount: totals.taxAmount,
    total: totals.total,
    updatedAt: new Date(),
  };
}

export const useQuoteStore = create<QuoteStoreState>()(
  persist(
    (set, get) => ({
      currentQuote: null,
      loaded: false,

      newQuote: async (template) => {
        const number = await getNextQuoteNumber();
        const q = buildEmptyQuote(template, number);
        set({ currentQuote: q, loaded: true });
        await addQuote(q);
        return q;
      },

      loadQuote: async (id) => {
        const all = await getAllQuotes();
        const q = all.find((x) => x.id === id) ?? null;
        set({ currentQuote: q, loaded: true });
        return q;
      },

      loadAllQuotes: async () => {
        return getAllQuotes();
      },

      saveCurrent: async () => {
        const q = get().currentQuote;
        if (!q) return;
        const updated = recomputeAndFill(q);
        await updateQuote(q.id, updated);
        set({ currentQuote: updated });
      },

      deleteQuote: async (id) => {
        await deleteQuote(id);
        if (get().currentQuote?.id === id) set({ currentQuote: null });
      },

      setStatus: (status) => {
        const q = get().currentQuote;
        if (!q) return;
        set({ currentQuote: { ...q, status, updatedAt: new Date() } });
      },

      updateCurrent: (changes) => {
        const q = get().currentQuote;
        if (!q) return;
        set({ currentQuote: recomputeAndFill({ ...q, ...changes }) });
      },

      addItemFromCatalog: (item) => {
        const q = get().currentQuote;
        if (!q) return;
        const newItem: QuoteItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          description: item.description,
          category: item.category,
          unit: item.unit,
          quantity: 1,
          unitPrice: item.unitPrice,
          discountPct: 0,
          total: item.unitPrice,
        };
        set({ currentQuote: recomputeAndFill({ ...q, items: [...q.items, newItem] }) });
      },

      addCustomItem: () => {
        const q = get().currentQuote;
        if (!q) return;
        const newItem: QuoteItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          description: 'Item personalizado',
          category: 'otro',
          unit: 'un',
          quantity: 1,
          unitPrice: 0,
          discountPct: 0,
          total: 0,
        };
        set({ currentQuote: recomputeAndFill({ ...q, items: [...q.items, newItem] }) });
      },

      updateItem: (id, changes) => {
        const q = get().currentQuote;
        if (!q) return;
        const items = q.items.map((it) => (it.id === id ? { ...it, ...changes } : it));
        set({ currentQuote: recomputeAndFill({ ...q, items }) });
      },

      removeItem: (id) => {
        const q = get().currentQuote;
        if (!q) return;
        set({ currentQuote: recomputeAndFill({ ...q, items: q.items.filter((it) => it.id !== id) }) });
      },

      updateLabor: (changes) => {
        const q = get().currentQuote;
        if (!q) return;
        set({ currentQuote: recomputeAndFill({ ...q, labor: { ...q.labor, ...changes } }) });
      },

      setTemplate: (template) => {
        const q = get().currentQuote;
        if (!q) return;
        set({ currentQuote: recomputeAndFill({ ...q, template }) });
      },

      setClientSignature: (dataUrl) => {
        const q = get().currentQuote;
        if (!q) return;
        const changes: Partial<Quote> = { clientSignature: dataUrl, signedAt: dataUrl ? new Date() : undefined };
        set({ currentQuote: { ...q, ...changes, updatedAt: new Date() } });
      },

      reset: () => set({ currentQuote: null }),
    }),
    { name: 'electrichile-quote' }
  )
);
