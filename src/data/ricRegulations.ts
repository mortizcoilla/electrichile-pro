/**
 * Reglamento de Instalaciones de Consumo de Energía Eléctrica (RIC)
 * Normativa vigente en Chile, dictada por la SEC.
 *
 * Sólo se incluyen los artículos referenciados por las calculadoras de la app.
 * Fuente oficial: Resolución Exenta N° 33.877, 30/12/2020 — SEC.
 */

export type RicId =
  | 'ric-01' | 'ric-02' | 'ric-03' | 'ric-04' | 'ric-05' | 'ric-06'
  | 'ric-07' | 'ric-08' | 'ric-09' | 'ric-10' | 'ric-11' | 'ric-12'
  | 'ric-13' | 'ric-14' | 'ric-15' | 'ric-16' | 'ric-17' | 'ric-18'
  | 'ric-19';

export interface RicArticle {
  /** Identificador estable, ej: "ric-03-5-1-3" */
  id: string;
  /** Pliego RIC, ej: 3 */
  ric: number;
  /** Numeral del artículo, ej: "5.1.3" */
  article: string;
  /** Título corto legible */
  title: string;
  /** Resumen claro para mostrar en la UI */
  summary: string;
  /** Cita textual del pliego (cuando aplica) */
  quote?: string;
  /** Calculadoras de la app que referencian este artículo */
  calculatorIds: string[];
}

export interface RicPliego {
  id: RicId;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  articles: RicArticle[];
}

