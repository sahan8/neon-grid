import { forwardRef, useRef, type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from 'react';
import { blip } from '../../lib/sound';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'relative inline-flex items-center justify-center gap-3 font-body font-bold uppercase tracking-[0.12em] whitespace-nowrap select-none ' +
  'transition-[background,color,box-shadow,transform] duration-fast ease-cyber min-h-[44px] disabled:opacity-40 disabled:pointer-events-none overflow-hidden';

const variants: Record<Variant, string> = {
  primary: 'clip-cut bg-magenta text-void hover:bg-magenta-hover active:bg-magenta-active hover:shadow-glow-magenta',
  secondary: 'clip-cut border border-cyan text-cyan bg-transparent hover:bg-cyan/10 hover:shadow-glow-cyan',
  ghost: 'text-ink hover:text-cyan',
};

const sizes: Record<Size, string> = {
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-8 text-base md:px-10 md:text-lg',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Magnetic pull toward the cursor (spec: 6px). */
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'lg', icon, magnetic = false, className = '', children, onClick, onMouseEnter, ...rest },
  ref,
) {
  const inner = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || reduced || !inner.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
    e.currentTarget.style.transform = `translate(${dx / 2}px, ${dy / 2}px)`;
  };
  const onLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={(e) => {
        blip('hover');
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        blip('click');
        onClick?.(e);
      }}
      data-cursor="ENTER"
      {...rest}
    >
      {/* scanline sweep on press */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 active:opacity-100 [background:linear-gradient(transparent,rgba(232,241,255,.35),transparent)] [animation:scan-sweep_300ms_linear]" />
      <span ref={inner} className="relative inline-flex items-center gap-3">
        {children}
        {icon}
      </span>
    </button>
  );
});

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
