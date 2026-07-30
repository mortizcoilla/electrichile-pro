/**
 * @file Tablas oficiales de ampacidad según RIC N°04.
 *
 * @description
 * Datos de ampacidad (capacidad de transporte de corriente) de los conductores
 * según el Reglamento de Instalaciones de Consumo de Energía Eléctrica (RIC N°04).
 *
 * El RIC N°04 incluye sus PROPIAS tablas de ampacidad (no referencia IEC 60364-5-523
 * para este cálculo). Las tablas usadas aquí son:
 *
 *   - Tabla 4.3: Conductores de cobre desnudos (no usada en la app — son para líneas aéreas).
 *   - Tabla 4.4: Conductores aislados para tendido fijo (70°C y 90°C).
 *   - Tabla 4.5: Conductores de uso móvil (H03VV, H05VV, H05RR, etc.).
 *   - Tabla 4.6: Factor de corrección por cantidad de conductores en ductos.
 *   - Tabla 4.7: Factor de corrección por temperatura ambiente.
 *
 * Los MÉTODOS de instalación del RIC N°04 son:
 *   - A1: Conductor monopolar en ducto embutido en pared.
 *   - A2: Cable multiconductor en ducto embutido en pared.
 *   - B1: Conductor monopolar en ducto/bandeja adosado a pared.
 *   - B2: Cable multiconductor en ducto/bandeja adosado a pared.
 *   - D1: Cables en ductos enterrados.
 *   - D2: Cables con cubierta, directamente enterrados.
 *   - E:  Cables multiconductores al aire (bandejas, escalerillas, canastillos).
 *   - F:  Cables monoconductores al aire, en contacto, disposición plana.
 *
 * Ver también:
 *   - pto 5.4: Secciones mínimas (iluminación 1.5 mm², enchufes 2.5 mm², subalimentadores 2.5 mm², alimentadores 4 mm²).
 *   - pto 5.32: Código de colores de los conductores.
 *   - pto 5.30 / 5.33: Restricciones sobre colores de canalización y bicolor verde/amarillo.
 *
 * @see RIC N°04, Resolución Exenta SEC N° 33.877/2020
 */

export type InstallationMethod = 'A1' | 'A2' | 'B1' | 'B2' | 'D1' | 'D2' | 'E' | 'F';

export interface InstallationMethodInfo {
  id: InstallationMethod;
  shortName: string;
  description: string;
  /** Casos típicos de uso en Chile. */
  typicalUse: string;
}

/**
 * Métodos de instalación del RIC N°04, pto 6.2.4 y Tabla 4.4.
 * Las descripciones son adaptaciones técnicas del Anexo del pliego.
 */
export const INSTALLATION_METHODS: InstallationMethodInfo[] = [
  {
    id: 'A1',
    shortName: 'A1',
    description: 'Hasta tres conductores monopolares con carga, instalados en ductos embutidos en paredes.',
    typicalUse: 'Embutido en muro, en tubería conduit cerrada.',
  },
  {
    id: 'A2',
    shortName: 'A2',
    description: 'Cables multiconductores (3 conductores con carga) instalados en ductos embutidos en paredes.',
    typicalUse: 'Embutido, cable multiconductor (NYY, RV-K) en tubería dentro de muro.',
  },
  {
    id: 'B1',
    shortName: 'B1',
    description: 'Hasta tres conductores monopolares instalados en ductos o en bandejas adosadas a paredes.',
    typicalUse: 'A la vista en tubería sobre muro (caso típico residencial chileno).',
  },
  {
    id: 'B2',
    shortName: 'B2',
    description: 'Cables multiconductores (3 conductores con carga) instalados en ductos o en bandejas adosadas a paredes.',
    typicalUse: 'A la vista, cable multiconductor NYY o RV-K en tubería/bandeja.',
  },
  {
    id: 'D1',
    shortName: 'D1',
    description: 'Cables monoconductores o multiconductores (3 conductores con carga) instalados en ductos enterrados.',
    typicalUse: 'Acometidas subterráneas en ducto PVC en zanja.',
  },
  {
    id: 'D2',
    shortName: 'D2',
    description: 'Cables con cubierta, monoconductores o multiconductores (3 conductores con carga) instalados directamente enterrados.',
    typicalUse: 'Cables directamente enterrados (sin ducto), p.ej. RV-K 0,6/1 kV.',
  },
  {
    id: 'E',
    shortName: 'E',
    description: 'Cables multiconductores (3 conductores con carga) instalados libremente al aire, en escalerillas, canastillos o bandejas perforadas.',
    typicalUse: 'Galpones industriales, salas de tableros, bandejas con ventilación.',
  },
  {
    id: 'F',
    shortName: 'F',
    description: 'Cables monoconductores (3 conductores con carga), en contacto y en disposición plana, instalados libremente al aire, en escalerillas, canastillos o bandejas perforadas.',
    typicalUse: 'Ductos de barras, tendidos aéreos con cables en contacto.',
  },
];

