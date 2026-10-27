import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { AugmentId } from '../data/content';
import { PostFX } from './effects/PostFX';
import { getQualityTier } from '../hooks/useWebGLSupport';

export interface AugmentViewerProps {
  active: boolean;
  item: AugmentId;
  color: string;
  parts: { code: string; t: string; pos: [number, number, number] }[];
  hotspot: number;
  onHotspot: (i: number) => void;
}

/**
 * 3D augment on a holographic pedestal. Models are procedural placeholders —
 * swap in Draco-compressed GLBs with drei's useGLTF('/models/titan_mk4.glb') when you have them.
 */
export default function AugmentViewer({ active, item, color, parts, hotspot, onHotspot }: AugmentViewerProps) {
  const tier = useMemo(getQualityTier, []);
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={tier === 'low' ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.6, 5.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-3, -1, 2]} intensity={12} color={color} />
      <group position={[0, 0.2, 0]} scale={0.78}>
        <Model item={item} color={color} />
        {parts.map((p, i) => (
          <Html key={p.code} position={p.pos} center zIndexRange={[20, 0]}>
            <button
              type="button"
              onClick={() => onHotspot(i)}
              aria-label={`Node ${i + 1}: ${p.t}`}
              aria-pressed={hotspot === i}
              className="grid h-11 w-11 place-items-center"
            >
              <span
                className="pulse-dot block h-3.5 w-3.5 rounded-full border-2"
                style={{ borderColor: color, color, background: hotspot === i ? color : 'rgba(5,6,10,.8)' }}
              />
            </button>
          </Html>
        ))}
      </group>
      <Pedestal color={color} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.2}
        minPolarAngle={Math.PI / 2 - 0.25}
        maxPolarAngle={Math.PI / 2 + 0.1}
        enableDamping
      />
      <PostFX tier={tier} bloom={0.9} />
    </Canvas>
  );
}

function Model({ item, color }: { item: AugmentId; color: string }) {
  const g = useRef<THREE.Group>(null);
  const glow = useMemo(() => new THREE.Color(color).multiplyScalar(2.5), [color]);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.06;
  });
  const chrome = <meshStandardMaterial color="#C9D3E3" metalness={0.95} roughness={0.22} />;
  const matte = <meshStandardMaterial color="#1a1f2c" metalness={0.5} roughness={0.55} />;
  const seam = <meshBasicMaterial color={glow} toneMapped={false} />;

  return (
    <group ref={g}>
      {item === 'arm' && (
        <group rotation={[0, 0, -0.5]}>
          <mesh position={[0.9, 0.9, 0]}>
            <sphereGeometry args={[0.38, 32, 32]} />
            {chrome}
          </mesh>
          <mesh position={[0.45, 0.45, 0]} rotation={[0, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.28, 0.9, 8, 24]} />
            {matte}
          </mesh>
          <mesh position={[0.45, 0.45, 0.28]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.04, 0.9, 0.02]} />
            {seam}
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.24, 24, 24]} />
            {chrome}
          </mesh>
          <mesh position={[-0.45, -0.3, 0]} rotation={[0, 0, Math.PI / 3]}>
            <capsuleGeometry args={[0.22, 0.85, 8, 24]} />
            {chrome}
          </mesh>
          <mesh position={[-0.45, -0.3, 0.22]} rotation={[0, 0, Math.PI / 3]}>
            <boxGeometry args={[0.035, 0.8, 0.02]} />
            {seam}
          </mesh>
          <RoundedBox args={[0.42, 0.5, 0.2]} radius={0.06} position={[-0.95, -0.62, 0]} rotation={[0, 0, Math.PI / 3]}>
            {matte}
          </RoundedBox>
          {[-0.12, -0.04, 0.04, 0.12].map((o) => (
            <mesh key={o} position={[-1.22 + o * 0.5, -0.86 - o * 0.6, 0]} rotation={[0, 0, Math.PI / 3]}>
              <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
              {chrome}
            </mesh>
          ))}
        </group>
      )}

      {item === 'optic' && (
        <group rotation={[0.1, 0.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.95, 0.95, 0.35, 64]} />
            {matte}
          </mesh>
          {[0.92, 0.72, 0.5].map((r, i) => (
            <mesh key={r} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.18 + i * 0.01, 0]}>
              <torusGeometry args={[r, 0.035, 12, 96]} />
              {seam}
            </mesh>
          ))}
          <mesh position={[0, 0.16, 0]}>
            <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#05060A" metalness={0.2} roughness={0.05} clearcoat={1} />
          </mesh>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[1.12, 0.012, 8, 96, Math.PI * 1.4]} />
              <meshBasicMaterial color="#00F0FF" toneMapped={false} />
            </mesh>
          </group>
          {[-0.4, 0, 0.4].map((x) => (
            <mesh key={x} position={[x * 0.6 - 0.6, -0.6, -0.4]} rotation={[0.6, 0, 0.4]}>
              <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
              {chrome}
            </mesh>
          ))}
        </group>
      )}

      {item === 'chip' && (
        <group rotation={[0.55, 0.6, 0]}>
          <RoundedBox args={[1.7, 0.42, 1.7]} radius={0.08}>
            <meshPhysicalMaterial color="#d7cdfa" transmission={0.85} thickness={0.6} roughness={0.08} ior={1.45} transparent opacity={0.85} />
          </RoundedBox>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            {seam}
          </mesh>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.6, 0.02, 0.025]} />
                {seam}
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

function Pedestal({ color }: { color: string }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.4;
  });
  const c = useMemo(() => new THREE.Color(color).multiplyScalar(2), [color]);
  return (
    <group position={[0, -1.35, 0]}>
      <mesh>
        <cylinderGeometry args={[1.25, 1.35, 0.18, 64]} />
        <meshStandardMaterial color="#0B0E17" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={ring} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.0, 1.12, 64, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial color={c} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* light cone */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 1.6, 48, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}
