import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize, type BloomEffect, type VignetteEffect } from 'postprocessing';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';

const BLOOM_BY_PERF: Record<'high' | 'medium' | 'low', { intensity: number; kernel: KernelSize }> = {
  high: { intensity: 0.7, kernel: KernelSize.LARGE },
  medium: { intensity: 0.5, kernel: KernelSize.MEDIUM },
  low: { intensity: 0.0, kernel: KernelSize.SMALL },
};

/**
 * Bloom + vignette. The bloom threshold drops and the vignette deepens as
 * the scene transitions from day to dusk — emissive accents (mailbox glow,
 * firefly burst, sun motes) become more theatrical without changing intensity
 * at noon.
 */
export function Postprocessing() {
  const perf = useSceneStore((s) => s.perf);
  const { intensity, kernel } = BLOOM_BY_PERF[perf];

  // drei's <Bloom/> / <Vignette/> forward to the underlying postprocessing
  // effect instances; the wrapper component types confuse TS so cast here.
  const bloomRef = useRef<BloomEffect | null>(null);
  const vignetteRef = useRef<VignetteEffect | null>(null);

  useFrame(() => {
    const dusk = useSceneStore.getState().shared.dusk;
    if (bloomRef.current) {
      // Day 0.62 → dusk 0.35 so warm highlights catch fire after sunset.
      bloomRef.current.luminanceMaterial.threshold = THREE.MathUtils.lerp(0.62, 0.35, dusk);
    }
    if (vignetteRef.current) {
      // Day 0.55 → dusk 0.78 for a more cinematic close.
      vignetteRef.current.darkness = THREE.MathUtils.lerp(0.55, 0.78, dusk);
    }
  });

  if (perf === 'low') return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        ref={bloomRef as unknown as React.RefObject<typeof BloomEffect>}
        intensity={intensity}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.2}
        mipmapBlur
        kernelSize={kernel}
      />
      <Vignette
        ref={vignetteRef as unknown as React.RefObject<typeof VignetteEffect>}
        eskil={false}
        offset={0.25}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
