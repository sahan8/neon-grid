import { useSyncExternalStore } from 'react';

/**
 * Off-by-default UI sound, synthesised with Web Audio (no audio files to download).
 * Drop real loops into src/assets/audio later and swap them in here if you like.
 */
let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: OscillatorNode[] = [];
const listeners = new Set<() => void>();

function ensureCtx() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.3; // spec: volume 30%
    master.connect(ctx.destination);
  }
  return ctx;
}

function startDrone() {
  const c = ensureCtx();
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  const g = c.createGain();
  g.gain.value = 0.08;
  filter.connect(g).connect(master!);
  drone = [55, 55.4, 82.4].map((f) => {
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.connect(filter);
    o.start();
    return o;
  });
}

function stopDrone() {
  drone.forEach((o) => o.stop());
  drone = [];
}

export function setSound(on: boolean) {
  enabled = on;
  if (on) {
    ensureCtx().resume();
    startDrone();
  } else {
    stopDrone();
  }
  listeners.forEach((l) => l());
}

/** Short UI blip. kind: hover (quiet, high) or click (louder, lower). */
export function blip(kind: 'hover' | 'click' = 'click') {
  if (!enabled || !ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = kind === 'hover' ? 1760 : 660;
  const now = ctx.currentTime;
  g.gain.setValueAtTime(kind === 'hover' ? 0.03 : 0.08, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  o.connect(g).connect(master);
  o.start(now);
  o.stop(now + 0.09);
}

export function useSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => enabled,
    () => false,
  );
  return [on, setSound];
}
