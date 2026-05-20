/**
 * App shell. Step 1 deliverable: scaffold only.
 * Subsequent steps populate <Scene /> (R3F Canvas), <Overlay /> (UI),
 * and <GardenGenie /> (chatbot).
 */
export default function App() {
  return (
    <main className="relative h-full w-full">
      <section className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-sm uppercase tracking-[0.4em] text-sun-400">
          Niki Lawn &amp; Gardening
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-cream sm:text-6xl md:text-7xl">
          A living garden, <span className="italic text-moss-300">in your browser.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-cream/70 sm:text-lg">
          Scaffold ready. The 3D world, gallery, contact, and GardenGenie chatbot land in the next
          steps.
        </p>
        <div className="mt-10 inline-flex items-center gap-3 rounded-full glass px-5 py-2 text-xs uppercase tracking-widest text-cream/80">
          <span className="h-2 w-2 animate-pulse rounded-full bg-moss-400" />
          Step 1 · Scaffold online
        </div>
      </section>
    </main>
  );
}
