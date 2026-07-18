/**
 * Contenido de la pantalla de Ayuda.
 * Separado del componente para que sea fácil de mantener y extender.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Info, Rocket, Calculator, FileText, FileCheck, Wifi, BookOpen,
  HelpCircle, Code, AlertTriangle,
} from 'lucide-react';

export type BlockType = 'paragraph' | 'list' | 'steps' | 'callout';

export interface HelpBlock {
  type: BlockType;
  text?: string;
  items?: string[];
  variant?: 'info' | 'success' | 'warning';
}

export interface HelpSection {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  content: HelpBlock[];
}

export interface QuickStartStep {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  route?: string;
}

export const APP_VERSION = '1.0.0';
export const APP_LAST_UPDATE = '2026-07-17';

/** Pasos para empezar a usar la app. */
export const QUICK_START: QuickStartStep[] = [
  {
    number: 1,
    title: 'Configura tu perfil',
    description: 'Ve a Configuración y completa tu nombre, RUT, N° SEC y tarifa por defecto. Estos datos aparecerán en tus cotizaciones.',
    icon: FileText,
  },
  {
    number: 2,
    title: 'Usa las calculadoras',
    description: 'En el Home o en Calculadoras, prueba caída de tensión, ampacidad o cortocircuito. Todos los resultados referencian el RIC vigente.',
    icon: Calculator,
  },
  {
    number: 3,
    title: 'Crea tu primera cotización',
    description: 'En Cotizador, elige una plantilla, ajusta items y totales. Guarda, descarga el PDF o envíala por WhatsApp al cliente.',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Emite una declaración TE1',
    description: 'Completa el formulario de la declaración de instalación según RIC N°18, firma digitalmente y descarga el PDF para presentar ante la SEC.',
    icon: FileCheck,
  },
];

/** Changelog de la versión actual. */
export const CHANGELOG: Array<{ version: string; date: string; changes: string[] }> = [
  {
    version: '1.0.0',
    date: '2026-07-17',
    changes: [
      'Calculadoras profesionales: caída de tensión, ampacidad, cortocircuito y selectividad',
      'Cotizador con plantillas, catálogo de items, IVA y PDF profesional',
      'Declaración TE1 según RIC N°18 y N°19 con firmas digitales',
      'Compatibilidad total con el RIC (N°01 a N°19) — referencia a la SEC',
      'Diseño responsive: optimizado para celular, tablet y notebook',
      'Modo oscuro / claro / sistema con persistencia',
      'Share por WhatsApp para cotización y TE1',
      'Firma digital con canvas (mouse y touch)',
      'PWA instalable con service worker (modo offline real)',
      'Logo del electricista en cotizaciones y TE1',
    ],
  },
];

