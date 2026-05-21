import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { groundHeightAt } from '@/scene/terrain';

const PERF_COUNT: Record<'high' | 'medium' | 'low', number> = {
  high: 7,
  medium: 5,
  low: 3,
};

// Hand-placed candidate trunk positions; trees pick the first `count` of these.
// Kept off the camera path's flythrough corridor (Z axis spine).
const SPOTS: Array<[number, number]> = [
  [-9, -4],
  [9, -2],
  [-13, 6],
  [12, 8],
  [-7, 18],
  [10, 20],
  [-16, -12],
];

const TRUNK = new THREE.Color('#3a2516');
const CANOPY_DAY = new THREE.Color('#2f6a32');
const CANOPY_DUSK = new THREE.Color('#3b3a6a');

/**
 * Low-poly stylised trees flanking the camera path. Each tree is one
 * cylinder trunk + two icosahedron canopies on a shared group; the canopy
 * tint lerps to dusk via the shared store so the woods don't read flat-green
 * at sunset.
 */
export function Trees() {
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNT[perf];
  const groupRef = useRef<THREE.Group>(null);
  const canopyColor = useRef(CANOPY_DAY.clone());

  const trees = useMemo(() => {
    return SPOTS.slice(0, count).map(([x, z], i) => {
      const seed = (i + 1) * 13.37;
      const yawn = (Math.sin(seed) * 0.5 + 0.5) * Math.PI * 2;
      const heightScale = 0.85 + ((Math.sin(seed * 1.7) + 1) / 2) * 0.5;
      const widthScale = 0.85 + ((Math.cos(seed * 2.3) + 1) / 2) * 0.4;
      return {
        x,
        z,
        y: groundHeightAt(x, z),
        yawn,
        heightScale,
        widthScale,
        key: `${x}_${z}`,
      };
    });
  }, [count]);

  const canopyRefs = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame(() => {
    const dusk = useSceneStore.getState().shared.dusk;
    canopyColor.current.lerpColors(CANOPY_DAY, CANOPY_DUSK, dusk);
    for (const m of canopyRefs.current) m.color.copy(canopyColor.current);
  });

  return (
    <group ref={groupRef}>
      {trees.map((t, i) => (
        <group key={t.key} position={[t.x, t.y, t.z]} rotation={[0, t.yawn, 0]}>
          <mesh castShadow position={[0, 1.7 * t.heightScale, 0]}>
            <cylinderGeometry args={[0.18 * t.widthScale, 0.32 * t.widthScale, 3.4 * t.heightScale, 6]} />
            <meshStandardMaterial color={TRUNK} roughness={1} metalness={0} />
          </mesh>
          <mesh castShadow position={[0, 3.7 * t.heightScale, 0]} scale={[1.4 * t.widthScale, 1.2 * t.heightScale, 1.4 * t.widthScale]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) canopyRefs.current[i * 2] = m;
              }}
              color={CANOPY_DAY}
              roughness={0.85}
              metalness={0}
              flatShading
            />
          </mesh>
          <mesh
            castShadow
            position={[0.45 * t.widthScale, 4.4 * t.heightScale, -0.2 * t.widthScale]}
            scale={[0.9 * t.widthScale, 0.85 * t.heightScale, 0.9 * t.widthScale]}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) canopyRefs.current[i * 2 + 1] = m;
              }}
              color={CANOPY_DAY}
              roughness={0.85}
              metalness={0}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
