'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, FileDown, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { getAllQuotes, deleteQuote } from '@/database/db';
import { downloadQuotePDF } from '@/utils/pdfQuoteGenerator';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useQuoteStore } from '@/stores/quoteStore';
import type { Quote, QuoteStatus } from '@/types';

interface Props {
  onBack: () => void;
  onNew: () => void;
}

const STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  billed: 'Facturada',
  paid: 'Pagada',
};

const STATUS_COLOR: Record<QuoteStatus, string> = {
  draft: 'bg-muted/30 text-muted-foreground',
  sent: 'bg-accent-secondary/15 text-accent-secondary',
  accepted: 'bg-accent-success/15 text-accent-success',
  rejected: 'bg-accent-danger/15 text-accent-danger',
  billed: 'bg-accent-warning/15 text-accent-warning',
  paid: 'bg-accent-primary/15 text-accent-primary',
};

export default function QuoteListScreen({ onBack, onNew }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filter, setFilter] = useState<QuoteStatus | 'all'>('all');
  const { loadQuote } = useQuoteStore();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const all = await getAllQuotes();
    setQuotes(all);
  };

  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter);

  const stats = {
    total: quotes.reduce((acc, q) => acc + q.total, 0),
    pending: quotes.filter((q) => q.status === 'sent' || q.status === 'accepted').reduce((acc, q) => acc + q.total, 0),
    paid: quotes.filter((q) => q.status === 'paid').reduce((acc, q) => acc + q.total, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Cotizaciones" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Resumen</h2>
            <Button size="sm" onClick={onNew}>
              <Plus className="w-4 h-4 mr-1" /> Nueva
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
              <p className="text-xs text-muted-foreground">cotizaciones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-secondary">{formatCurrency(stats.pending)}</p>
              <p className="text-xs text-muted-foreground">por cobrar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-success">{formatCurrency(stats.paid)}</p>
              <p className="text-xs text-muted-foreground">cobrado</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {(['all', 'draft', 'sent', 'accepted', 'billed', 'paid', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === s ? 'bg-accent-primary text-background' : 'bg-elevated text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'Todas' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card text-center py-12 space-y-3">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No hay cotizaciones {filter !== 'all' && `con estado "${STATUS_LABEL[filter as QuoteStatus]}"`}</p>
            <Button onClick={onNew}>
              <Plus className="w-4 h-4 mr-1" /> Crear primera cotización
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card hover:bg-elevated transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <button onClick={async () => { await loadQuote(q.id); onNew(); }} className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{q.number}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLOR[q.status]}`}>
                        {STATUS_LABEL[q.status]}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1 truncate">{q.clientName || 'Sin cliente'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(q.createdAt)}</p>
                    <p className="text-base font-bold text-foreground mt-2">{formatCurrency(q.total)}</p>
                  </button>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => downloadQuotePDF(q, null)} className="p-2 rounded hover:bg-elevated text-accent-secondary" aria-label="PDF">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button onClick={async () => { if (confirm(`¿Eliminar cotización ${q.number}?`)) { await deleteQuote(q.id); refresh(); }}} className="p-2 rounded hover:bg-elevated text-accent-danger" aria-label="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
