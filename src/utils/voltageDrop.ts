/**
 * @file Cálculo de caída de tensión en conductores eléctricos.
 *
 * @description
 * Implementa el cálculo de caída de tensión en alimentadores, subalimentadores
 * y circuitos finales según el Reglamento de Instalaciones de Consumo (RIC N°03,
 * pto 5.1.3) de la Superintendencia de Electricidad y Combustibles de Chile.
 *
 * La fórmula utilizada es la estándar de la electrotecnia:
 *
 *   Para sistemas monofásicos:  ΔU = (2 · L · I · ρ) / S
 *   Para sistemas trifásicos:    ΔU = (√3 · L · I · ρ) / S
 *
 * Donde:
 *   - L = longitud del conductor (m)
 *   - I = corriente que circula (A)
 *   - ρ = resistividad del material (Ω·mm²/m) — Cu: 0.0172, Al: 0.0282
 *   - S = sección del conductor (mm²)
 *
 * @see https://www.sec.cl - Reglamento de Instalaciones de Consumo (RIC)
 * @see {@link https://www.norma-technic.cl/ric-03} RIC N°03 completo
 */

import { CONDUCTOR_SECTIONS } from '@/data/cables';

/**
 * Caída de tensión máxima admisible en un alimentador.
 *
 * Valor: 3% según RIC N°03, pto 5.1.3:
 * "la caída de tensión... no exceda del 3% de la tensión nominal de la alimentación"
 *
 * @constant {number}
 */
export const CAIDA_MAX_ALIMENTADOR = 3;

/**
 * Caída de tensión máxima admisible en el punto más desfavorable de la instalación.
 *
 * Considera la suma de la caída en el alimentador + subalimentador + circuito final.
 * Valor: 5% según RIC N°03, pto 5.1.3:
 * "la caída de tensión total en el punto de la instalación más desfavorable
 *  no exceda del 5% de dicha tensión"
 *
 * @constant {number}
 */
export const CAIDA_MAX_TOTAL = 5;

/** Tensión nominal monofásica en Chile (fase-neutro). */
const VOLTAJE_MONOFASICO = 220;
/** Tensión nominal trifásica en Chile (fase-fase). */
const VOLTAJE_TRIFASICO = 380;

/**
 * Resultado del cálculo de caída de tensión.
 *
 * @property {number} voltageDrop - Caída de tensión absoluta en Voltios.
 * @property {number} percentage  - Caída de tensión como porcentaje de la tensión nominal.
 */
export type VoltageDropResult = {
  voltageDrop: number;
  percentage: number;
};

/**
 * Calcula la caída de tensión en un conductor.
 *
 * @param {number} length        - Longitud del conductor en metros.
 * @param {number} current       - Corriente que circula por el conductor en Amperes.
 * @param {number} section       - Sección transversal del conductor en mm².
 * @param {number} resistivity   - Resistividad del material en Ω·mm²/m (Cu: 0.0172, Al: 0.0282).
 * @param {boolean} isThreePhase - true si es sistema trifásico, false si es monofásico.
 * @param {number} [baseVoltage] - Tensión nominal del sistema. Por defecto 220V mono / 380V tri.
 *
 * @returns {VoltageDropResult | null} Resultado con la caída en V y %, o null si los parámetros son inválidos.
 *
 * @example
 * // Cable Cu 6mm², 50m, 20A, monofásico 220V
 * const r = calculateVoltageDrop(50, 20, 6, 0.0172, false);
 * // → { voltageDrop: 5.73, percentage: 2.61 }
 */
export function calculateVoltageDrop(
  length: number,
  current: number,
  section: number,
  resistivity: number,
  isThreePhase: boolean,
  baseVoltage?: number
): VoltageDropResult | null {
  if (length <= 0 || current <= 0 || section <= 0) return null;
  const factor = isThreePhase ? Math.sqrt(3) : 2;
  const voltageDrop = (factor * length * current * resistivity) / section;
  const voltage = baseVoltage ?? (isThreePhase ? VOLTAJE_TRIFASICO : VOLTAJE_MONOFASICO);
  const percentage = (voltageDrop / voltage) * 100;
  return { voltageDrop, percentage };
}

/**
 * Estados posibles del resultado según el porcentaje de caída de tensión.
 *
 * - 'ok':       La caída es ≤ 3% → cumple el límite del alimentador (RIC N°03, 5.1.3).
 * - 'warning':  La caída está entre 3% y 5% → puede ser aceptable para el circuito
 *               final, pero hay que revisar la caída total.
 * - 'danger':   La caída supera el 5% → no cumple la caída total máxima.
 */
export type VoltageStatus = 'ok' | 'warning' | 'danger';

/**
 * Clasifica el resultado de una caída de tensión según los límites del RIC.
 *
 * @param {number} percentage - Porcentaje de caída de tensión.
 * @returns {VoltageStatus} Estado que indica el cumplimiento normativo.
 *
 * @example
 * getVoltageStatus(2.5);   // 'ok'
 * getVoltageStatus(3.5);   // 'warning'
 * getVoltageStatus(6.0);   // 'danger'
 */
export function getVoltageStatus(percentage: number): VoltageStatus {
  if (percentage <= CAIDA_MAX_ALIMENTADOR) return 'ok';
  if (percentage <= CAIDA_MAX_TOTAL) return 'warning';
  return 'danger';
}

/**
 * Sugiere una sección mayor para que la caída de tensión cumpla el 3% del alimentador.
 *
 * Recorre la lista de secciones normalizadas de mayor a menor y devuelve la primera
 * que, con la sección actual y los demás parámetros, da una caída ≤ 3%.
 *
 * @param {number} percentage      - Caída actual en %.
 * @param {number} currentSection  - Sección actual del conductor en mm².
 * @param {number} current         - Corriente en A.
 * @param {number} length          - Longitud en m.
 * @param {number} resistivity     - Resistividad del material.
 * @param {boolean} isThreePhase   - Tipo de sistema.
 *
 * @returns {string | null} Mensaje con la sección sugerida, o null si ya cumple.
 *
 * @example
 * getSuggestion(4.5, 6, 20, 50, 0.0172, false);
 * // → 'Aumente sección a 10 mm² (≤ 3% en alimentador según RIC N°03, 5.1.3)'
 */
export function getSuggestion(
  percentage: number,
  currentSection: number,
  current: number,
  length: number,
  resistivity: number,
  isThreePhase: boolean
): string | null {
  if (percentage <= CAIDA_MAX_ALIMENTADOR) return null;
  for (const s of CONDUCTOR_SECTIONS) {
    if (s <= currentSection) continue;
    const result = calculateVoltageDrop(length, current, s, resistivity, isThreePhase);
    if (result && result.percentage <= CAIDA_MAX_ALIMENTADOR) {
      return `Aumente sección a ${s} mm² (≤ 3% en alimentador según RIC N°03, 5.1.3)`;
    }
  }
  return 'Considere reducir la longitud del circuito o subdividir la carga';
}
