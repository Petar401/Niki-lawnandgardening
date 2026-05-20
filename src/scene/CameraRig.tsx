import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { buildCameraPath } from './cameraPath';

/**
 * Camera rig:
 *  - Position + lookAt sampled from a Catmull-Rom path through 4 waypoints,
 *    driven by store `progress` (scroll position).
 *  - Pointer parallax layered on top, fading near the contact waypoint.
 *  - Frame-rate independent smoothing via lerp(dt * k).
 *  - prefers-reduced-motion: snap to the sampled pose with no smoothing
 *    and disable pointer sway entirely.
 */
export function CameraRig() {
  const { camera, pointer } = useThree();
  const path = useMemo(() => buildCameraPath(), []);

  const targetPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const finalPos = useRef(new THREE.Vector3().copy(camera.position));

  useFrame((_, dt) => {
    const state = useSceneStore.getState();
    const { position, target, fov } = path.sample(state.progress);

    if (state.reducedMotion) {
      camera.position.copy(position);
      finalPos.current.copy(position);
      lookAt.current.copy(target);
      camera.lookAt(lookAt.current);
      if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const swayScale = THREE.MathUtils.lerp(0.8, 0.15, state.progress);
    targetPos.current.copy(position);
    targetPos.current.x += pointer.x * 0.6 * swayScale;
    targetPos.current.y += pointer.y * 0.25 * swayScale;

    const k = 1 - Math.exp(-dt * 4);
    finalPos.current.lerp(targetPos.current, k);
    camera.position.copy(finalPos.current);

    lookAt.current.copy(target);
    camera.lookAt(lookAt.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, fov, k);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
