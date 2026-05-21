import { useMemo, useRef, useState } from 'react';
import { useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { galleryIntensity, type GalleryPair } from './galleryData';
import { beforeAfterVert, beforeAfterFrag } from './beforeAfterShader';

const ANISO_BY_PERF: Record<'high' | 'medium' | 'low', number> = {
  high: 8,
  medium: 4,
  low: 1,
};

interface Props {
  pair: GalleryPair;
}

/**
 * One before/after pair on a curved-feeling plane (we tilt the whole
 * plane in world space; the surface itself is flat, which keeps UVs
 * clean for the split shader).
 *
 * Drag interaction:
 *  - PointerDown captures the pointer and starts dragging.
 *  - PointerMove updates uSplit from the event's local UV.
 *  - PointerUp releases.
 * Tap-anywhere also works: a single click moves the split to that x.
 */
export function BeforeAfterPlane({ pair }: Props) {
  const textures = useLoader(THREE.TextureLoader, [pair.before, pair.after]);
  const before = textures[0] as THREE.Texture;
  const after = textures[1] as THREE.Texture;
  const { gl } = useThree();
  const perf = useSceneStore((s) => s.perf);
  // Photos are sRGB encoded; tag them so they go through gamma correctly.
  useMemo(() => {
    const aniso = Math.min(gl.capabilities.getMaxAnisotropy(), ANISO_BY_PERF[perf]);
    before.colorSpace = THREE.SRGBColorSpace;
    after.colorSpace = THREE.SRGBColorSpace;
    before.anisotropy = aniso;
    after.anisotropy = aniso;
    before.needsUpdate = true;
    after.needsUpdate = true;
  }, [before, after, gl, perf]);

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const dragging = useRef(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, dragging.current ? 'grabbing' : 'grab');

  const uniforms = useMemo(
    () => ({
      uBefore: { value: before },
      uAfter: { value: after },
      uSplit: { value: 0.5 },
      uSeamWidth: { value: 0.006 },
      uSeamColor: { value: new THREE.Color('#ffe9a8') },
      uReveal: { value: 0 },
    }),
    [before, after],
  );

  // Reveal/intensity tween + a soft scale breath when the camera is close.
  const { camera } = useThree();
  const scratch = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = galleryIntensity(useSceneStore.getState().progress);
    const target = THREE.MathUtils.smoothstep(t, 0, 1);
    uniforms.uReveal.value = THREE.MathUtils.lerp(uniforms.uReveal.value, target, 0.08);
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.visible = uniforms.uReveal.value > 0.01;
    if (!mesh.visible) return;

    // Distance-based breath: scale 1.0 -> ~1.04 within ~10m; pulses ±1%.
    mesh.getWorldPosition(scratch);
    const dist = scratch.distanceTo(camera.position);
    const near = THREE.MathUtils.clamp(1 - dist / 12, 0, 1);
    const breath = 1 + near * 0.04 + Math.sin(state.clock.elapsedTime * 1.3) * 0.008;
    mesh.scale.setScalar(breath);
  });

  const applyFromEvent = (e: ThreeEvent<PointerEvent>) => {
    const u = e.uv;
    if (!u) return;
    uniforms.uSplit.value = THREE.MathUtils.clamp(u.x, 0.02, 0.98);
  };

  // Aspect: photos are 1000x1333 (portrait 3:4). Plane sized to match.
  const planeArgs: [number, number] = [3, 4];

  return (
    <group position={pair.position} rotation={[0, pair.rotationY ?? 0, 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.target as Element).setPointerCapture?.(e.pointerId);
          dragging.current = true;
          applyFromEvent(e);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          applyFromEvent(e);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          try {
            (e.target as Element).releasePointerCapture?.(e.pointerId);
          } catch {
            // ignore — capture may not have been set
          }
        }}
      >
        <planeGeometry args={planeArgs} />
        <shaderMaterial
          ref={matRef}
          vertexShader={beforeAfterVert}
          fragmentShader={beforeAfterFrag}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Frame outline */}
      <lineSegments position={[0, 0, 0.001]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(...planeArgs)]} />
        <lineBasicMaterial color="#fdf7ec" transparent opacity={0.35} />
      </lineSegments>

      {/* Caption */}
      <Html
        position={[0, -2.4, 0]}
        center
        distanceFactor={6.5}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="glass whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-cream/80">
          {pair.caption}
        </div>
      </Html>

      {/* Before/After labels at top corners */}
      <Html position={[-1.35, 1.8, 0.01]} distanceFactor={6.5} style={{ pointerEvents: 'none' }}>
        <span className="rounded-full bg-dusk-900/60 px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-cream/80">
          Before
        </span>
      </Html>
      <Html position={[1.0, 1.8, 0.01]} distanceFactor={6.5} style={{ pointerEvents: 'none' }}>
        <span className="rounded-full bg-sun-500/80 px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-dusk-900">
          After
        </span>
      </Html>
    </group>
  );
}
