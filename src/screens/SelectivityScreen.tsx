'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/shared/ResultDisplay';
import RegulationRef from '@/components/shared/RegulationRef';
import { recommendProtection, type LoadType, type ProtectionInput } from '@/utils/selectivity';
import { formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

const LOAD_TYPE_OPTIONS: Array<{ id: LoadType; label: string; desc: string }> = [
  { id: 'iluminacion', label: 'Iluminación', desc: 'Inrush bajo (resistivo)' },
  { id: 'enchufes', label: 'Enchufes / mixto', desc: 'Inrush moderado' },
  { id: 'motor', label: 'Motor estándar', desc: 'Inrush 6-8×In' },
  { id: 'motorPesado', label: 'Motor pesado', desc: 'Inrush 10-12×In' },
  { id: 'resistivo', label: 'Resistivo (calefacción)', desc: 'Sin Inrush' },
  { id: 'electronica', label: 'Electrónica (LED, fuentes)', desc: 'Picos cortos' },
];

export default function SelectivityScreen({ onBack }: Props) {
  const [nominalCurrent, setNominalCurrent] = useState('');
  const [loadType, setLoadType] = useState<LoadType>('enchufes');
  const [inrushCurrent, setInrushCurrent] = useState('');
  const [iccMaxKA, setIccMaxKA] = useState('5');
  const [result, setResult] = useState<ReturnType<typeof recommendProtection>>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const I = parseFloat(nominalCurrent);
    const Icc = parseFloat(iccMaxKA);
    const Ia = inrushCurrent ? parseFloat(inrushCurrent) : undefined;
    if (isNaN(I) || I <= 0) {
      setError('Ingrese la corriente nominal del circuito');
      setResult(null);
      return;
    }
    if (isNaN(Icc) || Icc <= 0) {
      setError('Ingrese la Icc máxima prevista en el punto');
      setResult(null);
      return;
    }
    setError(null);
    const input: ProtectionInput = {
      nominalCurrent: I,
      loadType,
      inrushCurrent: Ia,
      iccMaxKA: Icc,
    };
    setResult(recommendProtection(input));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Selectividad" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-2xl lg:max-w-3xl mx-auto space-y-4">
        <div className="card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="I">Corriente nominal</Label>
              <Input id="I" type="number" value={nominalCurrent} onChange={(e) => setNominalCurrent(e.target.value)} placeholder="16" suffix="A" step="0.1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Icc">Icc máxima prevista</Label>
              <Input id="Icc" type="number" value={iccMaxKA} onChange={(e) => setIccMaxKA(e.target.value)} placeholder="5" suffix="kA" step="0.1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="Ia">Corriente de arranque (opcional)</Label>
            <Input id="Ia" type="number" value={inrushCurrent} onChange={(e) => setInrushCurrent(e.target.value)} placeholder="0 = sin Inrush conocido" suffix="A" step="1" />
            <p className="text-xs text-muted-foreground">Si es un motor, ingrese el Inrush real (típicamente 6-12×In).</p>
          </div>

          <div className="space-y-2">
            <Label>Tipo de carga</Label>
            <div className="grid grid-cols-2 gap-2">
              {LOAD_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLoadType(opt.id)}
                  aria-pressed={loadType === opt.id}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    loadType === opt.id
                      ? 'bg-accent-primary/15 border-accent-primary text-foreground'
                      : 'bg-elevated border-border text-foreground'
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-accent-danger">{error}</p>}

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Shield className="w-5 h-5 mr-2" />
            Recomendar protección
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="card space-y-3 bg-accent-success/5 border border-accent-success/30">
                <h3 className="font-semibold text-foreground">Protección recomendada</h3>
                <div className="grid grid-cols-3 gap-3">
                  <ResultDisplay label="In" value={String(result.in)} unit="A" />
                  <ResultDisplay label="Curva" value={result.curve} />
                  <ResultDisplay label="Poder de corte" value={String(result.breakingCapacity)} unit="kA" />
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{result.reasoning}</p>
              </div>

              {result.options.length > 1 && (
                <div className="card space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Alternativas comerciales</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground border-b border-border">
                          <th className="text-left py-2 px-2">In (A)</th>
                          <th className="text-left py-2 px-2">Curva</th>
                          <th className="text-left py-2 px-2">PdC (kA)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.options.map((o, i) => (
                          <tr key={i} className={`border-b border-border/30 ${o.in === result.in ? 'bg-accent-success/10' : ''}`}>
                            <td className="py-1.5 px-2 text-foreground">{o.in}</td>
                            <td className="py-1.5 px-2 text-foreground">{o.curve}</td>
                            <td className="py-1.5 px-2 text-foreground">{o.breakingCapacity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <RegulationRef articleId="ric-05-6-3" variant="card" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
