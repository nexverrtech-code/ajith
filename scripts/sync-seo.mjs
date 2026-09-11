#!/usr/bin/env node
/**
 * Propagates SITE.url from src/constants/site.js across every file that
 * hard-codes the domain: index.html, public/robots.txt, public/sitemap.xml,
 * public/llms.txt and public/site.webmanifest.
 *
 * Canonical tags, Open Graph URLs, JSON-LD @id values and the sitemap all
 * have to agree or search engines treat them as different pages — this keeps
 * the swap to one edit.
 *
 * The domain being replaced is read from the canonical tag in index.html, so
 * the script carries no hard-coded brand. If index.html has already been
 * changed by hand, name the old origin explicitly:
 *
 *   npm run seo:sync
 *   npm run seo:sync -- --from=https://old-domain.com
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const siteSrc = readFileSync(join(root, "src/constants/site.js"), "utf8");
const match = siteSrc.match(/url:\s*["'](https?:\/\/[^"']+)["']/);

if (!match) {
  console.error("✗ Could not find SITE.url in src/constants/site.js");
  process.exit(1);
}

const target = match[1].replace(/\/+$/, "");

/** Origin currently written into the files — the canonical tag is the record. */
const fromArg = process.argv.find((a) => a.startsWith("--from="));
const html = readFileSync(join(root, "index.html"), "utf8");
const canonical = (html.match(/rel="canonical"\s+href="(https?:\/\/[^/"]+)/) || [])[1];
const current = (fromArg ? fromArg.slice("--from=".length) : canonical || "").replace(
  /\/+$/,
  ""
);

if (!current) {
  console.error("✗ No canonical link in index.html — pass --from=https://old-domain.com");
  process.exit(1);
}

if (current === target) {
  console.log(`• Nothing to rewrite — every file already points at ${target}`);
  process.exit(0);
}

const escaped = current.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const DOMAIN_RE = new RegExp(`${escaped}(?::\\d+)?`, "gi");

const files = [
  "index.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/llms.txt",
  "public/site.webmanifest",
];

let changed = 0;

for (const rel of files) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    console.warn(`• skipped ${rel} (not found)`);
    continue;
  }

  const before = readFileSync(path, "utf8");
  const after = before.replace(DOMAIN_RE, target);

  if (before === after) {
    console.log(`• ${rel} — no ${current} references`);
    continue;
  }

  writeFileSync(path, after, "utf8");
  changed += 1;
  console.log(`✓ ${rel} — rewritten to ${target}`);
}

// Refresh <lastmod> so re-crawls aren't ignored as unchanged.
const sitemapPath = join(root, "public/sitemap.xml");
if (existsSync(sitemapPath)) {
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = readFileSync(sitemapPath, "utf8").replace(
    /<lastmod>[^<]*<\/lastmod>/g,
    `<lastmod>${today}</lastmod>`
  );
  writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`✓ sitemap lastmod → ${today}`);
}

console.log(
  changed
    ? `\nDone. ${changed} file(s) updated to ${target}`
    : `\nDone. Everything already points at ${target}`
);
