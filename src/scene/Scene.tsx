import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
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
 * Root R3F scene. Frameloop is set to "never" when the document tab is
 * hidden, so the canvas stops eating GPU + battery in the background.
 */
export function Scene() {
  const pageHidden = useSceneStore((s) => s.pageHidden);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop={pageHidden ? 'never' : 'always'}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ touchAction: 'pan-y' }}
      camera={{ position: [0, 1.7, 9], fov: 42, near: 0.1, far: 500 }}
      onCreated={({ scene }) => {
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
