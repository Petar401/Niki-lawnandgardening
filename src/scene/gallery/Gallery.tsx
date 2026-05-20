import { Suspense } from 'react';
import { useTexture } from '@react-three/drei';

import { PAIRS } from './galleryData';
import { Gate } from './Gate';
import { BeforeAfterPlane } from './BeforeAfterPlane';

/**
 * Gallery composition: stylised gate at centre, two before/after planes
 * angled slightly inward toward the camera. Suspense-wrapped so the
 * canvas doesn't choke while the WebPs load — until then the gate
 * shows alone.
 */
export function Gallery() {
  return (
    <group>
      <Gate />
      <Suspense fallback={null}>
        {PAIRS.map((p) => (
          <BeforeAfterPlane key={p.id} pair={p} />
        ))}
      </Suspense>
    </group>
  );
}

// Kick off texture downloads early so they're warm by the time the user
// scrolls into the gallery waypoint.
useTexture.preload([
  '/photos/before-1.webp',
  '/photos/after-1.webp',
  '/photos/before-2.webp',
  '/photos/after-2.webp',
]);
