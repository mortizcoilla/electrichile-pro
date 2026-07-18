'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/shared/ResultDisplay';
import RegulationRef from '@/components/shared/RegulationRef';
import { CONDUCTOR_SECTIONS, RESISTIVITY } from '@/data/cables';
import { calculateVoltageDrop, getVoltageStatus, getSuggestion, type VoltageDropResult } from '@/utils/voltageDrop';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { useInstallationStore } from '@/stores/installationStore';

interface Props {
  onBack: () => void;
}

export default function CalculatorDropScreen({ onBack }: Props) {
  const [length, setLength] = useState('');
  const [section, setSection] = useState('2.5');
  const [material, setMaterial] = useState<'cobre' | 'aluminio'>('cobre');
  const [current, setCurrent] = useState('');
  const [isThreePhase, setIsThreePhase] = useState(false);
  const [result, setResult] = useState<VoltageDropResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Invalida el resultado al editar cualquier entrada
  const invalidate = () => {
    setResult(null);
    setError(null);
    setSaved(false);
  };

  const handleCalculate = () => {
    const l = parseFloat(length);
    const i = parseFloat(current);
    const s = parseFloat(section);
    const rho = RESISTIVITY[material];
    if (isNaN(l) || l <= 0 || isNaN(i) || i <= 0 || isNaN(s) || s <= 0) {
      setError('Ingrese una longitud y una corriente mayores a 0');
      setResult(null);
      return;
    }
    setError(null);
    setResult(calculateVoltageDrop(l, i, s, rho, isThreePhase));
  };

  const status = useMemo(() => (result ? getVoltageStatus(result.percentage) : undefined), [result]);
  const suggestion = useMemo(
    () =>
      result
        ? getSuggestion(result.percentage, parseFloat(section), parseFloat(current), parseFloat(length), RESISTIVITY[material], isThreePhase)
        : null,
    [result, section, current, length, material, isThreePhase]
  );

  const addCalc = useInstallationStore((s) => s.addCalculation);
  const handleSave = () => {
    if (!result || saved) return;
    addCalc({
      id: crypto.randomUUID(),
      type: 'voltageDrop',
      data: { length, section, material, current, isThreePhase },
      result,
      timestamp: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Caída de Tensión" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-2xl lg:max-w-3xl mx-auto space-y-4">
        <div className="card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="length">Longitud del circuito</Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => { setLength(e.target.value); invalidate(); }}
              placeholder="100"
              suffix="m"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Sección del conductor</Label>
            <select
              id="section"
              value={section}
              onChange={(e) => { setSection(e.target.value); invalidate(); }}
              className="input-field"
            >
              {CONDUCTOR_SECTIONS.map((s) => (
                <option key={s} value={s}>{s} mm²</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Material</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMaterial('cobre'); invalidate(); }}
                aria-pressed={material === 'cobre'}
                className={`h-12 rounded-lg font-medium transition-all ${
                  material === 'cobre'
                    ? 'bg-accent-primary text-background'
                    : 'bg-elevated text-foreground border border-border'
                }`}
              >
                Cobre
              </button>
              <button
                onClick={() => { setMaterial('aluminio'); invalidate(); }}
                aria-pressed={material === 'aluminio'}
                className={`h-12 rounded-lg font-medium transition-all ${
                  material === 'aluminio'
                    ? 'bg-accent-primary text-background'
                    : 'bg-elevated text-foreground border border-border'
                }`}
              >
                Aluminio
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current">Intensidad de corriente</Label>
            <Input
              id="current"
              type="number"
              value={current}
              onChange={(e) => { setCurrent(e.target.value); invalidate(); }}
              placeholder="20"
              suffix="A"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de instalación</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setIsThreePhase(false); invalidate(); }}
                aria-pressed={!isThreePhase}
                className={`h-12 rounded-lg font-medium transition-all ${
                  !isThreePhase
                    ? 'bg-accent-primary text-background'
                    : 'bg-elevated text-foreground border border-border'
                }`}
              >
                Monofásico
              </button>
              <button
                onClick={() => { setIsThreePhase(true); invalidate(); }}
                aria-pressed={isThreePhase}
                className={`h-12 rounded-lg font-medium transition-all ${
                  isThreePhase
                    ? 'bg-accent-primary text-background'
                    : 'bg-elevated text-foreground border border-border'
                }`}
              >
                Trifásico
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-accent-danger">{error}</p>
          )}

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Zap className="w-5 h-5 mr-2" />
            Calcular
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card space-y-4"
            >
              <h3 className="font-semibold text-foreground">Resultado</h3>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Caída de tensión"
                  value={formatNumber(result.voltageDrop)}
                  unit="V"
                />
                <ResultDisplay
                  label="Porcentaje"
                  value={formatPercentage(result.percentage)}
                  status={status}
                />
              </div>

              {status && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  status === 'ok' ? 'bg-accent-success/10 text-accent-success border border-accent-success/30' :
                  status === 'warning' ? 'bg-accent-warning/10 text-accent-warning border border-accent-warning/30' :
                  'bg-accent-danger/10 text-accent-danger border border-accent-danger/30'
                }`}>
                  {status === 'ok'
                    ? '✓ Cumple RIC N°03 (≤ 3% en alimentador)'
                    : status === 'warning'
                      ? '⚠ Supera el 3% del alimentador. Verifique la caída total (alimentador + subalimentador + circuito) ≤ 5%.'
                      : '✕ Supera el 5% máximo total según RIC N°03'}
                </div>
              )}

              {suggestion && (
                <p className="text-sm text-accent-secondary">{suggestion}</p>
              )}

              <RegulationRef articleId="ric-03-5-1-3" variant="card" showQuote />

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave} className="flex-1" disabled={saved}>
                  {saved ? '✓ Guardado' : 'Guardar'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
