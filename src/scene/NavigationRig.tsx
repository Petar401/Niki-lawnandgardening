import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

import { useSceneStore } from '@/store/useSceneStore';
import { NODES_BY_ID, nodeProgress } from './navigationNodes';

/**
 * Camera rig for the click-to-explore experience. Replaces the old
 * scroll-driven CameraRig.
 *
 *  - Subscribes to store `targetZone`. When it changes, runs a GSAP tween
 *    over a plain pose object (position + lookAt + fov + progress).
 *  - `onUpdate` writes the tweened pose into stable refs and pushes the
 *    interpolated `progress` into the store so Sky / Lighting / Grass /
 *    Particles keep their day→dusk animation in sync with the fly-in.
 *  - `onComplete` commits the active zone and clears the flying flag.
 *  - `useFrame` reads the refs each frame, layers pointer parallax on top
 *    (only while idle), and applies to the camera on the R3F tick.
 *  - prefers-reduced-motion → near-instant tween, no parallax.
 *
 * This is the standard GSAP + R3F pattern: animation owns a plain object,
 * the render loop owns the camera. State stays in Zustand, read imperatively
 * via getState() to avoid stale closures.
 */
const ENTRY = NODES_BY_ID.entry;

export function NavigationRig() {
  const { camera, pointer } = useThree();

  const pos = useRef(new THREE.Vector3(...ENTRY.cameraPos));
  const look = useRef(new THREE.Vector3(...ENTRY.lookAt));
  const fov = useRef(ENTRY.fov);
  const parallax = useRef(new THREE.Vector3());
  const targetZone = useSceneStore((s) => s.targetZone);

  // Kick off at the entry zone on mount so the panel + active state populate.
  useEffect(() => {
    useSceneStore.getState().navigateTo('entry');
  }, []);

  useEffect(() => {
    if (!targetZone) return;
    const node = NODES_BY_ID[targetZone];
    const reduced = useSceneStore.getState().reducedMotion;

    const tween = {
      px: pos.current.x, py: pos.current.y, pz: pos.current.z,
      lx: look.current.x, ly: look.current.y, lz: look.current.z,
      fov: fov.current,
      progress: useSceneStore.getState().progress,
    };

    const anim = gsap.to(tween, {
      px: node.cameraPos[0], py: node.cameraPos[1], pz: node.cameraPos[2],
      lx: node.lookAt[0], ly: node.lookAt[1], lz: node.lookAt[2],
      fov: node.fov,
      progress: nodeProgress(targetZone),
      duration: reduced ? 0.05 : 1.8,
      ease: 'power3.inOut',
      onUpdate() {
        pos.current.set(tween.px, tween.py, tween.pz);
        look.current.set(tween.lx, tween.ly, tween.lz);
        fov.current = tween.fov;
        useSceneStore.getState().setProgress(tween.progress);
      },
      onComplete() {
        const s = useSceneStore.getState();
        s.setActiveZone(targetZone);
        s.setTargetZone(null);
        s.setIsFlying(false);
      },
    });

    return () => { anim.kill(); };
  }, [targetZone]);

  useFrame((_, dt) => {
    const { reducedMotion, isFlying } = useSceneStore.getState();
    const sway = isFlying ? 0 : 0.4;

    if (!reducedMotion) {
      const k = 1 - Math.exp(-dt * 3);
      parallax.current.x = THREE.MathUtils.lerp(parallax.current.x, pointer.x * 0.5 * sway, k);
      parallax.current.y = THREE.MathUtils.lerp(parallax.current.y, pointer.y * 0.2 * sway, k);
    } else {
      parallax.current.set(0, 0, 0);
    }

    camera.position.set(
      pos.current.x + parallax.current.x,
      pos.current.y + parallax.current.y,
      pos.current.z,
    );
    camera.lookAt(look.current);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov.current) > 0.001) {
      camera.fov = fov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
