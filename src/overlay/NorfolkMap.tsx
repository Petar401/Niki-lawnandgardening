import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_AREAS, type ServiceArea } from '@/config/contact';

/**
 * Interactive Norfolk coverage map.
 *
 * Zero third-party tiles, zero API. The county boundary is a hand-traced
 * SVG path; the towns are projected from real lat/lng onto the same
 * coordinate space using a simple Mercator-ish stretch tuned to the
 * Norfolk box.
 *
 * Hover/focus a town for a tooltip; click to pulse + prefill the
 * contact form via a window event.
 */

// Bounding box (degrees) for the projection — Norfolk inflated slightly.
const LON_MIN = 0.25;
const LON_MAX = 1.85;
const LAT_MIN = 52.3;
const LAT_MAX = 53.0;

// SVG canvas
const W = 800;
const H = 500;
const PAD = 20;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = PAD + ((lng - LON_MIN) / (LON_MAX - LON_MIN)) * (W - 2 * PAD);
  // Latitude inverted because SVG y grows downward.
  const y = PAD + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (H - 2 * PAD);
  return { x, y };
}

/**
 * Norfolk county outline. Hand-traced from a public-domain Ordnance Survey
 * boundary outline. Coordinates are already projected to the same lat/lng
 * box above (so the towns line up with their real positions on the map).
 */
const NORFOLK_OUTLINE: Array<[number, number]> = [
  // [lng, lat] going clockwise from the Wash (west coast) around the north
  // coast, down the east coast to the Waveney (south), and back west.
  [0.42, 52.95], // The Wash
  [0.48, 52.99],
  [0.6, 52.97],
  [0.75, 52.98],
  [0.9, 52.97],
  [1.05, 52.95],
  [1.2, 52.94],
  [1.32, 52.93], // Cromer
  [1.45, 52.9],
  [1.55, 52.85],
  [1.65, 52.78],
  [1.72, 52.7],
  [1.74, 52.6], // Great Yarmouth
  [1.7, 52.5],
  [1.62, 52.45],
  [1.5, 52.41],
  [1.4, 52.38],
  [1.28, 52.36],
  [1.15, 52.36], // Diss
  [1.0, 52.37],
  [0.85, 52.38],
  [0.72, 52.4],
  [0.6, 52.42],
  [0.5, 52.45],
  [0.4, 52.48],
  [0.32, 52.55],
  [0.3, 52.6],
  [0.35, 52.65],
  [0.32, 52.7],
  [0.3, 52.78],
  [0.36, 52.85],
  [0.42, 52.9],
];

function buildOutlinePath(): string {
  const pts = NORFOLK_OUTLINE.map(([lng, lat]) => project(lat, lng));
  return (
    `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` +
    pts.slice(1).map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
    ' Z'
  );
}

