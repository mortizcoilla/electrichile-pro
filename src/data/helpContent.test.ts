import { describe, it, expect } from 'vitest';
import {
  HELP_SECTIONS,
  QUICK_START,
  CHANGELOG,
  APP_VERSION,
  searchHelp,
} from './helpContent';

describe('helpContent', () => {
  it('tiene al menos 5 secciones', () => {
    expect(HELP_SECTIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('cada sección tiene id, title, icon, description y content', () => {
    for (const s of HELP_SECTIONS) {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.icon).toBeDefined();
      expect(s.description).toBeTruthy();
      expect(s.content.length).toBeGreaterThan(0);
    }
  });

  it('incluye secciones clave: intro, calculadoras, cotizaciones, te1, faq', () => {
    const ids = HELP_SECTIONS.map((s) => s.id);
    expect(ids).toContain('intro');
    expect(ids).toContain('calculators');
    expect(ids).toContain('quotes');
    expect(ids).toContain('te1');
    expect(ids).toContain('faq');
  });

  it('todos los blocks tienen tipo válido', () => {
    const validTypes = new Set(['paragraph', 'list', 'steps', 'callout']);
    for (const s of HELP_SECTIONS) {
      for (const b of s.content) {
        expect(validTypes.has(b.type)).toBe(true);
      }
    }
  });
});

describe('QUICK_START', () => {
  it('tiene exactamente 4 pasos', () => {
    expect(QUICK_START).toHaveLength(4);
  });

  it('los pasos están numerados del 1 al 4', () => {
    const numbers = QUICK_START.map((s) => s.number);
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it('cada paso tiene título y descripción', () => {
    for (const step of QUICK_START) {
      expect(step.title).toBeTruthy();
      expect(step.description).toBeTruthy();
    }
  });
});

describe('CHANGELOG', () => {
  it('tiene al menos una versión', () => {
    expect(CHANGELOG.length).toBeGreaterThan(0);
  });

  it('la primera versión coincide con APP_VERSION', () => {
    expect(CHANGELOG[0].version).toBe(APP_VERSION);
  });

  it('cada release tiene al menos 3 cambios', () => {
    for (const rel of CHANGELOG) {
      expect(rel.changes.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('searchHelp', () => {
  it('con query vacía devuelve todas las secciones', () => {
    expect(searchHelp('').length).toBe(HELP_SECTIONS.length);
  });

  it('encuentra por título de sección', () => {
    const r = searchHelp('cotizacion');
    expect(r.length).toBeGreaterThan(0);
    expect(r.some((s) => s.id === 'quotes')).toBe(true);
  });

  it('encuentra dentro del contenido (case-insensitive)', () => {
    const r = searchHelp('RIC');
    expect(r.length).toBeGreaterThan(0);
  });

  it('devuelve array vacío si no hay coincidencias', () => {
    expect(searchHelp('xyzqwerty_inexistente_123')).toEqual([]);
  });

  it('encuentra en items de listas', () => {
    const r = searchHelp('WhatsApp');
    expect(r.length).toBeGreaterThan(0);
  });

  it('encuentra en steps numerados', () => {
    const r = searchHelp('instalador');
    // Debe encontrar en la sección "first-steps" y posiblemente otras
    expect(r.length).toBeGreaterThan(0);
  });
});
