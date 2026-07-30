import { describe, it, expect } from 'vitest';
import { CABLE_COLORS, LEGACY_COLORS } from './colorsStandard';

describe('CABLE_COLORS — RIC N°04, pto 5.32', () => {
  it('incluye los 5 colores obligatorios del RIC (3 fases + neutro + protección)', () => {
    const ids = CABLE_COLORS.map((c) => c.id);
    expect(ids).toContain('phase-l1');
    expect(ids).toContain('phase-l2');
    expect(ids).toContain('phase-l3');
    expect(ids).toContain('neutral');
    expect(ids).toContain('protection');
  });

  it('L1 es azul, L2 es negro, L3 es rojo (no blanco)', () => {
    const l1 = CABLE_COLORS.find((c) => c.id === 'phase-l1');
    const l2 = CABLE_COLORS.find((c) => c.id === 'phase-l2');
    const l3 = CABLE_COLORS.find((c) => c.id === 'phase-l3');
    expect(l1).toBeDefined();
    expect(l2).toBeDefined();
    expect(l3).toBeDefined();
    // Sanity check: el nombre debe decir el color, NO debe ser "Fase - Blanco"
    expect(l1!.name.toLowerCase()).toContain('azul');
    expect(l2!.name.toLowerCase()).toContain('negro');
    expect(l3!.name.toLowerCase()).toContain('rojo');
    expect(l1!.name.toLowerCase()).not.toContain('blanco');
  });

  it('el blanco es el NEUTRO (no una fase)', () => {
    const neutral = CABLE_COLORS.find((c) => c.id === 'neutral');
    expect(neutral).toBeDefined();
    expect(neutral!.name.toLowerCase()).toContain('blanco');
    expect(neutral!.name.toLowerCase()).toContain('neutro');
    // No debe haber un item con id phase-* y nombre blanco
    const phaseWithWhite = CABLE_COLORS.find(
      (c) => c.id.startsWith('phase') && c.name.toLowerCase().includes('blanco')
    );
    expect(phaseWithWhite).toBeUndefined();
  });

  it('el conductor de protección (PE) es verde/amarillo bicolor', () => {
    const protection = CABLE_COLORS.find((c) => c.id === 'protection');
    expect(protection).toBeDefined();
    expect(protection!.name.toLowerCase()).toContain('verde');
    expect(protection!.name.toLowerCase()).toContain('amarillo');
    expect(protection!.stripe).toBeDefined(); // bicolor
  });

  it('ningún item referencia el RIC N°08 (los colores están en el RIC N°04)', () => {
    for (const c of CABLE_COLORS) {
      expect(c.standard).not.toMatch(/RIC N°?08/i);
      // Debe referenciar el RIC N°04 (pto 5.32) o "convención práctica"
      const isRIC4 = c.standard.includes('RIC N°04') || c.standard.includes('RIC 4');
      const isConvención = c.standard.toLowerCase().includes('convención');
      expect(isRIC4 || isConvención).toBe(true);
    }
  });

  it('cada color de fase o neutro cita explícitamente el RIC N°04, pto 5.32', () => {
    const required = ['phase-l1', 'phase-l2', 'phase-l3', 'neutral', 'protection'];
    for (const id of required) {
      const c = CABLE_COLORS.find((x) => x.id === id);
      expect(c, `color ${id} no encontrado`).toBeDefined();
      expect(c!.standard, `standard de ${id} debe mencionar RIC N°04`).toMatch(/RIC N°?04.*5\.32|pto 5\.32/);
    }
  });
});

describe('LEGACY_COLORS — equivalencias NCh 4/2003 → RIC N°04', () => {
  it('tiene la tabla de migración', () => {
    expect(LEGACY_COLORS.length).toBeGreaterThan(0);
  });

  it('cada entrada tiene old, modern, usage y note', () => {
    for (const l of LEGACY_COLORS) {
      expect(l.old).toBeTruthy();
      expect(l.modern).toBeTruthy();
      expect(l.usage).toBeTruthy();
      expect(l.note).toBeTruthy();
    }
  });
});
