import type { MetadataRoute } from "next";

// Con output: 'export' los route handlers deben declararse estáticos.
export const dynamic = "force-static";

/**
 * sitemap.xml generado por Next.js.
 *
 * Con output: 'export', este archivo se emite estáticamente en build
 * a /sitemap.xml. Solo declaramos rutas reales (no placeholders).
 *
 * A medida que el proyecto agregue rutas públicas reales (ej: /guias/ric-n03,
 * /guias/caida-de-tension), se agregan acá.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://electrichile-pro.vercel.app";
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          "es-CL": `${base}/`,
        },
      },
    },
  ];
}
