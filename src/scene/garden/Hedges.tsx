import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { blendPalette } from '../season';

/**
 * Procedural boxwood hedge: a row of slightly rough, rounded
 * boxes positioned along the left and right of the camera path
 * and around the gallery. Instanced — one draw call.
 */

const PERF_COUNTS: Record<'high' | 'medium' | 'low', number> = {
  high: 64,
  medium: 36,
  low: 20,
};

export function Hedges() {
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNTS[perf];
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  // Slightly irregular rounded-box geometry — feels organic.
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1.2, 1.1, 1.2, 6, 4, 6);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Round the corners by pushing vertices toward sphere.
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;
      const r = 0.78;
      pos.setX(i, THREE.MathUtils.lerp(x, nx * r, 0.45) + (Math.random() - 0.5) * 0.04);
      pos.setY(i, THREE.MathUtils.lerp(y, ny * r, 0.45) + (Math.random() - 0.5) * 0.04);
      pos.setZ(i, THREE.MathUtils.lerp(z, nz * r, 0.45) + (Math.random() - 0.5) * 0.04);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const half = Math.floor(count / 2);
    let idx = 0;
    // Two long borders flanking the path, gently curved away from camera.
    for (const side of [-1, 1]) {
      for (let i = 0; i < half; i++) {
        const t = i / Math.max(1, half - 1);
        const z = THREE.MathUtils.lerp(6, -26, t);
        const x = side * (4.5 + Math.sin(t * Math.PI * 1.3) * 0.4);
        const y = 0.5 + Math.sin(t * Math.PI) * 0.05;
        const scale = 0.85 + Math.random() * 0.35;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
        dummy.scale.set(scale, scale * 0.95, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx++, dummy.matrix);
      }
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame(() => {
    const { seasonClock, seasonOverride } = useSceneStore.getState();
    const pal = blendPalette(seasonClock, seasonOverride);
    if (matRef.current) matRef.current.color.copy(pal.leaf).multiplyScalar(0.65);
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} castShadow receiveShadow frustumCulled={false}>
      <meshStandardMaterial ref={matRef} color="#2e6e2c" roughness={0.85} metalness={0} flatShading />
    </instancedMesh>
  );
}
