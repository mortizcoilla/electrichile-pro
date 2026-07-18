export interface CableType {
  id: string;
  name: string;
  material: 'cobre' | 'aluminio';
  sections: number[];
  maxTemp: number;
  resistivity: number;
  description: string;
}

export const CABLES: CableType[] = [
  {
    id: 'thw',
    name: 'THW',
    material: 'cobre',
    sections: [1.5, 2.5, 4, 6, 10, 16, 25, 35],
    maxTemp: 75,
    resistivity: 0.0172,
    description: 'Cable unipolar para instalaciones fijas en ductos'
  },
  {
    id: 'n2xoh',
    name: 'N2XOH',
    material: 'cobre',
    sections: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240],
    maxTemp: 90,
    resistivity: 0.0172,
    description: 'Cable unipolar XLPE libre de halógenos; en Chile se instala en juegos de 3 conductores (fase, neutro y tierra)'
  },
  {
    id: 'nya',
    name: 'NYA',
    material: 'cobre',
    sections: [1.5, 2.5, 4, 6, 10, 16, 25, 35],
    maxTemp: 70,
    resistivity: 0.0172,
    description: 'Cable unipolar PVC para instalaciones interiores'
  },
  {
    id: 'nyy',
    name: 'NYY',
    material: 'cobre',
    sections: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240],
    maxTemp: 70,
    resistivity: 0.0172,
    description: 'Cable multipolar PVC para instalaciones exteriores'
  }
];

export const CONDUCTOR_SECTIONS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

export const RESISTIVITY = {
  cobre: 0.0172,
  aluminio: 0.0282,
} as const;
