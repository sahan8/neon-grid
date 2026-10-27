import { useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';

let cached: boolean | null = null;

function detectWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * Whether to render live 3D. False when WebGL is missing, the visitor prefers
 * reduced motion, or Save-Data is on — callers then show the static fallback image.
 */
export function useWebGLSupport(): boolean {
  const reduced = useReducedMotion();
  return useMemo(() => {
    if (typeof window === 'undefined' || reduced) return false;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
    return detectWebGL();
  }, [reduced]);
}

/** Rough device tier used for adaptive 3D quality. */
export function getQualityTier(): 'low' | 'high' {
  if (typeof window === 'undefined') return 'high';
  const small = window.matchMedia('(max-width: 767px)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return small || cores <= 4 || mem <= 4 ? 'low' : 'high';
}
