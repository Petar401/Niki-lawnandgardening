import * as THREE from 'three';
import { useMemo } from 'react';
import type { ServiceId } from './serviceData';

/**
 * Recognisable, low-poly service props that sit inside each glass orb.
 * Built procedurally from primitives (no GLTF). All read MeshStandardMaterial
 * so they pick up the day/dusk lighting and shadows.
 */
export function ServiceIcon({ id }: { id: ServiceId }) {
  switch (id) {
    case 'mowing':
      return <MowerIcon />;
    case 'landscaping':
      return <SpadeIcon />;
    case 'hedging':
      return <SecateursIcon />;
    case 'seasonal':
      return <LeafCluster />;
  }
}

const mat = (color: string, opts?: { roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number }) => (
  <meshStandardMaterial
    color={color}
    roughness={opts?.roughness ?? 0.55}
    metalness={opts?.metalness ?? 0.0}
    emissive={opts?.emissive ?? '#000000'}
    emissiveIntensity={opts?.emissiveIntensity ?? 0}
  />
);

/**
 * Push mower: deck + handle bars + grass-catcher chute + roller drum + 4 wheels.
 * Reads instantly as "lawnmower" at orb size.
 */
function MowerIcon() {
  return (
    <group scale={0.42} position={[0, -0.05, 0]} rotation={[0, 0.45, 0]}>
      {/* Deck (lower body) */}
      <mesh castShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[1.1, 0.18, 0.7]} />
        {mat('#2f7c2e', { roughness: 0.7 })}
      </mesh>
      {/* Upper engine housing */}
      <mesh castShadow position={[-0.05, 0.18, 0]}>
        <boxGeometry args={[0.55, 0.28, 0.55]} />
        {mat('#1f5b1f', { roughness: 0.7 })}
      </mesh>
      {/* Sun-yellow cap */}
      <mesh castShadow position={[-0.05, 0.36, 0]}>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        {mat('#f5b13a', { emissive: '#f5b13a', emissiveIntensity: 0.18 })}
      </mesh>
      {/* Grass-catcher chute (back) */}
      <mesh castShadow position={[0.62, 0.05, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.4, 0.4, 0.55]} />
        {mat('#dad6c4', { roughness: 0.9 })}
      </mesh>
      {/* Roller drum (front) */}
      <mesh castShadow position={[-0.55, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.62, 18]} />
        {mat('#cfcabe', { metalness: 0.4, roughness: 0.5 })}
      </mesh>
      {/* Handle bar arcs from the back */}
      <mesh castShadow position={[0.7, 0.45, 0.26]} rotation={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.95, 8]} />
        {mat('#1a1a18', { roughness: 0.5, metalness: 0.6 })}
      </mesh>
      <mesh castShadow position={[0.7, 0.45, -0.26]} rotation={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.95, 8]} />
        {mat('#1a1a18', { roughness: 0.5, metalness: 0.6 })}
      </mesh>
      {/* Cross-bar grip */}
      <mesh castShadow position={[1.15, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
        {mat('#3a2a1a', { roughness: 0.9 })}
      </mesh>
      {/* Rear wheels */}
      {[-0.28, 0.28].map((z) => (
        <mesh key={`rw_${z}`} castShadow position={[0.35, -0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 18]} />
          {mat('#0f1812', { roughness: 0.9 })}
        </mesh>
      ))}
      {/* Front wheels (smaller) */}
      {[-0.26, 0.26].map((z) => (
        <mesh key={`fw_${z}`} castShadow position={[-0.4, -0.22, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.07, 16]} />
          {mat('#0f1812', { roughness: 0.9 })}
        </mesh>
      ))}
    </group>
  );
}

/**
 * Spade: ash shaft with D-grip and a chamfered steel head.
 */
