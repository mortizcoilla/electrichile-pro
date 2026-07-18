'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/shared/ResultDisplay';
import RegulationRef from '@/components/shared/RegulationRef';
import { CONDUCTOR_SECTIONS } from '@/data/cables';
import { calculateShortCircuit, NETWORK_PRESETS, type ShortCircuitInput, type ShortCircuitType } from '@/utils/shortCircuit';
import type { ConductorMaterial } from '@/data/ampacityTables';
import { formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

export default function ShortCircuitScreen({ onBack }: Props) {
  const [type, setType] = useState<ShortCircuitType>('threePhase');
  const [voltage, setVoltage] = useState('380');
  const [pccMVA, setPccMVA] = useState('250');
  const [length, setLength] = useState('');
  const [section, setSection] = useState('10');
  const [material, setMaterial] = useState<ConductorMaterial>('cobre');
  const [result, setResult] = useState<ReturnType<typeof calculateShortCircuit>>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const L = parseFloat(length);
    const S = parseFloat(section);
    const U = parseFloat(voltage);
    const P = parseFloat(pccMVA);
    if (isNaN(L) || L <= 0) {
      setError('Ingrese una longitud mayor a 0');
      setResult(null);
      return;
    }
    if (isNaN(S) || S <= 0) {
      setError('Ingrese una sección mayor a 0');
      setResult(null);
      return;
    }
    setError(null);
    const input: ShortCircuitInput = {
      type,
      voltage: isNaN(U) ? (type === 'threePhase' ? 380 : 220) : U,
      networkPccMVA: isNaN(P) ? 250 : P,
      networkXRatio: 10,
      length: L,
      section: S,
      material,
    };
    setResult(calculateShortCircuit(input));
  };

  const applyPreset = (pccMVA: number) => {
    setPccMVA(String(pccMVA));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Cortocircuito" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-2xl lg:max-w-3xl mx-auto space-y-4">
        <div className="card space-y-4">
          <div className="space-y-2">
            <Label>Tipo de cortocircuito</Label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setType('threePhase'); setVoltage('380'); }} aria-pressed={type === 'threePhase'} className={`h-12 rounded-lg font-medium transition-all ${type === 'threePhase' ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                Trifásico
              </button>
              <button onClick={() => { setType('singlePhase'); setVoltage('220'); }} aria-pressed={type === 'singlePhase'} className={`h-12 rounded-lg font-medium transition-all ${type === 'singlePhase' ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                Monofásico
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="voltage">Tensión nominal</Label>
              <Input id="voltage" type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} suffix="V" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcc">Pcc de la red</Label>
              <Input id="pcc" type="number" value={pccMVA} onChange={(e) => setPccMVA(e.target.value)} suffix="MVA" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.values(NETWORK_PRESETS).map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.pccMVA)}
                className="text-[10px] px-2 py-1 rounded-full border border-border bg-elevated text-muted-foreground hover:text-foreground hover:border-accent-primary/50 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Longitud del conductor</Label>
            <Input id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="50" suffix="m" step="0.1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="section">Sección</Label>
              <select id="section" value={section} onChange={(e) => setSection(e.target.value)} className="input-field">
                {CONDUCTOR_SECTIONS.map((s) => (
                  <option key={s} value={s}>{s} mm²</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Material</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['cobre', 'aluminio'] as ConductorMaterial[]).map((m) => (
                  <button key={m} onClick={() => setMaterial(m)} aria-pressed={material === m} className={`h-10 rounded-lg text-sm font-medium capitalize transition-all ${material === m ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-accent-danger">{error}</p>}

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Zap className="w-5 h-5 mr-2" />
            Calcular Icc
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="card space-y-3">
                <h3 className="font-semibold text-foreground">Corriente de cortocircuito</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay label="Icc máxima" value={formatNumber(result.iccMaxKA, 2)} unit="kA" />
                  <ResultDisplay label="Icc mínima" value={formatNumber(result.iccMinKA, 2)} unit="kA" />
                  <ResultDisplay label="Icc en red" value={formatNumber(result.iccRedKA, 2)} unit="kA" />
                  <ResultDisplay label="Pico (Ip)" value={formatNumber(result.ipicoMaxKA, 1)} unit="kA" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay label="Z red" value={formatNumber(result.zRed * 1000, 1)} unit="mΩ" />
                  <ResultDisplay label="Z cable" value={formatNumber(result.zCable * 1000, 1)} unit="mΩ" />
                </div>
              </div>

              <div
                className={`card flex items-start gap-3 ${
                  result.enoughWith10kA
                    ? 'bg-accent-success/5 border border-accent-success/30'
                    : 'bg-accent-danger/5 border border-accent-danger/30'
                }`}
              >
                {result.enoughWith10kA ? (
                  <Check className="w-5 h-5 text-accent-success mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-accent-danger mt-0.5 shrink-0" />
                )}
                <div className="text-sm">
                  {result.enoughWith10kA ? (
                    <p className="text-foreground">
                      Icc máxima de <span className="font-semibold">{formatNumber(result.iccMaxKA, 2)} kA</span>: una
                      protección con poder de corte 10 kA es suficiente.
                    </p>
                  ) : (
                    <p className="text-foreground">
                      Icc máxima de <span className="font-semibold">{formatNumber(result.iccMaxKA, 2)} kA</span> supera los
                      10 kA típicos. Necesita una protección con poder de corte ≥ 15 kA o 25 kA.
                    </p>
                  )}
                </div>
              </div>

              <RegulationRef articleId="ric-05-6-3" variant="card" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
