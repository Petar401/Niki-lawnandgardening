import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';

const IVY_COUNT_BY_PERF: Record<'high' | 'medium' | 'low', number> = {
  high: 120,
  medium: 70,
  low: 36,
};

/**
 * Garden trellis arch — Catmull-Rom spline through 7 control points, swept
 * as a tube. Two posts anchor it; instanced ivy leaves clamber along the
 * arch with gentle wind sway driven by the shared store clock.
 */
export function Gate() {
  const archCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 0.0, 0),
      new THREE.Vector3(-1.4, 1.2, 0),
      new THREE.Vector3(-0.9, 2.0, 0),
      new THREE.Vector3(0.0, 2.3, 0),
      new THREE.Vector3(0.9, 2.0, 0),
      new THREE.Vector3(1.4, 1.2, 0),
      new THREE.Vector3(1.4, 0.0, 0),
    ]);
  }, []);

  const archGeom = useMemo(
    () => new THREE.TubeGeometry(archCurve, 80, 0.08, 10, false),
    [archCurve],
  );

  // Sample N points along the arch and place an instanced leaf at each.
  const perf = useSceneStore((s) => s.perf);
  const ivyCount = IVY_COUNT_BY_PERF[perf];

  const leaves = useMemo(() => {
    const out: Array<{
      pos: THREE.Vector3;
      rot: number;
      scale: number;
      seed: number;
    }> = [];
    for (let i = 0; i < ivyCount; i++) {
      const t = i / ivyCount;
      const p = archCurve.getPointAt(t).clone();
      // Offset perpendicular + slight forward, alternating side, with jitter.
      const side = (i % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.18);
      const tangent = archCurve.getTangentAt(t);
      const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      p.addScaledVector(normal, side);
      p.z += -0.04 + Math.random() * 0.18;
      out.push({
        pos: p,
        rot: Math.random() * Math.PI,
        scale: 0.14 + Math.random() * 0.16,
        seed: Math.random(),
      });
    }
    return out;
  }, [archCurve, ivyCount]);

  const ivyMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const mesh = ivyMesh.current;
    if (!mesh) return;
    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i]!;
      dummy.position.copy(l.pos);
      dummy.rotation.set(0, 0, l.rot);
      dummy.scale.setScalar(l.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = leaves.length;
  }, [leaves, dummy]);

  useFrame((s) => {
    const mesh = ivyMesh.current;
    if (!mesh || useSceneStore.getState().reducedMotion) return;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i]!;
      const sway = Math.sin(t * 1.4 + l.seed * 8.0) * 0.07;
      dummy.position.copy(l.pos);
      dummy.position.x += sway * 0.05;
      dummy.rotation.set(0, 0, l.rot + sway);
      dummy.scale.setScalar(l.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, -10]}>
      {/* Arch */}
      <mesh geometry={archGeom} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color="#1d461d" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Two posts */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 1.4, 14]} />
          <meshStandardMaterial color="#1d461d" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Instanced ivy leaves along the arch */}
      <instancedMesh
        ref={ivyMesh}
        args={[undefined, undefined, ivyCount]}
        position={[0, 1.4, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={[1, 1.2]} />
        <meshStandardMaterial
          color="#3f8a3c"
          emissive="#1d461d"
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
        />
      </instancedMesh>

      {/* Soft glow disc behind the arch */}
      <mesh position={[0, 1.4, -0.05]} renderOrder={-1}>
        <circleGeometry args={[1.9, 32]} />
        <meshBasicMaterial
          color="#ffe9a8"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
