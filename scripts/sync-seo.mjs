#!/usr/bin/env node
/**
 * Propagates SITE.url from src/constants/site.js across every file that
 * hard-codes the domain: index.html, public/robots.txt, public/sitemap.xml
 * and public/llms.txt.
 *
 * Canonical tags, Open Graph URLs, JSON-LD @id values and the sitemap all
 * have to agree or search engines treat them as different pages — this keeps
 * the swap to one edit.
 *
 *   npm run seo:sync
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
const DOMAIN_RE = /https?:\/\/[a-z0-9.-]*storyrigstudio[a-z0-9.-]*(?::\d+)?/gi;

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
    console.log(`• ${rel} — already ${target}`);
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
