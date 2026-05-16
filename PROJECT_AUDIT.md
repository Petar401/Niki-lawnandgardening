# Project Audit — Niki Lawn & Gardening

**Date:** 2026-05-16
**Branch:** `claude/audit-transform-repo-CySHC`
**Auditor role:** Senior full-stack engineer / creative director / code auditor

---

## 1. Current Repository State

The repository is effectively a blank slate with a small amount of real-world content.

### Inventory

| Item | Path | Notes |
|---|---|---|
| README | `README.md` | 2 lines. Contains a typo (`Niki-lawnntardening`). No actual project information. |
| Photo | `Before-1.jpg.JPG` | 1536×2048, real customer-garden photo, overgrown bed with weeds. "BEFORE" overlay burned in. |
| Photo | `After-1.jpg.JPG` | 1536×2048, same bed after redesign — stone border, fresh soil, solar lights, ornamental tree. "AFTER" overlay. |
| Photo | `Before-2.jpg.JPG` | 1536×2048, overgrown corner by lattice fence and tree base. "BEFORE" overlay. |
| Photo | `After-2.jpg.JPG` | 1536×2048, same corner after — brick-edged bed, decorative gravel, ornamental black spheres, tidy base. "AFTER" overlay. |
| Git | `.git/` | 2 commits: initial commit + `0b55b9b Add files via upload`. Clean working tree. |

### What is NOT present

- No `package.json`, no Node project, no JS/TS files
- No framework (React, Next, Vite, Astro, etc.)
- No build/lint/test configuration
- No styling system (Tailwind, CSS Modules, vanilla CSS, etc.)
- No routing, no components, no entry point
- No deployment config (Vercel, Netlify, Pages, etc.)
- No `.gitignore`
- No fonts, icons, or favicon
- No design tokens, branding direction, or brand assets beyond the four photos
- No copy, no business details (address, phone, service area), no testimonials

### Stack & dependencies

There is no stack to evaluate. Nothing is installed; nothing depends on anything.

### Existing components, routing, entry points

None.

### Technical debt / broken areas

- README contains a misspelling of the project name.
- The four image files have a doubled extension (`.jpg.JPG`) which is harmless but visually inconsistent. They will be re-saved with cleaner names and optimized variants (WebP/AVIF) when we wire them into the site.
- Photos have "BEFORE"/"AFTER" overlay text burned into the JPEG. That is fine for an honest before/after gallery but means we cannot use those crops as clean hero/lifestyle imagery without re-shooting or sourcing alternatives.

---

## 2. Real-World Signal from the Existing Photos

The four photos are the most important artifact in the repo because they tell us what the actual business is.

Observations:

- **Residential, hands-on garden work.** Small private gardens, not commercial landscape architecture.
- **Hardscape + tidy + plant work combined.** Stone/brick edging, decorative gravel, solar path lights, ornamental spheres, base-planted trees. This is a "transform a tired corner of your garden" service, not a 6-figure landscape design firm.
- **Likely UK / Ireland.** Brick paving patterns, lattice timber fencing, and plant palette are characteristic.
- **Craft is genuine.** The "After" results are clearly a real improvement: weeds removed, edges defined, materials laid by hand.
- **Operator-led.** Almost certainly a single named gardener ("Niki") or a very small team. The brand should feel personal, not corporate.

**Implication for the site:** The site must feel local, trustworthy, friendly, and craft-focused — premium in finish, but grounded. Not a "studio" abstraction. The hero promise should be "tired garden → tidy, planted, cared-for space" rather than "luxury landscape architecture."

---

## 3. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Only 4 real photos available — gallery will look thin | Medium | Build the gallery component to handle 4 real entries gracefully; design the projects section so it does not need 20 cards to feel complete. Document clearly in `TASKS.md` which content is real vs. placeholder. |
| No real business details (phone, email, service area, hours, pricing, real testimonials, real owner name) | High | Use clearly-labelled placeholder content (`{{PLACEHOLDER}}` style or commented), and list every placeholder in the final deliverable so the owner can fill them in before launch. Never invent a phone number or address. |
| 3D garden scene risks performance on mobile | Medium | Use a stylized low-poly scene, lazy-load Three.js, respect `prefers-reduced-motion`, provide a static poster fallback. |
| "BEFORE"/"AFTER" text is burned into JPEGs | Low | Treat them as gallery-only assets. Source unrelated free-to-use garden imagery for hero/lifestyle slots, or rely on the 3D scene + soft photographic gradients. |
| Photos are 1.1–1.4 MB each, JPEG, 1536×2048 portrait | Low | Re-encode to WebP/AVIF, generate responsive variants, lazy-load below the fold. |
| Single-developer site can drift into "AI template" look | High (per brief) | Hold tightly to the brand rules: greens + earth + one warm accent, generous whitespace, real photography, no neon gradients, no glassmorphism-by-default. |

