'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import { HOSPITALS } from '@/data/regions';

interface Props {
  onBack: () => void;
}

const EMERGENCY_NUMBERS = [
  { name: 'Bomberos', number: '132', color: '#ef4444' },
  { name: 'SAMU', number: '131', color: '#dc2626' },
  { name: 'Carabineros', number: '133', color: '#b91c1c' },
];

const PROTOCOL_STEPS = [
  { title: 'Cortar energía', desc: 'Desconecte el interruptor general o diferencial. No toque a la víctima si aún está en contacto con la fuente eléctrica.' },
  { title: 'Evaluar víctima', desc: 'Verifique si está consciente y respira. Llame al 131 inmediatamente si hay lesiones.' },
  { title: 'Primeros auxilios', desc: 'Si no respira, inicie RCP. 30 compresiones y 2 ventilaciones. No mueva a la víctima si sospecha lesión espinal.' },
  { title: 'Esperar ayuda', desc: 'Mantenga a la víctima caliente y calmada. No administre líquidos. Cubra las quemaduras con gasa estéril.' },
];

export default function EmergencyScreen({ onBack }: Props) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Emergencia Eléctrica" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-accent-danger/10 border border-accent-danger/30 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-accent-danger shrink-0" />
          <p className="text-sm font-medium text-accent-danger">En caso de emergencia eléctrica, actúe con calma y siga los protocolos.</p>
        </div>

        <div className="space-y-3">
          {EMERGENCY_NUMBERS.map((em) => (
            <motion.a
              key={em.number}
              href={`tel:${em.number}`}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-xl text-white font-bold text-lg transition-all"
              style={{ backgroundColor: em.color }}
            >
              <Phone className="w-6 h-6" />
              <div className="text-left">
                <p className="text-xl">{em.number}</p>
                <p className="text-sm font-medium opacity-90">{em.name}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Protocolo de Emergencia</h3>
          {PROTOCOL_STEPS.map((ps, i) => (
            <motion.div key={ps.title} className="card p-4">
              <button onClick={() => setExpandedStep(expandedStep === i ? null : i)} className="w-full flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-accent-primary">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{ps.title}</p>
                  <AnimatePresence>
                    {expandedStep === i && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-sm text-muted mt-2 overflow-hidden">
                        {ps.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {expandedStep === i ? <ChevronUp className="w-4 h-4 text-muted shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0" />}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Hospitales de referencia</h3>
          {HOSPITALS.map((h) => (
            <div key={h.id} className="card p-4 space-y-1">
              <p className="font-medium text-foreground text-sm">{h.name}</p>
              <p className="text-xs text-muted flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
