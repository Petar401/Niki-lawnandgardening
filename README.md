# Niki Lawn &amp; Gardening

Marketing site for a friendly, expert local garden design, lawn care, and seasonal-maintenance service.

This repository is being built out in phases — see `PROJECT_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, and `TASKS.md` for the strategy and progress.

---

## Tech stack

- Vite 5
- React 18 + TypeScript (strict)
- Tailwind CSS 3 + a brand `tokens.css` layer
- three.js + @react-three/fiber + @react-three/drei (hero 3D scene; added in Phase 5)
- framer-motion (restrained; added where needed)
- self-hosted fonts via `@fontsource/fraunces` (display) + `@fontsource/inter` (UI)

## Requirements

- Node `>= 22` (see `.nvmrc`)
- npm `>= 10`

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command            | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Vite dev server with HMR                           |
| `npm run build`    | Type-check then produce a static `dist/` bundle    |
| `npm run preview`  | Serve the production build locally                 |
| `npm run typecheck`| Run `tsc -b --noEmit`                              |
| `npm run lint`     | Run ESLint (no warnings allowed)                   |
| `npm run format`   | Format all source with Prettier                    |

## Project layout

```
src/
  main.tsx            # entry
  App.tsx             # page composition
  styles/
    tokens.css        # brand tokens (colors, radii, shadows, motion)
    globals.css       # Tailwind layers + base resets
  components/         # primitives, nav, sections, three, forms (added in later phases)
  content/            # typed content modules (added in Phase 4)
  hooks/
  lib/
public/
  favicon.svg
  images/             # project gallery photos (added in Phase 6)
