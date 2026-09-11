#!/usr/bin/env node
/**
 * Generates the brand raster assets from one vector source, so the monogram,
 * the favicon, the PWA icons and the social card can never drift apart:
 *
 *   public/media/icons/brand.png   navbar + footer mark
 *   public/brand-logo.png          the ImageObject in the JSON-LD
 *   public/favicon.png             browser tab + manifest icon
 *   public/apple-touch-icon.png    iOS home screen
 *   public/og-image.png            Open Graph / Twitter card
 *
 *   npm run brand
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (rel) => join(root, rel);

const INK = "#05060f";
const SURFACE = "#0d1024";
const VIOLET = "#915eff";
const AQUA = "#22d3ee";
const MUTED = "#aaa6c3";

const NAME = "Ajith S";
const INITIALS = "AS";
const ROLE = "3D ANIMATOR · VFX ARTIST · UNREAL ENGINE";
const TAGLINE = "Every frame tells a story,";
const TAGLINE_2 = "every motion sparks emotion.";

// Sora is a web font the build does not ship locally — fall back through the
// system stack so this renders the same on any machine that runs the script.
const FONT = "Sora, Poppins, Segoe UI, Helvetica, Arial, sans-serif";
const MONO = "Space Grotesk, Consolas, Segoe UI, monospace";

/** Square monogram: gradient ring, gradient initials, dark disc. */
const monogram = (size) => {
  const c = size / 2;
  const ring = size * 0.017;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${VIOLET}"/>
      <stop offset="100%" stop-color="${AQUA}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.3" cy="0.25" r="0.8">
      <stop offset="0%" stop-color="${VIOLET}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${c}" cy="${c}" r="${c}" fill="${SURFACE}"/>
  <circle cx="${c}" cy="${c}" r="${c}" fill="url(#glow)"/>
  <circle cx="${c}" cy="${c}" r="${c - ring}" fill="none" stroke="url(#g)" stroke-width="${ring * 2}" opacity="0.9"/>
  <text x="${c}" y="${c + size * 0.135}" font-family="${FONT}" font-size="${size * 0.42}"
        font-weight="800" letter-spacing="${-size * 0.012}" fill="url(#g)" text-anchor="middle">${INITIALS}</text>
</svg>`;
};

/** 1200x630 social card. */
const ogCard = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${VIOLET}"/>
      <stop offset="100%" stop-color="${AQUA}"/>
    </linearGradient>
    <radialGradient id="aurora" cx="0.16" cy="0.1" r="0.9">
      <stop offset="0%" stop-color="${VIOLET}" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="aurora2" cx="0.92" cy="0.95" r="0.7">
      <stop offset="0%" stop-color="${AQUA}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${AQUA}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0v60" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#aurora)"/>
  <rect width="1200" height="630" fill="url(#aurora2)"/>

  <circle cx="104" cy="96" r="34" fill="${SURFACE}"/>
  <circle cx="104" cy="96" r="33" fill="none" stroke="url(#g)" stroke-width="2"/>
  <text x="104" y="107" font-family="${FONT}" font-size="27" font-weight="800"
        fill="url(#g)" text-anchor="middle">${INITIALS}</text>
  <text x="152" y="105" font-family="${FONT}" font-size="27" font-weight="700" fill="#ffffff">${NAME}</text>

  <text x="80" y="292" font-family="${FONT}" font-size="62" font-weight="800" fill="#ffffff">${TAGLINE}</text>
  <text x="80" y="368" font-family="${FONT}" font-size="62" font-weight="800" fill="url(#g)">${TAGLINE_2}</text>

  <rect x="80" y="424" width="56" height="3" rx="1.5" fill="url(#g)"/>
  <text x="80" y="474" font-family="${MONO}" font-size="21" letter-spacing="3"
        fill="${MUTED}">${ROLE}</text>
  <text x="80" y="524" font-family="${MONO}" font-size="21" letter-spacing="3"
        fill="${MUTED}">CHENNAI, INDIA · WORKING WORLDWIDE</text>

  <rect x="0" y="626" width="1200" height="4" fill="url(#g)"/>
</svg>`;

const render = async (svg, rel) => {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out(rel));
  console.log(`✓ ${rel}`);
};

await render(monogram(256), "public/media/icons/brand.png");
await render(monogram(512), "public/brand-logo.png");
await render(monogram(512), "public/favicon.png");
await render(monogram(180), "public/apple-touch-icon.png");
await render(ogCard(), "public/og-image.png");

console.log("\nBrand assets regenerated.");
