# Arquitectura del proyecto

> Guía técnica sobre la estructura, patrones y decisiones de diseño de ElectriChile Pro. Orientada a contribuidores y mantenedores.

---

## 🏛️ Visión general

ElectriChile Pro es una **PWA client-side** construida con Next.js 15. Toda la lógica corre en el navegador — no hay backend, ni API routes, ni base de datos remota. El estado se persiste localmente con IndexedDB (Dexie) y localStorage (Zustand).

```
┌────────────────────────────────────────────────────────┐
│                     Browser (client)                   │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │ Next.js  │  │ Zustand  │  │ Dexie (IndexedDB)    │ │
│  │ App      │◄─┤ stores   │◄─┤ - installations      │ │
│  │ Router   │  │ (persist │  │ - quotes             │ │
│  │ + lazy   │  │  in LS)  │  │ - te1Declarations    │ │
│  │ screens  │  └──────────┘  │ - history            │ │
│  └────┬─────┘                │ - profile            │ │
│       │                      └──────────────────────┘ │
│       │                                                │
│  ┌────▼─────────────────────────────────────────────┐  │
│  │ Pure business logic (utils/)                     │  │
│  │ - voltageDrop, ampacity, shortCircuit,           │  │
│  │   selectivity, quoteCalculator, shareUtils       │  │
│  │ - pdfQuoteGenerator, te1PdfGenerator             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Service Worker (public/sw.js)                    │ │
│  │ - Cache-first para assets                        │ │
│  │ - Network-first para HTML                        │ │
│  │ - App shell pre-cacheado                         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Static export (next.config: output: 'export')   │ │
│  │ → dist/ → Vercel / cualquier hosting estático    │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Estructura de carpetas

```
src/
├── app/                      Next.js App Router (entry points)
│   ├── layout.tsx            Root layout + script inline de theme (no flash)
│   ├── page.tsx              Router principal: maneja activeTab + subScreen
│   └── globals.css           Design tokens + clases utilitarias
│
├── components/
│   ├── layout/               Shell de la app
│   │   ├── AppShell.tsx      Contenedor principal (responsive: mobile + sidebar)
│   │   ├── Header.tsx        Header mobile
│   │   ├── Sidebar.tsx       Nav lateral (md+)
│   │   ├── BottomNav.tsx     Nav inferior (mobile only)
│   │   ├── OfflineBanner.tsx Banner cuando no hay conexión
│   │   └── UpdateBanner.tsx  Banner cuando hay un SW nuevo
│   │
│   ├── shared/               Componentes reutilizables
│   │   ├── CalculatorCard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── RegulationRef.tsx Muestra referencias RIC inline
│   │   ├── ResultDisplay.tsx
│   │   ├── SignaturePad.tsx  Canvas para firma digital
│   │   └── UnitInput.tsx
│   │
│   └── ui/                   Primitivos (Button, Card, Input, Label, etc.)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       └── utils.ts          cn() helper (clsx + tailwind-merge)
│
├── screens/                  Pantallas (todas lazy-loaded)
│   ├── HomeScreen.tsx
│   ├── CotizadorScreen.tsx
│   ├── QuoteListScreen.tsx
│   ├── TE1Screen.tsx
│   ├── HelpScreen.tsx
│   ├── NormativaScreen.tsx
│   ├── AmpacityScreen.tsx
│   ├── ShortCircuitScreen.tsx
│   ├── SelectivityScreen.tsx
│   ├── CalculatorDropScreen.tsx
│   ├── ConverterScreen.tsx
│   ├── ColorCodeScreen.tsx
│   ├── ProtectionCalcScreen.tsx
│   ├── EmergencyScreen.tsx
│   ├── InstallationFormScreen.tsx
│   ├── InstallationListScreen.tsx
│   ├── MaterialsScreen.tsx
│   └── SettingsScreen.tsx
│
├── data/                     Datos estáticos (referencias normativas, catálogos)
│   ├── ricRegulations.ts     Pliegos RIC N°01-N°19 con artículos
│   ├── ampacityTables.ts     Tablas IEC 60364-5-523 + factores de corrección
│   ├── cables.ts             Tipos de cable (THW, N2XOH, NYA, NYY)
│   ├── colorsStandard.ts     Código de colores de cables en Chile
│   ├── materials.ts          Catálogo de materiales
│   ├── quoteTemplates.ts     Plantillas + catálogo de cotización
│   ├── regions.ts            Regiones y comunas + radiación solar
│   └── helpContent.ts        Contenido del centro de ayuda
│
├── hooks/                    Custom React hooks
│   ├── useCamera.ts
│   ├── useGeolocation.ts
│   ├── useOffline.ts
│   ├── useTheme.ts           Dark/Light/System con persistencia
│   └── useServiceWorker.ts   Registro del SW + updates
│
├── stores/                   Estado global con Zustand
│   ├── appStore.ts           Pantalla actual + online status
│   ├── installationStore.ts  Instalaciones (también en Dexie)
│   ├── materialStore.ts      Carrito de materiales
│   └── quoteStore.ts         Cotización en edición
│
├── types/                    Tipos TypeScript compartidos
│   └── index.ts              Installation, Quote, TE1Declaration, Profile, etc.
│
└── utils/                    Lógica de negocio pura (testeable)
    ├── voltageDrop.ts        Cálculo normativo RIC N°03
    ├── ampacity.ts           Selección de sección IEC 60364-5-523
    ├── shortCircuit.ts       Icc según IEC 60909
    ├── selectivity.ts        Recomendador IEC 60898
    ├── quoteCalculator.ts    Cálculo de totales
    ├── pdfQuoteGenerator.ts  PDF de cotización
    ├── te1PdfGenerator.ts    PDF de TE1
    ├── pdfGenerator.ts       PDF de instalación
    ├── shareUtils.ts         Share WhatsApp
    ├── formatters.ts         CLP, fechas, RUT
    └── validators.ts         Validaciones de RUT, etc.
