import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore, type Season } from '@/store/useSceneStore';
import { blendPalette } from '../season';

/**
 * Butterflies + bees. Each is a single triangle pair (two wings) with a
 * simple flap shader, following a per-instance Bezier path looped in
 * time. Count adapts to perf tier and goes to zero in winter / when
 * `reducedMotion` is set.
 */

const PERF_COUNTS: Record<'high' | 'medium' | 'low', number> = {
  high: 10,
  medium: 5,
  low: 0,
};

interface Butterfly {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  p3: THREE.Vector3;
  speed: number;
  phase: number;
  size: number;
  color: THREE.Color;
}

function randomPath(): Butterfly {
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  // Path waypoints kept in front of camera mostly.
  return {
    p0: new THREE.Vector3(rand(-4, 4), rand(0.7, 2.2), rand(-6, 2)),
    p1: new THREE.Vector3(rand(-3, 3), rand(1.2, 2.8), rand(-8, 1)),
    p2: new THREE.Vector3(rand(-3, 3), rand(1.0, 2.5), rand(-9, 0)),
    p3: new THREE.Vector3(rand(-4, 4), rand(0.8, 2.4), rand(-7, 2)),
    speed: rand(0.05, 0.11),
    phase: Math.random(),
    size: rand(0.13, 0.22),
    color: new THREE.Color().setHSL(rand(0, 1), 0.7, 0.65),
  };
}

function bezier(t: number, b: Butterfly, out: THREE.Vector3) {
  const u = 1 - t;
  const t2 = t * t;
  const u2 = u * u;
  out
    .copy(b.p0)
    .multiplyScalar(u2 * u)
    .addScaledVector(b.p1, 3 * u2 * t)
    .addScaledVector(b.p2, 3 * u * t2)
    .addScaledVector(b.p3, t2 * t);
}

export function Wildlife() {
  const perf = useSceneStore((s) => s.perf);
  const reduced = useSceneStore((s) => s.reducedMotion);
  const baseCount = PERF_COUNTS[perf];

  const butterflies = useMemo(() => {
    const out: Butterfly[] = [];
    for (let i = 0; i < baseCount; i++) out.push(randomPath());
    return out;
  }, [baseCount]);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchObj = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Two-triangle "wing" geometry — looks like a small butterfly when scaled.
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array([
      // left wing
      0, 0, 0, -1, 0, -0.3, -1, 0, 0.3,
      // right wing
      0, 0, 0, 1, 0, 0.3, 1, 0, -0.3,
    ]);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || reduced || baseCount === 0) return;

    const { seasonClock, seasonOverride } = useSceneStore.getState();
    const pal = blendPalette(seasonClock, seasonOverride);

    // In winter, hide them entirely.
    const winter = isWinter(seasonClock, seasonOverride);
    if (winter) {
      mesh.count = 0;
      return;
    }
    mesh.count = baseCount;

    const time = state.clock.elapsedTime;
    for (let i = 0; i < baseCount; i++) {
      const b = butterflies[i];
      const t = (b.phase + time * b.speed) % 1;
      bezier(t, b, scratchPos);
      // Flap: scale around y, rapid sine
      const flap = 0.6 + Math.abs(Math.sin(time * 14 + i)) * 0.4;
      scratchObj.position.copy(scratchPos);
      scratchObj.rotation.set(0, time * 0.4 + i, 0);
      scratchObj.scale.set(b.size * flap, b.size, b.size);
      scratchObj.updateMatrix();
      mesh.setMatrixAt(i, scratchObj.matrix);
      tmpColor.copy(b.color).lerp(pal.bloomColor, 0.4);
      mesh.setColorAt(i, tmpColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  if (baseCount === 0 || reduced) return null;
  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, baseCount]} frustumCulled={false}>
      <meshBasicMaterial vertexColors transparent opacity={0.95} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function isWinter(clock: number, override: Season | null): boolean {
  if (override) return override === 'winter';
  const c = ((clock % 4) + 4) % 4;
  return c >= 3;
}
