import type { Hospital } from '@/types';

export interface Region {
  id: string;
  name: string;
  radiation: number;
  communes: string[];
}

export const REGIONS: Region[] = [
  { id: 'XV', name: 'Arica y Parinacota', radiation: 7.5, communes: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { id: 'I', name: 'Tarapacá', radiation: 7.0, communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'] },
  { id: 'II', name: 'Antofagasta', radiation: 7.2, communes: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'] },
  { id: 'III', name: 'Atacama', radiation: 7.8, communes: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Freirina', 'Huasco', 'Alto del Carmen'] },
  { id: 'IV', name: 'Coquimbo', radiation: 6.5, communes: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'] },
  { id: 'V', name: 'Valparaíso', radiation: 5.8, communes: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quintero', 'Puchuncaví', 'Casablanca', 'San Antonio', 'Cartagena', 'El Tabo', 'El Quisco', 'Algarrobo', 'Isla de Pascua', 'Juan Fernández', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué', 'Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Felipe', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'Putaendo', 'Santa María', 'Panquehue', 'Llaillay', 'Catemu', 'Santo Domingo'] },
  { id: 'RM', name: 'Metropolitana', radiation: 5.5, communes: ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'] },
  { id: 'VI', name: "O'Higgins", radiation: 5.2, communes: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'] },
  { id: 'VII', name: 'Maule', radiation: 5.0, communes: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'] },
  { id: 'XVI', name: 'Ñuble', radiation: 4.8, communes: ['Bulnes', 'Chillán', 'Chillán Viejo', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'] },
  { id: 'VIII', name: 'Biobío', radiation: 4.6, communes: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualpén', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'] },
  { id: 'IX', name: 'La Araucanía', radiation: 4.3, communes: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'] },
  { id: 'X', name: 'Los Lagos', radiation: 3.8, communes: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'] },
  { id: 'XI', name: 'Aysén', radiation: 3.5, communes: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', "O'Higgins", 'Tortel', 'Chile Chico', 'Río Ibáñez'] },
  { id: 'XII', name: 'Magallanes', radiation: 2.8, communes: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'] }
];

export const HOSPITALS: Omit<Hospital, 'phone'>[] = [
  { id: 'h1', name: 'Hospital Clínico U. de Chile', address: 'Av. Santos Ossa 1531, Santiago', region: 'RM', lat: -33.4260, lng: -70.6420 },
  { id: 'h2', name: 'Hospital del Salvador', address: 'Av. Salvador 364, Providencia', region: 'RM', lat: -33.4330, lng: -70.6160 },
  { id: 'h3', name: 'Hospital San Juan de Dios', address: 'Av. Santa Rosa 1234, Santiago', region: 'RM', lat: -33.4480, lng: -70.6530 },
  { id: 'h4', name: 'Hospital Sótero del Río', address: 'Av. Concha y Toro s/n, Puente Alto', region: 'RM', lat: -33.6130, lng: -70.5770 },
  { id: 'h5', name: 'Hospital Regional de Valparaíso', address: 'Av. España 1220, Valparaíso', region: 'V', lat: -33.0470, lng: -71.6130 },
  { id: 'h6', name: 'Hospital Regional de Concepción', address: 'Av. San Martín 1436, Concepción', region: 'VIII', lat: -36.8270, lng: -73.0500 },
  { id: 'h7', name: 'Hospital Regional de Temuco', address: 'Av. Alemania 0520, Temuco', region: 'IX', lat: -38.7360, lng: -72.5990 },
  { id: 'h8', name: 'Hospital Regional de Antofagasta', address: 'Av. Pedro Aguirre Cerda 1812', region: 'II', lat: -23.6510, lng: -70.3980 },
];
