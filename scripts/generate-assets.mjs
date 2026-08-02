/**
 * generate-assets.mjs
 *
 * Genera desde el SVG vectorial todos los assets visuales que necesita
 * la PWA para producción. No toca código, solo archivos en public/.
 *
 *   - icons/icon-180x180.png  (apple-touch-icon)
 *   - icons/icon-192x192.png  (manifest, propósito "any")
 *   - icons/icon-512x512.png  (manifest, propósito "any")
 *   - icons/maskable-icon.png (512x512 con safe-zone 40%)
 *   - favicon.svg             (copia limpia, sin xmlns extra)
 *   - og-image.png            (1200x630, preview LinkedIn/WhatsApp)
 *
 * Uso:  node scripts/generate-assets.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const ICONS = resolve(PUBLIC, "icons");

const BG = "#0a0e1a";
const ACCENT = "#f59e0b";
const FG = "#f8fafc";
const MUTED = "#94a3b8";

/* -------------------------------------------------------------------------- */
/* 1. SVG fuente                                                              */
/* -------------------------------------------------------------------------- */
const sourceSvg = readFileSync(resolve(ICONS, "icon-192x192.svg"), "utf-8");

/* -------------------------------------------------------------------------- */
/* 2. Favicon SVG (mismo contenido, ruta limpia)                              */
/* -------------------------------------------------------------------------- */
writeFileSync(resolve(PUBLIC, "favicon.svg"), sourceSvg, "utf-8");
console.log("✓ favicon.svg");

/* -------------------------------------------------------------------------- */
/* 3. PNGs de icono                                                            */
/* -------------------------------------------------------------------------- */
const rasterizeIcon = (size, outPath) =>
  sharp(Buffer.from(sourceSvg))
    .resize(size, size, { fit: "contain", background: BG })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
    .then(() => console.log(`✓ ${outPath.replace(ROOT + "\\", "")} (${size}x${size})`));

await rasterizeIcon(180, resolve(ICONS, "icon-180x180.png"));
await rasterizeIcon(192, resolve(ICONS, "icon-192x192.png"));
await rasterizeIcon(512, resolve(ICONS, "icon-512x512.png"));

/* -------------------------------------------------------------------------- */
/* 4. Maskable icon                                                            */
/*                                                                            */
/*    La spec PWA "maskable" exige que el contenido visible (icono) caiga      */
/*    dentro del círculo central con 40% de padding respecto al cuadrado.      */
/*    Renderizamos el icono a 360x360 dentro de un canvas 512x512.             */
/* -------------------------------------------------------------------------- */
const maskableInner = 360;
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(${(512 - maskableInner) / 2}, ${(512 - maskableInner) / 2}) scale(${maskableInner / 192})">
    <path d="M96 32L120 96L96 80L72 96L96 32Z" fill="${ACCENT}"/>
    <path d="M96 80L120 144L96 128L72 144L96 80Z" fill="${ACCENT}" opacity="0.7"/>
    <circle cx="96" cy="96" r="12" fill="${ACCENT}"/>
  </g>
</svg>`;

await sharp(Buffer.from(maskableSvg))
  .png({ compressionLevel: 9 })
  .toFile(resolve(ICONS, "maskable-icon.png"));
console.log("✓ icons/maskable-icon.png (512x512, safe-zone 40%)");

/* -------------------------------------------------------------------------- */
/* 5. OG image 1200x630                                                        */
/*                                                                            */
/*    Layout:                                                                  */
/*      - Fondo BG (#0a0e1a)                                                   */
/*      - Banda izquierda con el logo (icono escalado)                         */
/*      - Texto a la derecha: nombre + tagline + bullets                       */
/* -------------------------------------------------------------------------- */
const W = 1200;
const H = 630;
const logoSize = 360;
const logoX = 80;
const logoY = (H - logoSize) / 2;

const ogLogo = `
<svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="${ACCENT}" fill-opacity="0.12"/>
  <path d="M96 32L120 96L96 80L72 96L96 32Z" fill="${ACCENT}"/>
  <path d="M96 80L120 144L96 128L72 144L96 80Z" fill="${ACCENT}" opacity="0.7"/>
  <circle cx="96" cy="96" r="12" fill="${ACCENT}"/>
</svg>`;

const ogBase = sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: BG,
  },
});

const logoBuf = await sharp(Buffer.from(ogLogo)).png().toBuffer();

await ogBase
  .composite([
    { input: logoBuf, left: logoX, top: logoY },
    {
      input: Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
          <defs>
            <style>
              .name { font: 700 76px 'Inter', system-ui, sans-serif; fill: ${FG}; }
              .tag  { font: 500 36px 'Inter', system-ui, sans-serif; fill: ${MUTED}; }
              .pill {
                font: 500 24px 'Inter', system-ui, sans-serif;
                fill: ${FG};
              }
            </style>
          </defs>
          <text class="name" x="500" y="250">ElectroChile Pro</text>
          <text class="tag"  x="500" y="310">PWA para electricistas en Chile</text>
          <g transform="translate(500, 380)">
            <rect x="0"   y="0" width="240" height="44" rx="22" fill="${ACCENT}" fill-opacity="0.15" stroke="${ACCENT}" stroke-opacity="0.6"/>
            <text class="pill" x="120" y="29" text-anchor="middle">Calculadoras RIC</text>
          </g>
          <g transform="translate(760, 380)">
            <rect x="0"   y="0" width="200" height="44" rx="22" fill="${ACCENT}" fill-opacity="0.15" stroke="${ACCENT}" stroke-opacity="0.6"/>
            <text class="pill" x="100" y="29" text-anchor="middle">Cotizador</text>
          </g>
          <g transform="translate(500, 440)">
            <rect x="0"   y="0" width="180" height="44" rx="22" fill="${ACCENT}" fill-opacity="0.15" stroke="${ACCENT}" stroke-opacity="0.6"/>
            <text class="pill" x="90" y="29" text-anchor="middle">TE1 (SEC)</text>
          </g>
          <g transform="translate(700, 440)">
            <rect x="0"   y="0" width="220" height="44" rx="22" fill="${ACCENT}" fill-opacity="0.15" stroke="${ACCENT}" stroke-opacity="0.6"/>
            <text class="pill" x="110" y="29" text-anchor="middle">100% offline</text>
          </g>
          <text class="tag" x="500" y="560" style="font-size: 24px; fill: ${MUTED}">electrochile-pro.vercel.app</text>
        </svg>`),
      top: 0,
      left: 0,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(resolve(PUBLIC, "og-image.png"));

console.log("✓ og-image.png (1200x630)");

console.log("\nTodos los assets regenerados.");
