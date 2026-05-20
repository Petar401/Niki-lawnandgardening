import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Temporary stylized ground plane. Step 3 replaces this with an instanced
 * grass field; the geometry stays roughly here so the camera framing carries
 * over. We use a subdivided plane so we can later read its vertices as the
 * spawn surface for grass instances.
 */
export function Ground() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 80, 64, 64);
    g.rotateX(-Math.PI / 2);

    // Subtle gentle undulation so the placeholder doesn't read as a flat disc.
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.12) * 0.18 + Math.cos(z * 0.15) * 0.18;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#2e6e2c"
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}
