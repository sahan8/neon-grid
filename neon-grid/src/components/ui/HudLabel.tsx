import type { ReactNode } from 'react';

/** Mono uppercase HUD readout, optionally with a pulsing status dot. */
export function HudLabel({
  children,
  dot,
  className = '',
  as: Tag = 'span',
}: {
  children: ReactNode;
  dot?: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}) {
  return (
    <Tag className={`hud-label inline-flex items-center gap-2 ${className}`}>
      {dot && (
        <span aria-hidden="true" className="pulse-dot inline-block h-2 w-2 rounded-full" style={{ background: dot, color: dot }} />
      )}
      {children}
    </Tag>
  );
}

/** Tag chip, e.g. "SECTOR 07" or a faction name. */
export function Chip({ children, color = '#00F0FF', className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center px-2 font-mono text-[11px] uppercase tracking-[0.14em] ${className}`}
      style={{ color, border: `1px solid ${color}55`, background: `linear-gradient(${color}14, ${color}14), rgba(5,6,10,.7)` }}
    >
      {children}
    </span>
  );
}

/** Section header: "01 / DISTRICTS" eyebrow + big title + optional intro. */
export function SectionHeader({
  index,
  label,
  title,
  meta,
  intro,
  id,
}: {
  index: string;
  label: string;
  title: string;
  meta?: string;
  intro?: string;
  id: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="mb-4 flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-cyan">
          {index} / {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        {meta && <span className="hud-label hidden md:inline">{meta}</span>}
      </div>
      <h2 id={id} className="glitch text-h2 font-black outline-none" data-text={title}>
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-xl text-lg text-ink-muted">{intro}</p>}
    </header>
  );
}
