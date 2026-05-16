import { cn } from '@/lib/cn';

type Props = { className?: string; ariaLabel?: string };

/**
 * Static SVG used as the visual fallback when WebGL is unavailable or the
 * visitor prefers reduced motion. Shares the brand palette and composition
 * with the 3D scene so the hero looks intentional in either mode.
 */
export function GardenPoster({
  className,
  ariaLabel = 'Stylised illustration of a garden corner with a planter, shrubs, an ornamental tree, brick edging and a stone slab.',
}: Props) {
  return (
    <svg
      viewBox="0 0 800 600"
      role="img"
      aria-label={ariaLabel}
      className={cn('h-full w-full', className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="poster-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0e7" />
          <stop offset="100%" stopColor="#f8f4eb" />
        </linearGradient>
        <linearGradient id="poster-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8cab0" />
          <stop offset="100%" stopColor="#bfae8e" />
        </linearGradient>
        <radialGradient id="poster-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1b241c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1b241c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="poster-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9bbf6f" />
          <stop offset="100%" stopColor="#4a7a3c" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="800" height="380" fill="url(#poster-sky)" />
      {/* ground */}
      <path d="M0,380 L800,380 L800,600 L0,600 Z" fill="url(#poster-ground)" />
      {/* far horizon hedge */}
      <path
        d="M0,380 C120,360 220,370 340,360 C460,350 580,372 720,360 L800,362 L800,380 L0,380 Z"
        fill="#6e8a5a"
        opacity="0.55"
      />

      {/* contact shadow */}
      <ellipse cx="430" cy="490" rx="280" ry="32" fill="url(#poster-shadow)" />

      {/* stone slab */}
      <g>
        <rect x="120" y="455" width="170" height="36" rx="6" fill="#cabfa9" />
        <rect x="120" y="455" width="170" height="8" rx="6" fill="#dcd3bf" />
      </g>

      {/* brick edge — curved arc */}
      <g fill="#a8553a">
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = (-Math.PI / 2) + (i / 8) * (Math.PI * 0.65);
          const cx = 470 + Math.cos(angle) * 220;
          const cy = 510 + Math.sin(angle) * 50;
          return (
            <rect
              key={i}
              x={cx - 26}
              y={cy - 12}
              width="52"
              height="22"
              rx="3"
              transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`}
              opacity={0.85 - i * 0.02}
            />
          );
        })}
      </g>

      {/* planter trough */}
      <g>
        <rect x="500" y="395" width="200" height="100" rx="6" fill="#8a6a4f" />
        <rect x="500" y="395" width="200" height="14" rx="6" fill="#a08368" />
        <rect x="500" y="481" width="200" height="14" rx="6" fill="#6e533c" />
      </g>

      {/* shrubs in planter */}
      <g>
        <ellipse cx="540" cy="385" rx="46" ry="50" fill="url(#poster-leaf)" />
        <ellipse cx="600" cy="365" rx="52" ry="58" fill="url(#poster-leaf)" />
        <ellipse cx="660" cy="385" rx="46" ry="50" fill="url(#poster-leaf)" />
      </g>

      {/* ornamental tree — trunk + layered foliage discs */}
      <g>
        <rect x="244" y="280" width="14" height="180" rx="4" fill="#4a3424" />
        <ellipse cx="251" cy="290" rx="78" ry="22" fill="#9bbf6f" opacity="0.95" />
        <ellipse cx="251" cy="260" rx="68" ry="20" fill="#7da757" opacity="0.95" />
        <ellipse cx="251" cy="232" rx="56" ry="18" fill="#618f49" opacity="0.95" />
        <ellipse cx="251" cy="208" rx="42" ry="16" fill="#4a7a3c" opacity="0.95" />
        <ellipse cx="251" cy="190" rx="28" ry="13" fill="#3c6a32" opacity="0.95" />
      </g>

      {/* small foreground stones */}
      <g fill="#1b241c" opacity="0.55">
        <circle cx="335" cy="510" r="8" />
        <circle cx="362" cy="520" r="6" />
        <circle cx="320" cy="528" r="5" />
      </g>
    </svg>
  );
}
