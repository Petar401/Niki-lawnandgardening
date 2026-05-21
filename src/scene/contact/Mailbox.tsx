import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { CONTACT_ANCHOR, contactIntensity } from './contactData';

const DOOR_OPEN = -1.05; // radians (~60°) outward swing
const DOOR_CLOSE_DURATION = 1.4; // seconds, total open + close cycle
const DOOR_CLOSE_DURATION_REDUCED = 0.4;

/**
 * Curbside mailbox built from primitives: arched roof, box body, hinged front
 * door, post, flag, and a small "Niki" plaque. The body emissive brightens
 * with the contact phase intensity. When the form submits (burstNonce
 * changes), the door swings open then closes alongside the firefly burst.
 */
export function Mailbox() {
  const bodyRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Group>(null);
  const doorPivot = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Door open trigger — listen to burstNonce.
  const burstNonce = useSceneStore((s) => s.burstNonce);
  const initialNonce = useRef(burstNonce);
  const doorAnim = useRef<{ start: number; duration: number } | null>(null);
  useEffect(() => {
    if (burstNonce === initialNonce.current) return;
    doorAnim.current = {
      start: performance.now() / 1000,
      duration: useSceneStore.getState().reducedMotion
        ? DOOR_CLOSE_DURATION_REDUCED
        : DOOR_CLOSE_DURATION,
    };
  }, [burstNonce]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const intensity = contactIntensity(useSceneStore.getState().progress);

    if (groupRef.current) {
      groupRef.current.visible = intensity > 0.01;
      groupRef.current.position.y = CONTACT_ANCHOR[1] + Math.sin(t * 0.9) * 0.04;
    }

    if (bodyRef.current && bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
      bodyRef.current.material.emissiveIntensity =
        0.05 + 0.35 * intensity + 0.06 * Math.sin(t * 1.6);
    }

    if (flagRef.current) {
      flagRef.current.rotation.z = -0.5 + Math.sin(t * 1.2) * 0.05;
    }

    // Door animation: open quickly, hold briefly, close.
    if (doorPivot.current) {
      let angle = 0;
      if (doorAnim.current) {
        const elapsed = performance.now() / 1000 - doorAnim.current.start;
        const u = Math.min(1, elapsed / doorAnim.current.duration);
        // Triangle wave: ramp open by 0.35, hold to 0.55, ramp closed by 1.0.
        let phase: number;
        if (u < 0.35) phase = u / 0.35;
        else if (u < 0.55) phase = 1;
        else phase = Math.max(0, 1 - (u - 0.55) / 0.45);
        const eased = phase * phase * (3 - 2 * phase);
        angle = DOOR_OPEN * eased;
        if (u >= 1) doorAnim.current = null;
      }
      doorPivot.current.rotation.z = angle;
    }
  });

  return (
    <group ref={groupRef} position={CONTACT_ANCHOR}>
      {/* Body — sturdy box with sloped/arched roof */}
      <mesh ref={bodyRef} position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.95, 0.42, 0.55]} />
        <meshStandardMaterial
          color="#2a214a"
          emissive="#ffe9a8"
          emissiveIntensity={0.15}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>
      {/* Roof — half-cylinder along X */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.95, 18, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#160f2b" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* Door — pivoting group; rotation.z around the right-hand hinge */}
      <group ref={doorPivot} position={[0.475, 0.16, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.4, 0.52]} />
          <meshStandardMaterial color="#160f2b" roughness={0.45} metalness={0.5} />
        </mesh>
        {/* Slot */}
        <mesh position={[0.022, 0.06, 0]}>
          <boxGeometry args={[0.01, 0.04, 0.32]} />
          <meshStandardMaterial color="#0a0817" />
        </mesh>
        {/* Knob */}
        <mesh position={[0.03, -0.14, 0]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial
            color="#f5b13a"
            emissive="#f5b13a"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* Flag */}
      <group ref={flagRef} position={[-0.42, 0.24, 0.28]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.62, 8]} />
          <meshStandardMaterial color="#1d461d" roughness={0.7} />
        </mesh>
        <mesh position={[0.13, 0.5, 0]}>
          <planeGeometry args={[0.26, 0.16]} />
          <meshStandardMaterial
            color="#e23b3b"
            emissive="#e23b3b"
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Post */}
      <mesh position={[0, -1.05, 0]} castShadow>
        <boxGeometry args={[0.12, 1.8, 0.12]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.95} metalness={0} />
      </mesh>

      {/* "Niki" plaque */}
      <mesh position={[0, -0.4, 0.07]}>
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