/** Secciones normalizadas según RIC N°04, pto 6.1.2. */
export const STANDARD_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240] as const;

/**
 * Capacidad de transporte de corriente (A) según RIC N°04, Tabla 4.4.
 *
 * Ver {@link TABLE_4_4_70C} y {@link TABLE_4_4_90C} para los valores oficiales.
 * Las funciones helper {@link getBaseAmpacity}, {@link getTemperatureFactor}
 * y {@link getGroupingFactor} permiten acceder a estos datos con las
 * correcciones del RIC N°04.
 *
 * @see RIC N°04, pto 6.2.2 y Tablas 4.4, 4.5
 */

export interface AmpacityTable {
  /** Conductores a los que aplica esta tabla */
  appliesTo: string;
  /** Temperatura de servicio en °C */
  tempServicio: number;
  /** Tabla: sección -> método -> A. */
  table: Record<number, Record<InstallationMethod, number>>;
}

/**
 * RIC N°04, Tabla 4.4 (primera parte): cables a 70°C.
 * Aplica a H07V-U/R/K, H07Z1-U/R/K, THWN, NYIFY, ACOMETIDA.
 */
export const TABLE_4_4_70C: AmpacityTable = {
  appliesTo: 'H07V-U/R/K, H07Z1-U/R/K, THWN, NYIFY, ACOMETIDA',
  tempServicio: 70,
  table: {
    1.5:  { A1: 14, A2: 14,  B1: 16, B2: 15, D1: 19, D2: 23, E: 19, F: 0 },
    2.5:  { A1: 18, A2: 18,  B1: 21, B2: 20, D1: 24, D2: 30, E: 25, F: 0 },
    4:    { A1: 24, A2: 24,  B1: 28, B2: 27, D1: 31, D2: 39, E: 33, F: 42 },
    6:    { A1: 31, A2: 31,  B1: 36, B2: 34, D1: 39, D2: 49, E: 42, F: 55 },
    10:   { A1: 42, A2: 42,  B1: 50, B2: 46, D1: 51, D2: 64, E: 57, F: 75 },
    16:   { A1: 56, A2: 56,  B1: 68, B2: 62, D1: 67, D2: 84, E: 76, F: 100 },
    25:   { A1: 73, A2: 73,  B1: 89, B2: 80, D1: 86, D2: 107, E: 99, F: 127 },
    35:   { A1: 89, A2: 89,  B1: 110, B2: 99, D1: 103, D2: 129, E: 121, F: 158 },
    50:   { A1: 108, A2: 108, B1: 134, B2: 118, D1: 122, D2: 153, E: 145, F: 192 },
    70:   { A1: 136, A2: 136, B1: 171, B2: 149, D1: 151, D2: 188, E: 183, F: 246 },
    95:   { A1: 164, A2: 164, B1: 207, B2: 179, D1: 179, D2: 226, E: 220, F: 296 },
    120:  { A1: 188, A2: 188, B1: 239, B2: 206, D1: 203, D2: 257, E: 253, F: 347 },
    150:  { A1: 216, A2: 216, B1: 262, B2: 232, D1: 230, D2: 287, E: 290, F: 399 },
    185:  { A1: 245, A2: 245, B1: 296, B2: 262, D1: 258, D2: 324, E: 329, F: 456 },
    240:  { A1: 286, A2: 286, B1: 346, B2: 304, D1: 297, D2: 375, E: 386, F: 538 },
  },
};

