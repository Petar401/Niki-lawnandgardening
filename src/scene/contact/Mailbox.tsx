import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { CONTACT_ANCHOR, contactIntensity } from './contactData';

/**
 * Stylised curbside mailbox: cylindrical body lying on its side, a flag,
 * a slot, and a wooden post. Made from primitives — small enough on
 * screen that this reads well without modelling effort.
 *
 * The emissive of the body brightens with contactIntensity so the
 * mailbox feels like it's "waking up" as the camera arrives.
 */
export function Mailbox() {
  const bodyRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const intensity = contactIntensity(useSceneStore.getState().progress);

    if (groupRef.current) {
      groupRef.current.visible = intensity > 0.01;
      // Slight float so the mailbox feels lit-from-within.
      groupRef.current.position.y = CONTACT_ANCHOR[1] + Math.sin(t * 0.9) * 0.04;
    }

    if (bodyRef.current && bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
      bodyRef.current.material.emissiveIntensity =
        0.05 + 0.35 * intensity + 0.06 * Math.sin(t * 1.6);
    }

    if (flagRef.current) {
      // Gentle flag wave.
      flagRef.current.rotation.z = -0.5 + Math.sin(t * 1.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={CONTACT_ANCHOR}>
      {/* Body — half-capsule lying on its side */}
      <mesh ref={bodyRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.42, 0.55, 8, 24]} />
        <meshStandardMaterial
          color="#2a214a"
          emissive="#ffe9a8"
          emissiveIntensity={0.2}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>

      {/* Door (front) */}
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 24, 1, false]} />
        <meshStandardMaterial color="#160f2b" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* Slot — a darker thin box across the door */}
      <mesh position={[0.73, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.01, 0.06, 0.4]} />
        <meshStandardMaterial color="#0f0a1e" />
      </mesh>

      {/* Knob */}
      <mesh position={[0.74, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#f5b13a" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Flag */}
      <group ref={flagRef} position={[-0.35, 0.2, 0.3]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          <meshStandardMaterial color="#1d461d" roughness={0.7} />
        </mesh>
        <mesh position={[0.12, 0.5, 0]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshStandardMaterial
            color="#f5b13a"
            emissive="#f5b13a"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Wooden post */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.95} metalness={0} />
      </mesh>

      {/* Small "Niki" plaque tied to the post */}
      <mesh position={[0, -0.5, 0.07]}>
        <planeGeometry args={[0.4, 0.18]} />
        <meshStandardMaterial
          color="#fdf7ec"
          emissive="#ffe9a8"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
