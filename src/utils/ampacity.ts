/**
 * @file Cálculo de ampacidad y selección de sección mínima.
 *
 * @description
 * Implementa la determinación de la sección mínima de un conductor eléctrico
 * según su corriente de diseño, el método de instalación, el material, el tipo
 * de aislamiento, la temperatura ambiente y el agrupamiento de circuitos.
 *
 * Ref. normativa: RIC N°04, tabla 4.4 (que referencia IEC 60364-5-523).
 *
 * La ampacidad corregida se calcula como:
 *
 *   I'z = I_z × K_temp × K_agrup
 *
 * Donde:
 *   I_z    = ampacidad base (tabla según método y sección)
 *   K_temp = factor de corrección por temperatura ambiente
 *   K_agrup = factor de corrección por agrupamiento de circuitos
 *
 * La sección mínima admisible es la primera sección normalizada cuya
 * ampacidad corregida sea ≥ la corriente de diseño del circuito.
 */

import {
  STANDARD_SECTIONS,
  getBaseAmpacity,
  getTemperatureFactor,
  getGroupingFactor,
  type ConductorMaterial,
  type InsulationType,
  type InstallationMethod,
} from '@/data/ampacityTables';

/** Parámetros de entrada para el cálculo de ampacidad. */
export interface AmpacityInput {
  /** Corriente de diseño del circuito en Amperes. */
  designCurrent: number;
  /** Método de instalación IEC 60364-5-523. */
  method: InstallationMethod;
  /** Material del conductor (cobre o aluminio). */
  material: ConductorMaterial;
  /** Tipo de aislamiento (XLPE 90°C o PVC 70°C). */
  insulation: InsulationType;
  /** Temperatura ambiente en °C. */
  ambientC: number;
  /** Número de circuitos agrupados en el mismo ducto o bandeja. */
  groupedCircuits: number;
}

/** Resultado del cálculo de ampacidad. */
export interface AmpacityResult {
  /** Sección mínima recomendada en mm² (0 si no hay sección normalizada que sirva). */
  minSection: number;
  /** Ampacidad corregida de la sección mínima en A. */
  correctedAmpacity: number;
  /** Factor de corrección por temperatura aplicado. */
  temperatureFactor: number;
  /** Factor de corrección por agrupamiento aplicado. */
  groupingFactor: number;
  /** ¿La sección mínima hallada cumple con la corriente de diseño? */
  meetsRequirement: boolean;
  /** Tabla completa con todas las secciones y su ampacidad corregida. */
  table: Array<{ section: number; correctedAmpacity: number; valid: boolean }>;
}

/**
 * Calcula la sección mínima de un conductor para soportar una corriente de diseño.
 *
 * Recorre la lista de secciones normalizadas (1.5 a 240 mm²) y devuelve la
 * primera cuya ampacidad corregida sea ≥ la corriente de diseño.
 *
 * @param {AmpacityInput} input - Parámetros del circuito y de la instalación.
 *
 * @returns {AmpacityResult | null} Resultado con la sección mínima y la tabla
 *                                  completa. null si los parámetros son inválidos.
 *
 * @example
 * const r = calculateAmpacity({
 *   designCurrent: 25,
 *   method: 'B1',
 *   material: 'cobre',
 *   insulation: 'xlpe',
 *   ambientC: 30,
 *   groupedCircuits: 1,
 * });
 * // → { minSection: 4, correctedAmpacity: 32, ... }
 */
export function calculateAmpacity(input: AmpacityInput): AmpacityResult | null {
  if (input.designCurrent <= 0) return null;
  const Ktemp = getTemperatureFactor(input.insulation, input.ambientC);
  const Kagr = getGroupingFactor(input.groupedCircuits);

  const table = STANDARD_SECTIONS.map((s) => {
    const base = getBaseAmpacity(s, input.method, input.material);
    const corrected = base === 0 ? 0 : base * Ktemp * Kagr;
    return { section: s, correctedAmpacity: corrected, valid: corrected >= input.designCurrent };
  });

  const firstValid = table.find((r) => r.valid && r.correctedAmpacity > 0);
  const minSection = firstValid ? firstValid.section : 0;

  return {
    minSection,
    correctedAmpacity: firstValid ? firstValid.correctedAmpacity : 0,
    temperatureFactor: Ktemp,
    groupingFactor: Kagr,
    meetsRequirement: minSection > 0,
    table,
  };
}

/**
 * Verifica si una sección específica es suficiente para una corriente de diseño.
 *
 * Internamente llama a {@link calculateAmpacity} y devuelve el mismo resultado.
 * Útil cuando el usuario quiere validar una sección existente en vez de buscar
 * la mínima.
 *
 * @param section        - Sección propuesta en mm².
 * @param designCurrent  - Corriente de diseño del circuito en A.
 * @param method         - Método de instalación IEC.
 * @param material       - Material del conductor.
 * @param insulation     - Tipo de aislamiento.
 * @param ambientC       - Temperatura ambiente en °C.
 * @param groupedCircuits- Número de circuitos agrupados.
 *
 * @returns {AmpacityResult | null} Resultado con la tabla y la verificación.
 */
export function verifySection(
  section: number,
  designCurrent: number,
  method: InstallationMethod,
  material: ConductorMaterial,
  insulation: InsulationType,
  ambientC: number,
  groupedCircuits: number
): AmpacityResult | null {
  return calculateAmpacity({
    designCurrent,
    method,
    material,
    insulation,
    ambientC,
    groupedCircuits,
  });
}
