'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { kwToHp, hpToKw, celsiusToFahrenheit, fahrenheitToCelsius, mm2ToAwg } from '@/utils/conversions';
import { formatNumber } from '@/utils/formatters';

interface Props {
  onBack: () => void;
}

export default function ConverterScreen({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState('kw-hp');
  const [inputValue, setInputValue] = useState('');

  const conversions: Record<string, { from: string; to: string; formula: string; convert: (v: number) => string }> = {
    'kw-hp': { from: 'kW', to: 'HP', formula: 'Fórmula: 1 kW = 1.341 HP', convert: (v) => formatNumber(kwToHp(v)) },
    'hp-kw': { from: 'HP', to: 'kW', formula: 'Fórmula: 1 HP = 0.746 kW', convert: (v) => formatNumber(hpToKw(v)) },
    'c-f': { from: '°C', to: '°F', formula: 'Fórmula: °F = °C × 9/5 + 32', convert: (v) => formatNumber(celsiusToFahrenheit(v)) },
    'f-c': { from: '°F', to: '°C', formula: 'Fórmula: °C = (°F - 32) × 5/9', convert: (v) => formatNumber(fahrenheitToCelsius(v)) },
    'mm2-awg': { from: 'mm²', to: 'AWG', formula: 'Equivalencia mm² → AWG/MCM según RIC N°10', convert: mm2ToAwg },
  };

  const current = conversions[activeTab] || conversions['kw-hp'];
  const numericValue = parseFloat(inputValue) || 0;
  const result = inputValue !== '' ? current.convert(numericValue) : '—';

  return (
    <div className="min-h-screen bg-background">
      <Header title="Conversor de Unidades" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="kw-hp">kW↔HP</TabsTrigger>
            <TabsTrigger value="hp-kw">HP↔kW</TabsTrigger>
            <TabsTrigger value="c-f">°C↔°F</TabsTrigger>
            <TabsTrigger value="f-c">°F↔°C</TabsTrigger>
            <TabsTrigger value="mm2-awg">mm²↔AWG</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card mt-4"
          >
            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
              <div className="space-y-2">
                <label htmlFor="converter-input" className="text-xs text-muted">{current.from}</label>
                <Input
                  id="converter-input"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="0"
                  className="text-center text-lg font-semibold"
                />
              </div>
              <div className="flex items-center justify-center pt-6">
                <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-accent-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="converter-result" className="text-xs text-muted">{current.to}</label>
                <div className="flex h-12 w-full rounded-[10px] border border-border bg-elevated items-center justify-center">
                  <span id="converter-result" className="text-lg font-bold text-accent-primary">
                    {result}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Tabs>

        <div className="card space-y-2">
          <p className="text-xs text-muted">{current.formula}</p>
        </div>
      </div>
    </div>
  );
}
