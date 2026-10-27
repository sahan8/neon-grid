import { useSyncExternalStore } from 'react';

/**
 * Tiny store the Loader watches. Lazy 3D scenes (and the first images) call
 * `markReady(key)` when their assets are in; the loader finishes when every
 * registered key is ready (or after a safety timeout).
 */
const pending = new Set<string>(['fonts', 'hero']);
const done = new Set<string>();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function markReady(key: string) {
  if (done.has(key)) return;
  done.add(key);
  emit();
}

export function bootProgress() {
  return Math.round((Array.from(pending).filter((k) => done.has(k)).length / pending.size) * 100);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useBootProgress() {
  return useSyncExternalStore(subscribe, bootProgress, () => 0);
}

// Fonts are part of the boot: wait for the webfonts so the first frame is on-brand.
if (typeof document !== 'undefined') {
  (document.fonts?.ready ?? Promise.resolve()).then(() => markReady('fonts'));
  // Safety net: never trap the visitor behind the loader.
  window.setTimeout(() => pending.forEach(markReady), 9000);
}

/** Smooth scroll to a section id, through Lenis when it is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as Window & { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -8 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Move focus for keyboard and screen-reader users.
  const heading = el.querySelector<HTMLElement>('h2, h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll: true });
}
