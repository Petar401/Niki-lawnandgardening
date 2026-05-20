import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

import { useSceneStore } from '@/store/useSceneStore';

const BLOOM_BY_PERF: Record<'high' | 'medium' | 'low', { intensity: number; kernel: KernelSize }> = {
  high: { intensity: 0.7, kernel: KernelSize.LARGE },
  medium: { intensity: 0.5, kernel: KernelSize.MEDIUM },
  low: { intensity: 0.0, kernel: KernelSize.SMALL },
};

/**
 * Bloom + vignette. Bloom catches the sun, the particle highlights, and
 * the emissive accents in later steps (mailbox glow, firefly burst). On
 * low-perf devices we drop bloom entirely (pass-through composer).
 */
export function Postprocessing() {
  const perf = useSceneStore((s) => s.perf);
  const { intensity, kernel } = BLOOM_BY_PERF[perf];

  if (perf === 'low') return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={intensity}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.2}
        mipmapBlur
        kernelSize={kernel}
      />
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
