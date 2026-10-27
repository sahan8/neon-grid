import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { PostFX } from './effects/PostFX';
import { makeBillboardTexture, makeWindowTexture } from './textures';
import { getQualityTier } from '../hooks/useWebGLSupport';
import { markReady } from '../lib/boot';

export interface CitySceneProps {
  active: boolean;
  /** Normalised device tilt from useGyro (mobile parallax). */
  tilt?: React.MutableRefObject<{ x: number; y: number }>;
}

/** Hero megacity: instanced towers, holo billboards, flying-car trails, rain, fog, wet street. */
export default function CityScene({ active, tilt }: CitySceneProps) {
  const initial = useMemo(getQualityTier, []);
  // Live adaptive quality: drop to the low tier (no reflections, lighter FX, lower DPR)
  // if the device can't hold its frame rate; step back up if it recovers.
  const [tier, setTier] = useState<'low' | 'high'>(initial);
  const [dpr, setDpr] = useState(initial === 'low' ? 1.25 : 1.75);
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 6, 34], fov: 55, near: 0.5, far: 400 }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.setClearColor('#05060A');
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
    >
      <PerformanceMonitor
        bounds={(refresh) => (refresh > 90 ? [50, 80] : [40, 58])}
        onDecline={() => {
          setDpr(1);
          setTier('low');
        }}
        onIncline={() => initial === 'high' && setDpr(1.5)}
        flipflops={3}
        onFallback={() => {
          setDpr(1);
          setTier('low');
        }}
      />
      <fogExp2 attach="fog" args={['#2a0f4a', tier === 'low' ? 0.022 : 0.018]} />
      <ambientLight intensity={0.25} color="#7B2CFF" />
      <pointLight position={[-14, 10, 10]} intensity={60} color="#00F0FF" distance={60} />
      <pointLight position={[14, 8, -10]} intensity={60} color="#FF2A6D" distance={60} />
      <CameraRig tilt={tilt} />
      <Towers tier={tier} />
      <Billboards />
      <Traffic count={tier === 'low' ? 24 : 60} />
      <Rain count={tier === 'low' ? 1200 : 4000} />
      <Street tier={tier} />
      <FirstFrame />
      <PostFX tier={tier} />
    </Canvas>
  );
}

function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      markReady('hero');
    }
  });
  return null;
}

/** Pointer parallax (max 3°) + scroll dive: first 100vh of scroll flies the camera down the street. */
function CameraRig({ tilt }: { tilt?: CitySceneProps['tilt'] }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  const target = useRef(new THREE.Vector3());
  useFrame(() => {
    const d = Math.min(1, window.scrollY / window.innerHeight);
    const px = tilt?.current.x || pointer.current.x;
    const py = tilt?.current.y || pointer.current.y;
    const z = 34 - d * 70;
    camera.position.x += (px * 2 - camera.position.x) * 0.05;
    camera.position.y += (6 - py * 1 + d * -2 - camera.position.y) * 0.05;
    camera.position.z += (z - camera.position.z) * 0.08;
    target.current.set(px * 3, 9 + d * 2, camera.position.z - 40);
    camera.lookAt(target.current);
  });
  return null;
}

function Towers({ tier }: { tier: 'low' | 'high' }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = tier === 'low' ? 90 : 220;
  const tex = useMemo(() => makeWindowTexture(7), []);
  useEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    let s = 42;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const lane = Math.floor(rnd() * 4);
      const x = side * (9 + lane * 7 + rnd() * 3);
      const z = 30 - rnd() * 260;
      const w = 4 + rnd() * 5;
      const h = 12 + Math.pow(rnd(), 1.5) * (lane > 1 ? 90 : 55);
      m.compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, w));
      ref.current!.setMatrixAt(i, m);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshStandardMaterial color="#0B0E17" roughness={0.6} metalness={0.4} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1.6} map={tex} />
    </instancedMesh>
  );
}

