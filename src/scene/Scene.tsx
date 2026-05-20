import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

import { CameraRig } from './CameraRig';
import { Lighting } from './Lighting';
import { Ground } from './Ground';
import { Sky } from './Sky';
import { Grass } from './grass/Grass';
import { Particles } from './Particles';
import { Postprocessing } from './Postprocessing';
import { PerfMonitor } from './PerfMonitor';
import { ServicesOrbs } from './services/ServicesOrbs';
import { Gallery } from './gallery/Gallery';
import { Contact } from './contact/Contact';

/**
 * Root R3F scene. Step 3 turns the placeholder ground into a living
 * garden: instanced grass with a GLSL wind+cursor shader, drifting
 * pollen/firefly particles, a physical sky, and a bloom + vignette
 * post-processing pipeline. All visual systems read scene `progress`
 * from the zustand store so they tween in lockstep with the camera
 * waypoints (wired in Step 4).
 */
export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      // Let touch scrolling pass through the canvas to the page.
      style={{ touchAction: 'pan-y' }}
      camera={{ position: [0, 1.7, 9], fov: 42, near: 0.1, far: 500 }}
      onCreated={({ scene }) => {
        // Matched to grass shader fog uniforms.
        scene.fog = new THREE.Fog('#bfe0ff', 28, 90);
      }}
    >
      <Suspense fallback={null}>
        <PerfMonitor />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Sky />
        <CameraRig />
        <Lighting />
        <Ground />
        <Grass />
        <Particles />
        <ServicesOrbs />
        <Gallery />
        <Contact />

        <Postprocessing />
      </Suspense>
    </Canvas>
  );
}
