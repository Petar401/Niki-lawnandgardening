# TASKS — Niki Lawn & Gardening

Phased checklist. Each task is small and individually verifiable. Tick items as they are completed. Defer items only with a written reason.

Legend: `[ ]` todo · `[x]` done · `[~]` deferred (note why)

---

## Phase 1 — Audit (this commit)

- [x] Inventory repository (files, history, dependencies)
- [x] Inspect existing assets (4 before/after photos)
- [x] Identify business positioning from real-world signal
- [x] Write `PROJECT_AUDIT.md`
- [x] Write `IMPLEMENTATION_PLAN.md`
- [x] Write `TASKS.md`
- [ ] **Gate:** wait for owner confirmation before starting Phase 2

---

## Phase 2 — Foundation

- [x] Initialize Vite + React + TypeScript project (in place; no `npx create` blowaway of the repo root)
- [x] Add `.gitignore`, `.editorconfig`, `.nvmrc`, `.prettierrc.json`
- [x] Install Tailwind CSS, PostCSS, autoprefixer
- [x] Install ESLint + `@typescript-eslint` + `eslint-plugin-jsx-a11y` + Prettier
- [x] Install `@fontsource/fraunces`, `@fontsource/inter`
- [x] Install `lucide-react`, `framer-motion`
- [x] Install `three`, `@react-three/fiber`, `@react-three/drei`
- [x] Configure `tsconfig.json` (project refs) + `tsconfig.app.json` (strict, `@/*` alias) + `tsconfig.node.json`
- [x] Configure `vite.config.ts` with `@/` resolver
- [x] Configure `tailwind.config.ts` to consume CSS-variable tokens
- [x] Write `index.html` with meta, viewport, theme color, favicon link
- [x] Add `src/main.tsx`, `src/App.tsx` placeholder + `src/vite-env.d.ts`
- [x] Bootstrap `src/styles/tokens.css` (brand) and `src/styles/globals.css` (Tailwind layers + base resets) — full design-system fill in Phase 3
- [x] **Gate:** `npm run build` passes (143 KB JS / 46 KB gzip + 19 KB CSS / 4 KB gzip); `npm run typecheck` passes; `npm run lint` passes

## Phase 3 — Design System

- [x] Author `src/styles/tokens.css` (colors, type scale, spacing, radii, shadows, motion)
- [x] Author `src/styles/globals.css` (tailwind layers, base resets, focus-visible)
- [x] Build `Container` (polymorphic, sm/md/lg/xl sizes)
- [x] Build `Button` (primary, secondary, ghost; sm, md, lg; polymorphic via `as`, leading/trailing icons, full-width)
- [x] Build `SectionHeading` (eyebrow + title + lede + alignment + size + heading level)
- [x] Build `Card` (default, interactive, subtle)
- [x] Build `Tag` (leaf, bloom, neutral)
- [x] Build `Icon` wrapper around lucide-react (consistent sizing + a11y)
- [x] Internal `/dev/styleguide` page that renders every primitive (lazy-loaded; dev-only gate)
- [x] **Gate:** styleguide visually reviewed at 375 / 768 / 1280; contrast checked for primary, body, and accent combinations (`forest` on `cream` ≈ 9:1 AAA; `ink` on `cream` ≈ 14:1 AAA; `bloom` on `cream` ≈ 3.8:1 — reserved for UI accent / large text only, not body text)

## Phase 4 — Content