---

## 4. Opportunities

- **Greenfield.** No legacy to fight. We can pick the cleanest stack and design system from the start.
- **Real before/after photos are gold for conversion.** The single most credible thing on a gardening website is "look what we did for someone like you." We will give them prime real estate.
- **3D done right is differentiating.** Most local gardener websites are Wix/Squarespace with a stock photo and a phone number. A subtle, tasteful 3D garden scene (stylized planters, a tree, soft sky) is genuinely premium and on-brand for "we design outdoor spaces" — provided it never feels like a tech demo.
- **Single page, fast to build, fast to load.** A small business does not need 12 routes. One excellent long-scroll page + a thanks page + legal pages is the right shape.

---

## 5. Recommended Architecture

### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Build tool | **Vite** | Fastest dev experience, smallest config, perfect for a one-page marketing site. Next.js would be overkill — we don't need SSR/ISR or a route tree. |
| Framework | **React 18 + TypeScript** | Best ecosystem for R3F; type-safety on a small site costs little and prevents copy/CTA regressions. |
| 3D | **three.js + @react-three/fiber + @react-three/drei** | Standard, well-documented, declarative. Drei gives us cameras, lights, env, contact shadows out of the box. |
| Styling | **Tailwind CSS** + a small `tokens.css` for brand colors / fonts / radii | Tailwind gives speed without imposing a "template" look as long as we discipline the palette. Tokens file ensures the brand stays consistent. |
| Fonts | **Fraunces** (display serif) + **Inter** (UI/body) via `@fontsource` | Fraunces feels editorial, warm, and slightly hand-crafted — right for a gardening studio. Inter for body keeps it readable. Self-hosted to avoid Google Fonts network calls. |
| Icons | **lucide-react** | Clean, consistent, tree-shakeable. |
| Forms | Native `<form>` posting to a placeholder endpoint with client-side validation | No form vendor lock-in. Owner can wire to Formspree / Resend / their own inbox at deploy time. |
| Animation | **framer-motion** (light usage) | For scroll reveals and micro-interactions. Respect `prefers-reduced-motion`. |
| Deployment | Static build → any host (Vercel / Netlify / GitHub Pages / Cloudflare Pages) | Vite outputs a static bundle. Zero server cost. |

### Why not Next.js?

- We have one page. SSR/ISR/route handlers add complexity with no payoff.
- Vite + a static build deploys anywhere, including the owner's existing host.
- Smaller bundle, faster local dev, simpler mental model.

### Folder layout (target)

```
/
├── public/
│   ├── images/
│   │   ├── projects/        # optimized before/after pairs
│   │   └── og/              # social share image
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/
│   │   ├── tokens.css       # brand tokens (colors, radii, shadows, motion)
│   │   └── globals.css      # tailwind layers + base resets
│   ├── components/
│   │   ├── primitives/      # Button, Container, SectionHeading, Tag, Card
│   │   ├── nav/             # Header, MobileMenu, Footer
│   │   ├── sections/        # Hero, Services, Projects, Process, Testimonials, FAQ, Contact, CTA
│   │   ├── three/           # GardenScene, Planter, Tree, Ground, Sky, useReducedMotion
│   │   └── forms/           # QuoteForm + field components
│   ├── content/
│   │   ├── services.ts
│   │   ├── projects.ts
│   │   ├── faqs.ts
│   │   ├── testimonials.ts
│   │   └── site.ts          # brand name, tagline, contact placeholders
│   ├── hooks/
│   └── lib/
├── index.html               # SEO meta, OG tags, fonts preconnect
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── PROJECT_AUDIT.md         # this file
├── IMPLEMENTATION_PLAN.md
├── TASKS.md
└── README.md                # rewritten with real project info
```

---

## 6. What to Preserve

- **All four before/after photos.** They are the most valuable assets in the repo. We will move them under `public/images/projects/`, rename them, generate WebP variants, and feature them in the projects section.
- **Git history.** Keep both existing commits. All new work goes on `claude/audit-transform-repo-CySHC`.

## 7. What to Replace

- **README.md** → rewritten with project name (corrected), short description, run/build instructions, deployment notes, content placeholder checklist.

## 8. What to Add

Everything else listed under "Recommended Architecture."

---

## 9. Recommendation

**Build from scratch inside this repo on `claude/audit-transform-repo-CySHC`.** There is nothing meaningful to migrate. The four photos and the git history are preserved; everything else is greenfield.

Proceed to `IMPLEMENTATION_PLAN.md` and `TASKS.md` for the build strategy and phased checklist. **Wait for user confirmation before starting Phase 2 (Foundation) onward.**
