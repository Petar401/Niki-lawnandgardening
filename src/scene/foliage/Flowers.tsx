import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { groundHeightAt } from '@/scene/terrain';

const PERF_COUNT: Record<'high' | 'medium' | 'low', number> = {
  high: 240,
  medium: 140,
  low: 70,
};

// Cluster centres — handfuls of blooms around landmark points so the camera
// finds colour at each waypoint.
const CLUSTERS: Array<[number, number, number]> = [
  // [x, z, radius]
  [-2.5, -6, 2.4], // hero foreground left
  [3, -7.5, 2.2], // hero foreground right
  [-5, 6, 2.4], // services area
  [6, 7, 2.6], // services area
  [-3, 22, 2.2], // gallery approach
  [2, 30, 2.0], // contact / mailbox
  [-2.5, 32, 1.9],
];

const PALETTE = [
  new THREE.Color('#f6c84c'), // gold
  new THREE.Color('#ef6b6b'), // poppy
  new THREE.Color('#dac0ff'), // lavender
  new THREE.Color('#ffffff'), // chamomile
  new THREE.Color('#ff9bcd'), // pink
];

const wind = new THREE.Vector2(0.3, 0.1);

/**
 * Instanced flower blooms. Each instance is a small disc + tiny stem cluster,
 * coloured from a 5-stop palette. Sways gently with the same prevailing
 * wind direction used by the grass.
 */
export function Flowers() {
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNT[perf];
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const seedsRef = useRef<Float32Array | null>(null);
  const basesRef = useRef<Float32Array | null>(null); // [x, y, z, angleSeed]

  const transforms = useMemo(() => {
    const seeds = new Float32Array(count);
    const bases = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const cluster = CLUSTERS[i % CLUSTERS.length]!;
      const [cx, cz, r] = cluster;
      const a = Math.random() * Math.PI * 2;
      const rr = Math.pow(Math.random(), 0.6) * r;
      const x = cx + Math.cos(a) * rr;
      const z = cz + Math.sin(a) * rr;
      const y = groundHeightAt(x, z);
      bases[i * 4 + 0] = x;
      bases[i * 4 + 1] = y;
      bases[i * 4 + 2] = z;
      bases[i * 4 + 3] = Math.random() * Math.PI * 2;
      seeds[i] = Math.random();
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { seeds, bases, colors };
  }, [count]);

  useEffect(() => {
    seedsRef.current = transforms.seeds;
    basesRef.current = transforms.bases;

    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const x = transforms.bases[i * 4 + 0]!;
      const y = transforms.bases[i * 4 + 1]!;
      const z = transforms.bases[i * 4 + 2]!;
      const a = transforms.bases[i * 4 + 3]!;
      const scale = 0.12 + transforms.seeds[i]! * 0.18;
      dummy.position.set(x, y + 0.18, z);
      dummy.rotation.set(0, a, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, new THREE.Color(
        transforms.colors[i * 3 + 0]!,
        transforms.colors[i * 3 + 1]!,
        transforms.colors[i * 3 + 2]!,
      ));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.count = count;
  }, [count, transforms]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((s) => {
    const mesh = meshRef.current;
    const bases = basesRef.current;
    const seeds = seedsRef.current;
    if (!mesh || !bases || !seeds || useSceneStore.getState().reducedMotion) return;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const x = bases[i * 4 + 0]!;
      const y = bases[i * 4 + 1]!;
      const z = bases[i * 4 + 2]!;
      const a = bases[i * 4 + 3]!;
      const seed = seeds[i]!;
      const scale = 0.12 + seed * 0.18;
      const swayPhase = t * 1.3 + seed * 6.2;
      const sway = Math.sin(swayPhase) * 0.05;
      dummy.position.set(x + wind.x * sway, y + 0.18, z + wind.y * sway);
      dummy.rotation.set(0, a + sway * 0.6, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      {/* Small bloom: cone-tipped puff that catches a directional light from any side. */}
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial vertexColors={false} roughness={0.7} flatShading />
    </instancedMesh>
  );
}
