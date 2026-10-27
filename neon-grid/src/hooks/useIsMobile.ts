import { useEffect, useState } from 'react';

/** True below the 768px breakpoint (mobile layout). */
export function useIsMobile(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return mobile;
}

/** True on touch-first devices (no hover, coarse pointer). */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const onChange = () => setTouch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return touch;
}
