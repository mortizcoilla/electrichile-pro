'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRightLeft,
  Palette,
  Shield,
  FilePlus,
  Sun,
  Phone,
  Gauge,
  Activity,
  Plug,
  FileText,
  FileCheck,
  BookOpen,
} from 'lucide-react';
import CalculatorCard from '@/components/shared/CalculatorCard';
import { getGreeting } from '@/utils/formatters';
import { useInstallationStore } from '@/stores/installationStore';

const CARDS = [
  { id: 'voltage-drop', icon: Zap, title: 'Caída de Tensión', color: '#f59e0b', route: 'voltage-drop' },
  { id: 'ampacity', icon: Gauge, title: 'Ampacidad', color: '#f97316', route: 'ampacity' },
  { id: 'short-circuit', icon: Activity, title: 'Cortocircuito', color: '#ef4444', route: 'short-circuit' },
  { id: 'selectivity', icon: Plug, title: 'Selectividad', color: '#22c55e', route: 'selectivity' },
  { id: 'converter', icon: ArrowRightLeft, title: 'Conversor Unidades', color: '#3b82f6', route: 'converter' },
  { id: 'colors', icon: Palette, title: 'Colores Cables', color: '#ec4899', route: 'colors' },
  { id: 'protections', icon: Shield, title: 'Protecciones', color: '#8b5cf6', route: 'protections' },
  { id: 'installation', icon: FilePlus, title: 'Nueva Instalación', color: '#6366f1', route: 'new-installation' },
  { id: 'solar', icon: Sun, title: 'Solar', color: '#facc15', route: 'solar' },
  { id: 'cotizador', icon: FileText, title: 'Cotizador', color: '#06b6d4', route: 'cotizador' },
  { id: 'te1', icon: FileCheck, title: 'Declaración TE1', color: '#10b981', route: 'te1' },
  { id: 'help', icon: BookOpen, title: 'Ayuda', color: '#64748b', route: 'help' },
];

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const installations = useInstallationStore((s) => s.installations);
  const todayCount = installations.filter(
    (i) => new Date(i.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const totalInstallations = installations.length;

  return (
    <div className="px-4 py-6 md:px-0 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, Electricista
        </h1>
        <p className="text-sm text-muted mt-1">
          Herramientas profesionales a tu alcance
        </p>
      </motion.div>

      {/* Banner de ayuda para usuarios nuevos */}
      {totalInstallations === 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onNavigate('help')}
          className="w-full card p-4 mb-6 text-left bg-gradient-to-br from-accent-secondary/15 to-accent-primary/10 border border-accent-secondary/30 hover:bg-elevated transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 text-accent-secondary flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm">¿Primera vez aquí?</p>
              <p className="text-xs text-muted-foreground">Recorré la guía de 4 pasos para empezar</p>
            </div>
            <span className="text-xs font-semibold text-accent-secondary shrink-0">Ver →</span>
          </div>
        </motion.button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {CARDS.map((card, index) => (
          <motion.div
            key={card.id}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <CalculatorCard
              icon={card.icon}
              title={card.title}
              color={card.color}
              onClick={() => onNavigate(card.route)}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-4"
      >
        <h2 className="text-sm font-semibold text-muted mb-3">Resumen del día</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{todayCount}</p>
            <p className="text-xs text-muted">Instalaciones hoy</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <p className="text-2xl font-bold text-foreground">
              {installations.filter((i) => i.status === 'completed').length}
            </p>
            <p className="text-xs text-muted">Certificados totales</p>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        onClick={() => onNavigate('emergency')}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-accent-danger text-white flex items-center justify-center shadow-lg shadow-accent-danger/30 hover:brightness-110 active:scale-95 transition-all z-40"
      >
        <Phone className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
