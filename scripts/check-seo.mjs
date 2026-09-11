#!/usr/bin/env node
/**
 * Pre-deploy SEO / GEO sanity check.
 *
 * Verifies the things that silently break a launch: a canonical that doesn't
 * match the sitemap, malformed JSON-LD, a missing OG image, crawl files that
 * still point at a previous domain.
 *
 *   npm run seo:check
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");

let pass = 0;
let warn = 0;
let fail = 0;

const ok = (m) => {
  pass += 1;
  console.log(`  [32m✓[0m ${m}`);
};
const caution = (m) => {
  warn += 1;
  console.log(`  [33m![0m ${m}`);
};
const bad = (m) => {
  fail += 1;
  console.log(`  [31m✗[0m ${m}`);
};
const section = (m) => console.log(`\n[1m${m}[0m`);

/* ---------------------------------------------------------------- */
section("index.html — head");

const html = read("index.html");
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');

const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "");
if (!title) bad("no <title>");
else if (title.length > 60) caution(`title is ${title.length} chars (Google truncates near 60)`);
else if (title.length < 25) caution(`title is only ${title.length} chars — room for more`);
else ok(`title ${title.length} chars`);

const desc = decode(
  (html.match(/name="description"[\s\S]*?content="([\s\S]*?)"/) || [])[1] || ""
)
  .replace(/\s+/g, " ")
  .trim();
if (!desc) bad("no meta description");
else if (desc.length > 165) caution(`description is ${desc.length} chars (aim for ≤160)`);
else if (desc.length < 70) caution(`description is only ${desc.length} chars`);
else ok(`description ${desc.length} chars`);

const canonical = (html.match(/rel="canonical"\s+href="([^"]+)"/) || [])[1];
if (!canonical) bad("no canonical link");
else ok(`canonical ${canonical}`);

for (const tag of [
  "og:title",
  "og:description",
  "og:image",
  "og:url",
  "og:type",
  "twitter:card",
  "twitter:image",
]) {
  const present = new RegExp(`(property|name)="${tag}"`).test(html);
  if (present) ok(`${tag} present`);
  else bad(`${tag} missing`);
}

for (const tag of ["geo.region", "geo.placename", "geo.position", "ICBM"]) {
  if (html.includes(`name="${tag}"`)) ok(`geo tag ${tag}`);
  else caution(`geo tag ${tag} missing`);
}

if (/<html[^>]+lang="[^"]+"/.test(html)) ok("html lang set");
else bad("html lang missing");

if (html.includes("<noscript>")) ok("noscript crawler fallback present");
else caution("no noscript fallback — AI crawlers that don't run JS will see an empty page");

/* ---------------------------------------------------------------- */
section("Structured data");

const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let graph = [];
if (!ldMatch) {
  bad("no JSON-LD block");
} else {
  try {
    const parsed = JSON.parse(ldMatch[1]);
    graph = parsed["@graph"] || [parsed];
    ok(`JSON-LD parses — ${graph.length} entities`);
  } catch (e) {
    bad(`JSON-LD is invalid JSON: ${e.message}`);
  }
}

const types = graph.flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]));
for (const t of ["Person", "ProfessionalService", "WebSite", "WebPage", "BreadcrumbList"]) {
  if (types.includes(t)) ok(`schema ${t}`);
  else caution(`schema ${t} missing`);
}

/* ---------------------------------------------------------------- */
section("Crawl files");

for (const [file, checks] of [
  ["public/robots.txt", ["Sitemap:", "GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]],
  ["public/sitemap.xml", ["<urlset", "<loc>"]],
  ["public/llms.txt", ["# Ajith S", "## Services"]],
  ["public/site.webmanifest", ["icons", "theme_color"]],
]) {
  if (!existsSync(join(root, file))) {
    bad(`${file} missing`);
    continue;
  }
  const body = read(file);
  const absent = checks.filter((c) => !body.includes(c));
  if (absent.length === 0) ok(`${file}`);
  else caution(`${file} — missing ${absent.join(", ")}`);
}

for (const asset of ["public/og-image.png", "public/favicon.png", "public/apple-touch-icon.png"]) {
  if (existsSync(join(root, asset))) ok(asset);
  else bad(`${asset} missing`);
}

/* Canonical, sitemap and manifest must agree on one origin. */
if (canonical && existsSync(join(root, "public/sitemap.xml"))) {
  const origin = new URL(canonical).origin;
  const sitemap = read("public/sitemap.xml");
  if (sitemap.includes(origin)) ok("sitemap origin matches canonical");
  else bad(`sitemap origin differs from canonical (${origin}) — run npm run seo:sync`);
}

/* ---------------------------------------------------------------- */
section("Accessibility signals");

const jsxFiles = ["Hero", "About", "Services", "Works", "Contact", "Footer"].map(
  (n) => `src/components/${n}.jsx`
);
let imgs = 0;
let noAlt = 0;
for (const f of jsxFiles) {
  if (!existsSync(join(root, f))) continue;
  const body = read(f);
  for (const tag of body.match(/<img[\s\S]*?\/>/g) || []) {
    imgs += 1;
    if (!/\balt=/.test(tag)) noAlt += 1;
  }
}
if (noAlt === 0) ok(`all ${imgs} <img> tags have alt attributes`);
else bad(`${noAlt} of ${imgs} <img> tags missing alt`);

/* ---------------------------------------------------------------- */
console.log(
  `\n[1mResult:[0m [32m${pass} passed[0m · [33m${warn} warnings[0m · [31m${fail} failures[0m\n`
);
process.exit(fail > 0 ? 1 : 0);
