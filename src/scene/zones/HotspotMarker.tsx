import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { type NavigationNode } from '../navigationNodes';

/**
 * A clickable beacon planted in the 3D world for one zone. Pulsing ring +
 * inner dot + soft additive glow + a billboarded HTML label. Clicking flies
 * the camera to the zone (guarded by `isFlying`). The marker shrinks while
 * its own zone is active to reduce clutter once you've arrived.
 *
 * Only the meshes are pointer targets; the HTML label is pointerEvents:none
 * so it never steals clicks (same approach as ServicesOrbs).
 */
interface HotspotMarkerProps {
  node: NavigationNode;
}

export function HotspotMarker({ node }: HotspotMarkerProps) {
  const isActive = useSceneStore((s) => s.activeZone === node.id);
  const isHovered = useSceneStore((s) => s.hoveredZone === node.id);
  const setHovered = useSceneStore((s) => s.setHoveredZone);

  useCursor(isHovered);

  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, dt) => {
    t.current += dt * 1.6;
    const pulse = 0.9 + Math.sin(t.current) * 0.12;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(isHovered ? 1.35 : pulse);
    }
    if (groupRef.current) {
      // Shrink the marker once the camera is parked at this zone.
      const target = isActive ? 0.55 : 1;
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 1 - Math.exp(-dt * 6));
      groupRef.current.scale.setScalar(s);
    }
  });

  const onClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!useSceneStore.getState().isFlying) useSceneStore.getState().navigateTo(node.id);
  };

  const color = isActive ? '#f5b13a' : isHovered ? '#ffe9a8' : '#bcdbba';

  return (
    <group ref={groupRef} position={node.hotspotPos}>
      {/* Outer pulsing ring (faces camera enough at garden-eye level). */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(node.id); }}
        onPointerOut={() => setHovered(null)}
        onClick={onClick}
      >
        <ringGeometry args={[0.28, 0.4, 40]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.95 : 0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner dot. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
        <circleGeometry args={[0.15, 28]} />
        <meshBasicMaterial color={isActive ? '#f5b13a' : '#fdf7ec'} transparent opacity={0.92} side={THREE.DoubleSide} />
      </mesh>

      {/* Soft glow disc (additive). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <circleGeometry args={[0.8, 28]} />
        <meshBasicMaterial
          color={isHovered ? '#f5b13a' : '#bcdbba'}
          transparent
          opacity={isHovered ? 0.24 : 0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Billboarded label. */}
      <Html center position={[0, 0.7, 0]} distanceFactor={8} zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
        <div
          className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] transition-all duration-200 ${
            isActive
              ? 'bg-sun-500/90 text-dusk-900 opacity-100'
              : isHovered
                ? 'glass text-cream opacity-100'
                : 'glass text-cream/80 opacity-90'
          }`}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}
