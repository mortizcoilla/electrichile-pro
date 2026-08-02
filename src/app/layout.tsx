import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * URL canónica del sitio. Se usa como base para:
 *  - metadataBase (resuelve rutas relativas en OG, Twitter, icons)
 *  - alternates.canonical
 *  - og:url, og:image (URL absoluta)
 *  - sitemap.ts y robots.ts
 */
const SITE_URL = "https://electrichile-pro.vercel.app";
const SITE_NAME = "ElectroChile Pro";
const SITE_DESCRIPTION =
  "Calculadoras técnicas, cotizador y declaración TE1 para electricistas en Chile. Basado en el RIC vigente. Funciona 100% offline.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Herramientas para electricistas en Chile`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "electricista Chile",
    "RIC",
    "caída de tensión",
    "ampacidad",
    "cotizador eléctrico",
    "TE1",
    "declaración SEC",
    "normativa eléctrica Chile",
    "PWA electricista",
  ],
  authors: [{ name: "ElectroChile Pro" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "productivity",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-180x180.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "/icons/icon-192x192.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-CL": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Herramientas para electricistas en Chile`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — PWA para electricistas chilenos`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Herramientas para electricistas en Chile`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Nota: NO fijamos maximumScale ni userScalable: false.
  // Eso rompe accessibility (Lighthouse y WCAG 1.4.4) y bloquea zoom en iOS.
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
};

/**
 * Script inline que aplica el theme ANTES del primer render,
 * evitando el "flash" al cargar.
 */
const themeScript = `
(function() {
  try {
    var mode = localStorage.getItem('electrochile-theme') || 'dark';
    var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var effective = mode === 'system' ? system : mode;
    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

/**
 * JSON-LD: SoftwareApplication. Mejora el snippet de Google y el
 * entendimiento del producto (instalable, gratis, sin coletazos raros).
 * Se inyecta como <script type="application/ld+json"> en el <head>.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Electrician Tools",
  operatingSystem: "Web, Android, iOS",
  inLanguage: "es-CL",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CLP",
  },
  featureList: [
    "Calculadora de caída de tensión (RIC N°03)",
    "Calculadora de ampacidad (RIC N°04)",
    "Cotizador con IVA y exportación PDF",
    "Declaración TE1 (RIC N°18, N°19)",
    "Funciona 100% offline",
    "PWA instalable",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#0a0e1a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="theme-color" content="#0a0e1a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
