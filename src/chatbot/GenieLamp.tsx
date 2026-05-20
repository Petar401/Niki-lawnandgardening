/**
 * The little oil-lamp icon that doubles as the GardenGenie avatar and
 * the launcher button. Pure SVG with a flame gradient so it tints with
 * the dusk palette.
 */
export function GenieLamp({ size = 24, glow = true }: { size?: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={glow ? 'drop-shadow-[0_0_10px_rgba(245,177,58,0.55)]' : undefined}
    >
      <defs>
        <linearGradient id="lamp-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f5b13a" />
          <stop offset="0.6" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#fff7e0" />
        </linearGradient>
        <linearGradient id="lamp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b4b8a" />
          <stop offset="1" stopColor="#2a214a" />
        </linearGradient>
      </defs>

      {/* Flame */}
      <path
        d="M16 4 C 14 7, 14 10, 16 11 C 18 10, 18 7, 16 4 Z"
        fill="url(#lamp-flame)"
      />

      {/* Wick */}
      <rect x="15.4" y="10.5" width="1.2" height="2.4" fill="#1d1230" />

      {/* Lamp body */}
      <path
        d="M9 19 L 23 19 C 24 19, 24.5 19.8, 24 20.6 L 22.5 24 C 22 25, 21 25.5, 20 25.5 L 12 25.5 C 11 25.5, 10 25, 9.5 24 L 8 20.6 C 7.5 19.8, 8 19, 9 19 Z"
        fill="url(#lamp-body)"
        stroke="#fdf7ec"
        strokeOpacity="0.4"
        strokeWidth="0.6"
      />
      {/* Neck */}
      <rect x="13" y="14" width="6" height="5" rx="1.4" fill="url(#lamp-body)" stroke="#fdf7ec" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* Handle */}
      <path d="M9 21 C 5 21, 5 25, 9 25" fill="none" stroke="#fdf7ec" strokeOpacity="0.6" strokeWidth="0.9" strokeLinecap="round" />
      {/* Spout */}
      <path d="M23 21 L 27 19 L 27 22 L 23 22 Z" fill="url(#lamp-body)" stroke="#fdf7ec" strokeOpacity="0.4" strokeWidth="0.5" />
    </svg>
  );
}
