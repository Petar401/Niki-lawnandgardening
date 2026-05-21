import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { blendPalette } from '../season';

/**
 * Background trees: trunk (cylinder) + canopy (icosahedron, displaced
 * for roughness). Three of them at varying distances act as visual
 * anchors. Canopy colour follows the season palette so they turn
 * orange in autumn and gain a frosty cast in winter.
 */
const TREE_POSITIONS: Array<[number, number, number, number]> = [
  // x, z, scale, hueShift
  [-9, -16, 1.4, 0],
  [10, -19, 1.7, 0.1],
  [-3, -32, 2.2, -0.05],
  [6, -36, 2.5, 0.05],
];

export function Trees() {
  return (
    <group>
      {TREE_POSITIONS.map((p, i) => (
        <Tree key={i} x={p[0]} z={p[1]} scale={p[2]} hueShift={p[3]} />
      ))}
    </group>
  );
}

function Tree({ x, z, scale, hueShift }: { x: number; z: number; scale: number; hueShift: number }) {
  const trunkMat = useRef<THREE.MeshStandardMaterial>(null);
  const canopyMat = useRef<THREE.MeshStandardMaterial>(null);

  const canopyGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const r = 0.85 + Math.random() * 0.35;
      pos.setX(i, pos.getX(i) * r);
      pos.setY(i, pos.getY(i) * (r * 1.1));
      pos.setZ(i, pos.getZ(i) * r);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(() => {
    const { seasonClock, seasonOverride } = useSceneStore.getState();
    const pal = blendPalette(seasonClock, seasonOverride);
    if (canopyMat.current) {
      canopyMat.current.color.copy(pal.leaf);
      if (hueShift) canopyMat.current.color.offsetHSL(hueShift, 0, 0);
    }
    if (trunkMat.current) trunkMat.current.color.setRGB(0.27, 0.18, 0.12);
  });

  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.3, 2.8, 8]} />
        <meshStandardMaterial ref={trunkMat} color="#5a3d24" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.6, 0]} geometry={canopyGeo} castShadow receiveShadow>
        <meshStandardMaterial ref={canopyMat} color="#3f8a3c" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}
