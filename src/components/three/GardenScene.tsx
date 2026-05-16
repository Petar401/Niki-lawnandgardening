/* eslint-disable react/no-unknown-property */
// Disabled because react/no-unknown-property does not recognise the
// JSX props that React Three Fiber introduces (position, args, intensity,
// castShadow, shadow-*, flatShading, etc.). These are valid R3F props.

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Vector3 } from 'three';

type Props = {
  /** When false, the canvas pauses its render loop. */
  active: boolean;
  /** When true, no idle motion or pointer parallax is applied. */
  reducedMotion: boolean;
};

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const basePos = useMemo(() => new Vector3(4.2, 2.8, 5.6), []);
  const target = useMemo(() => new Vector3(0, 0.8, 0), []);
  const lerped = useRef(new Vector3().copy(basePos));

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.copy(basePos);
      camera.lookAt(target);
      return;
    }
    const t = state.clock.elapsedTime;
    // Lissajous-style idle drift, ~30s cycle, very subtle (±0.18 units)
    const idleX = Math.sin(t * 0.2) * 0.18;
    const idleY = Math.sin(t * 0.27 + 0.7) * 0.10;
    // Pointer parallax with strong damping
    const parX = pointer.x * 0.35;
    const parY = pointer.y * 0.18;

    const desired = new Vector3(
      basePos.x + idleX + parX,
      basePos.y + idleY + parY,
      basePos.z,
    );
    lerped.current.lerp(desired, 1 - Math.pow(0.001, delta));
    camera.position.copy(lerped.current);
    camera.lookAt(target);
  });

  return null;
}

function Ground() {
  return (
    <>
      {/* main lawn */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#9bb47a" roughness={1} metalness={0} />
      </mesh>
      {/* warm path / soil patch under and around the bed */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.005, 0.4]}>
        <circleGeometry args={[3.4, 48]} />
        <meshStandardMaterial color="#c4ad88" roughness={1} metalness={0} />
      </mesh>
      {/* hedge backdrop — a curved bank of soft mounded shapes hides the
         hard horizon line and reads as a clipped boundary hedge */}
      <BackdropHedge />
    </>
  );
}