```

---

## 🧠 Patrones de diseño

### 1. Pure logic en `utils/`, UI en `screens/`

Toda la lógica de cálculo está en funciones puras sin dependencias de React:

```ts
// ✅ Buena práctica: función pura testeable
export function calculateVoltageDrop(...): VoltageDropResult | null {
  // cálculo sin efectos secundarios
}

// ❌ Anti-patrón: lógica mezclada con React
function CalculatorScreen() {
  const handleCalculate = () => {
    // 50 líneas de cálculo + UI updates
  };
}
```

**Beneficio**: tests rápidos, lógica reutilizable, fácil de razonar.

### 2. State local + Dexie (sin server)

No hay API REST, no hay GraphQL. El estado se guarda en dos lugares:

| Tipo de dato | Persistencia | Cuándo usar |
|---|---|---|
| Datos de cálculo temporal | `useState` de React | Formularios, sub-screens |
| Datos del usuario (perfil) | Dexie (`profile` table) | Configuración |
| Historial persistente | Dexie (varias tablas) | Cotizaciones, TE1, instalaciones |
| Theme + cotizador en edición | Zustand `persist` en localStorage | UI state que sobrevive reload |

### 3. Lazy loading de pantallas

Todas las pantallas se importan con `lazy()` en `app/page.tsx`:

```ts
const HelpScreen = lazy(() => import('@/screens/HelpScreen'));
```

**Beneficio**: el bundle inicial no carga las 18 pantallas — solo se baja el chunk de la pantalla activa.

### 4. Referencias normativas como datos

Los artículos del RIC referenciados están en `data/ricRegulations.ts` como datos estructurados:

```ts
{
  id: 'ric-03-5-1-3',
  ric: 3,
  article: '5.1.3',
  title: 'Caída de tensión en alimentadores y total',
  quote: '...',  // cita textual del pliego
  summary: 'Caída máxima del 3% en alimentador...',
  calculatorIds: ['voltage-drop'],
}
```

Las calculadoras los buscan con `findRicArticle('ric-03-5-1-3')` y los muestran inline.

### 5. Responsive mobile-first

```
Mobile (< 768px):
  - Header arriba, BottomNav abajo
  - 1 columna
  - max-w-md

Tablet/Desktop (≥ 768px):
  - Sidebar fija a la izquierda
  - 2-3 columnas en grids
  - max-w-2xl / 3xl / 4xl
```

Implementado con Tailwind breakpoints. Sin media queries custom.

### 6. PWA first-class

- `public/manifest.json` con iconos + shortcuts + categories
- `public/sw.js` con 3 estrategias de caché
- `hooks/useServiceWorker.ts` con detección de updates
- `components/layout/UpdateBanner.tsx` para notificar al usuario

---

## 🚀 Deploy

### Build

```bash
npm run build
```

Genera el sitio estático en `dist/`. El proceso:
1. Compila TypeScript y JSX
2. Optimiza CSS (Tailwind purga clases no usadas)
3. Genera páginas estáticas (SSG) para todas las rutas
4. Copia `public/` a `dist/` (incluye `sw.js` y `manifest.json`)

### Vercel

El proyecto incluye `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

