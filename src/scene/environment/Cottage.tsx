import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const STONE_MAT  = new THREE.MeshStandardMaterial({ color: '#b8a898', roughness: 0.9, metalness: 0 });
const ROOF_MAT   = new THREE.MeshStandardMaterial({ color: '#6b7280', roughness: 0.85, metalness: 0 });
const DOOR_MAT   = new THREE.MeshStandardMaterial({ color: '#3d2b1a', roughness: 0.8, metalness: 0 });
const ROSE_MAT   = new THREE.MeshStandardMaterial({ color: '#f0819a', roughness: 0.7, metalness: 0 });

const WINDOW_MAT = new THREE.MeshStandardMaterial({
  color: '#ffd080',
  emissive: '#ffd080',
  emissiveIntensity: 0.35,
  roughness: 0.2,
  metalness: 0,
});

const BODY_GEO    = new THREE.BoxGeometry(5.0, 3.0, 4.0);
const ROOF_PANEL  = new THREE.BoxGeometry(5.6, 0.18, 2.4);
const CHIMNEY_GEO = new THREE.BoxGeometry(0.5, 2.0, 0.5);
const WINDOW_GEO  = new THREE.BoxGeometry(0.8, 0.7, 0.12);
const DOOR_GEO    = new THREE.BoxGeometry(0.7, 1.4, 0.12);
const ROSE_GEO    = new THREE.SphereGeometry(0.07, 4, 4);

const DUMMY = new THREE.Object3D();

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const ROSE_POSITIONS: [number, number, number][] = (() => {
  const rand = seededRand(7);
  return Array.from({ length: 28 }, () => [
    (rand() - 0.5) * 4.4,
    1.4 + rand() * 2.0,
    2.05,
  ]);
})();

export function Cottage() {
  const roseRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!roseRef.current) return;
    ROSE_POSITIONS.forEach(([x, y, z], i) => {
      DUMMY.position.set(x, y, z);
      DUMMY.scale.setScalar(1);
      DUMMY.updateMatrix();
      roseRef.current!.setMatrixAt(i, DUMMY.matrix);
    });
    roseRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group position={[0, 0, -20]}>
      {/* Main body */}
      <mesh geometry={BODY_GEO} material={STONE_MAT} position={[0, 1.5, 0]} castShadow receiveShadow />

      {/* Gabled roof — two angled panels */}
      <mesh geometry={ROOF_PANEL} material={ROOF_MAT}
        position={[0, 3.25, -0.9]} rotation={[-Math.PI * 0.19, 0, 0]} castShadow />
      <mesh geometry={ROOF_PANEL} material={ROOF_MAT}
        position={[0, 3.25,  0.9]} rotation={[ Math.PI * 0.19, 0, 0]} castShadow />

      {/* Ridge cap */}
      <mesh material={ROOF_MAT} castShadow>
        <boxGeometry args={[5.6, 0.22, 0.22]} />
        <primitive object={ROOF_MAT} attach="material" />
      </mesh>
      <mesh position={[0, 3.55, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[5.6, 0.22, 0.22]} />
        <primitive object={ROOF_MAT} attach="material" />
      </mesh>

      {/* Chimney */}
      <mesh geometry={CHIMNEY_GEO} material={STONE_MAT}
        position={[1.6, 4.0, 0]} castShadow />

      {/* Windows — 2 on front face */}
      <mesh geometry={WINDOW_GEO} material={WINDOW_MAT} position={[-1.2, 1.8,  2.07]} />
      <mesh geometry={WINDOW_GEO} material={WINDOW_MAT} position={[ 1.2, 1.8,  2.07]} />
      {/* Windows — 1 on each side */}
      <mesh geometry={WINDOW_GEO} material={WINDOW_MAT} position={[-2.57, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={WINDOW_GEO} material={WINDOW_MAT} position={[ 2.57, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Door */}
      <mesh geometry={DOOR_GEO} material={DOOR_MAT} position={[0, 0.7, 2.07]} />

      {/* Climbing roses on front face */}
      <instancedMesh ref={roseRef} args={[ROSE_GEO, ROSE_MAT, ROSE_POSITIONS.length]} castShadow />
    </group>
  );
}
