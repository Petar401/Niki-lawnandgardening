import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { groundHeightAt } from '@/scene/terrain';

const PERF_COUNT: Record<'high' | 'medium' | 'low', number> = {
  high: 18,
  medium: 12,
  low: 8,
};

const HEDGE_DAY = new THREE.Color('#284c2a');
const HEDGE_DUSK = new THREE.Color('#2a2c4a');

// Two parallel rows that flank the central corridor through the camera path.
// Range covers from the services area down past the gallery gate.
function placements(count: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const z = -8 + t * 32; // -8 (services side) -> 24 (gallery approach)
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * 4.5 + Math.sin(i * 1.7) * 0.4;
    out.push([x, z]);
  }
  return out;
}

/**
 * Instanced box hedges lining the path. One InstancedMesh, one draw call.
 * Tint lerps to dusk via the shared store.
 */
export function Hedges() {
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNT[perf];
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tint = useRef(HEDGE_DAY.clone());

  const spots = useMemo(() => placements(count), [count]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < spots.length; i++) {
      const [x, z] = spots[i]!;
      const y = groundHeightAt(x, z);
      // Slight per-instance variation so the row doesn't look stamped.
      const lenScale = 0.9 + Math.sin(i * 2.1) * 0.1;
      const heightScale = 0.9 + Math.cos(i * 1.7) * 0.08;
      dummy.position.set(x, y + 0.55 * heightScale, z);
      dummy.rotation.set(0, Math.sin(i * 0.7) * 0.06, 0);
      dummy.scale.set(lenScale, heightScale, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = spots.length;
  }, [spots]);

  useFrame(() => {
    if (!matRef.current) return;
    tint.current.lerpColors(HEDGE_DAY, HEDGE_DUSK, useSceneStore.getState().shared.dusk);
    matRef.current.color.copy(tint.current);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[1.6, 1.1, 0.95, 1, 1, 1]} />
      <meshStandardMaterial ref={matRef} color={HEDGE_DAY} roughness={0.9} flatShading />
    </instancedMesh>
  );
}
