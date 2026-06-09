import { asset } from '@/lib/asset';

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
    before: asset('photos/before-1.webp'),
    after: asset('photos/after-1.webp'),
    position: [-3.6, 2.2, -10.5],
    rotationY: 0.32,
  },
  {
    id: 'yard-2',
    caption: 'Back yard · landscape refresh + reseed',
    before: asset('photos/before-2.webp'),
    after: asset('photos/after-2.webp'),
    position: [3.6, 2.2, -10.5],
    rotationY: -0.32,
  },
];

/** Bell curve around the patio zone progress (0.8) for fade-in. */
export function galleryIntensity(progress: number): number {
  const center = 0.8;
  const halfWidth = 0.22;
  const d = Math.abs(progress - center) / halfWidth;
  return Math.max(0, 1 - d);
}
