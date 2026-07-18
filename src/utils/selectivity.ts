/**
 * @file Recomendador de protecciones termomagnéticas (selectividad).
 *
 * @description
 * Selecciona automáticamente el interruptor termomagnético (ITM) adecuado
 * para un circuito, considerando:
 *  - Corriente nominal del circuito
 *  - Tipo de carga (resistiva, motor, enchufes, electrónica)
 *  - Corriente de arranque (Inrush) si se conoce
 *  - Corriente de cortocircuito máxima prevista en el punto
 *
 * Refs. normativas:
 *  - IEC 60898 — Interruptores automáticos para instalaciones domésticas
 *  - RIC N°05, pto 6.3 — Poder de corte ≥ Icc máxima en el punto
 *
 * Curvas de disparo (instantáneo) según IEC 60898:
 *  - Curva B: 3 a 5  × In  → resistivos, cables largos, iluminación
 *  - Curva C: 5 a 10 × In  → uso general (enchufes, iluminación)
 *  - Curva D: 10 a 20 × In → motores con alto arranque
 */

import type { ConductorMaterial } from '@/data/ampacityTables';

/** Curva de disparo del interruptor termomagnético según IEC 60898. */
export type ProtectionCurve = 'B' | 'C' | 'D';

/** Tipo de carga protegida — determina la curva y el factor de Inrush. */
export type LoadType =
  | 'iluminacion'   // Resistivo, Inrush bajo.
  | 'enchufes'      // Mixto, Inrush moderado.
  | 'motor'         // Inrush 6-8×In.
  | 'motorPesado'   // Inrush 10-12×In.
  | 'resistivo'     // Calefacción, termo, sin Inrush.
  | 'electronica';  // Fuentes conmutadas, picos cortos.

/** Parámetros de entrada del recomendador. */
export interface ProtectionInput {
  /** Corriente nominal del circuito o del motor en A. */
  nominalCurrent: number;
  /** Tipo de carga — determina la curva automáticamente. */
  loadType: LoadType;
  /** Corriente de arranque estimada en A (opcional). */
  inrushCurrent?: number;
  /** Corriente de cortocircuito máxima prevista en el punto en kA. */
  iccMaxKA: number;
}

/** Recomendación del ITM. */
export interface ProtectionRecommendation {
  /** Corriente nominal del dispositivo en A. */
  in: number;
  /** Curva recomendada. */
  curve: ProtectionCurve;
  /** Poder de corte mínimo necesario en kA. */
  breakingCapacity: number;
  /** Explicación textual de la elección. */
  reasoning: string;
  /** Alternativas comerciales típicas (In, curva, PdC). */
  options: Array<{ in: number; curve: ProtectionCurve; breakingCapacity: number }>;
}

/** Corrientes nominales normalizadas según IEC 60898. */
const STANDARD_IN_VALUES = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125] as const;

/** Poderes de corte normalizados en kA según IEC 60898. */
const STANDARD_BREAKING_CAPACITIES = [3, 4.5, 6, 10, 15, 25] as const;

/**
 * Factores de seguridad para dimensionar In considerando Inrush.
 *
 * En la práctica un electricista dimensiona con margen 5x para motores
 * (no 10x como dice el estándar IEC 60898 al pie de la letra), porque las
 * condiciones reales (tensión baja, frecuencia, temperatura) hacen que el
 * disparo magnético se acerque al límite inferior.
 */
const INRUSH_SAFETY_FACTOR: Record<LoadType, number> = {
  iluminacion: 2,
  enchufes: 3,
  motor: 5,
  motorPesado: 8,
  resistivo: 1.5,
  electronica: 3,
};

/**
 * Margen sobre la Icc para elegir el poder de corte.
 * 1.5x es el criterio conservador habitual: si la Icc es 5 kA,
 * se pide 10 kA de PdC, no 6 kA estricto.
 */
const BREAKING_SAFETY_FACTOR = 1.5;

