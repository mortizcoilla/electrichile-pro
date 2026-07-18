'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BUILDING_TYPES, SPECIAL_CIRCUITS, getNextBreakerRating } from '@/data/protections';
import { formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

interface ProtectionResult {
  icp: number | null;
  iga: number | null;
  circuits: { name: string; power: number; breaker: number | null }[];
  differential: string;
  differentialCount: number;
}

const EXCEDE_CALIBRES = 'Excede calibres estándar: requiere diseño especial';

export default function ProtectionCalcScreen({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [totalPower, setTotalPower] = useState('');
  const [buildingType, setBuildingType] = useState('residencial');
  const [circuitCount, setCircuitCount] = useState(6);
  const [selectedSpecial, setSelectedSpecial] = useState<string[]>([]);
  const [result, setResult] = useState<ProtectionResult | null>(null);

  const power = parseFloat(totalPower);
  const isPowerValid = !isNaN(power) && power > 0;

  const toggleSpecial = (id: string) => {
    setSelectedSpecial((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCalculate = () => {
    if (!isPowerValid) return;
    // El factor de demanda (estimación de diseño) aplica solo a las protecciones generales (ICP/IGA)
    const factor = BUILDING_TYPES.find((b) => b.id === buildingType)?.factor ?? 0.7;
    const powerPerCircuit = power / circuitCount;
    // RIC N°10 5.1.4.1: capacidad del circuito = potencia requerida + 10%
    const circuitCurrent = (powerPerCircuit * 1.1) / 220;
    const circuits = Array.from({ length: circuitCount }, (_, i) => ({
      name: `Circuito ${i + 1}`,
      power: powerPerCircuit,
      breaker: getNextBreakerRating(circuitCurrent),
    }));
    // Circuitos especiales seleccionados: circuitos dedicados, mín. 16A (RIC N°10 5.2.1)
    const specialCircuits = selectedSpecial.map((id) => {
      const sc = SPECIAL_CIRCUITS.find((s) => s.id === id)!;
      const rating = getNextBreakerRating(circuitCurrent);
      return {
        name: sc.name,
        power: powerPerCircuit,
        breaker: rating !== null ? Math.max(16, rating) : null,
      };
    });
    const allCircuits = [...circuits, ...specialCircuits];
    const demandCurrent = (power * factor) / 220;

    setResult({
      icp: getNextBreakerRating(demandCurrent),
      iga: getNextBreakerRating(demandCurrent * 1.25),
      circuits: allCircuits,
      // RIC N°10 5.1.3.5: circuitos de alumbrado protegidos con diferencial ≤ 30 mA
      differential: '30mA',
      // RIC N°10 5.1.3.7: máx. 3 circuitos derivados por protección diferencial
      differentialCount: Math.ceil(allCircuits.length / 3),
    });
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setTotalPower('');
    setBuildingType('residencial');
    setCircuitCount(6);
    setSelectedSpecial([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Calculadora de Protecciones" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                s === step
                  ? 'bg-accent-primary text-background'
                  : s < step
                  ? 'bg-accent-success text-white'
                  : 'bg-elevated text-muted'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-4"
            >
              <h3 className="font-semibold text-foreground">Datos Generales</h3>
              <div className="space-y-2">
                <Label htmlFor="totalPower">Potencia total (W)</Label>
                <Input
                  id="totalPower"
                  type="number"
                  value={totalPower}
                  onChange={(e) => setTotalPower(e.target.value)}
                  placeholder="3000"
                  suffix="W"
                />
                {totalPower !== '' && !isPowerValid && (
                  <p className="text-sm text-accent-danger">Ingrese una potencia mayor a 0</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo de edificio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {BUILDING_TYPES.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setBuildingType(bt.id)}
                      className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                        buildingType === bt.id
                          ? 'bg-accent-primary text-background'
                          : 'bg-elevated text-foreground border border-border'
                      }`}
                    >
                      {bt.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Número de circuitos</Label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCircuitCount(Math.max(2, circuitCount - 1))}
                    aria-label="Disminuir número de circuitos"
                    className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center text-xl font-bold"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-foreground w-12 text-center">
                    {circuitCount}
                  </span>
                  <button
                    onClick={() => setCircuitCount(Math.min(24, circuitCount + 1))}
                    aria-label="Aumentar número de circuitos"
                    className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full" disabled={!isPowerValid}>
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-4"
            >
              <h3 className="font-semibold text-foreground">Circuitos Especiales</h3>
              <div className="space-y-2">
                {SPECIAL_CIRCUITS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => toggleSpecial(sc.id)}
                    className={`w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all ${
                      selectedSpecial.includes(sc.id)
                        ? 'bg-accent-primary/10 border border-accent-primary/30'
                        : 'bg-elevated border border-border'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedSpecial.includes(sc.id)
                          ? 'bg-accent-primary border-accent-primary'
                          : 'border-border-strong'
                      }`}
                    >
                      {selectedSpecial.includes(sc.id) && <Check className="w-3 h-3 text-background" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{sc.name}</p>
                      <p className="text-xs text-muted">{sc.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
                </Button>
                <Button onClick={handleCalculate} className="flex-1">
                  Calcular
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="card space-y-3">
                <h3 className="font-semibold text-foreground">Protección General</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-elevated rounded-xl">
                    <p className="text-xs text-muted">ICP (Interruptor)</p>
                    {result.icp !== null ? (
                      <p className="text-xl font-bold text-accent-primary">{result.icp}A</p>
                    ) : (
                      <p className="text-sm font-medium text-accent-danger">{EXCEDE_CALIBRES}</p>
                    )}
                  </div>
                  <div className="p-3 bg-elevated rounded-xl">
                    <p className="text-xs text-muted">IGA (General)</p>
                    {result.iga !== null ? (
                      <p className="text-xl font-bold text-accent-primary">{result.iga}A</p>
                    ) : (
                      <p className="text-sm font-medium text-accent-danger">{EXCEDE_CALIBRES}</p>
                    )}
                  </div>
                  <div className="p-3 bg-elevated rounded-xl col-span-2">
                    <p className="text-xs text-muted">Diferencial</p>
                    <p className="text-xl font-bold text-accent-secondary">
                      {result.differentialCount > 1 ? `${result.differentialCount} × ${result.differential}` : result.differential}
                    </p>
                    <p className="text-xs text-muted mt-1">Máx. 3 circuitos por diferencial (RIC N°10 5.1.3.7)</p>
                  </div>
                </div>
              </div>

              <div className="card space-y-3">
                <h3 className="font-semibold text-foreground">Circuitos</h3>
                <div className="space-y-2">
                  {result.circuits.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-3 bg-elevated rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted">{formatNumber(c.power)}W</p>
                      </div>
                      {c.breaker !== null ? (
                        <Badge variant="default">{c.breaker}A</Badge>
                      ) : (
                        <Badge variant="danger">{EXCEDE_CALIBRES}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Nuevo cálculo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
