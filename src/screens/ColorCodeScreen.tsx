'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { CABLE_COLORS, LEGACY_COLORS, type CableColor } from '@/data/colorsStandard';
import { badgeVariants } from '@/components/ui/badge';

const swatchStyle = (color: CableColor): CSSProperties =>
  color.stripe
    ? { background: `linear-gradient(135deg, ${color.color} 50%, ${color.stripe} 50%)` }
    : { backgroundColor: color.color };

interface Props {
  onBack: () => void;
}

export default function ColorCodeScreen({ onBack }: Props) {
  const [selectedColor, setSelectedColor] = useState<typeof CABLE_COLORS[0] | null>(null);
  const [showLegacy, setShowLegacy] = useState(false);

  useEffect(() => {
    if (!selectedColor) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedColor(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedColor]);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Colores de Cables" showBack onBack={onBack} />
      <div className="px-4 py-6 md:px-0 md:py-0 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {CABLE_COLORS.map((color) => (
            <motion.button
              key={color.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedColor(color)}
              className="card p-4 text-left space-y-3"
            >
              <div
                className="h-20 rounded-lg w-full"
                style={swatchStyle(color)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{color.name}</p>
                <p className="text-xs text-muted line-clamp-2">{color.usage}</p>
              </div>
              {color.warnings && (
                <span className={`${badgeVariants({ variant: 'warning' })} text-[10px]`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Requiere atención
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => setShowLegacy(!showLegacy)}
          className="w-full card p-3 text-sm text-accent-secondary font-medium"
        >
          {showLegacy ? 'Ocultar' : 'Ver'} colores antiguos (anteriores al RIC)
        </button>

        <AnimatePresence>
          {showLegacy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="card space-y-3">
                {LEGACY_COLORS.map((legacy) => (
                  <div key={legacy.old} className="flex items-start gap-3 p-3 bg-elevated rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-accent-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {legacy.old} → {legacy.modern}
                      </p>
                      <p className="text-xs text-muted">Uso: {legacy.usage}</p>
                      <p className="text-xs text-accent-warning">{legacy.warning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setSelectedColor(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              role="dialog"
              aria-modal="true"
              className="bg-surface w-full max-w-md md:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{selectedColor.name}</h3>
                <button onClick={() => setSelectedColor(null)} className="p-2 -mr-2">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
              <div className="h-32 rounded-xl w-full" style={swatchStyle(selectedColor)} />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Uso permitido:</h4>
                <p className="text-sm text-muted">{selectedColor.usage}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted">Norma: {selectedColor.standard}</p>
              </div>
              {selectedColor.warnings && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-accent-warning">Advertencias</h4>
                  {selectedColor.warnings.map((w) => (
                    <p key={w} className="text-sm text-accent-danger">• {w}</p>
                  ))}
                </div>
              )}
              <button
                onClick={() => setSelectedColor(null)}
                className="w-full btn-primary"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
