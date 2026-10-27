import { useRef, type ReactNode, type PointerEvent, type HTMLAttributes } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Clipped-corner card with optional 3D tilt toward the pointer (max 10°)
 * and a holographic shine that follows the cursor.
 */
export function TiltCard({
  children,
  className = '',
  tilt = true,
  accent = '#00F0FF',
  ...rest
}: { children: ReactNode; tilt?: boolean; accent?: string } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt || reduced || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ref.current.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg) scale(1.02)`;
    ref.current.style.setProperty('--mx', `${px * 100}%`);
    ref.current.style.setProperty('--my', `${py * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative clip-cut bg-surface transition-[transform,box-shadow] duration-base ease-cyber will-change-transform ${className}`}
      style={{ ['--accent' as string]: accent }}
      {...rest}
    >
      {children}
      {/* holographic shine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-base group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.18), transparent 40%), linear-gradient(115deg, transparent 30%, rgba(0,240,255,.12) 45%, rgba(255,42,109,.12) 55%, transparent 70%)',
        }}
      />
    </div>
  );
}
