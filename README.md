# Niki Lawn & Gardening — 3D Living Garden

An immersive Three.js portfolio for Niki Lawn & Gardening. Scroll through
four cinematic camera waypoints — **Hero · Services · Before/After ·
Contact** — across a living grass field that morphs from sunny day to
firefly dusk. Drag the seam on real before/after photos. Submit a quote
and watch the mailbox door open and the fireflies burst. Chat with
**GardenGenie**, the client-side assistant.

Live area: **Norwich & Norfolk**. Static SPA, no backend, no API keys.

## Stack

- Vite + React 18 + TypeScript (strict + `noUncheckedIndexedAccess`)
- React Three Fiber + drei + postprocessing
  (custom GLSL grass / particles / split-shader / dynamic fog)
- Tailwind CSS (Fraunces display + Inter body)
- Zustand for scene state, Framer Motion for UI animation
- ESLint + `eslint-plugin-jsx-a11y`

## Scripts

```bash
npm install
npm run dev        # local dev on :5173
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint with jsx-a11y
```

CI: `.github/workflows/ci.yml` runs `typecheck` + `lint` + `build` on every PR.
Deploy: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on
every push to `main`.

## Pre-launch checklist for Niki

The repo is wired so 90 % of customisation lives in `src/config/`. Search
the codebase for `TODO` to find every placeholder.

1. **Phone number** — `src/config/contact.ts` → `CONTACT_PHONE`. Use UK
   E.164 format, e.g. `'+447123456789'`. Setting it instantly reveals the
   tap-to-call link in the footer and (planned) navbar CTA.
2. **Email** — `CONTACT_EMAIL` defaults to `info@nikislawngardens.co.uk`.
   Confirm it actually receives mail before launch.
3. **Service area** — `CONTACT_AREA` / `CONTACT_AREA_LONG` /
   `CONTACT_REGION`. Currently set to *Norwich & Norfolk*. Update if the
   service area changes. Don't forget to mirror into `index.html`'s
   `<script type="application/ld+json">` block.
4. **Testimonials** — `src/config/testimonials.ts`. **Replace every entry
   before launch** — real quotes outperform polished copy every time.
   Three reads well; up to five fits the strip layout.
5. **Pricing** — `src/config/pricing.ts`. Set a real `from` number per
   service or keep `null` for *Bespoke quote*. Even rough anchors cut
   bounce rate from price-sensitive visitors.
6. **FAQ** — `src/config/faq.ts`. The six questions there cover the most
   common ones; edit to match Niki's actual policies on rain, soil
   removal, minimum job, lead time, payment, area limits.
7. **Footer trust line** — `src/overlay/Footer.tsx` says "Fully insured".
   Add public-liability cert details or RHS / NPTC / Lantra tickets the
   moment Niki has them.
8. **Photos** — `public/photos/` holds the optimised webp variants
   (`before-1.webp`, `after-1.webp`, etc.). Replace with the same
   filenames to swap in new work. Aim for ≤ 250 KB each at ~1000 px
   wide, quality 75. The OG card uses `after-1.webp` directly.
9. **Favicon** — `public/favicon.svg`. Swap with Niki's mark when ready.

## Project layout