/**
 * Selecciona la curva de disparo según el tipo de carga.
 *
 * @param {LoadType} loadType - Tipo de carga.
 * @returns {ProtectionCurve} Curva IEC 60898 recomendada.
 *
 * @example
 * selectCurve('iluminacion');  // 'B'
 * selectCurve('enchufes');     // 'C'
 * selectCurve('motor');        // 'D'
 */
export function selectCurve(loadType: LoadType): ProtectionCurve {
  switch (loadType) {
    case 'iluminacion':
    case 'resistivo':
      return 'B';
    case 'electronica':
    case 'enchufes':
      return 'C';
    case 'motor':
    case 'motorPesado':
      return 'D';
  }
}

/**
 * Recomienda un interruptor termomagnético para un circuito.
 *
 * Considera el Inrush, el tipo de carga y la Icc máxima prevista para
 * dimensionar In, la curva y el poder de corte.
 *
 * @param {ProtectionInput} input - Parámetros del circuito.
 *
 * @returns {ProtectionRecommendation | null} Recomendación completa con
 *                                            In, curva, PdC, razonamiento y
 *                                            alternativas. null si la corriente
 *                                            nominal es inválida.
 *
 * @example
 * recommendProtection({ nominalCurrent: 16, loadType: 'enchufes', iccMaxKA: 5 });
 * // → { in: 16, curve: 'C', breakingCapacity: 10, ... }
 */
export function recommendProtection(input: ProtectionInput): ProtectionRecommendation | null {
  if (input.nominalCurrent <= 0) return null;

  const curve = selectCurve(input.loadType);

  // Corriente nominal: In ≥ I_nominal × factor de seguridad por Inrush
  const safetyFactor = INRUSH_SAFETY_FACTOR[input.loadType];
  const targetIn = input.inrushCurrent
    ? Math.max(input.nominalCurrent, input.inrushCurrent / safetyFactor)
    : input.nominalCurrent;

  const inCandidates = STANDARD_IN_VALUES.filter((v) => v >= targetIn);
  const inSelected = inCandidates[0] ?? targetIn;

  // Poder de corte: con factor de seguridad 1.5x
  const targetBreaking = input.iccMaxKA * BREAKING_SAFETY_FACTOR;
  const breaking = STANDARD_BREAKING_CAPACITIES.find((b) => b >= targetBreaking) ?? 25;

  // Generar opciones comerciales
  const options = [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125]
    .filter((v) => v >= input.nominalCurrent * 0.8)
    .slice(0, 4)
    .map((inOpt) => ({
      in: inOpt,
      curve,
      breakingCapacity: breaking,
    }));

  const reasoning = buildReasoning(input, curve, inSelected, breaking);

  return {
    in: inSelected,
    curve,
    breakingCapacity: breaking,
    reasoning,
    options,
  };
}

/**
 * Genera el texto explicativo de la recomendación.
 * @private
 */
function buildReasoning(
  input: ProtectionInput,
  curve: ProtectionCurve,
  inSelected: number,
  breaking: number
): string {
  const curveReason: Record<LoadType, string> = {
    iluminacion: 'Carga resistiva con bajo Inrush → curva B (disparo instantáneo 3-5×In)',
    enchufes: 'Carga mixta con Inrush moderado → curva C (disparo instantáneo 5-10×In)',
    motor: 'Motor con Inrush 6-8×In → curva D (disparo instantáneo 10-20×In)',
    motorPesado: 'Motor pesado con Inrush 10-12×In → curva D (verificar arranque)',
    resistivo: 'Carga puramente resistiva → curva B',
    electronica: 'Carga con fuentes conmutadas → curva C (tolera picos cortos)',
  };

  return [
    curveReason[input.loadType],
    `In = ${inSelected} A ≥ ${input.nominalCurrent.toFixed(1)} A nominales del circuito.`,
    `Poder de corte ≥ ${breaking} kA (Icc máxima prevista: ${input.iccMaxKA.toFixed(2)} kA).`,
  ].join(' ');
}