/**
 * RIC N°04, Tabla 4.4 (continuación): cables a 90°C.
 * Aplica a THHN, RV, RV-K, RZ1, RZ1-K.
 */
export const TABLE_4_4_90C: AmpacityTable = {
  appliesTo: 'THHN, RV, RV-K, RZ1, RZ1-K',
  tempServicio: 90,
  table: {
    1.5:  { A1: 17, A2: 17, B1: 18, B2: 19, D1: 19, D2: 23, E: 19, F: 0 },
    2.5:  { A1: 23, A2: 22, B1: 24, B2: 24, D1: 24, D2: 30, E: 25, F: 0 },
    4:    { A1: 31, A2: 30, B1: 37, B2: 35, D1: 31, D2: 39, E: 33, F: 42 },
    6:    { A1: 40, A2: 38, B1: 48, B2: 44, D1: 39, D2: 49, E: 42, F: 55 },
    10:   { A1: 54, A2: 51, B1: 66, B2: 60, D1: 51, D2: 64, E: 57, F: 75 },
    16:   { A1: 73, A2: 68, B1: 88, B2: 80, D1: 67, D2: 84, E: 76, F: 100 },
    25:   { A1: 95, A2: 89, B1: 117, B2: 105, D1: 86, D2: 107, E: 99, F: 127 },
    35:   { A1: 117, A2: 109, B1: 144, B2: 128, D1: 103, D2: 129, E: 121, F: 158 },
    50:   { A1: 141, A2: 130, B1: 175, B2: 154, D1: 122, D2: 153, E: 145, F: 192 },
    70:   { A1: 179, A2: 164, B1: 222, B2: 194, D1: 151, D2: 188, E: 183, F: 246 },
    95:   { A1: 216, A2: 197, B1: 269, B2: 233, D1: 179, D2: 226, E: 220, F: 296 },
    120:  { A1: 249, A2: 227, B1: 312, B2: 268, D1: 203, D2: 257, E: 253, F: 347 },
    150:  { A1: 285, A2: 259, B1: 342, B2: 300, D1: 230, D2: 287, E: 290, F: 399 },
    185:  { A1: 324, A2: 295, B1: 384, B2: 340, D1: 258, D2: 324, E: 329, F: 456 },
    240:  { A1: 380, A2: 346, B1: 450, B2: 398, D1: 297, D2: 375, E: 386, F: 538 },
  },
};

/** Tipo de aislamiento (define la tabla a usar). */
export type InsulationType = 'pvc' | 'xlpe';

/**
 * RIC N°04, Tabla 4.6: Factor de corrección por cantidad de conductores en ducto.
 * Aplica a 4 o más conductores activos.
 */
export const GROUPING_FACTORS: Record<string, number> = {
  '1-3': 1.00,
  '4-6': 0.80,
  '7-24': 0.70,
  '25-42': 0.60,
  'sobre 42': 0.50,
};

/**
 * RIC N°04, Tabla 4.7: Factor de corrección por temperatura ambiente.
 * Para cables a 70°C y a 90°C, con distintos métodos de instalación.
 */
