# ⚡ ElectriChile Pro

> **PWA para electricistas chilenos** — Calculadoras técnicas, cotizador y declaración TE1 según el RIC vigente. Funciona 100% offline.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-69%2F69%20passing-brightgreen?style=flat-square)](https://github.com/miguel/electrichile-pro)

[Demo](https://electrichile-pro.vercel.app) · [Reportar bug](https://github.com/miguel/electrichile-pro/issues) · [Pedir feature](https://github.com/miguel/electrichile-pro/issues)

---

## 🎯 ¿Qué es?

ElectriChile Pro es una herramienta pensada para el **instalador electricista en Chile**. Reúne en un solo lugar todo lo que necesitás en tu día a día:

- 🧮 **4 calculadoras técnicas** según el RIC (Reglamento de Instalaciones de Consumo)
- 💰 **Cotizador** con plantillas, IVA y PDF profesional
- 📋 **Declaración TE1** lista para presentar ante la SEC
- 📡 **Funciona 100% offline** (datos locales, sin servidor)
- 📱 **PWA instalable** en celular o notebook

**¿Por qué RIC y no NCh?** El RIC (Resolución Exenta SEC N° 33.877/2020) es la normativa eléctrica **vigente** en Chile. Reemplazó a la antigua NCh Elec 4/2003. Todas las calculadoras de esta app citan textualmente los artículos del RIC que aplican.

---

## ✨ Features

### 🧮 Calculadoras técnicas

| Calculadora | Qué hace | Referencia RIC |
|---|---|---|
| **Caída de tensión** | Verifica que el % de caída no supere el 3% en alimentador / 5% total. Sugiere sección si no cumple. | N°03, pto 5.1.3 |
| **Ampacidad** | Sección mínima del conductor según corriente, método de instalación (A1-F), material, aislamiento, temperatura y agrupamiento. | N°04, tabla 4.4 (IEC 60364-5-523) |
| **Cortocircuito** | Icc máxima y mínima según IEC 60909. Avisa si necesitás un PdC > 10 kA. | N°05, pto 6.3 |
| **Selectividad** | Recomienda In, curva (B/C/D) y poder de corte del ITM según tipo de carga. | N°05, pto 6.3 |

### 💰 Cotizador

- 6 plantillas preconfiguradas (residencial, ampliación, comercial, industrial, mantención, personalizada)
- 30+ items típicos del catálogo chileno con precios referenciales
- Cálculo en tiempo real de subtotales, mano de obra, descuento global, IVA 19% y total
- 6 estados: Borrador → Enviada → Aceptada / Rechazada → Facturada → Cobrada
- Generación de **PDF profesional** con datos del electricista, logo, totales y firma del cliente
- **Share por WhatsApp** con mensaje prearmado

### 📋 Declaración TE1 (RIC N°18, N°19)

- Formulario completo en 7 secciones (instalador, cliente, características, empalme, conductores, protecciones, observaciones)
- **Firmas digitales** con canvas (mouse + touch)
- Generación de PDF oficial con logo del electricista
- Numeración automática correlativa anual
- **Share por WhatsApp** al cliente o a la SEC

### 🎨 Diseño

- **Responsive**: optimizado para celular, tablet y notebook
- **Dark / Light / System** theme con persistencia
- **PWA instalable** con service worker (modo offline real)
- **Shortcuts** (long-press en el icono de la app): Cotizador, Calculadoras, TE1
- **Accesibilidad**: navegación por teclado, roles ARIA, contraste WCAG AA

---

## 🚀 Quick start

```bash
# 1. Clonar
git clone https://github.com/miguel/electrichile-pro.git
cd electrichile-pro

# 2. Instalar dependencias
npm install

# 3. Correr en dev
npm run dev
# → http://localhost:3000

# 4. Build de producción
npm run build
# → /dist (static export)

# 5. Tests
npm test
```

**Requisitos**: Node.js 18+ (recomendado 24.x) y npm 9+.

---

## 📦 Stack técnico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 |
| **Lenguaje** | TypeScript 5 (strict mode) |
| **Estilos** | Tailwind CSS 3 + sistema de design custom |
| **Estado global** | Zustand 5 (con persist en localStorage) |
| **Base de datos local** | Dexie 4 (IndexedDB) |
| **PDFs** | jsPDF + html2canvas |
| **Iconos** | Lucide React + Radix UI |
| **Animaciones** | Framer Motion |
| **PWA** | Service Worker custom + Web App Manifest |
| **Tests** | Vitest 2 + Testing Library |
| **Lint** | ESLint (config Next) |
| **Build** | Static export (`output: 'export'`) |

---

## 🏗️ Estructura del proyecto

```
electrichile-pro/
├── public/
│   ├── sw.js                    # Service Worker custom
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # Iconos PWA
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout + theme script
│   │   ├── page.tsx             # Router principal de pantallas
│   │   └── globals.css          # Estilos globales + design tokens
│   ├── components/
│   │   ├── layout/              # AppShell, Header, Sidebar, BottomNav
│   │   ├── shared/              # Componentes reutilizables
│   │   └── ui/                  # Primitivos (Button, Card, Input...)
│   ├── screens/                 # Pantallas (lazy-loaded)
│   │   ├── HomeScreen.tsx
│   │   ├── CotizadorScreen.tsx
│   │   ├── TE1Screen.tsx
│   │   ├── HelpScreen.tsx
│   │   ├── NormativaScreen.tsx
│   │   ├── AmpacityScreen.tsx
│   │   ├── ShortCircuitScreen.tsx
│   │   ├── SelectivityScreen.tsx
│   │   └── ... (11 pantallas en total)
│   ├── data/                    # Datos estáticos (RIC, catálogo, regiones)
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Stores Zustand
│   ├── types/                   # Tipos TypeScript
│   └── utils/                   # Lógica de negocio pura + tests
│       ├── voltageDrop.ts       # Cálculo normativo RIC N°03
│       ├── ampacity.ts          # Cálculo IEC 60364-5-523
│       ├── shortCircuit.ts      # Cálculo IEC 60909
│       ├── selectivity.ts       # Recomendador IEC 60898
│       ├── quoteCalculator.ts   # Cálculo de cotizaciones
│       ├── pdfQuoteGenerator.ts # PDF de cotización
│       ├── te1PdfGenerator.ts   # PDF de TE1
│       └── shareUtils.ts        # Share WhatsApp
├── next.config.mjs              # Config Next.js (output: 'export')
├── tailwind.config.ts           # Design system
├── vercel.json                  # Config de deploy
├── vitest.config.ts             # Config de tests
└── package.json
```

📐 **Más detalles de la arquitectura**: ver [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🇨🇱 Cumplimiento del RIC

Esta app está construida siguiendo el **Reglamento de Instalaciones de Consumo (RIC)** de la SEC. Los pliegos técnicos referenciados son:

| Pliego | Materia | Usado en |
|---|---|---|
| RIC N°01 | Empalmes | — |
| RIC N°02 | Tableros | — |
| **RIC N°03** | **Alimentadores y demanda** | **Caída de tensión** |
| **RIC N°04** | **Conductores y canalizaciones** | **Ampacidad** |
| **RIC N°05** | **Medidas de protección** | **Cortocircuito, Selectividad** |
| RIC N°06 | Puesta a tierra | — |
| RIC N°07 | Instalaciones de equipos | — |
| RIC N°09 | Sistemas de autogeneración | Solar |
| RIC N°15 | Recarga de vehículos eléctricos | — |
| RIC N°18 | Presentación de proyectos | **TE1** |
| RIC N°19 | Puesta en servicio | **TE1** |

La lista completa con cita textual está disponible dentro de la app en **Configuración → Normativa RIC** (o en [`src/data/ricRegulations.ts`](src/data/ricRegulations.ts)).

---

## 🧪 Tests

```bash
npm test                # correr todos
npm run test:watch      # modo watch
```

**69/69 tests passing** en 9 archivos:

```
✓ src/utils/voltageDrop.test.ts     (12 tests)
✓ src/utils/ampacity.test.ts         (5 tests)
✓ src/utils/shortCircuit.test.ts     (5 tests)
✓ src/utils/selectivity.test.ts     (10 tests)
✓ src/utils/quoteCalculator.test.ts  (8 tests)
✓ src/utils/shareUtils.test.ts       (8 tests)
✓ src/data/helpContent.test.ts      (16 tests)
✓ src/hooks/useTheme.test.ts         (3 tests)
✓ src/hooks/useServiceWorker.test.ts (2 tests)
```

Cobertura enfocada en la **lógica de negocio crítica** (cálculos normativos, cotizaciones, búsqueda en help).

---

## 🌐 Deploy

### Vercel (recomendado)

El proyecto está configurado para deploy estático en Vercel:

1. Hacé fork o clone del repo
2. Andá a [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. Vercel auto-detecta Next.js
4. Click Deploy

Ver guía detallada en [ARCHITECTURE.md](ARCHITECTURE.md#deploy).

### Otros hostings

Como es static export, podés deployar en cualquier hosting de archivos estáticos:

```bash
npm run build
# Subir contenido de /dist a:
# - Netlify
# - Cloudflare Pages
# - GitHub Pages
# - S3 + CloudFront
# - Nginx
```

**Importante**: la app **requiere HTTPS** (service worker + PWA). Todos los hostings modernos lo dan por defecto.

---

## 🛣️ Roadmap

### ✅ v1.0.0 (actual)
- 4 calculadoras técnicas según RIC
- Cotizador + PDF
- Declaración TE1 + PDF
- Share WhatsApp, firmas digitales, dark mode
- PWA instalable con service worker
- Centro de ayuda integrado
- 69 tests passing

### 🔜 v1.1 (próximo)
- [ ] OCR de placa de datos de artefactos (Tesseract.js)
- [ ] Sincronización entre dispositivos (Vercel KV)
- [ ] Modo multi-perfil (varios electricistas en el mismo dispositivo)

### 💡 Ideas
- [ ] Asistente IA con RAG al RIC
- [ ] Inventario de bodega con alertas de reposición
- [ ] Cálculo de iluminación (niveles de lux)
- [ ] Cálculo de cortocircuito trifásico en cascada
- [ ] Editor visual de diagrama unilineal
- [ ] i18n (inglés/portugués)

¿Querés sugerir algo? [Abrí un issue](https://github.com/miguel/electrichile-pro/issues/new).

---

## 🤝 Contribuir

¡Contribuciones son bienvenidas! Por favor leé [CONTRIBUTING.md](CONTRIBUTING.md) antes.

Áreas donde podés ayudar:
- 🐛 Reportar bugs o mejorar UX
- 📚 Agregar/corregir referencias al RIC
- 🧮 Nuevas calculadoras (puesta a tierra, factor de potencia, iluminación)
- 🌍 Traducción a otros idiomas
- 📱 Mejorar la PWA / soporte iOS

---

## 📄 Licencia

MIT © Miguel — ver [LICENSE](LICENSE) para detalles.

---

## 🙏 Agradecimientos

- **SEC (Superintendencia de Electricidad y Combustibles)** — por la publicación abierta del RIC
- **Comunidad de electricistas chilenos** — feedback y casos de uso
- **Next.js, React, Tailwind y todo el open source** que hace posible esta app

---

## 📞 Contacto

- 📧 contacto@electrichile.cl
- 🐛 [GitHub Issues](https://github.com/miguel/electrichile-pro/issues)
- 🌐 [electrichile.cl](https://electrichile.cl)

---

**Hecho con ⚡ en Chile · Riguroso con la normativa · Respetuoso de tu privacidad**
