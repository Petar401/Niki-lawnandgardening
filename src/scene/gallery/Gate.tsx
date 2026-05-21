import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Stylised garden trellis-arch gate: two posts + a smooth tube arch on top,
 * positioned at the centre of the gallery composition. Built procedurally
 * from a CatmullRom spline + TubeGeometry so the arch reads as one
 * organic piece, not stitched primitives.
 */
export function Gate() {
  const archGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 0.0, 0),
      new THREE.Vector3(-1.4, 1.2, 0),
      new THREE.Vector3(-0.9, 2.0, 0),
      new THREE.Vector3(0.0, 2.3, 0),
      new THREE.Vector3(0.9, 2.0, 0),
      new THREE.Vector3(1.4, 1.2, 0),
      new THREE.Vector3(1.4, 0.0, 0),
    ]);
    return new THREE.TubeGeometry(curve, 80, 0.08, 10, false);
  }, []);

  return (
    <group position={[0, 0, -10]}>
      {/* Arch */}
      <mesh geometry={archGeom} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color="#1d461d" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Two posts visually anchored to the ground */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 1.4, 14]} />
          <meshStandardMaterial color="#1d461d" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Hanging vine leaves on the arch (a few flat cards) for charm */}
      {[-0.7, 0.2, 0.6, -0.3].map((px, i) => (
        <mesh
          key={i}
          position={[px, 2.0 + Math.sin(px * 2) * 0.1, 0.05]}
          rotation={[0, 0, (i % 2 ? 1 : -1) * 0.4]}
        >
          <planeGeometry args={[0.25, 0.4]} />
          <meshStandardMaterial
            color="#3f8a3c"
            emissive="#1d461d"
            emissiveIntensity={0.1}
            side={THREE.DoubleSide}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}

      {/* Soft glow disc behind the arch (additive) */}
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
