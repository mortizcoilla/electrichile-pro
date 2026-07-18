/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useServiceWorker } from './useServiceWorker';

describe('useServiceWorker', () => {
  beforeEach(() => {
    // Reset mocks between tests
    vi.restoreAllMocks();
  });

  it('marca supported=false si navigator.serviceWorker no existe', () => {
    // jsdom tiene serviceWorker; para probar la rama "no soportado" lo borramos
    const original = (navigator as any).serviceWorker;
    delete (navigator as any).serviceWorker;

    const { result } = renderHook(() => useServiceWorker());
    expect(result.current.supported).toBe(false);
    expect(result.current.registered).toBe(false);

    // Restaurar
    (navigator as any).serviceWorker = original;
  });

  it('marca supported=true y registra si hay SW', async () => {
    const registerMock = vi.fn().mockResolvedValue({
      waiting: null,
      installing: null,
      addEventListener: vi.fn(),
    });
    (navigator as any).serviceWorker = {
      register: registerMock,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      controller: null,
    };

    const { result } = renderHook(() => useServiceWorker());
    // Inicialmente supported=true antes del effect
    expect(result.current.supported).toBe(true);

    // Esperar a que el effect se ejecute
    await new Promise((r) => setTimeout(r, 10));
    expect(registerMock).toHaveBeenCalledWith('/sw.js', expect.any(Object));
  });
});
