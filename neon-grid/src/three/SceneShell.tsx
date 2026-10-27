import { Suspense, lazy, type ComponentType, type ReactNode, useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { markReady } from '../lib/boot';

/**
 * Wraps a lazy-loaded 3D scene:
 * - shows `fallback` (a static image) when WebGL is off / reduced motion / Save-Data
 * - only downloads the scene chunk once the section approaches the viewport (or `eager`)
 * - passes `active` so the scene can pause its render loop off-screen, in a hidden tab, or while `paused`
 */
export function SceneShell<P extends object>({
  load,
  props,
  fallback,
  className = '',
  eager = false,
  readyKey,
  paused = false,
}: {
  load: () => Promise<{ default: ComponentType<P & { active: boolean }> }>;
  props: P;
  fallback: ReactNode;
  className?: string;
  eager?: boolean;
  readyKey?: string;
  /** Hold the render loop (e.g. while the boot loader covers the hero). */
  paused?: boolean;
}) {
  const webgl = useWebGLSupport();
  const { ref, inView, everSeen } = useInView<HTMLDivElement>('300px');
  const Scene = useLazy(load);
  const [live, setLive] = useState(false);

  // With no live 3D, the static image is the "ready" state for the loader.
  useEffect(() => {
    if (!webgl && readyKey) markReady(readyKey);
  }, [webgl, readyKey]);

  const mount = webgl && (eager || everSeen);

  return (
    <div ref={ref} className={className || 'relative'}>
      {/* The fallback covers the load, then fades once the scene commits (canvases are transparent, so it would show through). */}
      <div className={`absolute inset-0 transition-opacity duration-slow ${mount && live ? 'opacity-0' : ''}`}>{fallback}</div>
      {mount && (
        <Suspense fallback={null}>
          <OnMount run={() => setLive(true)} />
          <div className="absolute inset-0">
            <Scene {...props} active={inView && !paused} />
          </div>
        </Suspense>
      )}
    </div>
  );
}

// Commits together with the lazy scene inside the same Suspense boundary.
function OnMount({ run }: { run: () => void }) {
  useEffect(run, [run]);
  return null;
}

// Memoise React.lazy per loader so re-renders don't re-create the component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new WeakMap<object, any>();
function useLazy<P>(load: () => Promise<{ default: ComponentType<P> }>): ComponentType<P> {
  let c = cache.get(load) as ComponentType<P> | undefined;
  if (!c) {
    c = lazy(load) as unknown as ComponentType<P>;
    cache.set(load, c);
  }
  return c;
}