Vercel auto-detecta Next.js y configura:
- HTTPS automático
- CDN global
- Preview deployments por PR
- Headers correctos para SW y manifest

### Otros hostings

Funciona en cualquier hosting de archivos estáticos:

```bash
# Netlify
netlify deploy --dir=dist --prod

# GitHub Pages
# Subir dist/ a la rama gh-pages

# Cloudflare Pages
# Conectar repo, build cmd: npm run build, output: dist
```

**Requisito**: HTTPS obligatorio (todos los hostings modernos lo dan).

---

## 🧪 Tests

Cobertura enfocada en **lógica de negocio** (las funciones que si fallan, rompen el producto):

```
src/utils/voltageDrop.test.ts     12 tests  - Cálculo normativo RIC
src/utils/ampacity.test.ts         5 tests  - Selección de sección
src/utils/shortCircuit.test.ts     5 tests  - Icc
src/utils/selectivity.test.ts     10 tests  - Recomendador ITM
src/utils/quoteCalculator.test.ts  8 tests  - Cálculo de cotizaciones
src/utils/shareUtils.test.ts       8 tests  - Mensajes WhatsApp
src/data/helpContent.test.ts      16 tests  - Búsqueda en help
src/hooks/useTheme.test.ts         3 tests  - Resolución de theme
src/hooks/useServiceWorker.test.ts 2 tests  - Mock del SW API
```

**69/69 passing** en ~2 segundos.

### Agregar un test

```ts
// src/utils/miUtil.test.ts
import { describe, it, expect } from 'vitest';
import { miFuncion } from './miUtil';

describe('miFuncion', () => {
  it('caso básico', () => {
    expect(miFuncion(2, 3)).toBe(6);
  });
});
```

---

## 🛣️ Convenciones de código

### TypeScript

- **Strict mode** activado en `tsconfig.json`
- Tipos explícitos en las firmas de funciones públicas
- `interface` para objetos, `type` para uniones/aliases
- Evitar `any` salvo en adaptadores con librerías externas

### Naming

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | PascalCase | `CotizadorScreen` |
| Funciones utils | camelCase | `calculateVoltageDrop` |
| Constantes globales | SCREAMING_SNAKE | `CAIDA_MAX_ALIMENTADOR` |
| Tipos / Interfaces | PascalCase | `Quote`, `VoltageDropResult` |
| Stores Zustand | camelCase + prefijo `use` | `useQuoteStore` |
| Hooks custom | camelCase + prefijo `use` | `useTheme` |
| Archivos | kebab-case | `voltage-drop.ts` o PascalCase para componentes |

### Estructura de un componente

```tsx
'use client';  // solo si usa hooks o eventos

import { useState } from 'react';
// tipos arriba
// componentes auxiliares abajo (si los hay)

export default function MiComponente({ prop }: Props) {
  // hooks
  // handlers
  // render
}
```

### JSDoc

Toda función pública en `utils/` debe tener JSDoc con:
- Descripción de una línea
- `@param` para cada parámetro
- `@returns` para el retorno
- `@example` cuando aporta claridad
- `@see` para referencias normativas

---

## 🔌 Agregar una nueva calculadora

1. **Datos normativos** en `data/` (si aplica)
2. **Lógica pura** en `utils/` con JSDoc completo
3. **Tests** en `utils/miUtil.test.ts`
4. **Pantalla** en `screens/MiPantalla.tsx`
5. **Lazy import + ruta** en `app/page.tsx`
6. **Card en HomeScreen** + entrada en el grid
7. **Artículo RIC** en `data/ricRegulations.ts` con `calculatorIds: ['mi-calc']`
8. **Sección en Help** en `data/helpContent.ts`

---

## 🐛 Debugging tips

- **Ver el SW en DevTools**: Application → Service Workers
- **Forzar update**: Application → Service Workers → "Update" o "Unregister" + reload
- **Ver el manifest**: Application → Manifest
- **Limpiar localStorage**: DevTools → Application → Storage → Clear site data
- **Ver la base IndexedDB**: Application → Storage → IndexedDB → ElectriChileDB

---

## 📚 Referencias

- [Next.js 15 docs](https://nextjs.org/docs)
- [React 19 docs](https://react.dev)
- [Tailwind CSS 3](https://v3.tailwindcss.com)
- [Dexie.js](https://dexie.org)
- [Zustand](https://github.com/pmndrs/zustand)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Vitest](https://vitest.dev)
- [RIC SEC](https://www.sec.cl/areas/electricidad-y-combustibles/normativa-tecnica-vigente/)
