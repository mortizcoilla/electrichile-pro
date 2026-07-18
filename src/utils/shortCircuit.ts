/**
 * @file Cálculo de corrientes de cortocircuito (Icc) según IEC 60909.
 *
 * @description
 * Implementa el cálculo de la corriente de cortocircuito máxima y mínima
 * en bornes de la red y al final de un conductor, considerando la impedancia
 * de la red de distribución aguas arriba y la impedancia del cable.
 *
 * Fórmula general (IEC 60909):
 *
 *   Icc = c · U / (√3 · Z_total)
 *
 * Donde:
 *   - U = tensión nominal del sistema (V)
 *   - c = factor de tensión (1.05 para Icc máxima, 0.95 para Icc mínima)
 *   - Z_total = √((R_red + R_cable)² + (X_red + X_cable)²)
 *
 * Datos típicos de la red chilena:
 *   - BT urbana: Pcc = 250 MVA, X/R ≈ 10
 *   - BT rural:  Pcc = 100 MVA, X/R ≈ 8
 *   - MT:        Pcc = 500 MVA, X/R ≈ 15
 *
 * Aplicación en esta app: validar que el poder de corte del ITM seleccionado
 * sea suficiente para interrumpir la corriente de cortocircuito prevista en el
 * punto de instalación, según RIC N°05, pto 6.3.
 *
 * @see IEC 60909 - Short-circuit currents in three-phase AC systems
 * @see RIC N°05, pto 6.3 - Poder de corte de las protecciones
 */

import { RESISTIVITY } from '@/data/cables';
import type { ConductorMaterial } from '@/data/ampacityTables';

/** Tipo de cortocircuito a calcular. */
export type ShortCircuitType = 'threePhase' | 'singlePhase';

/** Parámetros de entrada para el cálculo de cortocircuito. */
export interface ShortCircuitInput {
  /** Tipo de cortocircuito (trifásico fase-fase o monofásico fase-neutro). */
  type: ShortCircuitType;
  /** Tensión nominal del sistema en V. Por defecto 380 V trifásico / 220 V monofásico. */
  voltage: number;
  /** Potencia de cortocircuito de la red aguas arriba en MVA. */
  networkPccMVA: number;
  /** Relación X/R de la red (típico 10 en BT Chile). */
  networkXRatio: number;
  /** Longitud del conductor en metros. */
  length: number;
  /** Sección del conductor en mm². */
  section: number;
  /** Material del conductor. */
  material: ConductorMaterial;
}

/** Resultado del cálculo de cortocircuito. */
export interface ShortCircuitResult {
  /** Corriente de cortocircuito máxima al final del conductor en kA. */
  iccMaxKA: number;
  /** Corriente de cortocircuito mínima al final del conductor en kA. */
  iccMinKA: number;
  /** Corriente de cortocircuito en bornes de la red (sin cable) en kA. */
  iccRedKA: number;
  /** Impedancia de la red en Ohmios. */
  zRed: number;
  /** Impedancia del cable en Ohmios. */
  zCable: number;
  /** Valor pico de la corriente (Ip) en kA — para verificar esfuerzo electrodinámico. */
  ipicoMaxKA: number;
  /** true si una protección con PdC 10 kA es suficiente. */
  enoughWith10kA: boolean;
}

/** Factor de tensión IEC 60909 para Icc máxima. */
const C_MAX = 1.05;
/** Factor de tensión IEC 60909 para Icc mínima. */
const C_MIN = 0.95;
/** Reactancia típica de cables BT a 50 Hz en Ω/km. */
const REACTANCIA_CABLE_BT = 0.08;

/**
 * Calcula la corriente de cortocircuito trifásica o monofásica en el extremo
 * de un conductor, considerando la impedancia de la red aguas arriba y del cable.
 *
 * @param {ShortCircuitInput} input - Parámetros del sistema y del cable.
 *
 * @returns {ShortCircuitResult | null} Resultado con Icc máx, mín, en bornes, Ip y
 *                                      la impedancia de la red y del cable.
 *                                      null si los parámetros son inválidos.
 *
 * @example
 * // Cable Cu 10mm², 50m, en BT chileno 380V / 250 MVA
 * const r = calculateShortCircuit({
 *   type: 'threePhase', voltage: 380, networkPccMVA: 250, networkXRatio: 10,
 *   length: 50, section: 10, material: 'cobre',
 * });
 * // → { iccMaxKA: 2.55, iccMinKA: 2.30, ... enoughWith10kA: true }
 */
export function calculateShortCircuit(input: ShortCircuitInput): ShortCircuitResult | null {
  if (input.length <= 0 || input.section <= 0 || input.networkPccMVA <= 0) return null;

  const rho = RESISTIVITY[input.material];
  // Reactancia del cable BT típica: 0.08 Ω/km
  const xCable = (REACTANCIA_CABLE_BT * input.length) / 1000;
  const rCable = (rho * input.length) / input.section;

  // Impedancia de la red (usando Pcc)
  const zRed = (input.voltage * input.voltage) / (input.networkPccMVA * 1e6);
  const rRed = zRed / Math.sqrt(1 + input.networkXRatio * input.networkXRatio);
  const xRed = rRed * input.networkXRatio;
  const iccRed = (C_MAX * input.voltage) / (Math.sqrt(3) * zRed) / 1000; // kA

  // Impedancia total
  const rTotal = rRed + rCable;
  const xTotal = xRed + xCable;
  const zTotal = Math.sqrt(rTotal * rTotal + xTotal * xTotal);

  // Icc máxima y mínima trifásica
  let iccMax = (C_MAX * input.voltage) / (Math.sqrt(3) * zTotal) / 1000;
  let iccMin = (C_MIN * input.voltage) / (Math.sqrt(3) * zTotal) / 1000;

  // Para cortocircuito monofásico, se usa la tensión fase-neutro
  if (input.type === 'singlePhase') {
    const uFase = input.voltage / Math.sqrt(3);
    iccMax = (C_MAX * uFase) / zTotal / 1000;
    iccMin = (C_MIN * uFase) / zTotal / 1000;
  }

  // Pico de corriente: Ip = κ · √2 · Icc
  // κ depende de X/R total: κ ≈ 1.02 + 0.98·e^(-3·X/R)
  const xrTotal = xTotal / rTotal;
  const kappa = 1.02 + 0.98 * Math.exp(-3 * xrTotal);
  const ipicoMax = kappa * Math.sqrt(2) * iccMax;

  return {
    iccMaxKA: iccMax,
    iccMinKA: iccMin,
    iccRedKA: iccRed,
    zRed,
    zCable: Math.sqrt(rCable * rCable + xCable * xCable),
    ipicoMaxKA: ipicoMax,
    enoughWith10kA: iccMax <= 10,
  };
}

/**
 * Presets de potencia de cortocircuito para la red chilena.
 * Referencia: valores típicos usados en Chile para diseño BT/MT.
 */
export const NETWORK_PRESETS = {
  /** Red de baja tensión urbana (Pcc = 250 MVA, X/R = 10). */
  btUrbano: { name: 'BT urbano (Pcc 250 MVA)', pccMVA: 250, xr: 10 },
  /** Red de baja tensión rural (Pcc = 100 MVA, X/R = 8). */
  btRural: { name: 'BT rural (Pcc 100 MVA)', pccMVA: 100, xr: 8 },
  /** Red de media tensión (Pcc = 500 MVA, X/R = 15). */
  mt: { name: 'MT (Pcc 500 MVA)', pccMVA: 500, xr: 15 },
} as const;
