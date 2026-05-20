# Niki Lawn & Gardening — 3D Living Garden World

An immersive Three.js portfolio for Niki Lawn & Gardening. Built with React + Vite + React Three Fiber.

## Stack
- Vite + React 18 + TypeScript
- React Three Fiber + drei + postprocessing
- Tailwind CSS (Fraunces + Inter)
- Zustand (scene/state), Framer Motion (UI animation)

## Scripts
```bash
npm install
npm run dev        # local dev server on :5173
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Project layout (filled in across steps)
```
src/
  App.tsx              # shell
  main.tsx             # React entry
  index.css            # Tailwind + globals
  scene/               # R3F Canvas, camera rig, lighting, world chunks
  shaders/             # GLSL grass, sky, particles
  overlay/             # HTML/CSS overlay UI (nav, sections, contact)
  chatbot/             # GardenGenie (intents, engine, widget)
  store/               # zustand stores (scene phase, chatbot state)
```

## Status
- [x] Step 1 · Scaffold (this commit)
- [ ] Step 2 · Base R3F scene
- [ ] Step 3 · Grass + wind shader + particles
- [ ] Step 4 · Scroll-driven camera path + day to dusk
- [ ] Step 5 · UI overlay (responsive, contact skeleton)
- [ ] Step 6 · Services orb scene
- [ ] Step 7 · Before/After 3D gallery
- [ ] Step 8 · Contact scene + firefly burst
- [ ] Step 9 · GardenGenie chatbot
- [ ] Step 10 · Polish, perf, mobile, a11y, deploy
