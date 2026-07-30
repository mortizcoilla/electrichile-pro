/**
 * @file Código de colores de conductores eléctricos según RIC N°04.
 *
 * @description
 * Colores de aislación de los conductores de una canalización eléctrica,
 * según el Reglamento de Instalaciones de Consumo (RIC N°04, pto 5.32).
 *
 * El RIC es el conjunto de 19 pliegos técnicos normativos dictados por la SEC
 * en virtud del Reglamento de Seguridad de las Instalaciones de Consumo de
 * Energía Eléctrica (D.S. N° 8/2019, Ministerio de Energía), mediante la
 * Resolución Exenta N° 33.877 del 30/12/2020.
 *
 * Cita literal del RIC N°04, pto 5.32:
 *
 *   "Los conductores de una canalización eléctrica se identificarán según
 *    el siguiente código de colores:
 *
 *    Conductor de la fase 1 — azul
 *    Conductor de la fase 2 — negro
 *    Conductor de la fase 3 — rojo
 *    Conductor de neutro y tierra de servicio — blanco
 *    Conductor de protección — verde o verde/amarillo"
 *
 * Restricciones adicionales del RIC N°04:
 *  - pto 5.30: "No se podrá utilizar los colores rojo, amarillo o azul en
 *    las canalizaciones eléctricas" (se refiere a la canalización/conduit,
 *    no a la aislación de los conductores).
 *  - pto 5.33 (continuación): "las cubiertas o aislaciones de color verde o
 *    verde/amarillo solo se emplearán para identificar conductores de
 *    protección (puesta a tierra). Por tal razón, no se permite el uso de
 *    alambres o cables multiconductores con cubierta exterior de color
 *    verde o verde/amarillo para otros fines, salvo que su fin específico
 *    sea la utilización como conductor de tierra de protección."
 *
 * @see https://www.sec.cl - Superintendencia de Electricidad y Combustibles
 */

export interface CableColor {
  id: string;
  name: string;
  color: string;
  stripe?: string;
  usage: string;
  /** Referencia exacta al artículo del RIC. */
  standard: string;
  warnings?: string[];
}

/**
 * Código de colores oficial de los conductores según RIC N°04, pto 5.32.
 *
 * IMPORTANTE:
 *  - Las FASES son **azul, negro y rojo** (no blanco).
 *  - El NEUTRO y la TIERRA DE SERVICIO son **blanco**.
 *  - El conductor de PROTECCIÓN (PE, tierra de protección de las masas) es
 *    **verde o verde/amarillo** (bicolor).
 *
 * Convenciones trifásicas (L1/L2/L3):
 *  - L1: azul
 *  - L2: negro
 *  - L3: rojo
 *
 * En un sistema monofásico, la fase única se identifica normalmente con
 * el color **azul** (L1) o, por convención internacional, con **negro** o
 * **marrón**. Chile adopta la convención RIC (azul como L1).
 */
export const CABLE_COLORS: CableColor[] = [
  {
    id: 'phase-l1',
    name: 'Fase 1 (L1) — Azul',
    color: '#2563EB',
    usage: 'Conductor de la fase 1 (L1) en sistemas trifásicos. También se usa como fase única en sistemas monofásicos según convención chilena.',
    standard: 'RIC N°04, pto 5.32',
  },
  {
    id: 'phase-l2',
    name: 'Fase 2 (L2) — Negro',
    color: '#18181B',
    usage: 'Conductor de la fase 2 (L2) en sistemas trifásicos.',
    standard: 'RIC N°04, pto 5.32',
  },
  {
    id: 'phase-l3',
    name: 'Fase 3 (L3) — Rojo',
    color: '#DC2626',
    usage: 'Conductor de la fase 3 (L3) en sistemas trifásicos.',
    standard: 'RIC N°04, pto 5.32',
    warnings: ['No usar como neutro', 'No usar como conductor de protección'],
  },
  {
    id: 'neutral',
    name: 'Neutro y tierra de servicio — Blanco',
    color: '#F8FAFC',
    usage: 'Conductor de neutro y tierra de servicio (N). Es el común de retorno en sistemas monofásicos y el neutro en trifásicos.',
    standard: 'RIC N°04, pto 5.32',
    warnings: [
      'En el RIC el neutro y la tierra de servicio son el mismo conductor (color blanco).',
      'El conductor de protección PE es otro distinto (verde/amarillo).',
    ],
  },
  {
    id: 'protection',
    name: 'Protección (PE) — Verde/Amarillo',
    color: '#16A34A',
    stripe: '#EAB308',
    usage: 'Conductor de protección (PE). Conecta las masas metálicas de los aparatos a la puesta a tierra de la instalación.',
    standard: 'RIC N°04, pto 5.32',
    warnings: [
      'Identificación bicolor verde/amarillo obligatoria.',
      'No debe usarse como neutro ni como conductor activo.',
      'No se permite cubierta exterior verde/amarillo en cables multipolares que no sean de protección.',
    ],
  },
  {
    id: 'control',
    name: 'Control — Naranja',
    color: '#F97316',
    usage: 'Circuitos de control, señalización, pilotos. No es conductor de potencia activa. Es una convención práctica, no exigida por el RIC N°04.',
    standard: 'Convención práctica (no exigido por RIC N°04)',
  },
];

/**
 * Tabla de migración desde la norma anterior (NCh Elec 4/2003, ya no vigente)
 * al RIC actual. Útil para electricistas que trabajan en instalaciones
 * pre-2020 y necesitan identificar conductores existentes.
 */
export const LEGACY_COLORS = [
  {
    old: 'Blanco',
    modern: 'Blanco',
    usage: 'Neutro / Tierra de servicio',
    note: 'Coincide con el RIC (mismo color).',
  },
  {
    old: 'Verde',
    modern: 'Verde/Amarillo',
    usage: 'Tierra de protección (PE)',
    note: 'La NCh 4/2003 usaba verde liso para tierra. El RIC exige bicolor verde/amarillo para PE (pto 5.33).',
  },
  {
    old: 'Rojo',
    modern: 'Rojo / Negro / Azul',
    usage: 'Fase (cualquiera de las 3)',
    note: 'En NCh 4/2003 el rojo se usaba como fase indistinta. En RIC N°04, las fases son L1=azul, L2=negro, L3=rojo.',
  },
  {
    old: 'Celeste / Azul claro',
    modern: 'Azul (L1)',
    usage: 'Fase 1 en RIC; en NCh 4/2003 no estaba estandarizado como fase',
    note: 'Verificar con multímetro antes de intervenir.',
  },
];
