/**
 * @file Hook de theme con persistencia y soporte para modo sistema.
 *
 * @description
 * Maneja el theme de la aplicación (dark / light / system) sincronizando
 * la clase `dark` del `<html>` con la preferencia del usuario. El theme
 * persiste en localStorage.
 *
 * Para evitar el "flash" al cargar, hay un script inline en
 * `src/app/layout.tsx` que aplica el theme ANTES del primer render.
 */

'use client';

import { useEffect, useState } from 'react';
import type { ElectricianProfile } from '@/types';

/** Modo de theme seleccionado por el usuario. */
export type ThemeMode = 'dark' | 'light' | 'system';
/** Theme efectivo aplicado (resuelve 'system' a un valor concreto). */
export type EffectiveTheme = 'dark' | 'light';

const STORAGE_KEY = 'electrichile-theme';

/**
 * Lee el theme persistido desde localStorage.
 * @returns {ThemeMode} El theme guardado, o 'dark' como fallback.
 */
export function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'dark';
}

/**
 * Resuelve un theme abstracto a un valor concreto, considerando la preferencia
 * del sistema operativo cuando el modo es 'system'.
 *
 * @param mode          - Modo seleccionado por el usuario.
 * @param systemPrefers - Preferencia actual del sistema (dark o light).
 * @returns {EffectiveTheme} Theme concreto a aplicar.
 */
export function resolveTheme(mode: ThemeMode, systemPrefers: EffectiveTheme): EffectiveTheme {
  if (mode === 'system') return systemPrefers;
  return mode;
}

/**
 * Hook de theme. Devuelve el modo actual, un setter y el theme efectivo.
 *
 * @example
 * const { mode, setMode, effective } = useTheme();
 * // mode: 'dark' | 'light' | 'system'
 * // effective: 'dark' | 'light' (resuelve 'system')
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(readStoredTheme);
  const [systemPrefers, setSystemPrefers] = useState<EffectiveTheme>('dark');

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefers(mql.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setSystemPrefers(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const effective = resolveTheme(mode, systemPrefers);
    const html = document.documentElement;
    if (effective === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, systemPrefers]);

  return { mode, setMode, effective: resolveTheme(mode, systemPrefers) };
}

/**
 * Aplica el theme desde un ElectricianProfile. Útil al cargar el perfil
 * guardado en Dexie al iniciar la app.
 *
 * @param profile - Perfil del electricista (o null si no hay).
 */
export function applyProfileTheme(profile: ElectricianProfile | null) {
  if (!profile) return;
  if (profile.theme && profile.theme !== 'system') {
    localStorage.setItem(STORAGE_KEY, profile.theme);
    const html = document.documentElement;
    if (profile.theme === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }
}