```

## Build &amp; deploy

```bash
npm run build
```

Produces a fully static `dist/` directory deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host. No server runtime is required.

### Vercel

Out of the box. The `vercel.json` at the repo root configures:

- SPA fallback for in-app routes (`/thanks`, `/privacy`, `/terms`, and a friendly `/404`) so deep links work
- Long-lived `Cache-Control: max-age=31536000, immutable` for fingerprinted assets, fonts, and images
- Short-lived `max-age=0, must-revalidate` for `index.html`, `robots.txt`, `sitemap.xml` so deploys are picked up immediately

Set the env vars from `.env.example` in the Vercel project settings panel.

### Netlify / Cloudflare Pages

The `public/_redirects` and `public/_headers` files do the same things in Netlify's format (Cloudflare Pages reads the same files). Both ship into `dist/` automatically. Set env vars in the Netlify / Cloudflare site settings.

### GitHub Pages or generic static host

Either configure your host to fall back to `index.html` for unknown paths, or accept that direct links to `/thanks`, `/privacy`, `/terms` will 404 until reached via the in-app router. The home page works either way.

### Environment variables

Copy `.env.example` to `.env.local` for development and configure these in your host's environment-variables panel for production:

| Variable | Purpose |
| --- | --- |
| `VITE_FORM_ENDPOINT` | Where the quote form POSTs JSON. Empty → `mailto:` fallback. |
| `VITE_SITE_URL` | Canonical site URL, used in the LocalBusiness JSON-LD `url` field. |
| `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL` | Optional duplicates of the values in `src/content/site.ts`. |

## Phase status

All 12 phases complete. See `TASKS.md` for the full ticked-off checklist:

1. Audit
2. Foundation (Vite + React + TS + Tailwind)
3. Design system (tokens + primitives + internal styleguide)
4. Content model (typed modules + placeholder system)
5. 3D scene (R3F garden + lazy loading + poster fallback)
6. Page sections (header, hero, services, projects, process, testimonials, FAQ, contact, footer)
7. Forms (validation, anti-spam, endpoint + mailto, /thanks /privacy /terms /404)
8. Performance (AVIF/WebP variants, font subset prune, picture/srcset)
9. Accessibility (axe-clean, skip link, focus trap, AA contrast across every surface)
10. SEO (meta, OG, Twitter, LocalBusiness JSON-LD, robots, sitemap, per-route titles)
11. Deployment readiness (Vercel + Netlify + Cloudflare configs, dead-dep sweep)
12. QA (viewport sweep, reduced motion, slow-3G, form paths, 404, console-clean)

## Bundle profile (gzip, after Phase 11 cleanup)

| Chunk | Size | When loaded |
| --- | --- | --- |
| `index.js` | 64 KB | First paint |
| `index.css` | 6 KB | First paint |
| Lazy route chunks (`/thanks`, `/privacy`, `/terms`, `/404`) | 0.5–1.3 KB each | On navigation |
| `GardenScene.js` (three + r3f + drei) | 222 KB | Hero in viewport |
| Project photos (AVIF 800w mobile / 1200w desktop) | ~120–280 KB each | Projects in viewport |
| Self-hosted fonts (latin only) | ~30 KB woff2 / weight | Browser-selected |

First paint ≈ 70 KB gzip; everything else is lazy.

## How the quote form sends enquiries

The form chooses a delivery path at runtime:

1. If `VITE_FORM_ENDPOINT` is set, the form POSTs JSON to that URL and then redirects to `/thanks` on success. Compatible with Formspree, Resend, Netlify Forms, your own endpoint, or anything that accepts a JSON body.
2. Otherwise, if `site.contact.email` has been replaced (it ships as `__PLACEHOLDER__`), the form opens the visitor's mail client with everything pre-filled (`mailto:` fallback).
3. If neither is configured, the form validates as normal and shows a friendly "not yet configured — please call or email us directly" message instead of failing silently.

## Replacing the project photos

The project photos in `public/images/projects/` are real customer work but the original JPEGs from the owner had "BEFORE" / "AFTER" overlay text burned into the top and bottom edges. We cropped them with `scripts/crop-project-photos.mjs`. If you replace any of these files with a new photo that also has burned-in labels, drop the new file in place and re-run:

```bash
node scripts/crop-project-photos.mjs
```

If your replacement photos are clean (no overlays), skip the cropping script.

After cropping (or if you supply already-clean photos), regenerate the AVIF + WebP variants used by the slider:

```bash
node scripts/build-image-variants.mjs
```

That produces `<stem>-800.avif`, `<stem>-800.webp`, `<stem>-1200.avif`, `<stem>-1200.webp` next to each `<stem>.jpg`. The site picks the smallest format the browser supports at the right size automatically.

## Launch checklist — content the owner must replace before going live

The site ships with clearly-marked placeholders in `src/content/site.ts`. Every value below must be replaced before the site goes to a live domain.

| Where | Field | Default |
| --- | --- | --- |
| `src/content/site.ts` | `contact.phone` | `__PLACEHOLDER__` — real customer-facing phone |
| `src/content/site.ts` | `contact.phoneHref` | `__PLACEHOLDER__` — `tel:+...` URL |
| `src/content/site.ts` | `contact.email` | `__PLACEHOLDER__` — real customer-facing email |
| `src/content/site.ts` | `contact.serviceArea` | `__PLACEHOLDER__` — e.g. `"Bath and surrounding villages"` |
| `src/content/site.ts` | `contact.addressLine` | `__PLACEHOLDER__` — optional postal address line |
| `src/content/site.ts` | `social.instagram` / `social.facebook` | `__PLACEHOLDER__` — full URLs or remove from footer |
| `src/content/site.ts` | `trust[].value` | `12+` / `180+` / `5★` — confirm or correct |
| `src/content/site.ts` | `flags.testimonialsAreIllustrative` | `true` — set to `false` once real, attributable testimonials replace `src/content/testimonials.ts` |
| `src/content/site.ts` | `flags.showTestimonials` | `true` — set to `false` to hide the testimonials section entirely |
| `src/content/testimonials.ts` | all entries | Three illustrative quotes — replace with real customer quotes (with names &amp; permission) |
| `src/content/projects.ts` | `lawn-restoration-illustrative`, `planting-plan-illustrative` | Two illustrative entries — replace with real project pairs and photos when available |
| `.env` (production) | `VITE_FORM_ENDPOINT` | Empty falls back to a `mailto:` link; set to a real form endpoint (Formspree, Resend, your own) before launch |
| `.env` (production) | `VITE_SITE_URL` | Canonical URL once a domain is chosen — appears in the JSON-LD `url` field |
| `.env` (production) | `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL` | Optional duplicates for SEO &amp; structured data |
| `public/sitemap.xml` | `<loc>` values | Replace each relative path with the absolute URL of your deployed site |
| `public/og-image.png` | (optional) | Regenerate with `node scripts/build-og-image.mjs` after editing `scripts/og-image.svg`; the default uses brand colours and the tagline |
