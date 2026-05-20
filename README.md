# Niki Lawn & Gardening — 3D Living Garden World

An immersive Three.js portfolio for Niki Lawn & Gardening. Scroll through 4
cinematic camera waypoints — Hero · Services · Before/After · Contact — across
a living grass field that morphs from sunny day to firefly dusk. Drag the seam
on real before/after photos. Submit a quote and watch the fireflies burst.
Chat with **GardenGenie**, the custom client-side assistant.

## Stack
- Vite + React 18 + TypeScript
- React Three Fiber + drei + postprocessing (custom GLSL grass / particles / split shader)
- Tailwind CSS (Fraunces + Inter)
- Zustand (scene state), Framer Motion (UI animation)
- No backend; static deploy.

## Scripts
```bash
npm install
npm run dev        # local dev server on :5173
npm run build      # type-check + production build (writes to dist/)
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Configure before launch
1. **Contact recipient** — open `src/config/contact.ts` and set
   `CONTACT_EMAIL` (and optionally `CONTACT_PHONE` / `CONTACT_AREA`).
   The form composes a `mailto:` link to this address — no backend or
   API key required.
2. **Photos** — Niki's 4 yard photos live in `public/photos/` as
   `before-1.webp` / `after-1.webp` / `before-2.webp` / `after-2.webp`.
   Replace them with the same filenames (≤1000px wide, ~80q WebP) to
   swap in new work.

## Deploy

The build output is a static SPA in `dist/`. Single `index.html` — no
server routing needed.

### Vercel
1. Import the repo in Vercel.
2. Framework preset: **Vite**.
3. Build command `npm run build`, output `dist`. Done.

### Netlify
1. Connect the repo.
2. Build command `npm run build`, publish directory `dist`.
3. Done — drag-and-drop deploys work too (drop the `dist/` folder).

### GitHub Pages
```bash
npm run build
# push dist/ to a gh-pages branch (e.g., via the `gh-pages` package)
```
If serving from a subpath (`/repo/`), add `base: '/repo/'` to
`vite.config.ts` before building.

### Any static host
Upload the contents of `dist/` (after `npm run build`) to any static
file host. There are no env vars or API keys at runtime.

## Project layout
```
src/
  App.tsx                shell
  main.tsx               React entry
  index.css              Tailwind + globals + reduced-motion CSS
  config/
    contact.ts           recipient email & area
  scene/                 R3F Canvas + every 3D system
    Scene.tsx              root Canvas
    CameraRig.tsx          scroll-driven 4-waypoint Catmull-Rom flythrough
    cameraPath.ts          waypoints
    Lighting.tsx           sun + hemisphere + day→dusk tween
    Sky.tsx                Hosek–Wilkie sky
    Ground.tsx             stylised soil
    Particles.tsx          pollen / fireflies (additive)
    Postprocessing.tsx     bloom + vignette
    PerfMonitor.tsx        FPS → perf tier
    grass/
      Grass.tsx            instanced grass (32k blades) + pointer raycast
      grassShader.ts       GLSL wind + cursor bend + dusk tint
      bladeGeometry.ts     5-vert tapered blade
    services/
      ServicesOrbs.tsx     4 glass orbs + hover panels
      Icons.tsx            primitive mower/shovel/clipper/leaf
      serviceData.ts       service definitions
    gallery/
      Gallery.tsx          gate + 2 before/after planes
      Gate.tsx             trellis arch (Tube along CatmullRom)
      BeforeAfterPlane.tsx draggable seam
      beforeAfterShader.ts split shader
      galleryData.ts       pair definitions
    contact/
      Contact.tsx          mailbox + fireflies
      Mailbox.tsx          stylised mailbox
      Fireflies.tsx        orbit ⇄ burst particle system
      contactData.ts       intensity curve
  overlay/                 DOM overlay UI (responsive, accessible)
    Navbar.tsx             top bar + mobile sheet
    Sections.tsx           4 stacked sections + motion
    ContactForm.tsx        glass form, mailto submit, fires burst
    Logo.tsx               SVG mark
    PhaseIndicator.tsx     dot-rail
    LoadingCurtain.tsx     fades out after first paint
    useScrollProgress.ts   scroll → store bridge
  chatbot/                 GardenGenie (custom, no API)
    intents.ts             19 intents + voice variants
    engine.ts              scoring matcher + contextual yes/no
    persistence.ts         sessionStorage transcript
    GenieLamp.tsx          lamp SVG
    ChatbotWidget.tsx      launcher ↔ panel
  lib/
    useAppFlags.ts         prefers-reduced-motion + visibility
  store/
    useSceneStore.ts       phase, progress, perf, burst, motion, visibility
public/
  favicon.svg              brand mark
  photos/                  4 optimized WebP before/after photos
```

## Accessibility & performance notes
- `prefers-reduced-motion`: camera snaps instead of lerps, fireflies fire a
  short acknowledge instead of a 2.2s burst, Framer Motion drops to
  static, CSS animations collapse to 0.01ms.
- Visibility-aware Canvas: the scene `frameloop` switches to `'never'`
  when the tab is hidden — no GPU/battery in the background.
- Adaptive perf tier: drei's `PerformanceMonitor` drives `high / medium /
  low`. Grass density (32k / 19k / 9k), particle count (600 / 320 / 140),
  firefly count (140 / 80 / 40), and bloom (large / medium / off) all
  read this tier.
- Chunk-split bundle: `three`, `@react-three/fiber`, `@react-three/drei`,
  `@react-three/postprocessing`, and `framer-motion` each ship as their
  own cacheable chunks.
- Keyboard: skip-to-content link, visible focus rings, semantic
  landmarks (`<main>`, `<nav>`, `<header>`, `<section>`).
- Touch: `touch-action: pan-y` on the canvas so page scroll wins; the
  gallery seam uses `setPointerCapture` so drags survive leaving the plane.

## License
All source code in this repo: do what you like with it. Photos in
`public/photos/` are Niki's — please ask before reusing.
