import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Temporary "hello world" marker so Step 2 reviewers can see the scene is
 * alive. A slowly bobbing glass orb at the focal point — gets deleted in
 * Step 3 once the grass field + hero text take over.
 */
export function Placeholder() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = 1.4 + Math.sin(clock.elapsedTime * 0.9) * 0.15;
    ref.current.rotation.y = clock.elapsedTime * 0.25;
  });

  return (
    <mesh ref={ref} position={[0, 1.4, 0]} castShadow>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color="#f5b13a"
        emissive="#5b4b8a"
        emissiveIntensity={0.25}
        roughness={0.25}
        metalness={0.4}
      />
    </mesh>
  );
}
