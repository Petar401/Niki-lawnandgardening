import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';

const PERF_COUNT: Record<'high' | 'medium' | 'low', number> = {
  high: 600,
  medium: 320,
  low: 140,
};

const particleVert = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uDusk;

  varying float vAlpha;
  varying float vGlow;   // dusk fireflies pulse

  void main() {
    vec3 pos = position;

    // Slow drift on wind. Each particle uses its seed for unique phase.
    float t = uTime * 0.25 + aSeed * 6.28;
    pos.x += sin(t * 1.3) * 0.9;
    pos.y += sin(t * 0.7 + aSeed) * 0.4;
    pos.z += cos(t * 1.1) * 0.8;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Distance-attenuated size, +pixel ratio.
    float perspective = 320.0 / max(-mv.z, 0.001);
    gl_PointSize = aSize * perspective * mix(1.0, 1.6, uDusk);

    // Fade out very close + very far so particles don't slam the camera.
    float d = -mv.z;
    vAlpha = smoothstep(0.5, 2.5, d) * smoothstep(60.0, 25.0, d);

    // Dusk pulse so they read as fireflies, not pollen.
    vGlow = 0.5 + 0.5 * sin(uTime * 2.4 + aSeed * 12.0);
  }
`;

const particleFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uDayColor;
  uniform vec3 uDuskColor;
  uniform float uDusk;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    // Soft circular sprite.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    if (core <= 0.001) discard;

    vec3 col = mix(uDayColor, uDuskColor, uDusk);
    // Fireflies (dusk) glow strongly; pollen (day) is soft.
    float intensity = mix(0.6, 1.5 * vGlow + 0.6, uDusk);

    gl_FragColor = vec4(col * intensity, core * vAlpha);
  }
`;

/**
 * Pollen by day, fireflies by dusk. Drifts on the same wind direction as
 * the grass for visual coherence. Renders with additive blending so it
 * blooms beautifully through the post FX.
 */
export function Particles() {
  const ref = useRef<THREE.Points>(null);
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNT[perf];

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const radius = 18;

    for (let i = 0; i < count; i++) {
      // Distribute around the focal volume — wide XZ ring, lifted Y band.
      const r = 1 + Math.pow(Math.random(), 0.7) * radius;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = 0.4 + Math.random() * 4.5;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      sizes[i] = 0.018 + Math.random() * 0.05;
      seeds[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const u = {
      uTime: { value: 0 },
      uDusk: { value: 0 },
      uDayColor: { value: new THREE.Color('#fff1c7') },
      uDuskColor: { value: new THREE.Color('#ffd28a') },
    };
    return { geometry: g, uniforms: u };
  }, [count]);

  // Dispose the previous geometry when perf-tier change recomputes it.
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
    uniforms.uDusk.value = THREE.MathUtils.smoothstep(
      useSceneStore.getState().progress,
      0,
      1,
    );
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
