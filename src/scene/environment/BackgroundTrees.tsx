import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const TREE_POSITIONS: [number, number][] = [
  [-28, -30], [-22, -33], [-16, -35], [-10, -36], [-5, -37], [0, -38],
  [5, -37],   [11, -36],  [17, -35],  [23, -33],  [28, -30],
  [-25, -42], [-15, -44], [-5, -45],  [5, -45],   [15, -44], [25, -42],
  [-8, -32],  [8, -32],   [0, -34],
];

const TREE_SCALES = [1.0, 0.85, 1.1, 0.9, 1.2, 0.8, 1.15, 0.95, 1.05, 0.75,
                     1.0, 0.9, 1.1, 0.85, 0.95, 1.05, 0.8, 1.3, 1.1, 1.0];

const CANOPY_COLORS = [
  '#1a4a1a', '#1e5520', '#245e22', '#1c5218', '#206018',
  '#2d6e2d', '#236523', '#1f5a1f', '#28682a', '#1b4e1b',
];

const TRUNK_GEO = new THREE.CylinderGeometry(0.18, 0.24, 1.8, 6);
const CANOPY_GEO = new THREE.ConeGeometry(2.2, 4, 7);
const TRUNK_MAT = new THREE.MeshStandardMaterial({ color: '#4a3728', roughness: 1 });

const DUMMY = new THREE.Object3D();

export function BackgroundTrees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const canopyMaterials = useMemo(
    () => CANOPY_COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 })),
    [],
  );

  // Use a single averaged canopy color for instanced mesh (variation via scale/pos)
  const canopyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#225522', roughness: 0.9, metalness: 0 }),
    [],
  );

  useMemo(() => {
    const count = TREE_POSITIONS.length;
    if (!trunkRef.current || !canopyRef.current) return;
    for (let i = 0; i < count; i++) {
      const [x, z] = TREE_POSITIONS[i];
      const scale = TREE_SCALES[i] ?? 1;

      DUMMY.position.set(x, 0.9 * scale, z);
      DUMMY.scale.set(scale, scale, scale);
      DUMMY.rotation.set(0, 0, 0);
      DUMMY.updateMatrix();
      trunkRef.current.setMatrixAt(i, DUMMY.matrix);

      DUMMY.position.set(x, (1.8 + 2.0) * scale, z);
      DUMMY.scale.set(scale, scale, scale);
      DUMMY.updateMatrix();
      canopyRef.current.setMatrixAt(i, DUMMY.matrix);
    }
    trunkRef.current.instanceMatrix.needsUpdate = true;
    canopyRef.current.instanceMatrix.needsUpdate = true;
    void canopyMaterials; // keep ref to avoid GC
  }, [canopyMaterials]);

  const count = TREE_POSITIONS.length;

  return (
    <>
      <instancedMesh ref={trunkRef} args={[TRUNK_GEO, TRUNK_MAT, count]} castShadow receiveShadow />
      <instancedMesh ref={canopyRef} args={[CANOPY_GEO, canopyMat, count]} castShadow receiveShadow />
    </>
  );
}
