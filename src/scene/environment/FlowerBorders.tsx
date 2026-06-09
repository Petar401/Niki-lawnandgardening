import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

const LEFT_COLORS  = ['#e87ea1', '#c0392b', '#9b59b6', '#f5f5f0', '#e87ea1', '#9b59b6'];
const RIGHT_COLORS = ['#4a90d9', '#a8d8ea', '#f4a0b5', '#fff8dc', '#5dade2', '#a8d8ea'];

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function buildFlowerData(side: 'left' | 'right', count: number) {
  const rand = seededRand(side === 'left' ? 42 : 137);
  const colors = side === 'left' ? LEFT_COLORS : RIGHT_COLORS;
  const xSign = side === 'left' ? -1 : 1;

  const positions: THREE.Vector3[] = [];
  const colorList: THREE.Color[] = [];

  for (let i = 0; i < count; i++) {
    const x = xSign * (6 + rand() * 10);
    const z = -rand() * 22;
    const xOff = (rand() - 0.5) * 1.2;
    const zOff = (rand() - 0.5) * 0.8;
    positions.push(new THREE.Vector3(x + xOff, 0, z + zOff));
    colorList.push(new THREE.Color(colors[Math.floor(rand() * colors.length)]));
  }
  return { positions, colorList };
}

const DUMMY = new THREE.Object3D();
const HEAD_GEO = new THREE.SphereGeometry(0.09, 5, 5);
const STEM_GEO = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4);
const STEM_MAT = new THREE.MeshStandardMaterial({ color: '#2d6e2c', roughness: 0.9 });

function FlowerSide({ side, count }: { side: 'left' | 'right'; count: number }) {
  const headRef = useRef<THREE.InstancedMesh>(null);
  const stemRef = useRef<THREE.InstancedMesh>(null);

  const { positions, colorList } = useMemo(() => buildFlowerData(side, count), [side, count]);

  const headMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0 });
  }, []);

  const colorAttr = useMemo(() => {
    const arr = new Float32Array(count * 3);
    colorList.forEach((c, i) => { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; });
    return new THREE.InstancedBufferAttribute(arr, 3);
  }, [colorList, count]);

  useMemo(() => {
    if (!headRef.current || !stemRef.current) return;
    positions.forEach((p, i) => {
      DUMMY.position.set(p.x, 0.4, p.z);
      DUMMY.scale.setScalar(1);
      DUMMY.updateMatrix();
      headRef.current!.setMatrixAt(i, DUMMY.matrix);

      DUMMY.position.set(p.x, 0.2, p.z);
      DUMMY.updateMatrix();
      stemRef.current!.setMatrixAt(i, DUMMY.matrix);
    });
    headRef.current!.instanceMatrix.needsUpdate = true;
    stemRef.current!.instanceMatrix.needsUpdate = true;
  }, [positions]);

  // Attach color attribute after mount
  useFrame(() => {
    if (headRef.current && !headRef.current.geometry.attributes.color) {
      headRef.current.geometry.setAttribute('color', colorAttr);
      positions.forEach((p, i) => {
        DUMMY.position.set(p.x, 0.4, p.z);
        DUMMY.scale.setScalar(1);
        DUMMY.updateMatrix();
        headRef.current!.setMatrixAt(i, DUMMY.matrix);

        DUMMY.position.set(p.x, 0.2, p.z);
        DUMMY.updateMatrix();
        stemRef.current!.setMatrixAt(i, DUMMY.matrix);
      });
      headRef.current.instanceMatrix.needsUpdate = true;
      stemRef.current!.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={headRef} args={[HEAD_GEO, headMat, count]} castShadow />
      <instancedMesh ref={stemRef} args={[STEM_GEO, STEM_MAT, count]} />
    </>
  );
}

export function FlowerBorders() {
  const perf = useSceneStore((s) => s.perf);
  if (perf === 'low') return null;
  const count = perf === 'high' ? 80 : 50;
  return (
    <>
      <FlowerSide side="left"  count={count} />
      <FlowerSide side="right" count={count} />
    </>
  );
}
