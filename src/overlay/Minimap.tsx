import { useSceneStore } from '@/store/useSceneStore';
import { NODES } from '@/scene/navigationNodes';

/**
 * Overhead property map. A small fixed glass card with an SVG plan of the
 * garden — boundary wall, curving stone path, cottage footprint — and a dot
 * per zone placed by its `minimapUV`. The active zone glows gold; clicking a
 * dot flies the camera there. Sits bottom-right, above the chatbot launcher.
 */
export function Minimap() {
  const activeZone = useSceneStore((s) => s.activeZone);
  const hoveredZone = useSceneStore((s) => s.hoveredZone);
  const navigateTo = useSceneStore((s) => s.navigateTo);
  const setHovered = useSceneStore((s) => s.setHoveredZone);

  return (
    <div
      role="navigation"
      aria-label="Property map"
      className="fixed bottom-24 right-4 z-20 opacity-80 transition-opacity hover:opacity-100 sm:bottom-6 sm:right-24"
    >
      <div className="glass relative h-28 w-28 rounded-2xl p-2.5 sm:h-36 sm:w-36">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          {/* Boundary wall */}
          <path d="M12,88 L12,16 L88,16 L88,88 Z" fill="rgba(120,150,110,0.06)" stroke="rgba(253,247,236,0.16)" strokeWidth="1" />
          {/* Lawn */}
          <ellipse cx="54" cy="58" rx="30" ry="24" fill="rgba(120,170,90,0.14)" />
          {/* Curving stone path */}
          <path d="M50,88 C40,72 34,60 40,46 C45,34 55,30 62,26" fill="none" stroke="rgba(214,200,180,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0.5 3" />
          {/* Cottage footprint */}
          <rect x="20" y="18" width="26" height="14" rx="1.5" fill="rgba(190,170,150,0.35)" stroke="rgba(253,247,236,0.2)" strokeWidth="0.5" />
        </svg>

        {NODES.map((node) => {
          const [u, v] = node.minimapUV;
          const isActive = activeZone === node.id;
          const isHovered = hoveredZone === node.id;
          return (
            <button
              key={node.id}
              type="button"
              aria-label={`Fly to ${node.label}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => navigateTo(node.id)}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ left: `${u * 100}%`, top: `${v * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-1 transition-transform hover:scale-125"
            >
              <span
                className={`block rounded-full transition-all ${
                  isActive
                    ? 'h-3 w-3 bg-sun-400 shadow-[0_0_8px_3px_rgba(245,177,58,0.7)]'
                    : isHovered
                      ? 'h-2.5 w-2.5 bg-cream/90'
                      : 'h-2 w-2 bg-cream/55'
                }`}
              />
            </button>
          );
        })}

        <p className="pointer-events-none absolute bottom-1.5 left-0 w-full text-center font-display text-[8px] uppercase tracking-[0.3em] text-cream/40">
          Property map
        </p>
      </div>
    </div>
  );
}
