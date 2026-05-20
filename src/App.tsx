import { Scene } from '@/scene/Scene';
import { Sections } from '@/overlay/Sections';
import { PhaseIndicator } from '@/overlay/PhaseIndicator';
import { useScrollProgress } from '@/overlay/useScrollProgress';

/**
 * App shell.
 *  - The R3F <Scene/> is `position: fixed` covering the viewport.
 *  - <Sections/> stack normally and provide the actual scroll height
 *    (4× viewport tall). useScrollProgress bridges scroll → store.
 *  - <PhaseIndicator/> is a fixed dot-nav showing the current phase.
 */
export default function App() {
  useScrollProgress();

  return (
    <main className="relative w-full">
      {/* Fixed 3D backdrop. */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Scroll surface. */}
      <div className="relative z-10">
        <Sections />
      </div>

      <PhaseIndicator />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[10px] uppercase tracking-widest text-cream/80">
          <span className="h-2 w-2 animate-pulse rounded-full bg-moss-300" />
          Step 4 · Scroll-driven camera path
        </div>
      </div>
    </main>
  );
}
