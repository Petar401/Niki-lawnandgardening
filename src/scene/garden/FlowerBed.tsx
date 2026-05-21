import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { blendPalette } from '../season';

/**
 * Two flower beds flanking the path. Each is an InstancedMesh of small
 * "lollipop" flowers (stem + bloom sphere). Wind via a vertex shader
 * uniform tied to elapsedTime. Bloom colour and opacity tied to the
 * current season palette (fades to near-invisible in winter).
 */

const PERF_COUNTS: Record<'high' | 'medium' | 'low', number> = {
  high: 220,
  medium: 130,
  low: 60,
};

const flowerVert = /* glsl */ `
  uniform float uTime;
  uniform float uWind;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 instancePos = instanceMatrix * vec4(position, 1.0);
    vec4 worldPos = modelMatrix * instancePos;
    float bend = pow(clamp(position.y, 0.0, 1.0), 1.6);
    float w = sin(uTime * 1.4 + worldPos.x * 0.7 + worldPos.z * 0.5);
    worldPos.x += w * uWind * bend * 0.18;
    worldPos.z += cos(uTime * 1.1 + worldPos.z * 0.6) * uWind * bend * 0.12;
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;
const flowerFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uStem;
  uniform vec3 uBloom;
  uniform float uOpacity;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    // uv.y < 0.65 = stem, otherwise bloom
    vec3 col = mix(uStem, uBloom, smoothstep(0.55, 0.7, vUv.y));
    // soft rim on the bloom
    float rim = smoothstep(0.7, 1.0, vUv.y);
    col += rim * 0.15;
    float depth = length(cameraPosition - vWorldPos);
    float fogF = smoothstep(uFogNear, uFogFar, depth);
    col = mix(col, uFog, fogF);
    gl_FragColor = vec4(col, uOpacity);
  }
`;

/**
 * Single "lollipop" flower geometry: thin tapered stem + a slightly
 * flattened sphere on top. UV.y stripes vertically so the shader can
 * shade stem vs bloom from a single material.
 */
function makeFlowerGeometry() {
  const stem = new THREE.CylinderGeometry(0.02, 0.04, 0.7, 5, 1, true);
  stem.translate(0, 0.35, 0);
  // Force uv.y in [0, 0.65]
  const stemUv = stem.attributes.uv;
  for (let i = 0; i < stemUv.count; i++) {
    stemUv.setY(i, stemUv.getY(i) * 0.65);
  }
  const bloom = new THREE.IcosahedronGeometry(0.12, 0);
  bloom.translate(0, 0.78, 0);
  const bloomUv = bloom.attributes.uv;
  for (let i = 0; i < bloomUv.count; i++) {
    // Force uv.y >= 0.7 so the shader treats it as bloom.
    bloomUv.setY(i, 0.85);
  }
  const merged = mergeBufferGeometries([stem, bloom]);
  merged.computeVertexNormals();
  return merged;
}

/** Inlined geometry merger to avoid pulling in BufferGeometryUtils. */
function mergeBufferGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let offset = 0;
  for (const g of geos) {
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      uvs.push(uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0);
    }
    const idx = g.getIndex();
    if (idx) {
      for (let i = 0; i < idx.count; i++) indices.push(idx.getX(i) + offset);
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        indices.push(offset + i, offset + i + 1, offset + i + 2);
      }
    }
    offset += pos.count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  return g;
}

export function FlowerBed() {
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNTS[perf];
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(makeFlowerGeometry, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWind: { value: 0.45 },
      uStem: { value: new THREE.Color('#2e6e2c') },
      uBloom: { value: new THREE.Color('#f5b13a') },
      uOpacity: { value: 1.0 },
      uFog: { value: new THREE.Color('#bfe0ff') },
      uFogNear: { value: 28 },
      uFogFar: { value: 90 },
    }),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    let idx = 0;
    const half = Math.floor(count / 2);
    for (const side of [-1, 1]) {
      for (let i = 0; i < half; i++) {
        const t = i / Math.max(1, half - 1);
        const baseZ = THREE.MathUtils.lerp(5, -22, t);
        const baseX = side * (3.4 + Math.random() * 0.6);
        // Scatter in a small band along the bed.
        const x = baseX + (Math.random() - 0.5) * 0.7;
        const z = baseZ + (Math.random() - 0.5) * 0.9;
        const y = 0.02 + Math.random() * 0.05;
        const scale = 0.85 + Math.random() * 0.6;
        const rot = Math.random() * Math.PI * 2;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, rot, 0);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx++, dummy.matrix);
      }
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const { seasonClock, seasonOverride } = useSceneStore.getState();
    const pal = blendPalette(seasonClock, seasonOverride);
    uniforms.uStem.value.copy(pal.leaf).multiplyScalar(0.7);
    uniforms.uBloom.value.copy(pal.bloomColor);
    uniforms.uOpacity.value = THREE.MathUtils.lerp(uniforms.uOpacity.value, pal.bloomDensity, 0.05);
    uniforms.uFog.value.copy(pal.fog);
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} castShadow frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={flowerVert}
        fragmentShader={flowerFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
