import * as THREE from 'three';

/**
 * Four cinematic waypoints. The user scrolls; we sample a Catmull-Rom curve
 * through these to get smooth camera position + lookAt simultaneously.
 *
 *   t = 0.00  Hero      → standing in the field, sun ahead
 *   t = 0.33  Services  → swoop right + up, surveying the garden
 *   t = 0.66  Gallery   → drift forward, looking deeper into the world
 *   t = 1.00  Contact   → lift and pull back as dusk arrives
 *
 * Slight roll banking is implied by how lookAt vs. position differ at each
 * waypoint; for a real bank-angle we could pass a third "up" curve, but
 * the natural look-direction tilt is enough to feel cinematic.
 */
export interface Waypoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  /** Optional FOV per waypoint — lets us cut wide for services, tight on contact. */
  fov?: number;
}

export const WAYPOINTS: Waypoint[] = [
  { position: [0,    1.7, 9],   lookAt: [0,   1.2,  0],   fov: 42 }, // Hero
  { position: [6.5,  3.4, 4],   lookAt: [-1,  2.0, -3],   fov: 48 }, // Services
  { position: [0,    2.2,-1.5], lookAt: [0,   1.4, -10],  fov: 38 }, // Gallery
  { position: [-2,   6.5, 6],   lookAt: [0,   3.0,  0],   fov: 44 }, // Contact
];

const toV3 = (a: [number, number, number]) => new THREE.Vector3(a[0], a[1], a[2]);

export function buildCameraPath() {
  const positions = WAYPOINTS.map((w) => toV3(w.position));
  const targets = WAYPOINTS.map((w) => toV3(w.lookAt));

  const positionCurve = new THREE.CatmullRomCurve3(positions, false, 'catmullrom', 0.4);
  const targetCurve = new THREE.CatmullRomCurve3(targets, false, 'catmullrom', 0.4);

  // Pre-allocated scratch so callers don't churn the GC on the hot path.
  const pos = new THREE.Vector3();
  const tgt = new THREE.Vector3();

  return {
    /** Sample the rig at t in [0,1]. Mutates the returned vectors. */
    sample(t: number) {
      const clamped = Math.min(1, Math.max(0, t));
      positionCurve.getPointAt(clamped, pos);
      targetCurve.getPointAt(clamped, tgt);

      // Lerp FOV between the two flanking waypoints.
      const seg = clamped * (WAYPOINTS.length - 1);
      const i = Math.min(WAYPOINTS.length - 2, Math.floor(seg));
      const f = seg - i;
      const fov = THREE.MathUtils.lerp(
        WAYPOINTS[i].fov ?? 42,
        WAYPOINTS[i + 1].fov ?? 42,
        f,
      );

      return { position: pos, target: tgt, fov };
    },
  };
}

/** Map raw scroll progress to a scene phase for UI/store/analytics. */
export function progressToPhase(p: number): 'hero' | 'services' | 'gallery' | 'contact' {
  if (p < 0.22) return 'hero';
  if (p < 0.55) return 'services';
  if (p < 0.85) return 'gallery';
  return 'contact';
}
