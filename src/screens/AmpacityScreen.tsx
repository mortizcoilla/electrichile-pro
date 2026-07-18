'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Check, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ResultDisplay from '@/components/shared/ResultDisplay';
import RegulationRef from '@/components/shared/RegulationRef';
import {
  INSTALLATION_METHODS,
  STANDARD_SECTIONS,
  type ConductorMaterial,
  type InsulationType,
  type InstallationMethod,
} from '@/data/ampacityTables';
import { calculateAmpacity, type AmpacityResult } from '@/utils/ampacity';
import { formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

export default function AmpacityScreen({ onBack }: Props) {
  const [designCurrent, setDesignCurrent] = useState('');
  const [method, setMethod] = useState<InstallationMethod>('B1');
  const [material, setMaterial] = useState<ConductorMaterial>('cobre');
  const [insulation, setInsulation] = useState<InsulationType>('xlpe');
  const [ambientC, setAmbientC] = useState('30');
  const [groupedCircuits, setGroupedCircuits] = useState('1');
  const [result, setResult] = useState<AmpacityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const I = parseFloat(designCurrent);
    const T = parseFloat(ambientC);
    const N = parseInt(groupedCircuits, 10);
    if (isNaN(I) || I <= 0) {
      setError('Ingrese una corriente de diseño mayor a 0');
      setResult(null);
      return;
    }
    setError(null);
    setResult(
      calculateAmpacity({
        designCurrent: I,
        method,
        material,
        insulation,
        ambientC: isNaN(T) ? 30 : T,
        groupedCircuits: isNaN(N) || N < 1 ? 1 : N,
      })
    );
  };

  const methodInfo = useMemo(
    () => INSTALLATION_METHODS.find((m) => m.id === method),
    [method]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header title="Ampacidad" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-2xl lg:max-w-3xl mx-auto space-y-4">
        <div className="card space-y-4">
          <div className="space-y-2">
            <Label htmlFor="I">Corriente de diseño del circuito</Label>
            <Input id="I" type="number" value={designCurrent} onChange={(e) => setDesignCurrent(e.target.value)} placeholder="25" suffix="A" step="0.1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Método de instalación</Label>
            <select id="method" value={method} onChange={(e) => setMethod(e.target.value as InstallationMethod)} className="input-field">
              {INSTALLATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.shortName} — {m.description}
                </option>
              ))}
            </select>
            {methodInfo && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Uso típico:</span> {methodInfo.typicalUse}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Material del conductor</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['cobre', 'aluminio'] as ConductorMaterial[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  aria-pressed={material === m}
                  className={`h-12 rounded-lg font-medium capitalize transition-all ${
                    material === m ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de aislamiento</Label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setInsulation('xlpe')} aria-pressed={insulation === 'xlpe'} className={`h-12 rounded-lg font-medium transition-all ${insulation === 'xlpe' ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                XLPE (90°C)
              </button>
              <button onClick={() => setInsulation('pvc')} aria-pressed={insulation === 'pvc'} className={`h-12 rounded-lg font-medium transition-all ${insulation === 'pvc' ? 'bg-accent-primary text-background' : 'bg-elevated text-foreground border border-border'}`}>
                PVC (70°C)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ambient">Temp. ambiente</Label>
              <Input id="ambient" type="number" value={ambientC} onChange={(e) => setAmbientC(e.target.value)} suffix="°C" step="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grouped">Circuitos agrupados</Label>
              <Input id="grouped" type="number" value={groupedCircuits} onChange={(e) => setGroupedCircuits(e.target.value)} suffix="circuitos" step="1" min="1" />
            </div>
          </div>

          {error && <p className="text-sm text-accent-danger">{error}</p>}

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Gauge className="w-5 h-5 mr-2" />
            Calcular sección mínima
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="card space-y-3">
                <div className="flex items-center gap-2">
                  {result.meetsRequirement ? (
                    <Check className="w-5 h-5 text-accent-success" />
                  ) : (
                    <X className="w-5 h-5 text-accent-danger" />
                  )}
                  <h3 className="font-semibold text-foreground">
                    {result.meetsRequirement
                      ? `Sección mínima: ${result.minSection} mm²`
                      : 'No hay sección normalizada que soporte esa corriente'}
                  </h3>
                </div>
                {result.meetsRequirement && (
                  <div className="grid grid-cols-2 gap-3">
                    <ResultDisplay label="Sección mínima" value={String(result.minSection)} unit="mm²" />
                    <ResultDisplay label="Ampacidad corregida" value={formatNumber(result.correctedAmpacity, 1)} unit="A" />
                    <ResultDisplay label="Factor temperatura" value={formatNumber(result.temperatureFactor, 2)} />
                    <ResultDisplay label="Factor agrupamiento" value={formatNumber(result.groupingFactor, 2)} />
                  </div>
                )}
              </div>

              <div className="card space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Tabla de ampacidad (método {methodInfo?.shortName})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2 px-2">Sección</th>
                        <th className="text-right py-2 px-2">I&apos;z (A)</th>
                        <th className="text-right py-2 px-2">¿Cumple?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.table.map((row) => (
                        <tr key={row.section} className={`border-b border-border/30 ${row.section === result.minSection ? 'bg-accent-success/10' : ''}`}>
                          <td className="py-1.5 px-2 text-foreground">{row.section} mm²</td>
                          <td className="py-1.5 px-2 text-right text-foreground">{row.correctedAmpacity > 0 ? formatNumber(row.correctedAmpacity, 1) : '—'}</td>
                          <td className="py-1.5 px-2 text-right">
                            {row.correctedAmpacity > 0 ? (
                              row.valid ? (
                                <Check className="w-3.5 h-3.5 text-accent-success inline" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-muted-foreground inline" />
                              )
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-muted-foreground">I&apos;z = I_z × K_temp × K_agrup · Tabla IEC 60364-5-523, referenciada por RIC N°04</p>
              </div>

              <RegulationRef articleId="ric-04-5-4" variant="card" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
