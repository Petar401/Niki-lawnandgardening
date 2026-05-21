import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { groundHeightAt } from '@/scene/terrain';

const DAY = new THREE.Color('#2c5f2f');
const DUSK = new THREE.Color('#2e3060');

const SPOTS: Array<[number, number]> = [
  [-3.4, -10.5], // hero left
  [3.4, -10.5], // hero right (mirror)
];

/**
 * Pair of sphere-pruned hedge ornaments flanking the hero waypoint. Two
 * stacked spheres (small over large) on a short stone plinth. Tints with dusk.
 */
export function Topiary() {
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const tint = useRef(DAY.clone());

  useFrame(() => {
    tint.current.lerpColors(DAY, DUSK, useSceneStore.getState().shared.dusk);
    for (const m of mats.current) m.color.copy(tint.current);
  });

  return (
    <group>
      {SPOTS.map(([x, z]) => {
        const y = groundHeightAt(x, z);
        return (
          <group key={`${x}_${z}`} position={[x, y, z]}>
            {/* Stone plinth */}
            <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.45, 0.5, 0.36, 12]} />
              <meshStandardMaterial color="#8a8270" roughness={1} />
            </mesh>
            {/* Large bottom sphere */}
            <mesh castShadow position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.75, 16, 14]} />
              <meshStandardMaterial
                ref={(m) => {
                  if (m) mats.current.push(m);
                }}
                color={DAY}
                roughness={0.85}
                flatShading
              />
            </mesh>
            {/* Smaller crown */}
            <mesh castShadow position={[0, 1.95, 0]}>
              <sphereGeometry args={[0.45, 14, 12]} />
              <meshStandardMaterial
                ref={(m) => {
                  if (m) mats.current.push(m);
                }}
                color={DAY}
                roughness={0.85}
                flatShading
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
