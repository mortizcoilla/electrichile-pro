import type { MetadataRoute } from "next";

// Con output: 'export' los route handlers deben declararse estáticos.
export const dynamic = "force-static";

/**
 * robots.txt generado por Next.js.
 *
 * Con output: 'export', este archivo se emite como /robots.txt estático
 * al hacer `next build`. Respeta metadataBase (https://electrichile-pro.vercel.app).
 *
 * Reglas:
 *  - Todo el sitio es público y se indexa por defecto.
 *  - Reservamos /api/ y /_next/ por si en el futuro se agregan endpoints.
 *  - Sitemap apuntando al canónico.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://electrichile-pro.vercel.app/sitemap.xml",
    host: "https://electrichile-pro.vercel.app",
  };
}
