#!/usr/bin/env node
/**
 * Generates responsive AVIF + WebP variants into /public/media, plus a
 * correctly-sized 1200×630 Open Graph card.
 *
 * The source PNGs are 1.1–3.5 MB each — fine as masters, ruinous as page
 * weight on a phone. Each poster comes out as 480/768/1200 wide AVIF and
 * WebP, and the components pick a size with srcset.
 *
 *   npm run images
 *
 * Re-run after replacing any master in src/assets.
 */
import sharp from "sharp";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public/media");
mkdirSync(OUT, { recursive: true });

/** slug → source file. Slugs are referenced from src/constants/index.js. */
const POSTERS = {
  "work-island": "src/assets/thumbnail1.png",
  "work-ganesha": "src/assets/thumbnail0.png",
  "work-airplane": "src/assets/thumbnail3.png",
  "work-mustang": "src/assets/thumbnail.png",
};

const WIDTHS = [480, 768, 1200];
const kb = (p) => (statSync(p).size / 1024).toFixed(0);

let before = 0;
let after = 0;

console.log("\nProject posters");
for (const [slug, rel] of Object.entries(POSTERS)) {
  const src = join(root, rel);
  if (!existsSync(src)) {
    console.warn(`  ! missing ${rel}`);
    continue;
  }

  before += statSync(src).size;
  const sizes = [];

  for (const w of WIDTHS) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });

    const webp = join(OUT, `${slug}-${w}.webp`);
    const avif = join(OUT, `${slug}-${w}.avif`);

    await base.clone().webp({ quality: 78, effort: 5 }).toFile(webp);
    await base.clone().avif({ quality: 58, effort: 5 }).toFile(avif);

    after += statSync(webp).size + statSync(avif).size;
    sizes.push(`${w}w ${kb(avif)}/${kb(webp)}KB`);
  }

  // JPEG fallback for anything that understands neither format.
  const jpg = join(OUT, `${slug}-1200.jpg`);
  await sharp(src).resize({ width: 1200 }).jpeg({ quality: 80, mozjpeg: true }).toFile(jpg);
  after += statSync(jpg).size;

  console.log(`  ✓ ${slug}  (${kb(src)}KB master) → ${sizes.join(" · ")} avif/webp`);
}

console.log("\nHero backdrop");
{
  const src = join(root, "src/assets/herobg.png");
  if (existsSync(src)) {
    before += statSync(src).size;
    for (const w of [768, 1440, 1920]) {
      const webp = join(OUT, `herobg-${w}.webp`);
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 70, effort: 5 })
        .toFile(webp);
      after += statSync(webp).size;
      console.log(`  ✓ herobg-${w}.webp  ${kb(webp)}KB`);
    }
  }
}

console.log("\nOpen Graph card");
{
  // 1200×630 is the ratio Facebook, LinkedIn, WhatsApp and X all crop to.
  const src = join(root, "src/assets/thumbnail4.png");
  const out = join(root, "public/og-image.png");
  if (existsSync(src)) {
    await sharp(src)
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .png({ quality: 88, compressionLevel: 9 })
      .toFile(out);
    console.log(`  ✓ og-image.png  1200×630  ${kb(out)}KB`);
  }
}

console.log("\nFavicons");
for (const [name, size] of [
  ["favicon.png", 512],
  ["apple-touch-icon.png", 180],
  ["brand-logo.png", 512],
]) {
  const src = join(root, name === "brand-logo.png" ? "src/assets/srs.png" : "logotitle.png");
  const out = join(root, "public", name);
  if (!existsSync(src)) continue;
  await sharp(src).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  ✓ ${name}  ${size}×${size}  ${kb(out)}KB`);
}

/**
 * UI icons.
 *
 * These render at 36–72 px but the masters run up to 650 KB — one of them is a
 * 2400 px PNG. 256 px is plenty for a retina 72 px slot, and the flat PNG here
 * doubles as the texture map for the 3D tech balls (three.js loads it through
 * an <img>, so a plain PNG URL is the safest thing to hand it).
 */
console.log("\nUI icons");
const ICON_DIR = join(OUT, "icons");
mkdirSync(ICON_DIR, { recursive: true });

const ICONS = {
  brand: "src/assets/srs.png",
  animation: "src/assets/animation.png",
  vfx: "src/assets/vfx.png",
  led: "src/assets/led.png",
  creator: "src/assets/creator.png",
  ue: "src/assets/tech/ue.png",
  blender: "src/assets/tech/blender.png",
  pt: "src/assets/tech/pt.png",
  aftereffect: "src/assets/tech/aftereffect.png",
  davinci: "src/assets/tech/davinci.png",
  pp: "src/assets/tech/pp.png",
  ps: "src/assets/tech/ps.png",
  ai: "src/assets/tech/ai.png",
  figma: "src/assets/tech/figma.png",
  edit: "src/assets/edit.png",
  freelance: "src/assets/company/fl.png",
};

let iconBefore = 0;
let iconAfter = 0;

for (const [name, rel] of Object.entries(ICONS)) {
  const src = join(root, rel);
  if (!existsSync(src)) {
    console.warn(`  ! missing ${rel}`);
    continue;
  }
  iconBefore += statSync(src).size;

  const out = join(ICON_DIR, `${name}.png`);
  await sharp(src)
    .resize(256, 256, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);

  iconAfter += statSync(out).size;
  console.log(`  ✓ ${name}.png  ${kb(src)}KB → ${kb(out)}KB`);
}

console.log(
  `  icons ${(iconBefore / 1024 / 1024).toFixed(1)} MB → ${(iconAfter / 1024).toFixed(0)} KB`
);

console.log(
  `\nMasters ${(before / 1024 / 1024).toFixed(1)} MB → served variants ${(after / 1024 / 1024).toFixed(1)} MB total across all breakpoints.`
);
console.log("A phone downloads only the 480w variant of each.\n");
