# Implementation Plan — Niki Lawn & Gardening

This document defines the target architecture and the exact build strategy for transforming the repository into a production-quality 3D gardening website. It is the contract between the audit (see `PROJECT_AUDIT.md`) and the phased work list (`TASKS.md`).

---

## 1. Target Architecture (at a glance)

- **Single-page marketing site.** One long-scroll experience with anchor navigation, plus a `/thanks` confirmation route and `/privacy`, `/terms` placeholder routes.
- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS + tokens.css for brand, three.js + @react-three/fiber + @react-three/drei for the hero 3D scene, framer-motion for restrained scroll/hover motion, lucide-react for icons, @fontsource for self-hosted fonts.
- **Deployment target:** static build (`dist/`) deployable to any static host.
- **Performance budget:** First contentful paint < 2.0s on a mid-range mobile over 4G; total JS shipped < 250 KB gzipped on first paint (3D bundle code-split and lazy).

---

## 2. Build Strategy (Phased)

Each phase has an explicit gate. The site must build cleanly between phases.

### Phase A — Foundation (~scaffolding)

- Initialize Vite + React + TS.
- Add Tailwind, PostCSS, autoprefixer.
- Add base `tsconfig`, `vite.config.ts`, ESLint, Prettier.
- Add `.gitignore`, `.editorconfig`.
- Wire `index.html` with proper meta, viewport, theme color, favicon placeholder.
- Add fonts via `@fontsource/fraunces` and `@fontsource/inter`.
- Smoke test: `npm run dev` shows a placeholder "Niki Lawn & Gardening" page.

**Gate:** `npm run build` passes; `npm run typecheck` passes.

### Phase B — Design System

- Define brand tokens in `src/styles/tokens.css`:
  - Colors: `--moss`, `--leaf`, `--forest`, `--bark`, `--soil`, `--cream`, `--stone`, plus accent `--bloom` (warm terracotta).
  - Type scale: 6 sizes with `clamp()` for fluid sizing.
  - Spacing: 4px base, 8/12/16/24/32/48/64/96/128.
  - Radii: 4 / 8 / 16 / 24.
  - Shadows: `--shadow-soft`, `--shadow-lift`.
  - Motion: `--ease-out-soft`, durations.
- Extend `tailwind.config.ts` to read tokens (CSS variable strategy).
- Build primitives in `src/components/primitives/`:
  - `Button` (primary / secondary / ghost; sizes sm/md/lg).
  - `Container` (max-w-7xl with responsive padding).
  - `SectionHeading` (eyebrow + title + lede).
  - `Card` (default + interactive variants).
  - `Tag` (chip for service categories / project tags).
- Build a `Storybook-lite` `/dev/styleguide` route that renders every primitive for visual review. (Internal only, not linked publicly.)

**Gate:** primitives render correctly across light backgrounds; type hierarchy is legible at 320 / 768 / 1280 widths.

### Phase C — Content Model

- Author content in `src/content/`:
  - `site.ts`: brand name, tagline, contact placeholders (clearly marked `__PLACEHOLDER__`).
  - `services.ts`: 6 services (Garden Design, Lawn Care, Hedge & Pruning, Seasonal Planting, Patio & Borders, Maintenance Plans).
  - `projects.ts`: 2 real entries built from the existing before/after photos + 2 clearly-labelled placeholder entries to round out the gallery.
  - `faqs.ts`: 8 honest, useful questions.
  - `testimonials.ts`: 3 placeholder testimonials, flagged in `site.ts` as `placeholderTestimonials: true` so the section can be hidden if the owner prefers.
- Copy tone: natural, friendly, expert, calm, specific. No marketing fluff, no buzzwords.

**Gate:** All copy is concrete (mentions plants, seasons, work types), free of lorem ipsum, and every placeholder is enumerated in the final deliverable section of `README.md`.

### Phase D — Page Sections

Order of implementation, top to bottom:

