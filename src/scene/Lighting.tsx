import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

/**
 * Day -> dusk lighting. Sun (key light) sweeps across the sky as scroll
 * progress moves through the scene. Hemisphere light grounds the palette.
 *
 * Colors interpolate between two tuned anchors:
 *   day:  warm sun-gold key, soft sky-blue ambient
 *   dusk: low magenta key, lavender ambient
 */
const DAY = {
  sunColor: new THREE.Color('#fff1c7'),
  sunIntensity: 2.6,
  sunPos: new THREE.Vector3(8, 12, 6),
  skyColor: new THREE.Color('#bfe0ff'),
  groundColor: new THREE.Color('#2e6e2c'),
  hemiIntensity: 0.7,
};

const DUSK = {
  sunColor: new THREE.Color('#ff9d6e'),
  sunIntensity: 1.4,
  sunPos: new THREE.Vector3(-10, 3, -2),
  skyColor: new THREE.Color('#5b4b8a'),
  groundColor: new THREE.Color('#1d461d'),
  hemiIntensity: 0.45,
};

export function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);

  useFrame(() => {
    // Scroll progress drives the day -> dusk tween. Eased for cinematic feel.
    const t = THREE.MathUtils.smoothstep(useSceneStore.getState().progress, 0, 1);
    const shared = useSceneStore.getState().shared;
    shared.dusk = t;

    if (sun.current) {
      sun.current.color.lerpColors(DAY.sunColor, DUSK.sunColor, t);
      sun.current.intensity = THREE.MathUtils.lerp(DAY.sunIntensity, DUSK.sunIntensity, t);
      sun.current.position.lerpVectors(DAY.sunPos, DUSK.sunPos, t);
      shared.sunDir.copy(sun.current.position).normalize();
    }
    if (hemi.current) {
      hemi.current.color.lerpColors(DAY.skyColor, DUSK.skyColor, t);
      hemi.current.groundColor.lerpColors(DAY.groundColor, DUSK.groundColor, t);
      hemi.current.intensity = THREE.MathUtils.lerp(DAY.hemiIntensity, DUSK.hemiIntensity, t);
    }
  });

  return (
    <>
      {/* Soft fill so nothing reads pure black in shadow. */}
      <ambientLight intensity={0.18} color="#cfe7c8" />

      {/* Sky/ground hemisphere — cheap but huge atmosphere lift. */}
      <hemisphereLight
        ref={hemi}
        args={[DAY.skyColor, DAY.groundColor, DAY.hemiIntensity]}
      />

      {/* Key light (the sun). Shadow camera is sized for our small playable area;
          will resize once the world expands in Step 3. */}
      <directionalLight
        ref={sun}
        position={DAY.sunPos}
        intensity={DAY.sunIntensity}
        color={DAY.sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />
    </>
  );
}
