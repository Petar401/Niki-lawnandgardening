import { useSceneStore } from '@/store/useSceneStore';
import { NODES, type ZoneId } from '@/scene/navigationNodes';

/**
 * Fixed dot-rail down the right edge. One dot per zone; click to fly there.
 * Doubles as the live readout of the active zone.
 */
export function PhaseIndicator() {
  const activeZone = useSceneStore((s) => s.activeZone);
  const navigateTo = useSceneStore((s) => s.navigateTo);

  return (
    <nav
      aria-label="Garden zones"
      className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 sm:flex"
    >
      {NODES.map((node) => {
        const active = activeZone === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => navigateTo(node.id as ZoneId)}
            aria-label={`Fly to ${node.label}`}
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
              {node.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
