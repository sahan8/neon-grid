import { useCallback, useEffect, useRef, useState } from 'react';

type IOSOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

/**
 * Opt-in device-tilt parallax for touch devices (design spec: 50% strength of mouse parallax).
 * Returns a ref with normalised { x, y } in -1..1 plus an `enable()` to call from a user gesture
 * (iOS requires a permission prompt triggered by a tap).
 */
export function useGyro() {
  const tilt = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const supported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  const enable = useCallback(async () => {
    if (!supported) return false;
    const DOE = DeviceOrientationEvent as IOSOrientationEvent;
    if (typeof DOE.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission();
        if (res !== 'granted') return false;
      } catch {
        return false;
      }
    }
    setEnabled(true);
    return true;
  }, [supported]);

  useEffect(() => {
    if (!enabled) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      const gamma = Math.max(-30, Math.min(30, e.gamma ?? 0)); // left/right
      const beta = Math.max(-30, Math.min(30, (e.beta ?? 45) - 45)); // front/back around a natural hold
      tilt.current = { x: (gamma / 30) * 0.5, y: (beta / 30) * 0.5 };
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [enabled]);

  return { tilt, enabled, enable, supported };
}
