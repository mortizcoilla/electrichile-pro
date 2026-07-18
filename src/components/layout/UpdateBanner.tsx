'use client';

import { useServiceWorker } from '@/hooks/useServiceWorker';
import { RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Banner flotante que avisa cuando hay una nueva versión del SW
 * y permite aplicarla con un click.
 */
export default function UpdateBanner() {
  const { supported, updateAvailable, applyUpdate } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  if (!supported || !updateAvailable || dismissed) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-accent-secondary text-background px-4 py-2.5 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <RefreshCw className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium truncate">Nueva versión disponible</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={applyUpdate}
            className="text-xs font-semibold bg-background text-accent-secondary px-3 py-1 rounded-md hover:opacity-90 transition-opacity"
          >
            Actualizar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded hover:bg-black/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