const BOARDS: { text: string; color: string; pos: [number, number, number]; size: [number, number]; vertical?: boolean; flicker: number }[] = [
  { text: '電脳都市', color: '#00F0FF', pos: [-8.6, 16, 6], size: [2.2, 9], vertical: true, flicker: 1.3 },
  { text: 'NEON//GRID', color: '#FF2A6D', pos: [8.6, 20, -14], size: [9, 4.5], flicker: 2.1 },
  { text: 'ネオン', color: '#F5E642', pos: [-8.6, 24, -40], size: [2, 7], vertical: true, flicker: 0.6 },
  { text: 'SECTOR 07', color: '#7B2CFF', pos: [9, 14, -60], size: [8, 4], flicker: 1.7 },
  { text: 'JACK IN', color: '#00F0FF', pos: [-9, 30, -90], size: [10, 5], flicker: 2.6 },
];

function Billboards() {
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const textures = useMemo(() => BOARDS.map((b) => makeBillboardTexture(b.text, b.color, b.vertical)), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    mats.current.forEach((m, i) => {
      const f = BOARDS[i].flicker;
      m.opacity = Math.sin(t * 7 + f * 10) > 0.97 ? 0.35 : 0.95; // occasional 4s-ish flicker
    });
  });
  return (
    <group>
      {BOARDS.map((b, i) => (
        <mesh key={b.text} position={b.pos} rotation={[0, b.pos[0] < 0 ? Math.PI / 2.4 : -Math.PI / 2.4, 0]}>
          <planeGeometry args={b.size} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            map={textures[i]}
            transparent
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Flying cars: bright streaks moving along sky lanes. */
function Traffic({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const data = useMemo(() => {
    let s = 7;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const colors = ['#00F0FF', '#FF2A6D', '#F5E642', '#E8F1FF'];
    return Array.from({ length: count }, () => ({
      x: (rnd() - 0.5) * 12,
      y: 10 + rnd() * 26,
      z: 30 - rnd() * 240,
      speed: (20 + rnd() * 30) * (rnd() > 0.5 ? 1 : -1),
      color: new THREE.Color(colors[Math.floor(rnd() * colors.length)]),
    }));
  }, [count]);
  useEffect(() => {
    data.forEach((d, i) => ref.current!.setColorAt(i, d.color.clone().multiplyScalar(3)));
    ref.current!.instanceColor!.needsUpdate = true;
  }, [data]);
  const m = useMemo(() => new THREE.Matrix4(), []);
  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    data.forEach((d, i) => {
      d.z += d.speed * step;
      if (d.z > 40) d.z = -220;
      if (d.z < -220) d.z = 40;
      m.makeScale(0.15, 0.08, 3.5);
      m.setPosition(d.x, d.y, d.z);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Rain({ count }: { count: number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = Math.random() * 50;
      const z = 40 - Math.random() * 120;
      p.set([x, y, z, x + 0.05, y - 0.9, z], i * 6);
    }
    return p;
  }, [count]);
  useFrame((state, dt) => {
    const geo = ref.current!.geometry;
    const arr = geo.attributes.position.array as Float32Array;
    const fall = Math.min(dt, 0.05) * 40;
    const camZ = state.camera.position.z;
    for (let i = 0; i < count; i++) {
      const o = i * 6;
      arr[o + 1] -= fall;
      arr[o + 4] -= fall;
      if (arr[o + 4] < 0) {
        const y = 50;
        const z = camZ + 10 - Math.random() * 110;
        arr[o + 1] = y;
        arr[o + 4] = y - 0.9;
        arr[o + 2] = z;
        arr[o + 5] = z;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#9fdcff" transparent opacity={0.35} />
    </lineSegments>
  );
}

/** Wet street. Reflections only on the high tier (spec: no reflections on mobile). */
function Street({ tier }: { tier: 'low' | 'high' }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]}>
      <planeGeometry args={[120, 300]} />
      {tier === 'high' ? (
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={18}
          roughness={0.9}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#07070d"
          metalness={0.6}
          mirror={0.7}
        />
      ) : (
        <meshStandardMaterial color="#090a12" roughness={0.35} metalness={0.8} />
      )}
    </mesh>
  );
}
