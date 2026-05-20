import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Camera rig. For Step 2 it just holds a fixed cinematic framing of the
 * hero garden with a gentle pointer-parallax so the scene feels alive
 * even without scrolling. Step 4 will swap this out for a multi-waypoint
 * spline driven by scroll progress.
 */
const BASE_POS = new THREE.Vector3(0, 1.7, 9);
const BASE_LOOK = new THREE.Vector3(0, 1.2, 0);

export function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3().copy(BASE_LOOK));

  useFrame((_, dt) => {
    // Smoothed pointer parallax: small lateral + vertical sway.
    const targetX = BASE_POS.x + pointer.x * 0.6;
    const targetY = BASE_POS.y + pointer.y * 0.25;

    camera.position.x += (targetX - camera.position.x) * Math.min(1, dt * 3);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, dt * 3);
    camera.position.z += (BASE_POS.z - camera.position.z) * Math.min(1, dt * 3);

    camera.lookAt(target.current);
  });

  return null;
}
