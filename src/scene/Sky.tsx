import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky as DreiSky } from '@react-three/drei';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';

/**
 * Hosek–Wilkie sky from drei. We drive its sun position from scene progress
 * so the sky physically transitions from high-noon blue to deep dusk
 * lavender as the user scrolls. Same source-of-truth (the store progress)
 * as <Lighting/> and the grass dusk tint — keeps everything in lockstep.
 */
export function Sky() {
  const sunRef = useRef(new THREE.Vector3(8, 12, 6));

  // Sphericals tuned by eye for high-noon vs golden-dusk.
  const sunHigh = useMemo(() => new THREE.Vector3(8, 18, 6), []);
  const sunLow = useMemo(() => new THREE.Vector3(-22, 1.4, -8), []);

  useFrame(() => {
    const t = THREE.MathUtils.smoothstep(useSceneStore.getState().progress, 0, 1);
    sunRef.current.lerpVectors(sunHigh, sunLow, t);
  });

  return (
    <DreiSky
      distance={4500}
      sunPosition={sunRef.current}
      mieCoefficient={0.005}
      mieDirectionalG={0.85}
      rayleigh={2}
      turbidity={6}
    />
  );
}
