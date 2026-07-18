/**
 * @file Tablas de ampacidad y factores de corrección según IEC 60364-5-523.
 *
 * @description
 * Datos de referencia para el cálculo de ampacidad (capacidad de corriente)
 * de los conductores eléctricos. El RIC N°04, tabla 4.4 referencia la norma
 * internacional IEC 60364-5-523 para estos valores.
 *
 * Las tablas de este archivo están dadas para:
 * - **Cobre** con aislamiento **XLPE 90°C** (N2XOH, THW/90)
 * - Temperatura ambiente de **30°C** de referencia
 * - 2 conductores cargados (monofásico) o 3 (trifásico)
 *
 * Los factores de corrección (temperatura, agrupamiento) permiten ajustar
 * estos valores a las condiciones reales de la instalación.
 *
 * Para otros materiales o aislamientos:
 * - Aluminio: multiplicar cobre × 0.78
 * - PVC 70°C: multiplicar cobre × 0.886
 *
 * @see https://webstore.iec.ch/publication/2180 - IEC 60364-5-523
 */

/**
 * Métodos de instalación según IEC 60364-5-523, Tabla A.52.1.
 *
 * Definen cómo se instala el conductor (dentro de muro, al aire, en bandeja, etc.)
 * y afectan significativamente la capacidad de disipación de calor.
 */
export type InstallationMethod = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'E' | 'F';

/**
 * Información descriptiva de un método de instalación para mostrar en la UI.
 *
 * @property {InstallationMethod} id          - Identificador IEC.
 * @property {string} shortName              - Código corto (ej: "A1").
 * @property {string} description            - Descripción técnica completa.
 * @property {string} typicalUse             - Casos de uso típicos en Chile.
 */
export interface InstallationMethodInfo {
  id: InstallationMethod;
  shortName: string;
  description: string;
  typicalUse: string;
}

/**
 * Catálogo completo de métodos de instalación IEC 60364-5-523 soportados,
 * con descripciones adaptadas al contexto chileno.
 */
export const INSTALLATION_METHODS: InstallationMethodInfo[] = [
  {
    id: 'A1',
    shortName: 'A1',
    description: 'Conductor unipolar en ducto dentro de pared aislante térmicamente',
    typicalUse: 'Embutido en muro con aislación (Polín, lana mineral)',
  },
  {
    id: 'A2',
    shortName: 'A2',
    description: 'Cable multiconductor en ducto dentro de pared aislante térmicamente',
    typicalUse: 'Embutido, cable NYA o THW en tubería dentro de aislación',
  },
  {
    id: 'B1',
    shortName: 'B1',
    description: 'Conductor unipolar en ducto sobre pared de madera o mampostería',
    typicalUse: 'A la vista, en tubería sobre muro (caso típico residencial chileno)',
  },
  {
    id: 'B2',
    shortName: 'B2',
    description: 'Cable multiconductor en ducto sobre pared de madera o mampostería',
    typicalUse: 'A la vista, cable multipolar NYY en tubería',
  },
  {
    id: 'C',
    shortName: 'C',
    description: 'Cable multipolar directamente sobre pared',
    typicalUse: 'Cables tipo NYY o N2XOH fijados con grapas, sin tubería',
  },
  {
    id: 'E',
    shortName: 'E',
    description: 'Cable multipolar al aire libre con distancia a la pared',
    typicalUse: 'Cable bandeja o escalerilla con ventilación, galpón industrial',
  },
  {
    id: 'F',
    shortName: 'F',
    description: 'Conductores unipolares en contacto, al aire libre',
    typicalUse: 'Barras o cables en tendido aéreo, ductos de barras',
  },
];

/** Secciones normalizadas según RIC N°04, pto 5.4. */
export const STANDARD_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240] as const;

/**
 * Ampacidad (A) para cobre con aislamiento XLPE 90°C, 30°C ambiente.
 *
 * Estructura: `AMPACITY_CU_XLPE[sección_mm²][método_instalación]` → corriente admisible (A).
 *
 * El valor 0 indica que esa combinación sección/método no es válida
 * (por ejemplo, secciones pequeñas en ductos de barras F).
 *
 * @see IEC 60364-5-523 Tabla B.52.4
 */