/** Secciones del help. */
export const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'intro',
    title: '¿Qué es ElectriChile Pro?',
    icon: Info,
    description: 'Una PWA para electricistas chilenos con calculadoras técnicas, cotizador y declaración TE1 — todo según el RIC vigente.',
    content: [
      {
        type: 'paragraph',
        text: 'ElectriChile Pro es una herramienta pensada para el trabajo en terreno del instalador electricista en Chile. Reúne en un solo lugar las calculaciones que haces a diario, los documentos que entregas a tus clientes y la declaración oficial que presentas ante la SEC.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Todos los cálculos y referencias normativas están basados en el Reglamento de Instalaciones de Consumo (RIC, Decreto N°8/2019, Resolución Exenta SEC N°33.877/2020), normativa eléctrica vigente en Chile.',
      },
      {
        type: 'paragraph',
        text: 'La app funciona 100% offline: todos los datos se guardan en tu dispositivo (IndexedDB), no necesita conexión a internet para operar. Solo la compartes por WhatsApp o generas PDFs cuando quieras.',
      },
    ],
  },
  {
    id: 'first-steps',
    title: 'Primeros pasos',
    icon: Rocket,
    description: 'Cuatro pasos para tener todo listo y empezar a usar la app en terreno.',
    content: [
      {
        type: 'paragraph',
        text: 'Recomendamos seguir este orden la primera vez que uses la app. Después, todo queda guardado y no necesitas repetirlo.',
      },
      {
        type: 'steps',
        items: [
          'Ve a Configuración y completa tu perfil: nombre, RUT, N° de registro SEC, teléfono. Estos datos aparecerán automáticamente en tus cotizaciones y TE1.',
          'Sube tu logo (opcional) — aparecerá en el header de los PDFs que generes.',
          'Ajusta tu tarifa por defecto y el factor de mano de obra en Configuración.',
          'Elige entre tema oscuro, claro o del sistema. La app recuerda tu preferencia.',
        ],
      },
    ],
  },
  {
    id: 'calculators',
    title: 'Calculadoras técnicas',
    icon: Calculator,
    description: 'Cuatro calculadoras profesionales con referencias al RIC.',
    content: [
      {
        type: 'paragraph',
        text: 'Las calculadoras están diseñadas para responder las preguntas técnicas más comunes en una obra: qué conductor usar, qué protección, si aguanta un cortocircuito.',
      },
      {
        type: 'list',
        items: [
          'Caída de tensión: calcula el % de caída y verifica que cumpla el RIC N°03 (3% en alimentador, 5% total). Sugiere sección si no cumple.',
          'Ampacidad: determina la sección mínima del conductor según corriente, método de instalación (A1-F según IEC 60364-5-523), material, aislamiento, temperatura y agrupamiento.',
          'Cortocircuito: calcula la Icc máxima y mínima en bornes y al final del circuito (IEC 60909). Te avisa si necesitas un poder de corte mayor a 10 kA.',
          'Selectividad: recomienda el interruptor termomagnético (In, curva B/C/D, poder de corte) según el tipo de carga y la Icc prevista.',
        ],
      },
      {
        type: 'callout',
        variant: 'success',
        text: 'Cada calculadora muestra en la parte inferior la referencia exacta al artículo del RIC que aplica, con cita textual del pliego.',
      },
    ],
  },
  {
    id: 'quotes',
    title: 'Cotizaciones',
    icon: FileText,
    description: 'Crea cotizaciones profesionales en minutos, con IVA, mano de obra y PDF listo para enviar.',
    content: [
      {
        type: 'paragraph',
        text: 'El cotizador tiene 6 plantillas preconfiguradas según el tipo de instalación (residencial básica, ampliación, local comercial, industrial, mantención, personalizada) con items típicos y horas estimadas.',
      },
      {
        type: 'list',
        items: [
          'Agrega items desde el catálogo (cables, protecciones, canalización, tableros) o crea items personalizados.',
          'Ajusta cantidad, precio unitario y descuento por item. Los totales se recalculan en tiempo real.',
          'Configura la mano de obra: horas, tarifa por hora, factor de dificultad (1.0 / 1.25 / 1.5 / 2.0).',
          'Aplica un descuento global adicional sobre el subtotal.',
          'Cambia el estado de la cotización: Borrador → Enviada → Aceptada / Rechazada → Facturada → Cobrada.',
          'Descarga el PDF profesional o envíalo directo al cliente por WhatsApp con un mensaje prearmado.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'La firma del cliente es opcional pero muy recomendada. El PDF de la cotización incluye la firma al final, en una caja de "Aceptación del cliente".',
      },
    ],
  },
  {
    id: 'te1',
    title: 'Declaración TE1 (RIC N°18, N°19)',
    icon: FileCheck,
    description: 'Genera la declaración oficial de instalación eléctrica para presentar ante la SEC.',
    content: [
      {
        type: 'paragraph',
        text: 'La Declaración de Instalación Eléctrica (TE1) es el documento que el instalador electricista presenta a la empresa distribuidora para que energice la instalación. Esta app genera un PDF con todos los campos esenciales según los pliegos RIC N°18 y N°19.',
      },
      {
        type: 'list',
        items: [
          'Datos del instalador (auto-rellenados desde tu perfil)',
          'Datos del cliente y ubicación de la instalación',
          'Características: tipo (nueva, ampliación, modificación, reparación), destino, superficie',
          'Empalme: monofásico/trifásico, capacidad en amperes',
          'Características eléctricas: potencia instalada, número de circuitos por tipo',
          'Conductores principales: sección, material, tipo (N2XOH, THW/90, etc.)',
          'Protección general: In, curva, poder de corte',
          'Diferencial (30/300/500 mA) y puesta a tierra',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Esta es una versión simplificada que cubre los campos más importantes. Para instalaciones industriales complejas, consulta directamente el RIC N°18 completo.',
      },
    ],
  },
  {
    id: 'offline',
    title: 'Modo offline y PWA',
    icon: Wifi,
    description: 'La app funciona sin internet y se puede instalar en tu dispositivo.',
    content: [
      {
        type: 'paragraph',
        text: 'ElectriChile Pro es una PWA (Progressive Web App). Eso significa que se puede instalar como una app nativa en tu celular o notebook, y funciona completamente offline.',
      },
      {
        type: 'steps',
        items: [
          'En Chrome / Edge (desktop o Android): aparece un ícono de "Instalar app" en la barra de direcciones. Haz click y se agrega a tu sistema.',
          'En iOS Safari: toca el botón de compartir y selecciona "Agregar a pantalla de inicio".',
          'Una vez instalada, se abre sin barra de navegador y funciona 100% offline.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Cuando hay una nueva versión disponible, aparece un banner azul arriba. Toca "Actualizar" para obtener la última versión con todas las mejoras.',
      },
    ],
  },
  {
    id: 'ric',
    title: 'Normativa aplicada (RIC)',
    icon: BookOpen,
    description: 'Todas las calculadoras y referencias usan el RIC vigente en Chile.',
    content: [
      {
        type: 'paragraph',
        text: 'El RIC (Reglamento de Instalaciones de Consumo de Energía Eléctrica) es la normativa obligatoria en Chile desde 2020, dictada por la SEC. Reemplazó a la antigua NCh Elec 4/2003.',
      },
      {
        type: 'list',
        items: [
          'RIC N°01 — Empalmes',
          'RIC N°02 — Tableros eléctricos',
          'RIC N°03 — Alimentadores y demanda (caída de tensión)',
          'RIC N°04 — Conductores y canalizaciones (ampacidad)',
          'RIC N°05 — Medidas de protección contra tensiones peligrosas',
          'RIC N°06 — Puesta a tierra',
          'RIC N°07 — Instalaciones de equipos (motores, etc.)',
          'RIC N°09 — Sistemas de autogeneración (solar)',
          'RIC N°15 — Infraestructura para recarga de vehículos eléctricos',
          'RIC N°18 — Presentación de proyectos',
          'RIC N°19 — Puesta en servicio (TE1)',
        ],
      },
      {
        type: 'callout',
        variant: 'success',
        text: 'En la pantalla "Normativa RIC" puedes ver todos los artículos referenciados por las calculadoras, con cita textual y resumen.',
      },
    ],
  },
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    icon: HelpCircle,
    description: 'Respuestas a las dudas más comunes.',
    content: [
      {
        type: 'list',
        items: [
          '¿Mis datos están seguros? Sí. Todo se guarda localmente en tu dispositivo (IndexedDB). No enviamos nada a ningún servidor.',
          '¿Funciona en iPhone? Sí. Agrégala a la pantalla de inicio desde Safari y se comporta como una app nativa.',
          '¿Puedo compartir cotizaciones entre dispositivos? No aún. La sincronización en la nube está en el roadmap.',
          '¿Los precios del catálogo son exactos? No, son referenciales. Cada cotizador puede ajustar los precios según su proveedor.',
          '¿Puedo usar la app en varias personas de un equipo? Sí, cada uno instala la app en su dispositivo y maneja sus propias cotizaciones. La sincronización entre usuarios está en roadmap.',
          '¿La firma digital tiene validez legal? Para cotizaciones privadas sí, como cualquier documento firmado. Para TE1 ante la SEC, la firma ológrafa sigue siendo obligatoria — la app te entrega el PDF listo para imprimir y firmar.',
          '¿Cómo reporto un error o pido una función? Mira la sección "Información técnica" abajo.',
        ],
      },
    ],
  },
  {
    id: 'tech',
    title: 'Información técnica',
    icon: Code,
    description: 'Detalles de la app: versión, stack, contacto.',
    content: [
      {
        type: 'list',
        items: [
          `Versión: ${APP_VERSION}`,
          `Última actualización: ${APP_LAST_UPDATE}`,
          'Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Dexie (IndexedDB), jsPDF',
          'Almacenamiento: local (IndexedDB). Datos no salen del dispositivo.',
          'Permisos: ninguno. La app no accede a tu ubicación, contactos ni archivos.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: '¿Encontraste un bug o tienes una sugerencia? Escríbeme a contacto@electrichile.cl o abre un issue en github.com/miguel/electrichile-pro',
      },
    ],
  },
];

// ─── Búsqueda ─────────────────────────────────────────────────────────────

/** Busca en el contenido del help. Devuelve las secciones que tienen coincidencias. */
export function searchHelp(query: string): HelpSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return HELP_SECTIONS;
  return HELP_SECTIONS.filter((s) => {
    if (s.title.toLowerCase().includes(q)) return true;
    if (s.description.toLowerCase().includes(q)) return true;
    return s.content.some((b) => {
      if (b.text?.toLowerCase().includes(q)) return true;
      if (b.items?.some((it) => it.toLowerCase().includes(q))) return true;
      return false;
    });
  });
}
