/**
 * Navigation graph — the single source of truth for the click-to-explore
 * experience. Replaces the old 4-waypoint scroll path with 6 discrete
 * "zones" the visitor can fly between by clicking 3D hotspots, the minimap,
 * or the navbar.
 *
 * Each node carries everything four different consumers need:
 *   - NavigationRig  → cameraPos / lookAt / fov  (the GSAP fly-in target)
 *   - HotspotMarker  → hotspotPos               (the clickable 3D marker)
 *   - Minimap        → minimapUV                (the overhead dot position)
 *   - ZonePanel      → service                  (the floating detail copy)
 *
 * The `index` (0..5) yields a `progress` fraction (index / 5) that maps onto
 * the existing day→dusk tween read by Sky / Lighting / Grass / Particles, so
 * those systems keep working untouched.
 */
export type ZoneId = 'entry' | 'lawn' | 'hedges' | 'flowerbeds' | 'patio' | 'contact';

export interface NavigationNode {
  id: ZoneId;
  index: number;
  label: string;
  eyebrow: string;

  /** Camera destination for the GSAP fly-in. */
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  fov: number;

  /** World-space position of the clickable hotspot marker. */
  hotspotPos: [number, number, number];

  /** Overhead minimap position, normalised 0..1 (u = x, v = y). */
  minimapUV: [number, number];

  /** Floating service panel content. */
  service: {
    title: string;
    oneLiner: string;
    bullets: string[];
    ctaLabel: string;
  };
}

export const NODES: NavigationNode[] = [
  {
    id: 'entry',
    index: 0,
    label: 'Entry',
    eyebrow: '01 · Welcome',
    cameraPos: [0, 1.7, 9],
    lookAt: [0, 1.2, 0],
    fov: 42,
    hotspotPos: [0, 1.1, 2.2],
    minimapUV: [0.5, 0.85],
    service: {
      title: 'A living garden, in your browser.',
      oneLiner:
        'Mowing, landscaping, hedging and seasonal care across the neighbourhood. Click a marker — or the map — to explore.',
      bullets: ['Local & fully insured', 'Free on-site quotes', 'Tidy, on-time crews'],
      ctaLabel: 'Get a quote',
    },
  },
  {
    id: 'lawn',
    index: 1,
    label: 'Lawn',
    eyebrow: '02 · Mowing',
    cameraPos: [4, 1.5, 4],
    lookAt: [0, 0.8, 0],
    fov: 48,
    hotspotPos: [-1.5, 0.9, 0.5],
    minimapUV: [0.65, 0.64],
    service: {
      title: 'Mowing',
      oneLiner: 'Crisp lines, every week or fortnight.',
      bullets: ['Weekly / bi-weekly visits', 'Striping on request', 'Edges + trimmer finish'],
      ctaLabel: 'Book a mow',
    },
  },
  {
    id: 'hedges',
    index: 2,
    label: 'Hedges',
    eyebrow: '03 · Hedging',
    cameraPos: [6.5, 3.4, 4],
    lookAt: [-1, 2.0, -3],
    fov: 44,
    hotspotPos: [1.2, 2.0, -3.2],
    minimapUV: [0.78, 0.44],
    service: {
      title: 'Hedging',
      oneLiner: 'Box, beech, privet — shaped with care.',
      bullets: ['Annual trim or sculpt', 'Tall hedges up to 4m', 'Clippings hauled away'],
      ctaLabel: 'Shape my hedges',
    },
  },
  {
    id: 'flowerbeds',
    index: 3,
    label: 'Flower Beds',
    eyebrow: '04 · Landscaping',
    cameraPos: [-6, 2.0, 2],
    lookAt: [0, 1.0, -5],
    fov: 46,
    hotspotPos: [-1.8, 1.0, -3.0],
    minimapUV: [0.24, 0.46],
    service: {
      title: 'Landscaping',
      oneLiner: 'From bare dirt to garden room.',
      bullets: ['Beds, borders & paths', 'Planting plans', 'Soil + mulch supply'],
      ctaLabel: 'Plan my garden',
    },
  },
  {
    id: 'patio',
    index: 4,
    label: 'Patio',
    eyebrow: '05 · Seasonal · Before / After',
    cameraPos: [0, 2.2, -1.5],
    lookAt: [0, 1.4, -10],
    fov: 38,
    hotspotPos: [0, 1.6, -8],
    minimapUV: [0.5, 0.32],
    service: {
      title: 'Seasonal cleanup',
      oneLiner: 'Spring wake-ups, autumn blowouts. Drag the seam to compare real yards.',
      bullets: ['Leaf removal', 'Deadheading + cutbacks', 'Winter prep'],
      ctaLabel: 'Book a cleanup',
    },
  },
  {
    id: 'contact',
    index: 5,
    label: 'Contact',
    eyebrow: '06 · Contact',
    cameraPos: [-2, 6.5, 6],
    lookAt: [0, 3.0, 0],
    fov: 44,
    hotspotPos: [0, 2.6, 0],
    minimapUV: [0.42, 0.54],
    service: {
      title: "Let's grow something.",
      oneLiner:
        "Drop a few details — we'll come look and send a quote within a business day.",
      bullets: ['Reply within 1 business day', 'No-obligation estimate', 'Flexible scheduling'],
      ctaLabel: 'Get a quote',
    },
  },
];

export const NODES_BY_ID: Record<ZoneId, NavigationNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
) as Record<ZoneId, NavigationNode>;

export const ZONE_ORDER: ZoneId[] = NODES.map((n) => n.id);

/** Progress fraction (0..1) for a zone — drives the day→dusk tween. */
export function nodeProgress(id: ZoneId): number {
  return NODES_BY_ID[id].index / (NODES.length - 1);
}
