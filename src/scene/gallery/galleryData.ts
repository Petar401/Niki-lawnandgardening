export interface GalleryPair {
  id: string;
  caption: string;
  before: string;
  after: string;
  /** World-space position of the plane (centre). */
  position: [number, number, number];
  /** Y-axis tilt so side planes angle slightly inward. */
  rotationY?: number;
}

export const PAIRS: GalleryPair[] = [
  {
    id: 'yard-1',
    caption: 'Front yard · weekly mow + edged borders',
    before: '/photos/before-1.webp',
    after: '/photos/after-1.webp',
    position: [-3.6, 2.2, -10.5],
    rotationY: 0.32,
  },
  {
    id: 'yard-2',
    caption: 'Back yard · landscape refresh + reseed',
    before: '/photos/before-2.webp',
    after: '/photos/after-2.webp',
    position: [3.6, 2.2, -10.5],
    rotationY: -0.32,
  },
];

/** Bell curve around the gallery waypoint progress (~0.66) for fade-in. */
export function galleryIntensity(progress: number): number {
  const center = 0.66;
  const halfWidth = 0.25;
  const d = Math.abs(progress - center) / halfWidth;
  return Math.max(0, 1 - d);
}
