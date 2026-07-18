export interface Installation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clientName: string;
  clientRut: string;
  address: string;
  commune: string;
  region: string;
  type: 'nueva' | 'ampliacion' | 'mantenimiento';
  photos: Photo[];
  location?: { lat: number; lng: number };
  technicalNotes: string;
  materials: MaterialItem[];
  calculations: Calculation[];
  signature?: string;
  certificateNumber: string;
  status: 'draft' | 'completed' | 'synced';
}

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: Date;
  caption?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Calculation {
  id: string;
  type: 'voltageDrop' | 'protection' | 'solar';
  data: Record<string, unknown>;
  result: Record<string, unknown>;
  timestamp: string;
}

export interface ElectricianProfile {
  name: string;
  rut: string;
  secNumber: string;
  phone: string;
  photo?: string;
  logo?: string;            // dataURL PNG/JPG, para PDFs
  defaultRate: number;
  laborFactor: number;
  theme: 'dark' | 'light' | 'system';
  units: 'metric' | 'imperial';
}

export interface CalculationHistory {
  id: string;
  type: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  timestamp: Date;
  favorite: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  description: string;
  image?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  region: string;
  lat: number;
  lng: number;
}

// ─── Cotizaciones ──────────────────────────────────────────────────────────

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'billed' | 'paid';

export type QuoteTemplate =
  | 'residential-basic'
  | 'residential-extension'
  | 'commercial-small'
  | 'industrial'
  | 'maintenance'
  | 'custom';

export interface QuoteItem {
  id: string;
  description: string;
  category: 'cable' | 'proteccion' | 'canalizacion' | 'conector' | 'tablero' | 'artefacto' | 'mano-obra' | 'otro';
  unit: string;            // 'm', 'un', 'kg', 'h'
  quantity: number;
  unitPrice: number;       // CLP
  discountPct: number;     // 0..100
  total: number;           // calculado: qty * unitPrice * (1 - discountPct/100)
}

export interface QuoteLabor {
  hours: number;
  hourlyRate: number;      // CLP/hora
  difficultyFactor: number; // 1.0 = normal, 1.5 = complejo
  total: number;
}

export interface Quote {
  id: string;
  number: string;          // ej: "COT-2026-001"
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date;
  status: QuoteStatus;
  template: QuoteTemplate;

  // Cliente
  clientName: string;
  clientRut: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  commune: string;
  region: string;

  // Items
  items: QuoteItem[];
  labor: QuoteLabor;

  // Totales (denormalizados para mostrar)
  subtotalMaterials: number;
  subtotalLabor: number;
  discountPct: number;     // descuento global extra
  taxPct: number;          // IVA 19%
  taxAmount: number;
  total: number;

  // Metadatos
  notes: string;
  installationId?: string;  // vincular con una instalación
  clientSignature?: string;  // dataURL PNG, opcional
  signedAt?: Date;
}

// ─── Declaración TE1 (RIC N°18, N°19) ────────────────────────────────────

export type InstallationType = 'nueva' | 'ampliacion' | 'modificacion' | 'reparacion';
export type InstallationDest = 'vivienda' | 'oficina' | 'local' | 'industrial' | 'otro';
export type EmpalmeType = 'monofasico' | 'trifasico';
export type EmpalmeCapacity = 6 | 10 | 16 | 20 | 25 | 32 | 40 | 50 | 63 | 80 | 100 | 125 | 160 | 200 | 250 | 320 | 400 | 500 | 630;

export interface TE1Declaration {
  id: string;
  number: string;          // ej: "TE1-2026-001"
  createdAt: Date;
  submittedAt?: Date;

  // Instalador (de ElectricianProfile)
  installerName: string;
  installerRut: string;
  installerSecNumber: string;
  installerPhone: string;
  installerAddress: string;

  // Cliente / ubicación
  clientName: string;
  clientRut: string;
  address: string;
  commune: string;
  region: string;
  // Geolocalización
  location?: { lat: number; lng: number };

  // Datos técnicos de la instalación
  installationType: InstallationType;
  installationArea: number;       // m²
  installationDest: 'vivienda' | 'oficina' | 'local' | 'industrial' | 'otro';

  // Empalme
  empalmeType: EmpalmeType;
  empalmeCapacity: EmpalmeCapacity; // A

  // Características eléctricas
  installedPowerKW: number;
  totalCircuits: number;
  lightingCircuits: number;
  outletCircuits: number;
  dedicatedCircuits: number;
  phasesCount: 1 | 3;

  // Conductores
  mainConductorSection: number;   // mm²
  mainConductorMaterial: 'cobre' | 'aluminio';
  mainConductorType: string;      // ej: 'N2XOH 0,6/1 kV'

  // Protecciones generales
  mainBreakerIn: number;          // A
  mainBreakerCurve: 'B' | 'C' | 'D';
  mainBreakerPdc: number;         // kA poder de corte
  hasDifferential: boolean;
  differentialSensitivity: 30 | 300 | 500; // mA
  hasGrounding: boolean;
  groundingResistance: number;    // Ω

  // Declaración
  compliesWithRic: boolean;
  observations: string;

  // Firmas
  installerSignature?: string;    // dataURL
  clientSignature?: string;
  signedAt?: Date;

  // Vínculo
  quoteId?: string;
  installationId?: string;
}