export const RIC_PLIEGOS: RicPliego[] = [
  {
    id: 'ric-03',
    number: 3,
    title: 'Alimentadores y demanda de una instalación',
    shortTitle: 'Alimentadores',
    summary: 'Requisitos de los alimentadores, subalimentadores y cómo se calcula la demanda de la instalación.',
    articles: [
      {
        id: 'ric-03-5-1-2',
        ric: 3,
        article: '5.1.2',
        title: 'Sección mínima de alimentadores y subalimentadores',
        summary: 'Alimentadores mínimo 4 mm² y subalimentadores mínimo 2,5 mm². La sección debe ser suficiente para la carga.',
        quote: 'La sección de los conductores de los alimentadores y subalimentadores será, por lo menos, la suficiente para servir las cargas… En todo caso la sección mínima permisible será de 4 mm² para alimentadores y de 2,5 mm² para subalimentadores.',
        calculatorIds: ['voltage-drop'],
      },
      {
        id: 'ric-03-5-1-3',
        ric: 3,
        article: '5.1.3',
        title: 'Caída de tensión en alimentadores y total',
        summary: 'Caída de tensión máxima del 3% en el alimentador y del 5% en el punto más desfavorable de la instalación (alimentador + subalimentador + circuito final).',
        quote: 'La sección de los alimentadores, subalimentadores y conductores será tal que la caída de tensión provocada por la corriente máxima que circula por ellos… no exceda del 3% de la tensión nominal de la alimentación y la caída de tensión total en el punto de la instalación más desfavorable no exceda del 5% de dicha tensión.',
        calculatorIds: ['voltage-drop'],
      },
      {
        id: 'ric-03-5-1-4',
        ric: 3,
        article: '5.1.4',
        title: 'Canalización vertical en edificios',
        summary: 'En edificios, los alimentadores se canalizan por shaft verticales de uso exclusivo con resistencia al fuego RF120.',
        calculatorIds: [],
      },
      {
        id: 'ric-03-5-2-5',
        ric: 3,
        article: '5.2.5',
        title: 'Protección individual de cada alimentador',
        summary: 'Cada alimentador o subalimentador requiere un dispositivo individual de protección, omnipolar hasta 630 A.',
        calculatorIds: ['protections'],
      },
      {
        id: 'ric-03-6-3',
        ric: 3,
        article: '6.3',
        title: 'Factores de demanda para alumbrado',
        summary: 'Tabla con factores de demanda según tipo de consumidor: casa habitación, hospitales, hoteles, bodegas, oficinas, locales comerciales.',
        quote: 'Tabla Nº3.1: Factores de demanda para cálculo de alimentadores de alumbrado.',
        calculatorIds: ['protections'],
      },
    ],
  },
  {
    id: 'ric-04',
    number: 4,
    title: 'Conductores, materiales y sistemas de canalización',
    shortTitle: 'Conductores',
    summary: 'Requisitos de conductores, materiales aislantes, sistemas de canalización, uniones y secciones mínimas.',
    articles: [
      {
        id: 'ric-04-5-4',
        ric: 4,
        article: '5.4',
        title: 'Secciones mínimas de conductores',
        summary: 'Mínimos: circuitos de iluminación 1,5 mm² · enchufes y mixtos 2,5 mm² · subalimentadores 2,5 mm² · alimentadores 4 mm².',
        quote: 'La sección mínima de los conductores a utilizar serán las secciones milimétricas que se indican…',
        calculatorIds: ['voltage-drop', 'protections'],
      },
      {
        id: 'ric-04-5-5',
        ric: 4,
        article: '5.5',
        title: 'Cables en lugares de reunión de personas',
        summary: 'En lugares de reunión, los cables deben ser: retardantes a la llama, no propagadores de incendio, baja emisión de humos, libres de halógenos y baja toxicidad.',
        calculatorIds: [],
      },
    ],
  },
  {
    id: 'ric-05',
    number: 5,
    title: 'Medidas de protección contra tensiones peligrosas',
    shortTitle: 'Protecciones',
    summary: 'Protecciones contra contactos directos e indirectos, differentials, puesta a tierra de protección.',
    articles: [
      {
        id: 'ric-05-6-1',
        ric: 5,
        article: '6.1',
        title: 'Protección contra contactos directos e indirectos',
        summary: 'Toda instalación debe protegerse mediante aislamiento, barreras, puesta a tierra y dispositivos diferenciales de alta sensibilidad (30 mA para enchufes).',
        calculatorIds: ['protections'],
      },
      {
        id: 'ric-05-6-3',
        ric: 5,
        article: '6.3',
        title: 'Poder de corte de las protecciones',
        summary: 'El poder de corte del dispositivo de protección debe ser igual o superior a la corriente de cortocircuito máxima prevista en el punto de instalación.',
        quote: 'El poder de corte del dispositivo de protección no deberá ser inferior a la corriente de cortocircuito máxima prevista en el punto de la instalación.',
        calculatorIds: ['short-circuit', 'selectivity'],
      },
    ],
  },
  {
    id: 'ric-07',
    number: 7,
    title: 'Instalaciones de equipos',
    shortTitle: 'Equipos',
    summary: 'Dimensionamiento de alimentadores de fuerza y climatización, factor de potencia, motores.',
    articles: [
      {
        id: 'ric-07-3-2',
        ric: 7,
        article: '3.2',
        title: 'Corrientes nominales de motores',
        summary: 'Tablas de corrientes nominales para motores monofásicos y trifásicos según potencia y tensión.',
        calculatorIds: ['protections'],
      },
    ],
  },
  {
    id: 'ric-09',
    number: 9,
    title: 'Sistemas de autogeneración',
    shortTitle: 'Autogeneración',
    summary: 'Requisitos para sistemas fotovoltaicos, inversores, protecciones de interfaz y conexión a red.',
    articles: [
      {
        id: 'ric-09-4-1',
        ric: 9,
        article: '4.1',
        title: 'Dimensionamiento básico de un sistema fotovoltaico',
        summary: 'Consideraciones de HSP por zona, orientación, inclinación, factor de rendimiento (PR 60-75%) y superficie disponible.',
        calculatorIds: ['solar'],
      },
    ],
  },
];

/** Busca un artículo por su id estable. */
export function findRicArticle(id: string): RicArticle | undefined {
  for (const pliego of RIC_PLIEGOS) {
    const a = pliego.articles.find((x) => x.id === id);
    if (a) return a;
  }
  return undefined;
}

/** Devuelve los artículos que aplican a una calculadora específica. */
export function getArticlesForCalculator(calculatorId: string): RicArticle[] {
  const out: RicArticle[] = [];
  for (const pliego of RIC_PLIEGOS) {
    for (const article of pliego.articles) {
      if (article.calculatorIds.includes(calculatorId)) out.push(article);
    }
  }
  return out;
}

/** Devuelve un pliego por número. */
export function getPliego(num: number): RicPliego | undefined {
  return RIC_PLIEGOS.find((p) => p.number === num);
}
