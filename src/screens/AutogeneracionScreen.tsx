'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, ChevronDown, ChevronUp, BookOpen, Shield, Plug } from 'lucide-react';
import Header from '@/components/layout/Header';
import RegulationRef from '@/components/shared/RegulationRef';

/**
 * Pantalla informativa sobre autogeneración según RIC N°09.
 *
 * Esta pantalla NO realiza cálculos de dimensionamiento (no hay fórmulas del RIC
 * N°09 para HSP, número de paneles o payback — esos vienen de la práctica
 * internacional o del fabricante de los equipos). Solo muestra los REQUISITOS
 * NORMATIVOS que el RIC N°09 establece para sistemas de autogeneración.
 *
 * Para el dimensionamiento técnico, se debe consultar al fabricante de los
 * paneles/inversores y la normativa técnica internacional de referencia.
 */

interface Props {
  onBack: () => void;
}

interface RequirementGroup {
  title: string;
  icon: typeof Sun;
  items: Array<{ title: string; description: string; ricRef?: string }>;
}

const REQUIREMENT_GROUPS: RequirementGroup[] = [
  {
    title: 'Generalidades (RIC N°09, pto 1)',
    icon: BookOpen,
    items: [
      {
        title: 'Sistemas de autogeneración',
        description: 'Sistemas de generación eléctrica que el cliente instala en su propiedad para abastecer parcial o totalmente su consumo. Pueden ser on-grid (conectados a la red de distribución) u off-grid (aislados, con almacenamiento).',
      },
      {
        title: 'Declaración de energización',
        description: 'Toda instalación con autogeneración debe presentar la comunicación de energización según RIC N°18 antes de ser conectada a la red de distribución. La distribuidora debe autorizar la conexión.',
      },
    ],
  },
  {
    title: 'Requisitos técnicos (RIC N°09, pto 3)',
    icon: Shield,
    items: [
      {
        title: 'Protección de interfaz',
        description: 'El sistema debe contar con una protección de interfaz que impida la inyección de energía a la red cuando esta esté desconectada (función anti-isla). Esta protección es exigida por la distribuidora y debe cumplir con la normativa técnica aplicable.',
        ricRef: 'ric-05-6-1',
      },
      {
        title: 'Puesta a tierra',
        description: 'La estructura del sistema (paneles, inversores, marcos metálicos) debe estar conectada a la puesta a tierra de protección de la instalación, según RIC N°06.',
        ricRef: 'ric-06',
      },
      {
        title: 'Secciones de los conductores',
        description: 'Los conductores de continua (CC) y alterna (CA) deben cumplir con las secciones mínimas del RIC N°04 pto 5.4 y las ampacidades de la Tabla 4.4 según el método de instalación.',
        ricRef: 'ric-04-5-4',
      },
      {
        title: 'Caída de tensión',
        description: 'La caída de tensión en los circuitos de autogeneración debe cumplir con los límites del RIC N°03 pto 5.1.3 (3% en alimentador, 5% total).',
        ricRef: 'ric-03-5-1-3',
      },
    ],
  },
  {
    title: 'Medición bidireccional (RIC N°09, pto 4)',
    icon: Plug,
    items: [
      {
        title: 'Medidor bidireccional',
        description: 'El empalme debe contar con un medidor bidireccional que registre tanto la energía consumida de la red como la inyectada a la red. La solicitud de cambio de medidor la realiza el cliente a la distribuidora.',
      },
      {
        title: 'Netbilling / Netmetering',
        description: 'El sistema de inyección de excedentes a la red se rige por la normativa vigente de la SEC y los reglamentos de la distribuidora correspondiente. Los excedentes se valorizan según la tarifa de inyección regulada.',
      },
    ],
  },
];

export default function AutogeneracionScreen({ onBack }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });

  const toggle = (i: number) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="min-h-screen bg-background">
      <Header title="Autogeneración" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 max-w-3xl mx-auto space-y-4">
        <div className="card space-y-2 bg-accent-primary/5 border border-accent-primary/30">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg font-semibold text-foreground">Sistemas de autogeneración</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Esta pantalla muestra los <strong>requisitos normativos</strong> del RIC N°09
            para sistemas solares fotovoltaicos y otras formas de autogeneración.
            El dimensionamiento técnico (potencia, número de paneles, payback) depende
            de variables específicas del proyecto y del fabricante de los equipos.
          </p>
          <p className="text-xs text-muted-foreground">
            Esta app no realiza cálculos de dimensionamiento porque el RIC N°09
            no entrega fórmulas para HSP, rendimiento o payback. Para esos cálculos,
            consulta al fabricante o a un profesional de autogeneración.
          </p>
        </div>

        {REQUIREMENT_GROUPS.map((group, i) => {
          const Icon = group.icon;
          const isOpen = expanded[i] ?? false;
          return (
            <div key={i} className="card space-y-2">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-2 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-accent-primary/15 text-accent-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-foreground">{group.title}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2 border-t border-border">
                      {group.items.map((item, j) => (
                        <div key={j} className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                          {item.ricRef && (
                            <div className="pt-1">
                              <RegulationRef articleId={item.ricRef} variant="pill" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="card space-y-2">
          <p className="text-sm font-semibold text-foreground">Para el dimensionamiento</p>
          <p className="text-xs text-muted leading-relaxed">
            Esta app entrega los requisitos normativos del RIC N°09. Para el cálculo
            de potencia instalada, número de paneles, baterías y payback, debes
            consultar al fabricante de los equipos y a un profesional electricista
            que pueda evaluar tu consumo real, la irradiación solar de tu zona y
            las condiciones de tu instalación.
          </p>
        </div>

        <RegulationRef articleId="ric-09-4-1" variant="card" showQuote />
      </div>
    </div>
  );
}
