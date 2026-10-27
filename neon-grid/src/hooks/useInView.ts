import { useEffect, useRef, useState } from 'react';

/**
 * True while the element is on screen AND the tab is visible.
 * 3D canvases use this to pause their render loop (frameloop="never").
 */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [tabVisible, setTabVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
      if (entry.isIntersecting) setSeen(true);
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return { ref, inView: onScreen && tabVisible, everSeen: seen };
}
