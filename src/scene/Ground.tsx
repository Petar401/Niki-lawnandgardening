import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { fbm } from './terrain';

const SIZE = 110;
const SEGMENTS = 96;

const DAY_DIRT = new THREE.Color('#3a2a1a');
const DUSK_DIRT = new THREE.Color('#241a2a');

/**
 * Rolling earth surface. Two octaves of value-noise give large rises plus
 * fine grain; the standard material picks up sun + dusk lighting via
 * `Lighting.tsx`. Color tints toward dusk via the shared store.
 */
export function Ground() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const baseColorRef = useRef(DAY_DIRT.clone());

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Two scales: large dunes + small grain.
      const large = fbm(x * 0.04, z * 0.04);
      const small = fbm(x * 0.18, z * 0.18);
      const y = large * 0.9 + small * 0.18 - 0.6;
      pos.setY(i, y);

      // Per-vertex tint: greener in low spots, drier on rises, so the grass
      // shader sitting on top reads "earth", not flat colour.
      const moss = 0.55 + (1 - large) * 0.4;
      const dry = 0.4 + small * 0.2;
      colors[i * 3 + 0] = 0.18 + dry * 0.18;
      colors[i * 3 + 1] = 0.18 + moss * 0.22;
      colors[i * 3 + 2] = 0.12 + moss * 0.1;
    }
    pos.needsUpdate = true;
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(() => {
    const m = matRef.current;
    if (!m) return;
    baseColorRef.current.lerpColors(DAY_DIRT, DUSK_DIRT, useSceneStore.getState().shared.dusk);
    m.color.copy(baseColorRef.current);
  });

  return (
    <mesh geometry={geometry} receiveShadow position={[0, 0, 0]}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        color={DAY_DIRT}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