1. **Header** — logo wordmark + horizontal nav + primary CTA + animated mobile drawer.
2. **Hero** — headline, subheadline, dual CTA ("Request a quote" + "See our work"), trust strip (years, gardens cared for, service area), 3D garden scene on the right (desktop) or behind (mobile).
3. **Services** — 6 cards in a responsive grid with subtle hover lift and accent underline.
4. **Projects / Gallery** — before/after slider component using the real photos. Card structure: project title, garden type, location, short brief, slider.
5. **Process** — 4-step horizontal timeline (Consultation → Design & quote → Implementation → Ongoing care).
6. **Testimonials** — quote cards in a soft surface, with star rating glyphs and source labels (clearly marked as placeholder until real ones supplied).
7. **FAQ** — accessible accordion using `<details>` styled with Tailwind + a small JS enhancement for smooth height transitions.
8. **Contact / Quote form** — fields: name, email, phone (optional), postcode, garden size (radio: small / medium / large / unsure), services interested in (chip toggles), message. Submits to a configurable `VITE_FORM_ENDPOINT`. On success, redirect to `/thanks`.
9. **Footer** — short brand statement, contact placeholders, service links (anchors), socials placeholders, legal links, copyright.

**Gate:** every section renders correctly at 320 / 768 / 1024 / 1440 / 1920; no horizontal scroll; tab order is sensible.

### Phase E — 3D Scene

- Place a stylized low-poly garden corner: planter trough with three soft shrub clusters, a small ornamental tree with foliage made of layered translucent discs, a stone slab in front, a brick edge, soft gradient sky, soft contact shadow.
- Camera: gentle Lissajous-style idle motion (±2°), parallax tied to pointer/scroll position with strong damping.
- Lighting: hemisphere + warm key light + cool fill. Soft contact shadow via `<ContactShadows />`.
- Lazy-load the entire scene with `React.lazy` + `Suspense`, with a static poster image (rendered once via the scene itself and exported, or a hand-drawn SVG) as the fallback.
- `useReducedMotion()`: if true, render a static frame (no camera motion, no parallax).
- WebGL detection: if unavailable, render the same static frame.
- Pause animation when the canvas is offscreen (IntersectionObserver).

**Gate:** scene boots in < 800ms on a mid-range mobile after lazy-import; idle CPU < 5%; no jank during scroll.

### Phase F — Forms / Contact

- Build `QuoteForm` with controlled inputs, inline validation, accessible error summaries.
- Honeypot anti-spam field + `Math.min` time-to-submit check.
- Endpoint is read from `import.meta.env.VITE_FORM_ENDPOINT`. If unset, submission goes to a `mailto:` fallback so the site still functions without backend wiring.
- Success state navigates to `/thanks` with a clear confirmation.

**Gate:** form passes keyboard-only test; screen-reader announces errors; submit works in both endpoint-set and unset modes.

### Phase G — Performance

- Lazy-load 3D bundle + framer-motion features only where used.
- Convert the 4 project photos to WebP at 800w and 1600w; keep originals as a fallback. Use `<picture>` with `srcset`.
- Preconnect to font sources; preload Fraunces 700 and Inter 400.
- Inline a critical CSS shell for the hero text so it paints immediately.
- Lighthouse target on mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

**Gate:** Lighthouse mobile run hits all targets locally.

### Phase H — Accessibility

- Audit with `eslint-plugin-jsx-a11y` and manual keyboard pass.
- All interactive elements reachable in source order.
- Visible `:focus-visible` outlines using `--bloom` accent.
- Color contrast ≥ AA for all text on its surface.
- 3D canvas has `aria-label` and is marked `role="img"` with a meaningful alt-text description.
- Form errors use `aria-describedby` and `aria-invalid`.

**Gate:** axe DevTools shows zero critical/serious issues.

### Phase I — SEO

- `<title>` and `<meta name="description">` set from `site.ts`.
- Open Graph + Twitter Card tags.
- `schema.org/LocalBusiness` JSON-LD with placeholder address/phone (clearly marked).
- `sitemap.xml` and `robots.txt` generated at build.
- Canonical URL placeholder.