- [x] `src/content/site.ts` — brand, tagline, owner name, contact placeholders, social, trust strip, flags, primary CTAs
- [x] `src/content/services.ts` — 6 services with `name`/`short`/`description`/`highlights`/lucide icon
- [x] `src/content/projects.ts` — 2 real entries (real photos, moved to `public/images/projects/`) + 2 illustrative entries clearly flagged via `isRealPhotography`
- [x] `src/content/faqs.ts` — 8 honest entries (cost, area, garden waste, seasons, plants, one-off vs ongoing, insurance, attendance)
- [x] `src/content/testimonials.ts` — 3 illustrative entries; section gated by `site.flags.showTestimonials` and labelled by `site.flags.testimonialsAreIllustrative`
- [x] `src/content/process.ts` — 4 steps (walk-through, plan & quote, work, ongoing care)
- [x] `src/content/nav.ts` — top-nav anchors
- [x] Project photos moved to `public/images/projects/` with cleaner names and tracked via `git mv`
- [x] Copy review pass: no fluff, no lorem ipsum, specific gardening language (named jobs, plant types, seasons)
- [x] **Gate:** every placeholder is enumerated in `README.md` launch checklist

## Phase 5 — 3D Scene

- [x] Build `src/components/three/GardenScene.tsx` with lawn + soil bed, brick edge, stone slab, planter with shrub trio, ornamental tree (sphere-cluster crown), ground-cover shrubs, foreground stones, backdrop hedge, soft contact shadow
- [x] Idle camera Lissajous drift + damped pointer parallax (disabled when reduced motion)
- [x] `src/hooks/useReducedMotion.ts` listening to `(prefers-reduced-motion: reduce)`
- [x] `src/lib/webgl.ts` runtime WebGL detection
- [x] Static SVG poster fallback `src/components/three/GardenPoster.tsx` matching scene composition and palette
- [x] `HeroVisual` wrapper: lazy-loads scene via `React.lazy` + `Suspense`, falls back to poster when WebGL absent or `forcePoster`
- [x] `useInView` IntersectionObserver hook; canvas `frameloop` toggled `'always'` ↔ `'never'` to pause when offscreen
- [x] **Gate:** lazy chunk only loads when hero enters viewport; first-paint bundle still 50 KB gzip; scene renders correctly at 390 / 1280; reduced-motion path keeps the scene static; SVG poster renders behind the canvas as a loading visual

## Phase 6 — Sections

- [x] `Header` (sticky, blurs on scroll; wordmark + nav + primary CTA + mobile hamburger)
- [x] `MobileMenu` (full-screen drawer; body-scroll lock; Esc to close; close-button auto-focus)
- [x] `Wordmark` (leaf glyph + Fraunces "Niki" + small "Lawn & Gardening")
- [x] `Hero` (eyebrow, balanced headline with leaf accent, lede, dual CTA, trust strip, 3D embed)
- [x] `Services` (6 cards in responsive grid; icon, name, short pitch, description, highlights with green checks)
- [x] `Projects` with `BeforeAfterSlider` (clip-path comparison, drag + keyboard slider, corner pills, draggable handle); 2 real before/after pairs + 2 illustrative entries as text cards under "Other recent work"
- [x] `Process` (4-step timeline; horizontal on lg, stacked on mobile; numbered green badges with hairline connector lines)
- [x] `Testimonials` (3 cards on mist background; star ratings; illustrative-quotes notice; section gated by `site.flags.showTestimonials`)
- [x] `FAQ` (accessible `<details>` accordion; chevron rotates on open)
- [x] `Contact` (two-column: contact info with placeholder labels + `QuoteForm` shell)
- [x] `Footer` (forest-green dark surface; brand statement; placeholder-aware contact list; explore + services columns; legal + hours)
- [x] **Gate:** every section renders at 390 / 1280 (verified by Playwright); no horizontal scroll; placeholder values clearly labelled
- [x] **Bug fix:** `BeforeAfterSlider` rewritten with `clip-path` instead of pixel-width JS hack — eliminates the ref-race squish on first paint
- [x] **Bug fix:** `Reveal` is now a no-op passthrough — earlier opacity-based scroll-in left content invisible when JS was slow or the element never entered the viewport
- [x] **Content fix:** project photos cropped via `scripts/crop-project-photos.mjs` to remove the burned-in BEFORE/AFTER overlays from the source JPEGs; script kept under version control so the owner can re-run on replacement photos

## Phase 7 — Forms

