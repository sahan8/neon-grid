import { useEffect, useRef, useState } from 'react';
import { useIsTouch } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Custom cursor: small cyan ring + dot. Over [data-cursor] elements it grows
 * and shows that label ("VIEW", "DRAG", "ENTER"). Hidden on touch devices.
 */
export function Cursor() {
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (touch) return;
    document.documentElement.classList.add('has-custom-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target?.dataset.cursor ?? '');
    };
    const leave = () => setVisible(false);
    const loop = () => {
      const k = reduced ? 1 : 0.2;
      rx += (x - rx) * k;
      ry += (y - ry) * k;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [touch, reduced]);

  if (touch) return null;
  const big = !!label;

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-fast ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        ref={ring}
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-cyan transition-[width,height,background] duration-base ease-cyber"
        style={{ width: big ? 72 : 32, height: big ? 72 : 32, background: big ? 'rgba(0,240,255,0.12)' : 'transparent', boxShadow: '0 0 8px rgba(0,240,255,.5)' }}
      >
        {big && <span className="font-mono text-[10px] tracking-[0.16em] text-cyan">{label}</span>}
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan" style={{ opacity: big ? 0 : 1 }} />
    </div>
  );
}
