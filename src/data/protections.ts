export interface ProtectionType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Factores de demanda: estimaciones de diseño (no normativas).
// Aplican solo al dimensionamiento de las protecciones generales (ICP/IGA), no por circuito.
export const BUILDING_TYPES = [
  { id: 'residencial', name: 'Residencial', icon: 'Home', factor: 0.7 },
  { id: 'comercial', name: 'Comercial', icon: 'Building2', factor: 0.8 },
  { id: 'industrial', name: 'Industrial', icon: 'Factory', factor: 0.9 },
] as const;

export const SPECIAL_CIRCUITS = [
  { id: 'banio', name: 'Baño', icon: 'Bath', description: 'Diferencial 30 mA obligatorio (RIC 10/5.1.3.5)', hasDifferential: true },
  { id: 'cocina', name: 'Cocina', icon: 'CookingPot', description: 'Circuito exclusivo mín. 16A (RIC 10/5.2.1.d)', hasDifferential: true },
  { id: 'lavanderia', name: 'Lavandería', icon: 'Shirt', description: 'Circuito dedicado para lavadora', hasDifferential: true },
  { id: 'garaje', name: 'Garaje', icon: 'Car', description: 'Circuito para herramientas/puerta', hasDifferential: false },
  { id: 'exterior', name: 'Exterior', icon: 'TreePine', description: 'Iluminación y tomas exteriores', hasDifferential: true },
] as const;

export const BREAKER_STANDARDS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

// Calibre comercial inmediatamente superior (RIC N°10 5.1.4.1).
// Devuelve null si la corriente supera el máximo calibre estándar (nunca hace clamp silencioso).
export function getNextBreakerRating(current: number): number | null {
  return BREAKER_STANDARDS.find(r => r >= current) ?? null;
}