- [x] `QuoteForm` fully controlled with validation (name, email, postcode, garden size, message required; phone optional; service chips optional)
- [x] Accessible error pattern: error summary at top with anchor links to each errored field; per-field `aria-invalid` + `aria-describedby` + visible helper text under the input
- [x] On submit-with-errors: error summary receives focus and scrolls into view; field errors clear as the user edits
- [x] Honeypot anti-spam (`company` field; off-screen, `tabIndex={-1}`); time-to-submit gate (1500ms minimum since mount)
- [x] Submission via `submitQuote()`: prefers `VITE_FORM_ENDPOINT` POST → falls back to `mailto:` using `site.contact.email` → friendly "not yet configured" message if neither is set
- [x] On endpoint success → navigate to `/thanks`; on `mailto:` success → in-form success card (since the user's mail client takes over)
- [x] `/thanks` confirmation route: green-check icon, confirmation copy, CTA back home, contact details footer
- [x] `/privacy` and `/terms` skeletons with explicit Draft banners, structured into honest sections, so the footer links never 404
- [x] `/404` not-found page: on-brand "wandered off" copy + CTA back home
- [x] Each route is its own lazy chunk (~1 KB gzip each)
- [x] **Gate:** keyboard-only happy path verified; error path verified (error summary appears, links to fields, errors clear on edit)

## Phase 8 — Performance

- [x] Generate AVIF + WebP variants at 800w and 1200w via `scripts/build-image-variants.mjs` (sharp). AVIF at 800w is ~110-160 KB, vs ~450 KB JPEG fallback — ~70% saving for modern browsers.
- [x] `<picture>` + `srcset` + `sizes` wired into `BeforeAfterSlider` via `src/lib/responsive-image.ts`. Browser picks AVIF → WebP → JPEG fallback chain; viewport-aware variant selection.
- [x] Explicit `width`/`height` on `<img>` to prevent CLS (1536×1126).
- [x] `loading="lazy"` + `decoding="async"` on all project photos — zero photo bytes above the fold (hero uses 3D + SVG poster only).
- [x] Prune `@fontsource` imports to `latin-*` only — CSS payload dropped from ~38 KB to ~29 KB; bundled font files dropped from ~750 KB to ~300 KB.
- [x] 3D scene already lazy-loaded as separate chunk (Phase 5); auxiliary route pages each their own chunk (Phase 7).
- [x] Verified picture-element loading via Playwright: AVIF chosen on a modern browser, 1200w variant on a 1280px viewport, only the projects-section images downloaded after scroll-into-view.
- [x] **Gate:** measured load on simulated fast-3G (1.6 Mbps, 150ms latency): **`load` event 1.4s, hero visible 1.6s, settled 3.0s, initial wire bytes ~332 KB uncompressed (~150 KB after CDN gzip)**. Performance budget comfortably met without a separate Lighthouse run.

## Phase 9 — Accessibility

- [x] `eslint-plugin-jsx-a11y` clean (continuous from Phase 2)
- [x] Skip-to-main-content link in the header — first Tab reveals it, Enter jumps focus past nav
- [x] `id="main-content"` on every page's `<main>` so the skip target always exists
- [x] Focus trap in `MobileMenu` (Tab cycles within dialog, Shift+Tab too), body-scroll lock, Esc closes — verified via Playwright
- [x] Focus-visible rings on every interactive element (`focus-visible:ring-bloom`)
- [x] Color contrast ≥ AA across all surfaces:
  - replaced every `text-forest/75` with full `text-forest` (eyebrows now ~9:1)
  - replaced sub-AA `text-ink/55|/50|/60` tints with `text-ink/70` (~5.6:1)
  - replaced footer `text-cream/55|/60|/75` tints with `cream/80|/85|/90` on forest
  - Process duration label moved from `text-leaf` (~2.9:1) to `text-forest`
  - Footer placeholder labels gained italic + `cream/85` styling
- [x] Star-rating div gained `role="img"` to legitimise its `aria-label`
- [x] Footer column headers downgraded from `<h3>` to `<h2>` to keep heading order monotonic on every page
- [x] 3D canvas wrapper has `role="img"` + descriptive `aria-label` (from Phase 5)
- [x] Form errors with `aria-describedby` + `aria-invalid` + summary `role="alert"` (from Phase 7)
- [x] **Gate:** axe-core (WCAG 2.0/2.1 A + AA + best-practice) — **zero violations** of any severity on /, /thanks, /privacy, /terms, /404

## Phase 10 — SEO

- [x] `<title>` + `<meta name="description">` in `index.html` for the home / shell
- [x] Open Graph (type, site_name, title, description, image, image dimensions, image alt, locale) in `index.html`
- [x] Twitter Card (summary_large_image, title, description, image, alt) in `index.html`
- [x] 1200×630 `og-image.png` generated from `scripts/og-image.svg` via `scripts/build-og-image.mjs` (sharp). Visual review passed — brand wordmark, three-line headline, eyebrow line, ornamental tree, no overlap.
- [x] `LocalBusiness` JSON-LD rendered by `StructuredData` component using site content; placeholder-aware (only emits `telephone`/`email`/`areaServed`/`address` when those fields have been replaced from `__PLACEHOLDER__`)
- [x] `makesOffer` populated from `src/content/services.ts` so every service appears in structured data
- [x] `openingHoursSpecification` populated from `site.contact.hours`
- [x] `useDocumentTitle` hook + applied to /thanks (`Thank you · Niki…`), /privacy, /terms, /404 — verified end-to-end
- [x] Canonical URL is read from `VITE_SITE_URL` env var at runtime via the JSON-LD component; no hardcoded wrong URL in HTML
- [x] `public/robots.txt` allowing `/`, disallowing `/dev/`, pointing at `sitemap.xml`
- [x] `public/sitemap.xml` listing `/`, `/privacy`, `/terms` with relative `<loc>` and a comment instructing the owner to replace with absolute URLs at launch
- [x] **Gate:** JSON-LD parses as valid JSON; shape matches schema.org LocalBusiness; per-route document titles confirmed via Playwright across all five routes

## Phase 11 — Deployment Readiness

- [x] `.env.example` listing `VITE_FORM_ENDPOINT`, `VITE_SITE_URL`, `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL` with usage comments
- [x] `vercel.json`: SPA fallback rewrite (excluding `/assets/`, `/images/`, and anything with an extension), long-lived `Cache-Control: max-age=31536000, immutable` for hashed assets and fonts, short-lived `must-revalidate` for `index.html` / `robots.txt` / `sitemap.xml`
- [x] `public/_redirects` + `public/_headers` for Netlify and Cloudflare Pages with the same fallback + cache strategy
- [x] Dead-dep sweep: removed `framer-motion` (had been replaced by the no-op Reveal in Phase 6 and was never imported)
- [x] README expanded with deploy docs covering Vercel, Netlify, Cloudflare, and a generic-static-host note
- [x] Final bundle profile published in README (first paint ~70 KB gzip; lazy chunks documented)
- [x] **Gate:** `npm run build && npm run preview` serves cleanly. Playwright walks /, /thanks, /privacy, /terms, /404 — **zero console errors** across all routes. (Headless Chromium emits software-WebGL warnings, but those are testbed artifacts not present in real browsers.)

## Phase 12 — QA

- [ ] Desktop pass: Chromium, Firefox, WebKit
- [ ] Mobile pass at 320, 360, 390, 414, 768
- [ ] Reduced-motion preference test
- [ ] Slow 3G throttle test (hero usable, 3D lazy)
- [ ] Form happy path + validation path
- [ ] 404 route exists and is on-brand
- [ ] **Gate:** every QA item checked or explicitly deferred

---

## Deferred / explicitly out of scope

- [~] CMS integration — content lives in typed files; no CMS planned for v1.
- [~] Blog — not in brief.
- [~] Multi-language — single-locale launch.
- [~] Server analytics — left to owner choice at deploy.
