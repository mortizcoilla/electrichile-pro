'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, ChevronDown, Save, FileDown, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/shared/ResultDisplay';
import SignaturePad from '@/components/shared/SignaturePad';
import { useQuoteStore } from '@/stores/quoteStore';
import { QUOTE_TEMPLATES, CATALOG } from '@/data/quoteTemplates';
import { formatCurrency } from '@/utils/formatters';
import { downloadQuotePDF } from '@/utils/pdfQuoteGenerator';
import { shareQuoteViaWhatsApp } from '@/utils/shareUtils';
import { getProfile } from '@/database/db';
import type { QuoteTemplate, QuoteItem, QuoteStatus, ElectricianProfile } from '@/types';

interface Props {
  onBack: () => void;
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
  draft: 'bg-muted/30 text-muted-foreground border-border',
  sent: 'bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30',
  accepted: 'bg-accent-success/15 text-accent-success border-accent-success/30',
  rejected: 'bg-accent-danger/15 text-accent-danger border-accent-danger/30',
  billed: 'bg-accent-warning/15 text-accent-warning border-accent-warning/30',
  paid: 'bg-accent-primary/15 text-accent-primary border-accent-primary/30',
};

export default function CotizadorScreen({ onBack }: Props) {
  const {
    currentQuote, newQuote, updateCurrent, addItemFromCatalog, addCustomItem,
    updateItem, removeItem, updateLabor, saveCurrent, setStatus, setClientSignature,
  } = useQuoteStore();

  const [showCatalog, setShowCatalog] = useState(false);
  const [showClient, setShowClient] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [profile, setProfile] = useState<ElectricianProfile | null>(null);

  useEffect(() => {
    if (!currentQuote) {
      newQuote('residential-basic');
    }
    getProfile().then((p) => setProfile(p ? { ...p } : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentQuote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const q = currentQuote;

  const handleAddFromCatalog = (catalogId: string) => {
    const item = CATALOG.find((c) => c.id === catalogId);
    if (item) {
      addItemFromCatalog(item);
      setShowCatalog(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Cotizador" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        {/* Header card: número + estado + plantilla */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground">Cotización</p>
              <p className="text-lg font-semibold text-foreground">{q.number}</p>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full border ${STATUS_COLOR[q.status]}`}>
              {STATUS_LABEL[q.status]}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tpl">Plantilla</Label>
            <select id="tpl" value={q.template} onChange={(e) => updateCurrent({ template: e.target.value as QuoteTemplate })} className="input-field">
              {QUOTE_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => setStatus('sent')} variant="outline">
              <Send className="w-4 h-4 mr-1" /> Marcar enviada
            </Button>
            <Button size="sm" onClick={() => setStatus('accepted')} variant="outline">
              Aceptada
            </Button>
            <Button size="sm" onClick={() => setStatus('rejected')} variant="outline">
              Rechazada
            </Button>
            <Button size="sm" onClick={() => setStatus('billed')} variant="outline">
              Facturada
            </Button>
            <Button size="sm" onClick={() => setStatus('paid')}>
              Cobrada ✓
            </Button>
          </div>
        </div>

        {/* Cliente */}
        <div className="card space-y-3">
          <button onClick={() => setShowClient((v) => !v)} className="w-full flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Datos del cliente</h3>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showClient ? 'rotate-180' : ''}`} />
          </button>
          {showClient && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="cn">Nombre / Razón social</Label>
                <Input id="cn" value={q.clientName} onChange={(e) => updateCurrent({ clientName: e.target.value })} placeholder="Juan Pérez" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="crut">RUT</Label>
                  <Input id="crut" value={q.clientRut} onChange={(e) => updateCurrent({ clientRut: e.target.value })} placeholder="12.345.678-9" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cph">Teléfono</Label>
                  <Input id="cph" value={q.clientPhone ?? ''} onChange={(e) => updateCurrent({ clientPhone: e.target.value })} placeholder="+56 9 ..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caddr">Dirección</Label>
                <Input id="caddr" value={q.address} onChange={(e) => updateCurrent({ address: e.target.value })} placeholder="Av. Principal 1234" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ccom">Comuna</Label>
                  <Input id="ccom" value={q.commune} onChange={(e) => updateCurrent({ commune: e.target.value })} placeholder="Providencia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creg">Región</Label>
                  <Input id="creg" value={q.region} onChange={(e) => updateCurrent({ region: e.target.value })} placeholder="RM" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Items ({q.items.length})</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowCatalog((v) => !v)}>
                <Plus className="w-4 h-4 mr-1" /> Catálogo
              </Button>
              <Button size="sm" onClick={addCustomItem}>
                <Plus className="w-4 h-4 mr-1" /> Item
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showCatalog && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border border-border rounded-xl p-2 max-h-60 overflow-y-auto space-y-1">
                {CATALOG.map((c) => (
                  <button key={c.id} onClick={() => handleAddFromCatalog(c.id)} className="w-full text-left p-2 rounded hover:bg-elevated text-sm flex justify-between gap-2">
                    <span className="truncate">{c.description}</span>
                    <span className="text-muted-foreground whitespace-nowrap">{formatCurrency(c.unitPrice)}/{c.unit}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {q.items.map((item) => (
              <ItemRow key={item.id} item={item} onUpdate={(c) => updateItem(item.id, c)} onRemove={() => removeItem(item.id)} />
            ))}
            {q.items.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No hay items. Agrega desde el catálogo.</p>
            )}
          </div>
        </div>

        {/* Mano de obra */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-foreground">Mano de obra</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="h">Horas</Label>
              <Input id="h" type="number" value={q.labor.hours} onChange={(e) => updateLabor({ hours: parseFloat(e.target.value) || 0 })} step="0.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr">$/hora</Label>
              <Input id="hr" type="number" value={q.labor.hourlyRate} onChange={(e) => updateLabor({ hourlyRate: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="df">Dificultad</Label>
              <select id="df" value={q.labor.difficultyFactor} onChange={(e) => updateLabor({ difficultyFactor: parseFloat(e.target.value) })} className="input-field">
                <option value="1">1.0 normal</option>
                <option value="1.25">1.25 medio</option>
                <option value="1.5">1.5 complejo</option>
                <option value="2">2.0 crítico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="card space-y-2">
          <Label htmlFor="notes">Notas / condiciones</Label>
          <textarea id="notes" value={q.notes} onChange={(e) => updateCurrent({ notes: e.target.value })} rows={3} className="input-field resize-none" placeholder="Plazo de entrega, condiciones de pago, garantía..." />
        </div>

        {/* Firma del cliente */}
        <div className="card space-y-2">
          <button onClick={() => setShowSignature((v) => !v)} className="w-full flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Firma del cliente {q.clientSignature && '✓'}</h3>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showSignature ? 'rotate-180' : ''}`} />
          </button>
          {showSignature && (
            <div className="pt-2">
              <SignaturePad
                value={q.clientSignature}
                onChange={(d) => setClientSignature(d)}
                label="El cliente declara aceptar los términos de esta cotización"
              />
            </div>
          )}
        </div>

        {/* Totales */}
        <div className="card space-y-2 bg-accent-primary/5 border border-accent-primary/30">
          <div className="grid grid-cols-2 gap-3">
            <ResultDisplay label="Subtotal materiales" value={formatCurrency(q.subtotalMaterials)} />
            <ResultDisplay label="Subtotal mano de obra" value={formatCurrency(q.subtotalLabor)} />
            <ResultDisplay label={`IVA (${q.taxPct}%)`} value={formatCurrency(q.taxAmount)} />
            <ResultDisplay label="TOTAL" value={formatCurrency(q.total)} />
          </div>
          <div className="space-y-2 pt-2">
            <Label htmlFor="dpct">Descuento global (%)</Label>
            <Input id="dpct" type="number" value={q.discountPct} onChange={(e) => updateCurrent({ discountPct: parseFloat(e.target.value) || 0 })} step="1" min="0" max="100" suffix="%" />
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sticky bottom-20 md:bottom-4">
          <Button onClick={saveCurrent} variant="outline">
            <Save className="w-4 h-4 mr-1" /> Guardar
          </Button>
          <Button onClick={() => downloadQuotePDF(q, profile)} variant="outline">
            <FileDown className="w-4 h-4 mr-1" /> PDF
          </Button>
          <Button onClick={() => shareQuoteViaWhatsApp(q, profile)}>
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, onUpdate, onRemove }: { item: QuoteItem; onUpdate: (c: Partial<QuoteItem>) => void; onRemove: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 p-2 space-y-2">
      <div className="flex items-start gap-2">
        <input
          value={item.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
        />
        <button onClick={onRemove} className="text-accent-danger p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div>
          <label className="text-muted-foreground">Cant.</label>
          <Input type="number" value={item.quantity} onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })} step="0.1" />
        </div>
        <div>
          <label className="text-muted-foreground">Unidad</label>
          <input value={item.unit} onChange={(e) => onUpdate({ unit: e.target.value })} className="w-full bg-elevated rounded px-2 py-1.5 text-foreground" />
        </div>
        <div>
          <label className="text-muted-foreground">P. unit</label>
          <Input type="number" value={item.unitPrice} onChange={(e) => onUpdate({ unitPrice: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-muted-foreground">Desc%</label>
          <Input type="number" value={item.discountPct} onChange={(e) => onUpdate({ discountPct: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="text-right text-sm font-semibold text-foreground">{formatCurrency(item.total)}</div>
    </div>
  );
}