function BackdropHedge() {
  const mounds = useMemo(() => {
    const out: Array<{ position: [number, number, number]; scale: number; color: string }> = [];
    const radius = 6;
    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const angle = -Math.PI * 0.95 + t * Math.PI * 1.9;
      const wobble = Math.sin(i * 1.3) * 0.4;
      const colors = ['#5a7a48', '#496638', '#618f49', '#3c6a32'];
      out.push({
        position: [
          Math.cos(angle) * (radius + wobble),
          0.6 + Math.sin(i * 0.7) * 0.15,
          Math.sin(angle) * (radius + wobble) - 0.5,
        ],
        scale: 1.1 + Math.sin(i * 0.9) * 0.25,
        color: colors[i % colors.length] as string,
      });
    }
    return out;
  }, []);
  return (
    <>
      {mounds.map((m, i) => (
        <mesh key={i} position={m.position} castShadow>
          <icosahedronGeometry args={[m.scale, 1]} />
          <meshStandardMaterial color={m.color} roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

function StoneSlab() {
  return (
    <group position={[-0.9, 0.06, 1.4]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 1.0]} />
        <meshStandardMaterial color="#cabfa9" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

function BrickEdge() {
  // Tight arc of bricks defining the front of a planted bed.
  const bricks = useMemo(() => {
    const radius = 2.6;
    const count = 22;
    const arcStart = Math.PI * 0.08;
    const arcEnd = Math.PI * 0.92;
    return Array.from({ length: count }).map((_, i) => {
      const t = i / (count - 1);
      const angle = arcStart + t * (arcEnd - arcStart);
      const x = Math.cos(angle) * radius;
      const z = -Math.sin(angle) * radius + 1.4;
      return {
        position: [x, 0.085, z] as [number, number, number],
        rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
      };
    });
  }, []);

  return (
    <group>
      {bricks.map((b, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={b.position}
          rotation={b.rotation}
        >
          <boxGeometry args={[0.26, 0.17, 0.18]} />
          <meshStandardMaterial color="#a8553a" roughness={0.9} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

function Planter() {
  return (
    <group position={[1.6, 0, -0.6]}>
      {/* trough */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[2.0, 0.7, 0.9]} />
        <meshStandardMaterial color="#8a6a4f" roughness={0.85} metalness={0} />
      </mesh>
      {/* top rim */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[2.06, 0.06, 0.96]} />
        <meshStandardMaterial color="#a08368" roughness={0.7} metalness={0} />
      </mesh>
      {/* shrub clusters */}
      <Shrub position={[-0.55, 0.95, 0]} scale={0.9} hue="#4a7a3c" />
      <Shrub position={[0.0, 1.05, 0.05]} scale={1.05} hue="#618f49" />
      <Shrub position={[0.55, 0.95, 0]} scale={0.85} hue="#3c6a32" />
    </group>
  );
}

function Shrub({
  position,
  scale,
  hue,
}: {
  position: [number, number, number];
  scale: number;
  hue: string;
}) {
  // Cluster of three icosahedrons that read as a soft mounded shrub
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[-0.18, 0, 0]}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color={hue} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0.18, 0.05, 0.04]}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial color={hue} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.18, -0.06]}>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color={hue} roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function OrnamentalTree() {
  // Trunk + a soft cluster of icosahedron blobs forming a natural rounded crown.
  const blobs = useMemo(
    () => [
      { position: [0, 1.55, 0] as [number, number, number], scale: 0.6, color: '#618f49' },
      { position: [-0.35, 1.4, 0.05] as [number, number, number], scale: 0.5, color: '#4a7a3c' },
      { position: [0.32, 1.42, -0.08] as [number, number, number], scale: 0.52, color: '#7da757' },
      { position: [0.05, 1.78, 0.02] as [number, number, number], scale: 0.42, color: '#3c6a32' },
      { position: [-0.18, 1.65, -0.18] as [number, number, number], scale: 0.38, color: '#9bbf6f' },
      { position: [0.2, 1.62, 0.22] as [number, number, number], scale: 0.4, color: '#4a7a3c' },
    ],
    [],
  );

  return (
    <group position={[-1.5, 0, -0.4]}>
      <mesh castShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.3, 12]} />
        <meshStandardMaterial color="#4a3424" roughness={1} />
      </mesh>
      {blobs.map((b, i) => (
        <mesh key={i} castShadow position={b.position}>
          <icosahedronGeometry args={[b.scale, 1]} />
          <meshStandardMaterial color={b.color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function GroundShrubs() {
  // Low ground-cover mounds along the bed edge for visual fill
  const items = useMemo(
    () => [
      { position: [-0.6, 0.15, 1.1] as [number, number, number], scale: 0.22, color: '#618f49' },
      { position: [-0.25, 0.13, 1.25] as [number, number, number], scale: 0.18, color: '#7da757' },
      { position: [0.55, 0.16, 1.05] as [number, number, number], scale: 0.24, color: '#4a7a3c' },
      { position: [0.95, 0.14, 0.85] as [number, number, number], scale: 0.2, color: '#9bbf6f' },
    ],
    [],
  );
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} castShadow position={it.position}>
          <icosahedronGeometry args={[it.scale, 1]} />
          <meshStandardMaterial color={it.color} roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

function ForegroundStones() {
  const stones = useMemo(
    () => [
      { position: [-0.2, 0.05, 1.9] as [number, number, number], scale: 0.08 },
      { position: [-0.05, 0.05, 2.05] as [number, number, number], scale: 0.06 },
      { position: [0.18, 0.05, 1.95] as [number, number, number], scale: 0.07 },
    ],
    [],
  );
  return (
    <>
      {stones.map((s, i) => (
        <mesh key={i} castShadow position={s.position}>
          <icosahedronGeometry args={[s.scale, 0]} />
          <meshStandardMaterial color="#1b241c" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={['#fff7e6', '#5a4a36', 0.55]} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.6}
        color="#ffe8c2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.35} color="#bcd2ff" />
    </>
  );
}

function SceneContents({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />
      <Lights />
      <Ground />
      <BrickEdge />
      <StoneSlab />
      <Planter />
      <OrnamentalTree />
      <GroundShrubs />
      <ForegroundStones />
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.45}
        scale={10}
        blur={2.6}
        far={3.5}
        color="#1b241c"
      />
    </>
  );
}

export default function GardenScene({ active, reducedMotion }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [4.2, 2.8, 5.6], fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      style={{ background: 'transparent' }}
    >
      <SceneContents reducedMotion={reducedMotion} />
    </Canvas>
  );
}