export const AMPACITY_CU_XLPE: Record<number, Record<InstallationMethod, number>> = {
  1.5:  { A1: 15.5, A2: 15,   B1: 17.5, B2: 16.5, C: 22,  E: 24,  F: 0   },
  2.5:  { A1: 21,   A2: 20,   B1: 24,   B2: 23,   C: 30,  E: 33,  F: 0   },
  4:    { A1: 28,   A2: 27,   B1: 32,   B2: 30,   C: 40,  E: 45,  F: 0   },
  6:    { A1: 36,   A2: 34,   B1: 41,   B2: 38,   C: 51,  E: 57,  F: 0   },
  10:   { A1: 50,   A2: 46,   B1: 57,   B2: 52,   C: 70,  E: 76,  F: 0   },
  16:   { A1: 66,   A2: 62,   B1: 76,   B2: 69,   C: 94,  E: 101, F: 0   },
  25:   { A1: 84,   A2: 80,   B1: 96,   B2: 90,   C: 119, E: 135, F: 146 },
  35:   { A1: 104,  A2: 99,   B1: 119,  B2: 111,  C: 148, E: 169, F: 182 },
  50:   { A1: 125,  A2: 118,  B1: 144,  B2: 133,  C: 180, E: 207, F: 221 },
  70:   { A1: 160,  A2: 149,  B1: 184,  B2: 168,  C: 232, E: 268, F: 284 },
  95:   { A1: 194,  A2: 180,  B1: 223,  B2: 201,  C: 282, E: 328, F: 346 },
  120:  { A1: 225,  A2: 208,  B1: 259,  B2: 232,  C: 328, E: 382, F: 403 },
  150:  { A1: 260,  A2: 240,  B1: 299,  B2: 268,  C: 379, E: 441, F: 465 },
  185:  { A1: 297,  A2: 274,  B1: 341,  B2: 305,  C: 434, E: 506, F: 533 },
  240:  { A1: 350,  A2: 321,  B1: 401,  B2: 357,  C: 514, E: 599, F: 631 },
};

/**
 * Factores de corrección por temperatura ambiente.
 * Aplican a la ampacidad base de la tabla, según la temperatura real del entorno.
 *
 * @see IEC 60364-5-523 Tabla B.52.14
 */
export const TEMPERATURE_FACTORS = {
  xlpe: {
    10: 1.15, 15: 1.12, 20: 1.08, 25: 1.04, 30: 1.00,
    35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82, 55: 0.76, 60: 0.71, 65: 0.65, 70: 0.58, 75: 0.50, 80: 0.41,
  },
  pvc: {
    10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.00,
    35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50, 65: 0.35, 70: 0.00, 75: 0.00, 80: 0.00,
  },
} as const;

/** Tipo de aislamiento del conductor. */
export type InsulationType = 'xlpe' | 'pvc';
/** Material del conductor. */
export type ConductorMaterial = 'cobre' | 'aluminio';

/**
 * Factores de corrección por agrupamiento de circuitos.
 * Aplica cuando múltiples circuitos comparten el mismo ducto, bandeja o envolvente.
 *
 * @see IEC 60364-5-523 Tabla B.52.17
 */
export const GROUPING_FACTORS: Record<number, number> = {
  1: 1.00, 2: 0.80, 3: 0.70, 4: 0.65, 5: 0.60,
  6: 0.57, 7: 0.54, 8: 0.52, 9: 0.50, 12: 0.45, 16: 0.41, 20: 0.38,
};

/**
 * Obtiene la ampacidad base (sin aplicar factores de corrección) para una
 * combinación de sección, método de instalación y material.
 *
 * @param {number} section       - Sección del conductor en mm².
 * @param {InstallationMethod} method - Método de instalación IEC.
 * @param {ConductorMaterial} material - Material del conductor.
 *
 * @returns {number} Corriente admisible en A. Retorna 0 si la combinación no aplica
 *                   (sección no estándar o método F con secciones < 25 mm²).
 *
 * @example
 * getBaseAmpacity(6, 'B1', 'cobre');     // 41
 * getBaseAmpacity(6, 'B1', 'aluminio');  // 32 (≈ 41 × 0.78)
 */
export function getBaseAmpacity(
  section: number,
  method: InstallationMethod,
  material: ConductorMaterial
): number {
  const table = AMPACITY_CU_XLPE[section];
  if (!table) return 0;
  const value = table[method];
  if (value === 0) return 0;
  return material === 'cobre' ? value : value * 0.78;
}

/**
 * Obtiene el factor de corrección por temperatura ambiente.
 * Redondea la temperatura al múltiplo de 5 más cercano.
 *
 * @param {InsulationType} insulation - Tipo de aislamiento del conductor.
 * @param {number} ambientC          - Temperatura ambiente en °C (rango válido: 10-80).
 *
 * @returns {number} Factor multiplicativo a aplicar a la ampacidad base.
 *
 * @example
 * getTemperatureFactor('xlpe', 30);  // 1.00
 * getTemperatureFactor('xlpe', 40);  // 0.91
 */
export function getTemperatureFactor(insulation: InsulationType, ambientC: number): number {
  const table = TEMPERATURE_FACTORS[insulation];
  const rounded = Math.max(10, Math.min(80, Math.round(ambientC / 5) * 5));
  return (table as Record<number, number>)[rounded] ?? 1.0;
}

/**
 * Obtiene el factor de corrección por agrupamiento de circuitos en un mismo ducto.
 *
 * @param {number} circuitsCount - Número de circuitos en el mismo ducto/bandeja.
 *
 * @returns {number} Factor multiplicativo. 1.0 si es 1 circuito, menor si hay más.
 *
 * @example
 * getGroupingFactor(1);   // 1.00
 * getGroupingFactor(3);   // 0.70
 * getGroupingFactor(15);  // 0.41
 */
export function getGroupingFactor(circuitsCount: number): number {
  if (circuitsCount <= 1) return 1.0;
  if (circuitsCount >= 20) return 0.38;
  return GROUPING_FACTORS[circuitsCount] ?? 0.38;
}
