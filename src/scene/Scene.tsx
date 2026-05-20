import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

import { CameraRig } from './CameraRig';
import { Lighting } from './Lighting';
import { Ground } from './Ground';
import { Placeholder } from './Placeholder';
import { PerfMonitor } from './PerfMonitor';

/**
 * Root R3F scene. Step 2: cinematic framing, day-leaning lighting, fog
 * for atmospheric depth, ground plane, placeholder orb.
 *
 * Color management: r155+ enables ColorManagement by default; we set
 * ACESFilmic tone mapping for cinematic highlights and a slightly warm
 * clear color that the day-lit fog blends into seamlessly.
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
      camera={{ position: [0, 1.7, 9], fov: 42, near: 0.1, far: 200 }}
      onCreated={({ scene }) => {
        // Sky-leaning fog so distant geometry fades into the dome cleanly.
        scene.fog = new THREE.Fog('#bfe0ff', 28, 90);
        scene.background = new THREE.Color('#bfe0ff');
      }}
    >
      <Suspense fallback={null}>
        <PerfMonitor />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <CameraRig />
        <Lighting />
        <Ground />
        <Placeholder />
      </Suspense>
    </Canvas>
  );
}
