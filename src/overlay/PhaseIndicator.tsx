import { useSceneStore } from '@/store/useSceneStore';

const STAGES: { id: 'hero' | 'services' | 'gallery' | 'contact'; label: string }[] = [
  { id: 'hero', label: 'Garden' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Before / After' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Fixed dot-rail down the right edge. Click to jump-scroll to a phase.
 * Doubles as the live readout of the current scroll-driven phase.
 */
export function PhaseIndicator() {
  const phase = useSceneStore((s) => s.phase);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 sm:flex"
    >
      {STAGES.map((s) => {
        const active = phase === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active ? 'true' : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`relative inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border transition-all ${
                active
                  ? 'border-sun-400 bg-sun-400 shadow-[0_0_14px_3px_rgba(245,177,58,0.55)]'
                  : 'border-cream/40 bg-transparent'
              }`}
            />
            <span
              className={`pointer-events-none font-display text-[10px] uppercase tracking-[0.3em] transition-opacity ${
                active ? 'text-cream/90 opacity-100' : 'text-cream/60 opacity-0 group-hover:opacity-100'
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
