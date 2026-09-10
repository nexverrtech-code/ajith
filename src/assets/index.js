/**
 * Asset masters live in this folder; the site no longer imports them directly.
 *
 * Every image the browser downloads is generated into /public/media by
 * `npm run images` (scripts/optimize-images.mjs) and referenced by URL:
 *
 *   /media/work-<slug>-{480,768,1200}.{avif,webp}  project posters
 *   /media/herobg-{768,1440,1920}.webp             hero backdrop
 *   /media/icons/<name>.png                        service, tool and brand icons
 *   /og-image.png                                  1200×630 social card
 *
 * Importing the masters instead put ~11 MB of oversized PNGs through the
 * bundler — a 2.4 MB file to fill a 36 px icon slot. Replace a master here,
 * re-run `npm run images`, and the served variants update.
 *
 * The unused starter-template artwork (carrent, jobit, tripguide, the web-dev
 * tech icons, the placeholder company logos) is still on disk in this folder.
 */

export {};
