import { describe, it, expect } from 'vitest';
import { resolveTheme } from './useTheme';

describe('resolveTheme', () => {
  it('"dark" siempre devuelve "dark"', () => {
    expect(resolveTheme('dark', 'light')).toBe('dark');
    expect(resolveTheme('dark', 'dark')).toBe('dark');
  });

  it('"light" siempre devuelve "light"', () => {
    expect(resolveTheme('light', 'light')).toBe('light');
    expect(resolveTheme('light', 'dark')).toBe('light');
  });

  it('"system" sigue la preferencia del sistema', () => {
    expect(resolveTheme('system', 'dark')).toBe('dark');
    expect(resolveTheme('system', 'light')).toBe('light');
  });
});
