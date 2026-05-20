import * as THREE from 'three';
import { useMemo } from 'react';
import type { ServiceId } from './serviceData';

/**
 * Tiny stylised 3D icons that sit inside each glass orb. Built from
 * primitives — no GLTF loading, no textures. They're small (~0.5u) so
 * subtle silhouettes read fine; we lean on color + emissive for clarity.
 *
 * All icons render through MeshStandardMaterial so they participate in
 * the day/dusk lighting and shadows correctly.
 */
export function ServiceIcon({ id }: { id: ServiceId }) {
  switch (id) {
    case 'mowing':
      return <MowerIcon />;
    case 'landscaping':
      return <ShovelIcon />;
    case 'hedging':
      return <ClipperIcon />;
    case 'seasonal':
      return <LeafIcon />;
  }
}

const mat = (color: string, emissive = '#000000', emissiveIntensity = 0) => (
  <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.55} metalness={0.15} />
);

function MowerIcon() {
  return (
    <group scale={0.45}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.95, 0.32, 0.6]} />
        {mat('#2e6e2c')}
      </mesh>
      {/* Engine */}
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[0.45, 0.22, 0.35]} />
        {mat('#1d461d')}
      </mesh>
      {/* Handle */}
      <mesh position={[-0.55, 0.35, 0]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.025, 0.025, 0.95]} />
        {mat('#fdf7ec')}
      </mesh>
      {/* Wheels */}
      {[-0.3, 0.3].map((z) =>
        [-0.4, 0.4].map((x) => (
          <mesh key={`${x}_${z}`} position={[x, -0.22, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.08, 18]} />
            {mat('#0f2a10')}
          </mesh>
        )),
      )}
    </group>
  );
}

function ShovelIcon() {
  return (
    <group scale={0.55} rotation={[0, 0, -0.4]}>
      {/* Shaft */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 16]} />
        {mat('#a87145')}
      </mesh>
      {/* T-grip */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
        {mat('#fdf7ec')}
      </mesh>
      {/* Scoop */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.22, 0.4, 16, 1, true]} />
        {mat('#3f8a3c', '#1d461d', 0.15)}
      </mesh>
    </group>
  );
}

function ClipperIcon() {
  // Two crossed blades around a central pivot.
  const blade = useMemo(() => new THREE.BoxGeometry(0.8, 0.07, 0.04), []);
  return (
    <group scale={0.5}>
      <mesh geometry={blade} rotation={[0, 0, Math.PI / 12]}>
        {mat('#e7eef3', '#0f2a10', 0.05)}
      </mesh>
      <mesh geometry={blade} rotation={[0, 0, -Math.PI / 12]}>
        {mat('#e7eef3', '#0f2a10', 0.05)}
      </mesh>
      {/* Grips */}
      <mesh position={[-0.45, -0.22, 0]}>
        <boxGeometry args={[0.18, 0.28, 0.08]} />
        {mat('#1d461d')}
      </mesh>
      <mesh position={[-0.45, 0.22, 0]}>
        <boxGeometry args={[0.18, 0.28, 0.08]} />
        {mat('#1d461d')}
      </mesh>
      {/* Pivot */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        {mat('#f5b13a', '#f5b13a', 0.4)}
      </mesh>
    </group>
  );
}

function LeafIcon() {
  // Stylized maple-ish leaf using a custom shape.
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0.4, -0.4, 0.55, 0.0, 0.35, 0.4);
    s.bezierCurveTo(0.2, 0.6, 0.0, 0.55, 0.0, 0.5);
    s.bezierCurveTo(0.0, 0.55, -0.2, 0.6, -0.35, 0.4);
    s.bezierCurveTo(-0.55, 0.0, -0.4, -0.4, 0, -0.5);
    return s;
  }, []);

  const geom = useMemo(
    () => new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1 }),
    [shape],
  );

  return (
    <group scale={0.75} rotation={[0, 0, 0.2]}>
      <mesh geometry={geom}>
        {mat('#d18d1a', '#f5b13a', 0.25)}
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.55, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.25, 8]} />
        {mat('#1d461d')}
      </mesh>
    </group>
  );
}
