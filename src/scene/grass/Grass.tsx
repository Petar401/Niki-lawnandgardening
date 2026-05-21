import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { makeBladeGeometry } from './bladeGeometry';
import { grassVert, grassFrag } from './grassShader';
import { blendPalette } from '../season';

interface GrassProps {
  /** Square area side length. */
  area?: number;
  /** Max blade count at perf=high; auto-scaled down at lower tiers. */
  countHigh?: number;
}

const PERF_DENSITY: Record<'high' | 'medium' | 'low', number> = {
  high: 1.0,
  medium: 0.6,
  low: 0.3,
};

/**
 * Instanced grass field. One InstancedMesh, one draw call. Density adapts
 * to the perf tier set by <PerfMonitor/> (low-end devices get ~30%).
 *
 * The cursor uniform is updated every frame by raycasting the pointer onto
 * the ground plane — gives a physically-meaningful "wind ripple where I
 * point" interaction.
 */
export function Grass({ area = 70, countHigh = 32000 }: GrassProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const perf = useSceneStore((s) => s.perf);
  const count = Math.floor(countHigh * PERF_DENSITY[perf]);

  const geometry = useMemo(() => makeBladeGeometry(), []);

  // Build per-instance transforms once. Re-runs when `count` changes (perf
  // tier shift). Random distribution clusters slightly tighter near origin
  // so the focal area reads dense without exploding count.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const half = area * 0.5;

    for (let i = 0; i < count; i++) {
      // Bias toward center: sqrt distribution.
      const r = Math.sqrt(Math.random()) * half;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      // Match the gentle ground undulation in Ground.tsx so blades sit on
      // the surface, not floating above troughs.
      const y = Math.sin(x * 0.12) * 0.18 + Math.cos(z * 0.15) * 0.18;

      const heightScale = 0.6 + Math.random() * 0.9;
      const widthScale = 0.7 + Math.random() * 0.6;
      const rot = Math.random() * Math.PI * 2;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rot, 0);
      dummy.scale.set(widthScale, heightScale, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = count;
  }, [count, area]);

  // Uniforms are stable refs so we can mutate them on the hot path.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector2(999, 999) },
      uCursorRadius: { value: 3.2 },
      uWindStrength: { value: 0.35 },
      uBaseColor: { value: new THREE.Color('#1d461d') },
      uTipColor: { value: new THREE.Color('#8fc28d') },
      uDuskTint: { value: new THREE.Color('#5b4b8a') },
      uDusk: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.5, 0.8, 0.4).normalize() },
      uFogColor: { value: new THREE.Color('#bfe0ff') },
      uFogNear: { value: 28 },
      uFogFar: { value: 90 },
    }),
    [],
  );

  // Pointer -> ground raycast. Reusable scratch objects to avoid alloc churn.
  const { camera, pointer, raycaster } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const s = useSceneStore.getState();
    uniforms.uDusk.value = THREE.MathUtils.smoothstep(s.progress, 0, 1);

    // Season blend — lerp toward the current palette every frame.
    const pal = blendPalette(s.seasonClock, s.seasonOverride);
    uniforms.uBaseColor.value.lerp(pal.grassBase, 0.05);
    uniforms.uTipColor.value.lerp(pal.grassTip, 0.05);
    uniforms.uFogColor.value.lerp(pal.fog, 0.05);

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, scratch)) {
      uniforms.uCursor.value.set(scratch.x, scratch.z);
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={matRef}
        vertexShader={grassVert}
        fragmentShader={grassFrag}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={false}
      />
    </instancedMesh>
  );
}
