import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const ca = new THREE.Vector2(0.0008, 0.0008);

/**
 * Spec: Bloom 1.2, subtle chromatic aberration, film grain, vignette.
 * Low tier drops chromatic aberration and noise and halves bloom resolution.
 */
export function PostFX({ tier, bloom = 1.2 }: { tier: 'low' | 'high'; bloom?: number }) {
  if (tier === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={bloom * 0.8} luminanceThreshold={0.25} luminanceSmoothing={0.4} mipmapBlur resolutionScale={0.5} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={bloom} luminanceThreshold={0.2} luminanceSmoothing={0.35} mipmapBlur />
      <ChromaticAberration offset={ca} radialModulation={false} modulationOffset={0} blendFunction={BlendFunction.NORMAL} />
      <Noise opacity={0.05} premultiply blendFunction={BlendFunction.SCREEN} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  );
}