```
src/
  App.tsx                shell, ErrorBoundary
  main.tsx               React entry
  index.css              Tailwind + globals + reduced-motion CSS
  config/
    contact.ts           email / phone / area
    testimonials.ts      placeholder quotes (TODO replace)
    pricing.ts           service price anchors
    faq.ts               6 default Q/A in brand voice
  lib/
    useAppFlags.ts       prefers-reduced-motion + tab visibility
    useFocusTrap.ts      modal focus loop + ESC handler
    asset.ts             import.meta.env.BASE_URL helper
  store/
    useSceneStore.ts     phase, progress, perf, burst, dusk, sunDir,
                         firstFramePainted, audio, motion, visibility
  scene/                 R3F Canvas + every 3D system
    Scene.tsx              root Canvas + DynamicFog
    CameraRig.tsx          scroll-driven Catmull-Rom flythrough
    cameraPath.ts          4 waypoints
    Lighting.tsx           sun + hemisphere + day→dusk; writes shared store
    Sky.tsx                Hosek–Wilkie sky
    Ground.tsx             rolling earth (fbm + vertex tints)
    terrain.ts             shared fbm + groundHeightAt sampler
    Particles.tsx          pollen / fireflies (additive, disposed on perf change)
    Postprocessing.tsx     bloom + vignette (dusk-adaptive)
    PerfMonitor.tsx        FPS → perf tier
    foliage/
      Trees.tsx              low-poly stylised trees
      Hedges.tsx             instanced box hedges flanking path
      Flowers.tsx            clustered bloom instances
      Topiary.tsx            pair of sphere-pruned ornaments
    grass/
      Grass.tsx              instanced grass (32k / 19k / 9k by tier)
      grassShader.ts         GLSL wind + cursor bend + dusk tint + live sun
      bladeGeometry.ts       5-vert tapered blade
    services/
      ServicesOrbs.tsx       4 glass orbs + hover panels
      Icons.tsx              push mower / spade / secateurs / leaf cluster
      serviceData.ts         service definitions
    gallery/
      Gallery.tsx            gate + 2 before/after planes
      Gate.tsx               trellis arch + instanced ivy
      BeforeAfterPlane.tsx   draggable seam + distance-pulse
      beforeAfterShader.ts   split shader
      galleryData.ts         pair definitions
    contact/
      Contact.tsx            mailbox + fireflies
      Mailbox.tsx            box body + roof + animated door
      Fireflies.tsx          orbit ⇄ burst particle system
      contactData.ts         intensity curve
  overlay/                 DOM overlay UI (accessible)
    Navbar.tsx             top bar + mobile sheet (focus-trap, ESC)
    Sections.tsx           4 stacked sections + motion + privacy dialog
    ContactForm.tsx        glass form, inline validation, mailto submit
    Testimonials.tsx       3-quote strip (data-driven)
    Faq.tsx                accordion (data-driven)
    Footer.tsx             trust line + privacy link
    Privacy.tsx            GDPR notice dialog
    ErrorBoundary.tsx      friendly fallback if scene crashes
    Logo.tsx               SVG mark
    PhaseIndicator.tsx     dot rail
    LoadingCurtain.tsx     waits for textures + first frame
    useScrollProgress.ts   scroll → store bridge
  chatbot/                 GardenGenie (no API)
    intents.ts             intent registry
    engine.ts              scoring matcher + plural strip + profanity skip
    persistence.ts         sessionStorage transcript
    GenieLamp.tsx          lamp SVG
    ChatbotWidget.tsx      launcher ↔ panel (ESC, rate-limit, privacy note)
public/
  favicon.svg              brand mark
  photos/                  4 optimised WebP before/after photos
```

## Accessibility & performance notes

- `prefers-reduced-motion`: camera snaps instead of lerps, fireflies fire
  a short acknowledge instead of a 2.2s burst, mailbox door uses the
  short cycle, flower sway is disabled, Framer Motion drops to static.
- Visibility-aware Canvas: `frameloop` switches to `'never'` when the
  document tab is hidden — no GPU/battery in the background.
- Adaptive perf tier: drei's `PerformanceMonitor` drives `high / medium
  / low`. Grass density (32 k / 19 k / 9 k), flower count (240 / 140 /
  70), ivy count (120 / 70 / 36), tree count (7 / 5 / 3), particle count
  (600 / 320 / 140), firefly count (140 / 80 / 40), anisotropy (8 / 4 /
  1), bloom (large / medium / off) all read the tier. Bloom threshold
  and vignette darkness shift with the day→dusk progress.
- Mobile viewport: hero uses `100dvh` with a `100svh` fallback so the
  iOS Safari URL bar doesn't cause layout jumps.
- Focus management: mobile menu and Privacy dialog trap focus; ESC closes
  the mobile menu, chatbot, and Privacy dialog. Chatbot ESC returns
  focus to the launcher.
- Form validation: client-side checks before the `mailto:` is composed
  (`aria-invalid`, `aria-describedby` red ring). Double-submit guarded.
- Chatbot transcript stays in `sessionStorage` — never leaves the
  browser. A line in the panel header tells the visitor.
- Chunk-split bundle: `three`, `@react-three/fiber`,
  `@react-three/drei`, `@react-three/postprocessing`, and `framer-motion`
  ship as their own cacheable chunks. Production sourcemaps disabled.

## Deploy

The build output is a static SPA in `dist/`. Single `index.html`, no
server routing.

### GitHub Pages (automated)

`.github/workflows/deploy.yml` builds and publishes to Pages on every
push to `main`. One-time setup: Repo Settings → Pages → **Source: GitHub
Actions**. The live URL appears in the workflow run summary.

`vite.config.ts` sets `base: './'` so the build works at any subpath —
no per-repo edits needed.

### Vercel / Netlify

Framework preset **Vite**, build `npm run build`, output `dist`. Done.

### Any static host

Upload the contents of `dist/` after `npm run build`. There are no env
vars or API keys at runtime.

## License

All source code in this repo: do what you like with it. Photos in
`public/photos/` are Niki's — please ask before reusing.
