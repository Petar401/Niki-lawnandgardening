import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { SERVICES, servicesIntensity, type Service } from './serviceData';
import { ServiceIcon } from './Icons';

/**
 * Cluster of 4 glass orbs at the services waypoint. Each:
 *  - bobs gently
 *  - fades in/out around progress ~ 0.33 (a bell curve)
 *  - on hover: scales up, glows, and pops an HTML info panel
 *
 * Pointer events on transmissive glass work fine in three.js because
 * MeshPhysicalMaterial still creates standard raycaster geometry —
 * transmission only changes the fragment shader path.
 */
export function ServicesOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<Service['id'] | null>(null);
  useCursor(hoveredId !== null);

  // Pause orb interactivity while they're faded — saves picking work and
  // prevents accidental hovers when the camera is elsewhere.
  const [interactive, setInteractive] = useState(false);

  useFrame(() => {
    const intensity = servicesIntensity(useSceneStore.getState().progress);
    if (groupRef.current) {
      groupRef.current.visible = intensity > 0.02;
      // Group-level scale tween for a "blooming-in" feel.
      const target = THREE.MathUtils.lerp(0.4, 1.0, intensity);
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.15),
      );
    }
    setInteractive((prev) => {
      const want = intensity > 0.5;
      return prev === want ? prev : want;
    });
  });

  return (
    <group ref={groupRef}>
      {SERVICES.map((svc) => (
        <Orb
          key={svc.id}
          service={svc}
          hovered={hoveredId === svc.id}
          interactive={interactive}
          onEnter={() => setHoveredId(svc.id)}
          onLeave={() => setHoveredId((id) => (id === svc.id ? null : id))}
        />
      ))}
    </group>
  );
}

interface OrbProps {
  service: Service;
  hovered: boolean;
  interactive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function Orb({ service, hovered, interactive, onEnter, onLeave }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);

  // Per-orb bob phase so they don't move in unison.
  const bobPhase = useRef(Math.random() * Math.PI * 2);
  const baseY = service.position[1];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Bob.
    const yOff = Math.sin(t * 0.8 + bobPhase.current) * 0.12;
    if (meshRef.current) {
      meshRef.current.position.y = baseY + yOff;
      // Hover scale.
      const targetScale = hovered ? 1.18 : 1.0;
      const s = meshRef.current.scale.x;
      const next = THREE.MathUtils.lerp(s, targetScale, 0.15);
      meshRef.current.scale.setScalar(next);
    }
    // Inner icon slow spin.
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.35 + bobPhase.current;
    }
  });

  // Once unmounted from interactive (services phase faded out) clear hover.
  useEffect(() => {
    if (!interactive && hovered) onLeave();
  }, [interactive, hovered, onLeave]);

  const [x, , z] = service.position;
  const [ox, oy, oz] = service.panelOffset;

  return (
    <mesh
      ref={meshRef}
      position={[x, baseY, z]}
      onPointerOver={interactive ? (e) => { e.stopPropagation(); onEnter(); } : undefined}
      onPointerOut={interactive ? onLeave : undefined}
    >
      <sphereGeometry args={[0.7, 48, 48]} />
      <meshPhysicalMaterial
        transmission={0.78}
        thickness={1.2}
        roughness={0.06}
        ior={1.42}
        iridescence={0.35}
        iridescenceIOR={1.3}
        metalness={0}
        attenuationColor={service.tint}
        attenuationDistance={1.5}
        color="#ffffff"
        emissive={service.tint}
        emissiveIntensity={hovered ? 0.55 : 0.18}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />

      {/* Inner icon, lit normally (not refracted geometry). */}
      <group ref={innerRef}>
        <ServiceIcon id={service.id} />
      </group>

      {/* Hover info panel — drei <Html> projects DOM to a world-space point. */}
      <Html
        position={[ox, oy, oz]}
        center
        distanceFactor={6.5}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: hovered ? 'auto' : 'none' }}
      >
        <div
          className={`glass min-w-[12rem] max-w-[16rem] rounded-2xl px-4 py-3 text-left text-cream transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
          }`}
        >
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-sun-200">
            {service.title}
          </p>
          <p className="mt-1.5 text-sm leading-snug text-cream/90">{service.oneLiner}</p>
          <ul className="mt-3 space-y-1 text-[11px] text-cream/75">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 flex-none rounded-full bg-moss-300" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Html>
    </mesh>
  );
}
