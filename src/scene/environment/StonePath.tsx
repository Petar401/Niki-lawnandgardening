import { useMemo } from 'react';
import * as THREE from 'three';

const STONE_MAT = new THREE.MeshStandardMaterial({
  color: '#7a7060',
  roughness: 0.95,
  metalness: 0,
});

const FLAGSTONE_MAT = new THREE.MeshStandardMaterial({
  color: '#8a8070',
  roughness: 1,
  metalness: 0,
});

const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3( 0.8, 0.01,  7),
  new THREE.Vector3( 1.5, 0.01,  2),
  new THREE.Vector3( 0.5, 0.01, -5),
  new THREE.Vector3( 0,   0.01, -15),
]);

const FLAGSTONE_GEO = new THREE.BoxGeometry(1.1, 0.06, 0.8);

function buildFlagstones() {
  const count = 14;
  const stones: { pos: THREE.Vector3; rotY: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const p = CURVE.getPointAt(t);
    // slight stagger
    const stagger = ((i % 2) - 0.5) * 0.3;
    const tangent = CURVE.getTangentAt(t);
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    p.addScaledVector(normal, stagger);
    const rotY = Math.atan2(tangent.x, tangent.z) + (Math.random() - 0.5) * 0.12;
    stones.push({ pos: p.clone(), rotY });
  }
  return stones;
}

const STONES = buildFlagstones();

export function StonePath() {
  const ribbonGeometry = useMemo(() => {
    const tube = new THREE.TubeGeometry(CURVE, 40, 0.85, 3, false);
    return tube;
  }, []);

  return (
    <group>
      {/* Thin ribbon base */}
      <mesh geometry={ribbonGeometry} material={STONE_MAT} scale={[1, 0.04, 1]} receiveShadow />

      {/* Individual flagstones */}
      {STONES.map((s, i) => (
        <mesh
          key={i}
          geometry={FLAGSTONE_GEO}
          material={FLAGSTONE_MAT}
          position={[s.pos.x, 0.03, s.pos.z]}
          rotation={[0, s.rotY, 0]}
          receiveShadow
        />
      ))}
    </group>
  );
}
