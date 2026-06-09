import * as THREE from 'three';

/**
 * Patio furniture group echoing the reference photo: a flagstone pad in
 * front of the cottage with a round table, a cream parasol, and two simple
 * chairs. Pure low-poly primitives with shared materials (matches the
 * Cottage approach) so it costs almost nothing.
 */
const PAVER_MAT = new THREE.MeshStandardMaterial({ color: '#c9bca8', roughness: 0.95, metalness: 0 });
const WOOD_MAT = new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.8, metalness: 0 });
const POLE_MAT = new THREE.MeshStandardMaterial({ color: '#7a6048', roughness: 0.7, metalness: 0 });
const CANOPY_MAT = new THREE.MeshStandardMaterial({
  color: '#f3ead8',
  roughness: 0.85,
  metalness: 0,
  side: THREE.DoubleSide,
});

function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh material={WOOD_MAT} position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
      </mesh>
      {/* Back */}
      <mesh material={WOOD_MAT} position={[0, 0.75, -0.21]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.07]} />
      </mesh>
      {/* Legs */}
      {([[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]] as const).map(([x, z], i) => (
        <mesh key={i} material={WOOD_MAT} position={[x, 0.22, z]}>
          <boxGeometry args={[0.06, 0.45, 0.06]} />
        </mesh>
      ))}
    </group>
  );
}

export function PatioSet() {
  // In front of the cottage (cottage sits at z = -20, front face ~ z = -18),
  // nudged to the left like the reference photo.
  return (
    <group position={[-4.5, 0, -15]}>
      {/* Flagstone pad */}
      <mesh material={PAVER_MAT} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.6, 32]} />
      </mesh>

      {/* Table top + central pole + base */}
      <mesh material={WOOD_MAT} position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 24]} />
      </mesh>
      <mesh material={POLE_MAT} position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.74, 12]} />
      </mesh>

      {/* Parasol: tall pole + conical canopy */}
      <mesh material={POLE_MAT} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 12]} />
      </mesh>
      <mesh material={CANOPY_MAT} position={[0, 2.75, 0]} castShadow>
        <coneGeometry args={[1.9, 0.9, 8, 1, true]} />
      </mesh>

      {/* Chairs */}
      <Chair position={[1.2, 0, 0.2]} rotation={-Math.PI / 2.2} />
      <Chair position={[-1.2, 0, -0.2]} rotation={Math.PI / 2.2} />
    </group>
  );
}
