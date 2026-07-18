export interface CableColor {
  id: string;
  name: string;
  color: string;
  stripe?: string;
  usage: string;
  standard: string;
  warnings?: string[];
}

export const CABLE_COLORS: CableColor[] = [
  {
    id: 'phase-red',
    name: 'Fase - Rojo',
    color: '#DC2626',
    usage: 'Conductores de fase en instalaciones nuevas. Circuitos monofásicos y trifásicos.',
    standard: 'RIC (D.S. N° 8/2019)',
    warnings: ['No usar como neutro ni tierra']
  },
  {
    id: 'phase-black',
    name: 'Fase - Negro',
    color: '#18181B',
    usage: 'Conductores de fase alternativa. Segunda fase en sistemas bifásicos.',
    standard: 'RIC (D.S. N° 8/2019)'
  },
  {
    id: 'phase-white',
    name: 'Fase - Blanco',
    color: '#F8FAFC',
    usage: 'Conductores de fase en instalaciones específicas. Tercera fase en trifásicos.',
    standard: 'RIC (D.S. N° 8/2019)',
    warnings: ['Puede confundirse con neutro en instalaciones antiguas']
  },
  {
    id: 'neutral',
    name: 'Neutro - Celeste',
    color: '#38BDF8',
    usage: 'Conductor neutro en todas las instalaciones. No debe interrumpirse.',
    standard: 'RIC (D.S. N° 8/2019)',
    warnings: ['Nunca usar como fase', 'Debe estar conectado a tierra en origen']
  },
  {
    id: 'ground',
    name: 'Tierra - Verde/Amarillo',
    color: '#16A34A',
    stripe: '#EAB308',
    usage: 'Conductor de protección (PE). Conexión a tierra de masas metálicas.',
    standard: 'RIC (D.S. N° 8/2019)',
    warnings: ['Identificación bicolor verde/amarillo obligatoria', 'Obligatorio en todas las instalaciones', 'No debe usarse como neutro']
  },
  {
    id: 'control',
    name: 'Control - Naranja',
    color: '#F97316',
    usage: 'Circuitos de control, señalización, pilotos. No es potencia.',
    standard: 'RIC (D.S. N° 8/2019)'
  }
];

export const LEGACY_COLORS = [
  { old: 'Blanco', modern: 'Celeste', usage: 'Neutro', warning: 'Instalaciones anteriores al RIC (pre-2020)' },
  { old: 'Verde', modern: 'Verde-Amarillo', usage: 'Tierra', warning: 'Peligro: puede confundirse con tierra moderna' },
  { old: 'Rojo', modern: 'Rojo/Negro/Blanco', usage: 'Fase', warning: 'Verificar con multímetro' }
];
