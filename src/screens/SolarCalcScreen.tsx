'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResultDisplay from '@/components/shared/ResultDisplay';
import { REGIONS } from '@/data/regions';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

// Supuestos de diseño (estimaciones)
const PANEL_KWP = 0.45; // potencia nominal por panel (kWp)
const PERFORMANCE_RATIO = 0.7; // rendimiento real en terreno (PR 60–75%)
const PRICE_PER_KW_CLP = 800000; // costo por kW instalado
const BATTERY_PRICE_PER_KWH_CLP = 500000; // costo estimado por kWh de batería
const BATTERY_DOD = 0.5; // profundidad de descarga
const AUTONOMY_DAYS = 1; // días de autonomía del banco

export default function SolarCalcScreen({ onBack }: Props) {
  const [step, setStep] = useState(1);
  const [regionId, setRegionId] = useState('');
  const [consumption, setConsumption] = useState('');
  const [tariff, setTariff] = useState('150');
  const [isOffGrid, setIsOffGrid] = useState(false);
  const [result, setResult] = useState<{
    panels: number;
    systemPower: number;
    batteryKwh: number;
    estimatedPrice: number;
    monthlySavings: number;
    roiMonths: number;
    paybackYears: number;
  } | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === regionId);
  // radiation de regions.ts corresponde a las Horas Solares Pico (HSP) verificadas por región
  const hsp = selectedRegion?.radiation ?? 0;

  const monthlyKwh = parseFloat(consumption);
  const rate = parseFloat(tariff);
  const isConsumptionValid = !isNaN(monthlyKwh) && monthlyKwh > 0;
  const isTariffValid = !isNaN(rate) && rate > 0;

  const handleCalculate = () => {
    if (!isConsumptionValid || !isTariffValid) return;
    const h = hsp || 5.0;
    const panels = Math.ceil(monthlyKwh / (h * 30 * PANEL_KWP * PERFORMANCE_RATIO));
    const systemPower = panels * PANEL_KWP;
    // Off-grid: banco de baterías para 1 día de autonomía; on-grid: sin baterías
    const batteryKwh = isOffGrid ? ((monthlyKwh / 30) * AUTONOMY_DAYS) / BATTERY_DOD : 0;
    const estimatedPrice = systemPower * PRICE_PER_KW_CLP + batteryKwh * BATTERY_PRICE_PER_KWH_CLP;
    const monthlySavings = monthlyKwh * rate;
    const roiMonths = Math.ceil(estimatedPrice / monthlySavings);

    setResult({
      panels,
      systemPower,
      batteryKwh,
      estimatedPrice,
      monthlySavings,
      roiMonths,
      paybackYears: Math.round((roiMonths / 12) * 10) / 10,
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Calculadora Solar" showBack onBack={onBack} />
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
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-secondary" /> Ubicación
              </h3>
              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <select id="region" value={regionId} onChange={(e) => setRegionId(e.target.value)} className="input-field">
                  <option value="">Seleccionar región</option>
                  {REGIONS.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                </select>
              </div>
              {selectedRegion && (
                <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-xl">
                  <p className="text-sm text-accent-primary font-medium">
                    Horas Solares Pico (HSP): {hsp} h/día
                  </p>
                </div>
              )}
              <Button onClick={() => setStep(2)} className="w-full" disabled={!regionId}>Siguiente</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-primary" /> Consumo
              </h3>
              <div className="space-y-2">
                <Label htmlFor="consumption">Consumo mensual</Label>
                <Input id="consumption" type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} placeholder="300" suffix="kWh" />
                {consumption !== '' && !isConsumptionValid && (
                  <p className="text-sm text-accent-danger">Ingrese un consumo mayor a 0</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tariff">Tarifa actual</Label>
                <Input id="tariff" type="number" value={tariff} onChange={(e) => setTariff(e.target.value)} placeholder="150" suffix="$/kWh" />
                {!isTariffValid && (
                  <p className="text-sm text-accent-danger">Ingrese una tarifa mayor a 0</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo de sistema</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setIsOffGrid(false)} aria-pressed={!isOffGrid} className={`h-12 rounded-lg font-medium ${!isOffGrid ? 'bg-accent-primary text-background' : 'bg-elevated border border-border text-foreground'}`}>On-grid</button>
                  <button onClick={() => setIsOffGrid(true)} aria-pressed={isOffGrid} className={`h-12 rounded-lg font-medium ${isOffGrid ? 'bg-accent-primary text-background' : 'bg-elevated border border-border text-foreground'}`}>Off-grid</button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Atrás</Button>
                <Button onClick={handleCalculate} className="flex-1" disabled={!isConsumptionValid || !isTariffValid}>Calcular</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="card space-y-4">
                <h3 className="font-semibold text-foreground">Resultado del Sistema</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ResultDisplay label="Paneles" value={String(result.panels)} unit="uds" />
                  <ResultDisplay label="Potencia" value={formatNumber(result.systemPower)} unit="kW" />
                </div>
                {result.batteryKwh > 0 && (
                  <ResultDisplay label="Banco de baterías (1 día de autonomía)" value={formatNumber(result.batteryKwh)} unit="kWh" />
                )}
                <ResultDisplay label="Precio estimado" value={formatCurrency(result.estimatedPrice)} />
                <ResultDisplay label="Ahorro mensual" value={formatCurrency(result.monthlySavings)} />
                <div className="p-4 rounded-xl bg-accent-success/10 border border-accent-success/30">
                  <p className="text-xs text-muted">Payback estimado</p>
                  <p className="text-2xl font-bold text-accent-success">{result.paybackYears} años</p>
                  <p className="text-xs text-muted">{result.roiMonths} meses aprox.</p>
                  <p className="text-xs text-accent-success font-medium mt-1">
                    {result.paybackYears < 8 ? '✓ Rentable' : '⚠ Evaluar cuidadosamente'}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">Nuevo cálculo</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
