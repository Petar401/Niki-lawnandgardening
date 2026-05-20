import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneStore } from '@/store/useSceneStore';
import { buildCameraPath } from './cameraPath';

/**
 * Camera rig (Step 4):
 *  - Position + lookAt sampled from a Catmull-Rom path through 4 waypoints,
 *    driven by store `progress` (scroll position).
 *  - Pointer parallax layered on top as a small additive offset, so the
 *    scene feels alive even when scroll is stationary.
 *  - Frame-rate independent smoothing via lerp(dt * k).
 *
 * The camera object itself stays the same PerspectiveCamera that R3F
 * created in <Scene/>; we only mutate its position/quaternion/fov here.
 */
export function CameraRig() {
  const { camera, pointer } = useThree();
  const path = useMemo(() => buildCameraPath(), []);

  // Scratch vectors so the per-frame work is alloc-free.
  const targetPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const finalPos = useRef(new THREE.Vector3().copy(camera.position));

  useFrame((_, dt) => {
    const progress = useSceneStore.getState().progress;
    const { position, target, fov } = path.sample(progress);

    // Additive pointer sway, scaled down as we move deeper into the path
    // so the contact waypoint stays stable for form interaction.
    const swayScale = THREE.MathUtils.lerp(0.8, 0.15, progress);
    targetPos.current.copy(position);
    targetPos.current.x += pointer.x * 0.6 * swayScale;
    targetPos.current.y += pointer.y * 0.25 * swayScale;

    // Smooth toward path-sampled pose (k≈4 → ~250ms catch-up at 60fps).
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
