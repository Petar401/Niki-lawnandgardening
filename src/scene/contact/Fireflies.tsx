import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { CONTACT_ANCHOR, contactIntensity } from './contactData';

const PERF_COUNT: Record<'high' | 'medium' | 'low', number> = {
  high: 140,
  medium: 80,
  low: 40,
};

const fireflyVert = /* glsl */ `
  attribute vec3  aOrbit;     // (radius, baseY offset, phase)
  attribute vec3  aBurstDir;  // pre-baked random outward direction
  attribute float aSize;

  uniform float uTime;
  uniform float uBurstStart;
  uniform float uBurstDuration;
  uniform float uIntensity;   // 0..1 contact phase
  uniform vec3  uCenter;

  varying float vGlow;
  varying float vAlpha;

  void main() {
    // 1. Orbital position around the mailbox.
    float t = uTime * 0.5 + aOrbit.z * 6.28;
    vec3 orbital = uCenter + vec3(
      cos(t) * aOrbit.x,
      aOrbit.y + sin(t * 1.3 + aOrbit.z * 3.0) * 0.35,
      sin(t) * aOrbit.x
    );

    // 2. Burst trajectory (parabolic — outward then drifting down).
    float burstT = clamp((uTime - uBurstStart) / uBurstDuration, 0.0, 1.0);
    float burstAttack = smoothstep(0.0, 0.07, burstT);
    float burstFade   = 1.0 - smoothstep(0.55, 1.0, burstT);
    float burstMix    = burstAttack * burstFade;

    float travel = burstT * 7.5;
    vec3 burstPos = uCenter
      + aBurstDir * travel
      - vec3(0.0, burstT * burstT * 1.4, 0.0); // gravity arc

    vec3 finalPos = mix(orbital, burstPos, burstMix);

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;

    float perspective = 320.0 / max(-mv.z, 0.01);
    gl_PointSize = aSize * perspective * (1.0 + burstMix * 2.5);

    // Per-firefly pulse (idle) → strong glow (burst).
    float idlePulse = 0.5 + 0.5 * sin(uTime * 2.3 + aOrbit.z * 9.0);
    vGlow = mix(idlePulse, 1.0, burstMix);

    vAlpha = uIntensity * mix(1.0, 1.4, burstMix);
  }
`;

const fireflyFrag = /* glsl */ `
  precision highp float;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    if (core <= 0.001) discard;

    vec3 col = mix(vec3(1.0, 0.85, 0.5), vec3(1.0, 0.95, 0.7), vGlow);
    float intensity = 0.4 + vGlow * 1.6;

    gl_FragColor = vec4(col * intensity, core * vAlpha);
  }
`;

const BURST_DURATION = 2.2; // seconds
const BURST_DURATION_REDUCED = 0.6; // soft acknowledge when motion is reduced

/**
 * Firefly swarm orbiting the mailbox during the contact phase.
 * On every `burstNonce` change (form submitted), all fireflies surge
 * outward in a parabolic firework, then re-form into the orbit pattern.
 */
export function Fireflies() {
  const ref = useRef<THREE.Points>(null);
  const perf = useSceneStore((s) => s.perf);
  const count = PERF_COUNT[perf];

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);     // unused; vertex shader computes
    const orbits = new Float32Array(count * 3);
    const burstDirs = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Orbit: radius 1.0–3.0, vertical offset -0.3..1.8, random phase.
      orbits[i * 3 + 0] = 1.0 + Math.random() * 2.0;
      orbits[i * 3 + 1] = -0.3 + Math.random() * 2.1;
      orbits[i * 3 + 2] = Math.random();

      // Burst direction: hemisphere biased upward, unit vector.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1) * 0.6 + 0.15; // upward bias
      burstDirs[i * 3 + 0] = Math.sin(phi) * Math.cos(theta);
      burstDirs[i * 3 + 1] = Math.cos(phi); // mostly positive
      burstDirs[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);

      sizes[i] = 0.04 + Math.random() * 0.07;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aOrbit', new THREE.BufferAttribute(orbits, 3));
    g.setAttribute('aBurstDir', new THREE.BufferAttribute(burstDirs, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    // Bounding sphere so frustum culling won't drop us.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(...CONTACT_ANCHOR), 12);

    const u = {
      uTime: { value: 0 },
      uBurstStart: { value: -10 }, // far in the past so no burst on load
      uBurstDuration: { value: BURST_DURATION },
      uIntensity: { value: 0 },
      uCenter: { value: new THREE.Vector3(...CONTACT_ANCHOR) },
    };

    return { geometry: g, uniforms: u };
  }, [count]);

  // Dispose the previous geometry when perf-tier change recomputes it.
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Subscribe to burst trigger.
  const burstNonce = useSceneStore((s) => s.burstNonce);
  const initialNonce = useRef(burstNonce);
  useEffect(() => {
    if (burstNonce === initialNonce.current) return;
    // Start a new burst now (use the canvas clock via the next frame).
    pendingBurst.current = true;
  }, [burstNonce]);
  const pendingBurst = useRef(false);

  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
    const intensity = contactIntensity(useSceneStore.getState().progress);
    uniforms.uIntensity.value = THREE.MathUtils.lerp(
      uniforms.uIntensity.value,
      intensity,
      0.08,
    );

    if (pendingBurst.current) {
      uniforms.uBurstStart.value = s.clock.elapsedTime;
      uniforms.uBurstDuration.value = useSceneStore.getState().reducedMotion
        ? BURST_DURATION_REDUCED
        : BURST_DURATION;
      pendingBurst.current = false;
    }
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={fireflyVert}
        fragmentShader={fireflyFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
