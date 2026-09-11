# Ajith S — Portfolio

Personal portfolio for **Ajith S** — 3D animation, CGI visual effects, virtual
production and real-time Unreal Engine cinematics, from Chennai.

React 18 · Vite 4 · Tailwind CSS 3 · three.js / react-three-fiber · Framer Motion

---

## Quick start

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on `:5173`, exposed on the LAN so you can open it on a real phone |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` on `:4173` |
| `npm run images` | Regenerate every served image variant into `public/media` |
| `npm run models` | Re-optimise the glTF textures in `public/desktop_pc` and `public/planet` |
| `npm run brand` | Regenerate the monogram, favicon, PWA icons and Open Graph card |
| `npm run seo:sync` | Push `SITE.url` out to every file that hard-codes the domain |
| `npm run seo:check` | Pre-deploy SEO/GEO audit — fails on a broken canonical, invalid JSON-LD or a sitemap on the wrong origin |

---

## Before you deploy

1. **Set the domain.** Edit `url` in [`src/constants/site.js`](src/constants/site.js),
   then run `npm run seo:sync`. That rewrites the canonical tag, Open Graph URLs,
   JSON-LD `@id`s, `robots.txt`, `sitemap.xml` and `llms.txt` in one pass — they all
   have to agree or search engines treat them as different pages.
2. **Run `npm run seo:check`.** It should report 0 failures.
3. **Submit `sitemap.xml`** in Google Search Console and Bing Webmaster Tools.

---

## Where things live

```
index.html                 All SEO: meta, Open Graph, geo tags, JSON-LD, noscript fallback
public/
  robots.txt               Crawl rules, incl. explicit allows for AI crawlers
  sitemap.xml              With image + video extensions for the showreel pieces
  llms.txt                 Structured brand summary for generative engines (GEO)
  site.webmanifest         PWA / installable metadata
  media/                   Every image the browser actually downloads (generated)
src/
  constants/site.js        Identity, domain, location, contact, EmailJS keys
  constants/index.js       Nav, stats, services, tools, projects, experience
  components/              One file per section, plus the shared chrome
  components/canvas/       The four WebGL scenes (lazy-loaded)
  hooks/                   Media queries, scroll, capability detection, count-up
  utils/motion.js          Framer Motion variants
scripts/                   Image/model optimisation and the SEO sync/check tools
model-masters/             Untouched glTF originals (not built, keep in the repo)
```

---

## Content edits

- **Projects** — `projects` in `src/constants/index.js`. Each entry needs a `slug`
  matching a poster in `public/media`. To add one: drop the master PNG in
  `src/assets/`, add it to `POSTERS` in `scripts/optimize-images.mjs`, run
  `npm run images`, then add the project with that slug.
- **Services, tools, experience, stats** — all in `src/constants/index.js`.
- **Name, tagline, domain, socials** — `src/constants/site.js`. It is the only place
  the identity is written; the navbar, footer, meta tags and `aria-label`s all read
  from it.
- **Brand artwork** — `scripts/make-brand.mjs` draws the "AS" monogram and the social
  card from one vector source and writes `brand.png`, `brand-logo.png`, `favicon.png`,
  `apple-touch-icon.png` and `og-image.png`. Edit the constants at the top of that
  file, then `npm run brand`.
- **Contact form** — EmailJS, sent with `send()` against the existing template
  (`{{from_name}}`, `{{from_email}}`, `{{message}}`). The project-type dropdown is
  folded into the message body so the template needs no changes.

---

## How the performance work holds together

The site is a client-rendered SPA carrying a ~830 KB WebGL bundle, so three rules keep
it fast. All three are easy to undo by accident:

**1. Nothing may statically import three.js.**
Every canvas sits behind `React.lazy()`, so Rollup keeps three.js in an async chunk
that only downloads when a device actually renders a scene. Two things have already
broken this once:

- Re-exporting `CanvasLoader` from `src/components/index.js` (it imports `drei`).
  That barrel now deliberately excludes it and the canvases.
- A hand-written `manualChunks` that grouped node_modules by path substring. It split
  the WebGL graph across two chunks that imported each other, forcing the whole
  bundle into the entry.

After touching either, check:

```bash
grep modulepreload dist/index.html
```

The ~800 KB chunk must **not** be listed. A phone should pull roughly **110 KB of JS**.

**2. Images are served from `public/media`, never imported from `src/assets`.**
The masters are 1–3.5 MB each. `npm run images` emits AVIF/WebP at 480/768/1200 and
256 px icons; a phone pulls ~20 KB per poster instead of 2.3 MB. `src/assets/index.js`
exists only to document this.

**3. The glTF scenes are pre-optimised.** `npm run models` caps every texture at
1024 px and minifies the `.gltf` JSON, taking the two scenes from 20 MB to 9.5 MB.
Originals live in `/model-masters` and the script always reads from there, so
re-running never recompresses an already-compressed file. It also keeps a candidate
only when it is genuinely smaller — several of these PNGs are already indexed-colour
and a naive re-encode inflates them. Keep `/model-masters`: without it the script
would treat the compressed files as the new originals.

`useCanRender3D()` decides what a device gets: phones, reduced-motion users, low-core
machines, data-saver and anything without WebGL get static fallbacks — a still hero
image, flat tool tiles, a CSS starfield and a CSS globe.

---

## Accessibility

- `MotionConfig reducedMotion="user"` in `App.jsx` makes the OS setting govern Framer
  Motion, not just CSS. Without it every JS-driven reveal ignores the preference.
- Skip link, focus-visible rings, `aria-expanded`/`aria-controls` on the nav,
  a labelled modal dialog, and 44 px touch targets.
- The 3D scenes carry `role="img"` labels, and the tool marquee and tech balls have
  screen-reader text equivalents.

---

## SEO / GEO notes

Because this renders client-side, the `<noscript>` block in `index.html` mirrors the
page's substance in plain HTML. Google executes JavaScript; most AI answer engines
do not, so that block plus `llms.txt` is what they actually read. Keep it in sync when
services or work change.

Structured data is one `@graph` with `Person` as the primary entity, plus
`ProfessionalService`, `ImageObject`, `WebSite`, `WebPage`, `BreadcrumbList` and an
`ItemList` of `VideoObject`s, cross-referenced by `@id`.

---

## Known constraints

- Desktop opens **11 WebGL contexts** (1 hero + 8 tool balls + globe + starfield)
  against a browser limit near 16. Adding more canvases risks blank ones; add tools to
  the flat-tile grid instead.
- `testimonials` in `src/constants/index.js` is intentionally empty and the
  `Feedbacks` section is not mounted — add real client quotes before rendering it.
- Unused starter-template artwork still sits in `src/assets/` but is no longer bundled.

---

Originally built on the [JavaScript Mastery 3D portfolio template](https://github.com/adrianhajdin/project_3D_developer_portfolio).
