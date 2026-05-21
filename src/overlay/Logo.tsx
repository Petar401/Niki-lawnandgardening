/**
 * Niki Lawn & Gardening logomark: a stylised sprout/leaf inside a roundel.
 * Pure SVG so it scales crisply and inherits currentColor for hover states.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        aria-hidden="true"
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <linearGradient id="logo-leaf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bcdbba" />
            <stop offset="1" stopColor="#3f8a3c" />
          </linearGradient>
          <linearGradient id="logo-sun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe9a8" />
            <stop offset="1" stopColor="#f5b13a" />
          </linearGradient>
        </defs>

        <circle cx="16" cy="16" r="15" fill="url(#logo-sun)" opacity="0.18" />
        <circle cx="16" cy="16" r="15" fill="none" stroke="url(#logo-leaf)" strokeWidth="1.5" />
        {/* Sprout/leaf */}
        <path
          d="M16 23 C 16 19, 16 16, 19 14 C 22 12, 23 10, 22 7 C 18.5 8, 16 11, 16 14 C 16 11, 13.5 8, 10 7 C 9 10, 10 12, 13 14 C 16 16, 16 19, 16 23 Z"
          fill="url(#logo-leaf)"
        />
        <line x1="16" y1="20" x2="16" y2="26" stroke="#1d461d" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold tracking-tight text-cream text-shadow-strong">
          Niki
        </span>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.32em] text-sun-200 text-shadow-soft">
          Lawn &amp; Gardening
        </span>
      </span>
    </span>
  );
}
