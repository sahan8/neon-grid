import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PostFX } from './effects/PostFX';
import { getQualityTier } from '../hooks/useWebGLSupport';
import { augments } from '../data/content';

// Preload every render so switching items never suspends the canvas.
augments.forEach((a) => useTexture.preload(a.img));

export interface AugmentViewerProps {
  active: boolean;
  img: string;
  color: string;
  parts: { code: string; t: string; pos: [number, number, number] }[];
  hotspot: number;
  onHotspot: (i: number) => void;
}

/**
 * The augment render as a holographic card: its own luminance is the alpha, so the black
 * backdrop disappears and the card tilts in real perspective. Swap in Draco GLBs with
 * drei's useGLTF('/models/titan_mk4.glb') when you have them.
 */
export default function AugmentViewer({ active, img, color, parts, hotspot, onHotspot }: AugmentViewerProps) {
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
        <Suspense fallback={null}>
          <Hologram img={img} color={color} />
        </Suspense>
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
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minAzimuthAngle={-0.55}
        maxAzimuthAngle={0.55}
        minPolarAngle={Math.PI / 2 - 0.25}
        maxPolarAngle={Math.PI / 2 + 0.1}
        enableDamping
      />
      <PostFX tier={tier} bloom={0.9} />
    </Canvas>
  );
}

function Hologram({ img, color }: { img: string; color: string }) {
  const tex = useTexture(img);
  tex.colorSpace = THREE.SRGBColorSpace;
  const g = useRef<THREE.Group>(null);
  // Light tint toward the selected finish; the render keeps its own colours.
  const tint = useMemo(() => new THREE.Color('#ffffff').lerp(new THREE.Color(color), 0.3), [color]);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.06;
    g.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.18;
  });
  return (
    <group ref={g}>
      <mesh>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial map={tex} alphaMap={tex} color={tint} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
