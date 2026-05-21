export type ServiceId = 'mowing' | 'landscaping' | 'hedging' | 'seasonal';

export interface Service {
  id: ServiceId;
  title: string;
  oneLiner: string;
  bullets: string[];
  /** World-space orb anchor for the services waypoint framing. */
  position: [number, number, number];
  /** Orb tint (attenuation color through the glass). */
  tint: string;
  /** Side the hover panel pops out toward (offset direction). */
  panelOffset: [number, number, number];
}

export const SERVICES: Service[] = [
  {
    id: 'mowing',
    title: 'Mowing',
    oneLiner: 'Crisp lines, every week or fortnight.',
    bullets: ['Weekly / bi-weekly visits', 'Striping on request', 'Edges + trimmer'],
    position: [-4.2, 2.2, -2.4],
    tint: '#bcdbba',
    panelOffset: [-2.3, 0.6, 0],
  },
  {
    id: 'landscaping',
    title: 'Landscaping',
    oneLiner: 'From bare dirt to garden room.',
    bullets: ['Beds, borders, paths', 'Planting plans', 'Soil + mulch'],
    position: [-1.6, 2.8, -3.2],
    tint: '#f0d29a',
    panelOffset: [0, 1.5, 0],
  },
  {
    id: 'hedging',
    title: 'Hedging',
    oneLiner: 'Box, beech, privet — shaped with care.',
    bullets: ['Annual trim or sculpt', 'Tall hedges up to 4m', 'Clippings hauled'],
    position: [1.2, 2.4, -3.4],
    tint: '#dfeede',
    panelOffset: [0, 1.5, 0],
  },
  {
    id: 'seasonal',
    title: 'Seasonal cleanup',
    oneLiner: 'Spring wake-ups, fall blowouts.',
    bullets: ['Leaf removal', 'Deadheading + cutbacks', 'Winter prep'],
    position: [3.6, 3.0, -2.6],
    tint: '#ffe9a8',
    panelOffset: [2.3, 0.6, 0],
  },
];

/** Bell curve around the services waypoint progress (~0.33) for fade-in/out. */
export function servicesIntensity(progress: number): number {
  const center = 0.33;
  const halfWidth = 0.25;
  const d = Math.abs(progress - center) / halfWidth;
  return Math.max(0, 1 - d);
}