function SpadeIcon() {
  return (
    <group scale={0.55} rotation={[0, 0, -0.5]}>
      {/* Ash shaft */}
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.04, 1.05, 14]} />
        {mat('#c79a63', { roughness: 0.85 })}
      </mesh>
      {/* D-grip top: arch + crossbar */}
      <group position={[0, 0.58, 0]}>
        <mesh castShadow position={[-0.06, 0.06, 0]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 10]} />
          {mat('#c79a63', { roughness: 0.85 })}
        </mesh>
        <mesh castShadow position={[0.06, 0.06, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 10]} />
          {mat('#c79a63', { roughness: 0.85 })}
        </mesh>
        <mesh castShadow position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 10]} />
          {mat('#c79a63', { roughness: 0.85 })}
        </mesh>
      </group>
      {/* Ferrule */}
      <mesh castShadow position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.055, 0.05, 0.1, 14]} />
        {mat('#b9b0a0', { metalness: 0.7, roughness: 0.45 })}
      </mesh>
      {/* Steel head: trapezoidal box + chamfered tip */}
      <mesh castShadow position={[0, -0.78, 0]}>
        <boxGeometry args={[0.34, 0.36, 0.05]} />
        {mat('#9a9182', { metalness: 0.85, roughness: 0.4 })}
      </mesh>
      <mesh castShadow position={[0, -1.02, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.19, 0.18, 4]} />
        {mat('#9a9182', { metalness: 0.85, roughness: 0.4 })}
      </mesh>
    </group>
  );
}

/**
 * Secateurs (pruning shears): twin curved blades, pivot bolt, two grips.
 */
function SecateursIcon() {
  // Curved blade — quarter torus segment via TorusGeometry slice.
  const bladeGeom = useMemo(
    () => new THREE.TorusGeometry(0.42, 0.025, 6, 18, Math.PI * 0.55),
    [],
  );
  return (
    <group scale={0.55} rotation={[0, 0, 0.2]}>
      {/* Upper blade */}
      <mesh castShadow geometry={bladeGeom} rotation={[0, 0, 0.0]} position={[-0.1, -0.05, 0]}>
        {mat('#e3e6e8', { metalness: 0.8, roughness: 0.3 })}
      </mesh>
      {/* Lower blade (mirrored) */}
      <mesh castShadow geometry={bladeGeom} rotation={[Math.PI, 0, 0.0]} position={[-0.1, 0.05, 0]}>
        {mat('#cfd3d6', { metalness: 0.7, roughness: 0.35 })}
      </mesh>
      {/* Pivot bolt */}
      <mesh castShadow position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        {mat('#f5b13a', { metalness: 0.7, roughness: 0.4, emissive: '#f5b13a', emissiveIntensity: 0.25 })}
      </mesh>
      {/* Top grip (red) */}
      <mesh castShadow position={[-0.55, -0.25, 0]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
        {mat('#c43d3d', { roughness: 0.7 })}
      </mesh>
      {/* Bottom grip (red) */}
      <mesh castShadow position={[-0.55, 0.25, 0]} rotation={[0, 0, -0.6]}>
        <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
        {mat('#c43d3d', { roughness: 0.7 })}
      </mesh>
    </group>
  );
}

/**
 * Cluster of autumn leaves — three overlapping cards with stem detail.
 */
function LeafCluster() {
  const leafShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0.35, -0.45, 0.55, -0.05, 0.4, 0.4);
    s.bezierCurveTo(0.22, 0.6, 0.05, 0.55, 0, 0.5);
    s.bezierCurveTo(-0.05, 0.55, -0.22, 0.6, -0.4, 0.4);
    s.bezierCurveTo(-0.55, -0.05, -0.35, -0.45, 0, -0.5);
    return s;
  }, []);
  const leafGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelSize: 0.02,
        bevelThickness: 0.02,
        bevelSegments: 1,
      }),
    [leafShape],
  );

  const leaves = [
    { rot: 0.1, pos: [0, 0, 0] as [number, number, number], scale: 1.0, color: '#e89a3a' },
    { rot: -0.9, pos: [0.32, -0.08, 0.06] as [number, number, number], scale: 0.78, color: '#c45a2c' },
    { rot: 1.4, pos: [-0.28, 0.05, -0.05] as [number, number, number], scale: 0.7, color: '#b8862a' },
  ];

  return (
    <group scale={0.7}>
      {leaves.map((l, i) => (
        <mesh key={i} castShadow geometry={leafGeom} position={l.pos} rotation={[0, 0, l.rot]} scale={l.scale}>
          {mat(l.color, {
            roughness: 0.85,
            emissive: l.color,
            emissiveIntensity: 0.08,
          })}
        </mesh>
      ))}
      {/* Stem cluster */}
      <mesh castShadow position={[0, -0.5, 0.04]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.014, 0.018, 0.32, 8]} />
        {mat('#5a3b1c', { roughness: 0.9 })}
      </mesh>
    </group>
  );
}
