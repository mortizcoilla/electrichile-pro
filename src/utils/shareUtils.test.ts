import { describe, it, expect } from 'vitest';
import { buildQuoteMessage, buildTE1Message, normalizePhone } from './shareUtils';
import type { Quote, TE1Declaration } from '@/types';

const baseQuote: Quote = {
  id: 'q1',
  number: 'COT-2026-001',
  createdAt: new Date('2026-07-17T12:00:00Z'),
  updatedAt: new Date('2026-07-17T12:00:00Z'),
  validUntil: new Date('2026-08-01T12:00:00Z'),
  status: 'draft',
  template: 'residential-basic',
  clientName: 'Juan Pérez',
  clientRut: '12.345.678-9',
  address: 'Av. Principal 1234',
  commune: 'Providencia',
  region: 'RM',
  items: [
    { id: 'i1', description: 'Cable 2,5 mm²', category: 'cable', unit: 'm', quantity: 50, unitPrice: 1500, discountPct: 0, total: 75000 },
  ],
  labor: { hours: 8, hourlyRate: 15000, difficultyFactor: 1, total: 120000 },
  subtotalMaterials: 75000,
  subtotalLabor: 120000,
  discountPct: 0,
  taxPct: 19,
  taxAmount: 37050,
  total: 232050,
  notes: 'Entrega en 5 días',
};

const baseTE1: TE1Declaration = {
  id: 't1',
  number: 'TE1-2026-001',
  createdAt: new Date('2026-07-17'),
  installerName: 'Pedro Electricista',
  installerRut: '11.111.111-1',
  installerSecNumber: '12345',
  installerPhone: '+56912345678',
  installerAddress: 'Casa matriz',
  clientName: 'Juan Pérez',
  clientRut: '22.222.222-2',
  address: 'Av. Principal 1234',
  commune: 'Providencia',
  region: 'RM',
  installationType: 'nueva',
  installationArea: 80,
  installationDest: 'vivienda',
  empalmeType: 'monofasico',
  empalmeCapacity: 10,
  installedPowerKW: 5.5,
  totalCircuits: 8,
  lightingCircuits: 3,
  outletCircuits: 4,
  dedicatedCircuits: 1,
  phasesCount: 1,
  mainConductorSection: 6,
  mainConductorMaterial: 'cobre',
  mainConductorType: 'N2XOH 0,6/1 kV',
  mainBreakerIn: 25,
  mainBreakerCurve: 'C',
  mainBreakerPdc: 10,
  hasDifferential: true,
  differentialSensitivity: 30,
  hasGrounding: true,
  groundingResistance: 5,
  compliesWithRic: true,
  observations: '',
};

describe('normalizePhone', () => {
  it('elimina todo lo que no sea dígito', () => {
    expect(normalizePhone('+56 9 1234-5678')).toBe('56912345678');
  });
  it('devuelve string vacío si no hay dígitos', () => {
    expect(normalizePhone('---')).toBe('');
  });
});

describe('buildQuoteMessage', () => {
  it('incluye número, cliente, total y notas', () => {
    const msg = buildQuoteMessage(baseQuote, null);
    expect(msg).toContain('COT-2026-001');
    expect(msg).toContain('Juan Pérez');
    expect(msg).toContain('232.050'); // CLP formateado
    expect(msg).toContain('Entrega en 5 días');
  });

  it('incluye los items con su precio', () => {
    const msg = buildQuoteMessage(baseQuote, null);
    expect(msg).toContain('Cable 2,5 mm²');
    expect(msg).toContain('50 m');
  });

  it('incluye mano de obra cuando hay horas', () => {
    const msg = buildQuoteMessage(baseQuote, null);
    expect(msg).toContain('8 h mano de obra');
  });
});

describe('buildTE1Message', () => {
  it('incluye número, cliente e instalador', () => {
    const msg = buildTE1Message(baseTE1);
    expect(msg).toContain('TE1-2026-001');
    expect(msg).toContain('Juan Pérez');
    expect(msg).toContain('Pedro Electricista');
    expect(msg).toContain('12345'); // SEC
  });

  it('traduce el tipo de instalación al español', () => {
    expect(buildTE1Message(baseTE1)).toContain('Nueva');
    const mod = { ...baseTE1, installationType: 'modificacion' as const };
    expect(buildTE1Message(mod)).toContain('Modificación');
  });

  it('incluye empalme y potencia', () => {
    const msg = buildTE1Message(baseTE1);
    expect(msg).toContain('monofasico');
    expect(msg).toContain('10 A');
    expect(msg).toContain('5.5 kW');
  });
});
