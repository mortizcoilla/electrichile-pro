/**
 * @file Hook para registrar el Service Worker y manejar updates.
 *
 * @description
 * Registra el SW custom ubicado en `/public/sw.js`, expone su estado
 * (soporte del navegador, registro exitoso, update disponible) y permite
 * aplicar un update con un click.
 *
 * Estrategia del SW (ver public/sw.js):
 *  - App shell pre-cacheado en instalación.
 *  - Network-first para navegaciones (HTML).
 *  - Cache-first para assets estáticos (JS, CSS, imágenes, fuentes).
 */

'use client';

import { useEffect, useState } from 'react';

/** Estado del Service Worker expuesto por el hook. */
export interface SWStatus {
  /** Service worker soportado por el navegador. */
  supported: boolean;
  /** SW registrado correctamente. */
  registered: boolean;
  /** Hay un SW nuevo esperando para activarse. */
  updateAvailable: boolean;
  /** Activa el SW nuevo (envía SKIP_WAITING al SW y recarga la página). */
  applyUpdate: () => void;
}

/**
 * Registra el service worker y devuelve su estado.
 * Detecta updates (cuando el SW nuevo está en estado 'waiting') y permite
 * aplicarlo manualmente.
 *
 * @returns {SWStatus} Estado actual del SW.
 */
export function useServiceWorker(): SWStatus {
  const [supported] = useState(() => typeof navigator !== 'undefined' && 'serviceWorker' in navigator);
  const [registered, setRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        if (cancelled) return;

        setRegistered(true);

        // Si ya hay un SW esperando (caso de recargar antes de aplicar el update)
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setUpdateAvailable(true);
        }

        // Detectar nuevos updates
        reg.addEventListener('updatefound', () => {
          const newSw = reg.installing;
          if (!newSw) return;
          newSw.addEventListener('statechange', () => {
            if (newSw.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newSw);
              setUpdateAvailable(true);
            }
          });
        });
      } catch (err) {
        console.warn('SW registration failed:', err);
      }
    };

    register();

    // Refrescar la página cuando el nuevo SW tome el control
    const onControllerChange = () => {
      if (!cancelled) window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, [supported]);

  /** Envía SKIP_WAITING al SW en espera y recarga la página. */
  const applyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return { supported, registered, updateAvailable, applyUpdate };
}
