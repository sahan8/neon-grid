import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PostFX } from './effects/PostFX';
import { getQualityTier } from '../hooks/useWebGLSupport';

/** Infinite tunnel of glowing grid rings moving toward the camera (Join section background). */
export default function DataTunnel({ active }: { active: boolean }) {
  const tier = useMemo(getQualityTier, []);
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={tier === 'low' ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 0], fov: 70, near: 0.1, far: 120 }}
      gl={{ antialias: false, alpha: false }}
      aria-hidden="true"
      onCreated={({ gl }) => gl.setClearColor('#05060A')}
    >
      <fog attach="fog" args={['#05060A', 10, 80]} />
      <Rings count={tier === 'low' ? 20 : 34} />
      <Particles count={tier === 'low' ? 300 : 900} />
      <PostFX tier={tier} bloom={1} />
    </Canvas>
  );
}

const SPACING = 3;

function Rings({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(6, 6, 0.01, 8, 1, true).rotateX(Math.PI / 2)), []);
  const colors = useMemo(() => ['#00F0FF', '#7B2CFF', '#00F0FF', '#FF2A6D'].map((c) => new THREE.Color(c).multiplyScalar(1.6)), []);
  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05) * 8;
    group.current?.children.forEach((ring) => {
      ring.position.z += step;
      if (ring.position.z > 2) ring.position.z -= count * SPACING;
      ring.rotation.z += step * 0.01;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => (
        <lineSegments key={i} geometry={geo} position={[0, 0, -i * SPACING]} rotation={[0, 0, (i % 2) * (Math.PI / 8)]}>
          <lineBasicMaterial color={colors[i % colors.length]} toneMapped={false} transparent opacity={0.8} />
        </lineSegments>
      ))}
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 4;
      p.set([Math.cos(a) * r, Math.sin(a) * r, -Math.random() * 100], i * 3);
    }
    return p;
  }, [count]);
  useFrame((_, dt) => {
    const arr = ref.current!.geometry.attributes.position.array as Float32Array;
    const step = Math.min(dt, 0.05) * 20;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += step;
      if (arr[i * 3 + 2] > 2) arr[i * 3 + 2] = -100;
    }
    ref.current!.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9ff6ff" size={0.06} sizeAttenuation toneMapped={false} />
    </points>
  );
}
