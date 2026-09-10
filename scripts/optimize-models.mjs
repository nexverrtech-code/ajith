#!/usr/bin/env node
/**
 * Shrinks the glTF scenes in /public.
 *
 * The hero PC model shipped as ~18 MB: 12 MB of textures (two of them near
 * 3 MB), a 4 MB geometry buffer and a 1.7 MB pretty-printed .gltf. All of it
 * downloads the moment the desktop hero canvas mounts.
 *
 * This resizes every texture to at most 1024px and minifies the .gltf JSON.
 * Both are lossless-ish and, crucially, keep the original filenames, so the
 * .gltf's own URI references stay valid and nothing else has to change.
 *
 * Originals are copied to /model-masters on the first run and every later run
 * reads from there, so re-running never recompresses an already-compressed
 * file. Delete /model-masters and re-run to start from the current public/.
 *
 *   npm run models
 */
import sharp from "sharp";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MASTERS = join(root, "model-masters");
const MAX_DIM = 1024;

const kb = (p) => statSync(p).size / 1024;
const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";

let before = 0;
let after = 0;

for (const model of ["desktop_pc", "planet"]) {
  const publicDir = join(root, "public", model);
  if (!existsSync(publicDir)) continue;

  const masterDir = join(MASTERS, model);
  const firstRun = !existsSync(masterDir);

  console.log(`\n${model}${firstRun ? "  (backing up originals)" : "  (reading from model-masters)"}`);

  // ---- textures ----
  const texPublic = join(publicDir, "textures");
  const texMaster = join(masterDir, "textures");
  if (existsSync(texPublic)) {
    mkdirSync(texMaster, { recursive: true });

    for (const file of readdirSync(texPublic)) {
      if (!/\.(png|jpe?g)$/i.test(file)) continue;

      const out = join(texPublic, file);
      const master = join(texMaster, file);

      // First run: the file in public IS the original.
      if (!existsSync(master)) copyFileSync(out, master);

      const srcSize = kb(master);
      before += srcSize;

      const isJpeg = /\.jpe?g$/i.test(file);
      const meta = await sharp(master).metadata();
      const needsResize = Math.max(meta.width || 0, meta.height || 0) > MAX_DIM;

      let pipeline = sharp(master);
      if (needsResize) {
        pipeline = pipeline.resize({
          width: MAX_DIM,
          height: MAX_DIM,
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      /**
       * Several of these PNGs are already indexed-colour and well packed, so a
       * plain lossless re-encode inflates them back to full RGBA — three of
       * them grew by 50% on the first attempt. So: try the candidates, keep
       * the smallest, and fall back to the untouched original if nothing beats
       * it. Palette quantisation is skipped for the maps where banding would
       * actually show.
       */
      const candidates = [];
      if (isJpeg) {
        candidates.push(await pipeline.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer());
      } else {
        candidates.push(await pipeline.clone().png({ compressionLevel: 9 }).toBuffer());
        if (!/metallicRoughness|normal|emissive/i.test(file)) {
          candidates.push(
            await pipeline.clone().png({ compressionLevel: 9, palette: true, quality: 92 }).toBuffer()
          );
        }
      }

      const best = candidates.sort((a, b) => a.length - b.length)[0];
      const original = readFileSync(master);
      const winner = best.length < original.length ? best : original;

      writeFileSync(out, winner);
      after += kb(out);

      if (srcSize > 200 || needsResize) {
        const note = winner === original ? "  (kept original — already smaller)" : "";
        console.log(
          `  ${file.padEnd(38)} ${srcSize.toFixed(0).padStart(5)}KB → ${kb(out).toFixed(0).padStart(5)}KB` +
            (needsResize && winner !== original ? `  (${meta.width}×${meta.height} → ≤${MAX_DIM})` : note)
        );
      }
    }
  }

  // ---- scene.gltf: strip the pretty-printing ----
  const gltfPublic = join(publicDir, "scene.gltf");
  const gltfMaster = join(masterDir, "scene.gltf");
  if (existsSync(gltfPublic)) {
    mkdirSync(masterDir, { recursive: true });
    if (!existsSync(gltfMaster)) copyFileSync(gltfPublic, gltfMaster);

    const srcSize = kb(gltfMaster);
    before += srcSize;
    const json = JSON.parse(readFileSync(gltfMaster, "utf8"));
    writeFileSync(gltfPublic, JSON.stringify(json));
    after += kb(gltfPublic);
    console.log(
      `  ${"scene.gltf".padEnd(38)} ${srcSize.toFixed(0).padStart(5)}KB → ${kb(gltfPublic).toFixed(0).padStart(5)}KB  (minified)`
    );
  }

  // scene.bin is vertex data — shrinking it needs Draco/meshopt, which would
  // mean a decoder in the bundle. Left alone.
  const bin = join(publicDir, "scene.bin");
  if (existsSync(bin)) {
    before += kb(bin);
    after += kb(bin);
    console.log(`  ${"scene.bin".padEnd(38)} ${kb(bin).toFixed(0).padStart(5)}KB  (geometry, unchanged)`);
  }
}

console.log(
  `\nModels ${mb(before * 1024)} → ${mb(after * 1024)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`
);
console.log("Originals preserved in /model-masters (not part of the build).\n");
