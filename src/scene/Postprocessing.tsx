import { EffectComposer, Bloom, Vignette, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { Vector2 } from 'three';

import { useSceneStore } from '@/store/useSceneStore';

const CA_OFFSET = new Vector2(0.0004, 0.0002);

/**
 * Bloom + vignette + DoF + chromatic aberration.
 * DoF and CA are high-perf only — they add the "camera was physically there"
 * feeling without meaningful cost on capable hardware.
 * Medium gets bloom + vignette. Low gets nothing.
 */
export function Postprocessing() {
  const perf = useSceneStore((s) => s.perf);

  if (perf === 'low') return null;

  if (perf === 'high') {
    return (
      <EffectComposer multisampling={0} enableNormalPass>
        <DepthOfField focusDistance={0.008} focalLength={0.035} bokehScale={2.5} />
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.2}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.55}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration
          offset={CA_OFFSET}
          radialModulation
          modulationOffset={0.15}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
        mipmapBlur
        kernelSize={KernelSize.MEDIUM}
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