export const TEMPERATURE_FACTORS = {
  /** Cables 70°C en métodos A1/B1/E */
  '70_A1_B1_E': {
    10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.00,
    35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50,
  },
  /** Cables 90°C en métodos A1/A2/B1/B2/E */
  '90_A1_A2_B1_B2_E': {
    10: 1.15, 15: 1.12, 20: 1.08, 25: 1.04, 30: 1.00,
    35: 0.96, 40: 0.91, 45: 0.87, 50: 0.82, 55: 0.76, 60: 0.71,
  },
  /** Métodos subterráneos D1/D2 (temperatura del suelo) */
  'D1_D2': {
    10: 1.07, 15: 1.04, 20: 1.00, 25: 0.96, 30: 0.93,
    35: 0.89, 40: 0.85, 45: 0.80, 50: 0.76, 55: 0.71, 60: 0.65,
  },
} as const;

/**
 * RIC N°04, pto 6.2.4: La ampacidad corregida se calcula como:
 *
 *   I_c = I_t × f_n × f_t
 *
 * donde:
 *   - I_t: corriente de la tabla 4.4
 *   - f_n: factor de corrección por agrupamiento (tabla 4.6)
 *   - f_t: factor de corrección por temperatura (tabla 4.7)
 */

export type ConductorMaterial = 'cobre' | 'aluminio';

/**
 * Obtiene la ampacidad base para una combinación sección/método/aislamiento.
 * El RIC N°04 solo tabula COBRE; el aluminio se permite pero requiere factor
 * de corrección (no tabulado en RIC N°04 → debe consultarse al fabricante).
 *
 * @returns Corriente admisible en A. Retorna 0 si la combinación no aplica.
 */
export function getBaseAmpacity(
  section: number,
  method: InstallationMethod,
  insulation: InsulationType
): number {
  const table = insulation === 'pvc' ? TABLE_4_4_70C.table : TABLE_4_4_90C.table;
  const row = table[section];
  if (!row) return 0;
  const value = row[method];
  return value === 0 ? 0 : value;
}

/**
 * Obtiene el factor de corrección por temperatura ambiente según RIC N°04, Tabla 4.7.
 * Redondea la temperatura al múltiplo de 5 más cercano.
 *
 * @param insulation - Tipo de aislamiento del conductor.
 * @param method     - Método de instalación (define qué sub-tabla aplicar).
 * @param ambientC   - Temperatura ambiente en °C.
 *
 * @returns Factor multiplicativo (1.00 a 30°C).
 */
export function getTemperatureFactor(
  insulation: InsulationType,
  method: InstallationMethod,
  ambientC: number
): number {
  // Determinar qué sub-tabla usar
  let tableKey: keyof typeof TEMPERATURE_FACTORS;
  if (method === 'D1' || method === 'D2') {
    tableKey = 'D1_D2';
  } else if (insulation === 'pvc') {
    // 70°C en métodos A1/B1/E (los más comunes)
    if (method === 'A1' || method === 'B1' || method === 'E') {
      tableKey = '70_A1_B1_E';
    } else {
      // A2/B2 con PVC — usar tabla 90°C como conservadora (es la mejor aprox. del RIC)
      tableKey = '90_A1_A2_B1_B2_E';
    }
  } else {
    tableKey = '90_A1_A2_B1_B2_E';
  }
  const table = TEMPERATURE_FACTORS[tableKey];
  // Redondear a 5°C dentro del rango de la tabla (10-60°C)
  const rounded = Math.max(10, Math.min(60, Math.round(ambientC / 5) * 5));
  return (table as Record<number, number>)[rounded] ?? 1.0;
}

/**
 * Obtiene el factor de corrección por cantidad de conductores activos en ducto,
 * según RIC N°04, Tabla 4.6.
 *
 * @param circuitsCount - Número de conductores activos.
 * @returns Factor multiplicativo.
 */
export function getGroupingFactor(circuitsCount: number): number {
  if (circuitsCount <= 3) return 1.00;
  if (circuitsCount <= 6) return 0.80;
  if (circuitsCount <= 24) return 0.70;
  if (circuitsCount <= 42) return 0.60;
  return 0.50;
}
