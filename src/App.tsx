import { Scene } from '@/scene/Scene';

/**
 * App shell. The R3F <Scene /> is pinned full-viewport behind a transparent
 * UI overlay; subsequent steps add real overlay content (nav, sections,
 * contact, GardenGenie). For Step 2 we keep a slim hero card so reviewers
 * can confirm the 3D layer renders behind real DOM content.
 */
export default function App() {
  return (
    <main className="relative h-full w-full">
      {/* Fixed 3D backdrop. */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        {/* Re-enable pointer events for the canvas only (so future drei
            controls / picking work) while keeping the wrapper transparent
            to text-selection on the overlay above. */}
        <div className="pointer-events-auto h-full w-full">
          <Scene />
        </div>
      </div>

      {/* UI overlay (skeleton — fills in across Steps 5/6/7/8). */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-end px-6 pb-16 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-sun-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Niki Lawn &amp; Gardening
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl">
          A living garden, <span className="italic text-moss-200">in your browser.</span>
        </h1>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full glass px-5 py-2 text-[10px] uppercase tracking-widest text-cream/80">
          <span className="h-2 w-2 animate-pulse rounded-full bg-moss-300" />
          Step 2 · Base R3F scene
        </div>
      </section>
    </main>
  );
}