export function NorfolkMap() {
  const outlineD = useMemo(buildOutlinePath, []);
  const [active, setActive] = useState<ServiceArea | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);

  const norwich = SERVICE_AREAS.find((a) => a.hub)!;
  const norwichP = project(norwich.lat, norwich.lng);
  // 40-mile radius — visually convey coverage. 1 deg latitude ≈ 69 miles.
  const radiusY = (40 / 69) * ((H - 2 * PAD) / (LAT_MAX - LAT_MIN));

  const handleClick = (area: ServiceArea) => {
    setActive(area);
    setPulse(area.name);
    window.setTimeout(() => setPulse(null), 900);
    // Notify the contact form to prefill its message with this town.
    window.dispatchEvent(new CustomEvent('niki:area-selected', { detail: { name: area.name } }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      aria-label="Norfolk coverage map"
      className="glass mx-auto mt-6 w-full max-w-3xl rounded-3xl p-3 sm:p-5"
    >
      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h3 className="font-display text-base font-semibold text-cream text-shadow-soft">
          Niki's Norfolk patch
        </h3>
        <p className="text-[10px] uppercase tracking-[0.24em] text-cream/70">
          Tap a town to prefill
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dusk-900/70 via-moss-900/60 to-dusk-800/70 ring-1 ring-cream/10">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Map of Norfolk showing towns Niki Lawn & Gardening covers"
          className="block h-auto w-full"
        >
          <defs>
            <linearGradient id="land-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f8a3c" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1d461d" stopOpacity="0.65" />
            </linearGradient>
            <radialGradient id="coverage-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f5b13a" stopOpacity="0.0" />
              <stop offset="60%" stopColor="#f5b13a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f5b13a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sea background grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`gx-${i}`}
              x1={(W / 10) * i}
              y1={0}
              x2={(W / 10) * i}
              y2={H}
              stroke="rgba(253,247,236,0.04)"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`gy-${i}`}
              x1={0}
              y1={(H / 6) * i}
              x2={W}
              y2={(H / 6) * i}
              stroke="rgba(253,247,236,0.04)"
              strokeWidth={1}
            />
          ))}

          {/* Norfolk landmass */}
          <path d={outlineD} fill="url(#land-fill)" stroke="#8fc28d" strokeWidth={1.2} />

          {/* Coverage ring around Norwich */}
          <motion.ellipse
            initial={{ rx: 0, ry: 0, opacity: 0 }}
            whileInView={{ rx: radiusY * 1.4, ry: radiusY, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            cx={norwichP.x}
            cy={norwichP.y}
            fill="url(#coverage-grad)"
            stroke="#f5b13a"
            strokeWidth={1}
            strokeDasharray="4 6"
            strokeOpacity={0.45}
          />

          {/* Town markers */}
          {SERVICE_AREAS.map((a) => {
            const p = project(a.lat, a.lng);
            const r = a.hub ? 8 : 4;
            const isPulsing = pulse === a.name;
            return (
              <g
                key={a.name}
                tabIndex={0}
                role="button"
                aria-label={a.name + (a.hub ? " — Niki's base" : `, ${a.drive} minute drive from Norwich`)}
                onClick={() => handleClick(a)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(a);
                  }
                }}
                onMouseEnter={() => setActive(a)}
                onMouseLeave={() => setActive((cur) => (cur === a ? null : cur))}
                onFocus={() => setActive(a)}
                onBlur={() => setActive((cur) => (cur === a ? null : cur))}
                className="cursor-pointer outline-none transition-transform focus:[&_circle]:stroke-sun-400 hover:[&_circle]:stroke-sun-400"
                style={{ transform: isPulsing ? 'scale(1.15)' : undefined, transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {/* Hit target */}
                <circle cx={p.x} cy={p.y} r={Math.max(r + 6, 12)} fill="transparent" />
                {/* Halo for hub */}
                {a.hub && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + 5}
                    fill="none"
                    stroke="#f5b13a"
                    strokeOpacity={0.55}
                    strokeWidth={1.5}
                  />
                )}
                {/* Marker */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={a.hub ? '#f5b13a' : '#bcdbba'}
                  stroke="#fdf7ec"
                  strokeWidth={1.5}
                />
                {/* Label */}
                <text
                  x={p.x + r + 4}
                  y={p.y + 3}
                  fontSize={a.hub ? 13 : 10}
                  fontWeight={a.hub ? 700 : 500}
                  fill="#fdf7ec"
                  paintOrder="stroke"
                  stroke="#0f2a10"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  className="pointer-events-none select-none"
                >
                  {a.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip card */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute bottom-3 left-3 max-w-[18rem] rounded-2xl bg-black/75 px-4 py-3 text-left backdrop-blur"
            >
              <p className="font-display text-sm font-semibold text-cream">{active.name}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.24em] text-sun-200">
                {active.hub ? 'Niki’s base' : `${active.drive} min drive from Norwich`}
              </p>
              <p className="mt-1 text-xs text-cream/80">
                Yes — Niki covers {active.name}. Tap to prefill a quick quote request.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 px-1 text-[11px] text-cream/70">
        Don't see your village? Niki covers <strong className="text-cream">every postcode in Norfolk</strong>{' '}
        — just drop the address in the form.
      </p>
    </section>
  );
}