**Gate:** Rich Results Test validates the LocalBusiness JSON-LD shape (placeholders allowed).

### Phase J — Deployment Readiness

- Add `vercel.json` / `netlify.toml` / GitHub Pages workflow as needed — but only the format the owner will use. Default to Vercel-compatible static output and document Netlify equivalency in `README.md`.
- Add a `.env.example` listing `VITE_FORM_ENDPOINT`, `VITE_SITE_URL`, `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL`.
- Final pass: dead-code removal, unused-dep removal, prod build size report.

**Gate:** `npm run build && npm run preview` serves the production site cleanly with no console errors.

### Phase K — QA

- Manual desktop + mobile pass.
- Tab order, focus, motion, contrast, screen-reader spot-check.
- 404 handling.
- Form submit happy path + validation path.
- Reduced-motion preference test.
- Cross-browser smoke: Chromium, Firefox, Safari (or WebKit via Playwright).

**Gate:** QA checklist in `TASKS.md` is fully checked off.

---

## 3. Decisions Recorded

| Decision | Choice | Why |
|---|---|---|
| Bundler | Vite | Static one-pager; no SSR needed. |
| Framework | React + TS | R3F ecosystem; type-safety on copy/CTA. |
| Styling | Tailwind + tokens.css | Speed without templated feel, constrained palette. |
| 3D | r3f + drei | Declarative, supportable, well-trodden. |
| Animation | framer-motion (restrained) | Tasteful entrances; respects reduced-motion. |
| Routing | Anchor links on one page + 3 thin routes (`/thanks`, `/privacy`, `/terms`) | A local gardener site does not need a router tree. |
| Forms | Native form + configurable endpoint + mailto fallback | No vendor lock-in. |
| Hosting | Static, host-agnostic | Cheap, portable, fast. |

---

## 4. Open Questions (will use sensible defaults until owner confirms)

These are surfaced here so the owner can correct them after the audit:

1. **Brand name** — using "Niki Lawn & Gardening" (cleaned from the repo name). Confirm exact wording, capitalization, and whether an `&` or `and`.
2. **Service area** — placeholder will say "Serving [Town] and surrounding areas."
3. **Owner name** — placeholder "Niki" used in the about/contact copy.
4. **Phone / email / address** — left as `__PLACEHOLDER__` constants in `src/content/site.ts`. Listed prominently in `README.md` so they can't ship by accident.
5. **Real testimonials** — using clearly-marked placeholders. Section can be removed by flipping one flag in `site.ts`.
6. **Form delivery target** — defaulting to a `mailto:` fallback; Formspree / Resend / custom endpoint can be plugged in via `VITE_FORM_ENDPOINT`.
7. **Legal copy** — `/privacy` and `/terms` will be skeletons with a banner saying they are templates and require legal review.

---

## 5. Out of Scope

- CMS integration (Sanity, Contentful, etc.). All copy lives in typed files under `src/content/`.
- E-commerce (no product checkout).
- Multi-language. The site is single-locale (English) until the owner requests otherwise.
- A blog / news section. Can be added later as a separate route group; not part of the launch.
- Server-side analytics. The site can be paired with Plausible/GA at deploy time; we will not embed a tracker by default.

---

## 6. Definition of Done

The project is "done" when:

1. `npm run build` produces a clean static `dist/`.
2. Lighthouse mobile is ≥ 90/95/95/95 (Perf/A11y/BP/SEO).
3. Every section listed in the brief renders correctly at 320 / 768 / 1024 / 1440 / 1920.
4. The 3D scene loads, idles smoothly, and falls back gracefully.
5. The form validates, submits (or `mailto`s), and shows a confirmation.
6. `TASKS.md` has every item ticked or explicitly deferred with a reason.
7. `README.md` contains a launch checklist of every placeholder the owner must replace before going live.
