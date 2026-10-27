import { useState, type FormEvent } from 'react';
import { footerColumns, ticker } from '../../data/content';
import { scrollToId } from '../../lib/boot';
import { Logo } from './Nav';

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email)) setSent(true);
  };
  const toTop = () => {
    const l = (window as Window & { __lenis?: { scrollTo: (n: number) => void } }).__lenis;
    if (l) l.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-void pt-12 md:pt-16">
      {/* system ticker */}
      <div className="border-y border-line py-3" aria-label="System status">
        <div className="container-grid flex flex-wrap gap-x-8 gap-y-2">
          {ticker.map(([k, v, c]) => (
            <span key={k} className="hud-label">
              {k} <span style={{ color: c }}>{v}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-grid grid grid-cols-2 gap-10 py-12 md:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 md:col-span-1">
          <Logo className="text-2xl" />
          <p className="mt-3 max-w-sm text-ink-muted">A living city on the other side of the screen.</p>
          <form onSubmit={submit} className="mt-6 max-w-sm" aria-label="Newsletter">
            <label htmlFor="footer-email" className="hud-label mb-2 block text-ink">
              Subscribe to transmissions
            </label>
            {sent ? (
              <p role="status" className="font-mono text-sm text-success">
                ✓ TRANSMISSION LINK ACTIVE
              </p>
            ) : (
              <div className="flex">
                <input
                  id="footer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="runner@grid.net"
                  className="h-12 min-w-0 flex-1 border border-cyan/25 bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-cyan"
                />
                <button type="submit" className="h-12 bg-cyan px-5 font-body font-bold uppercase tracking-[0.12em] text-void hover:shadow-glow-cyan">
                  Sync
                </button>
              </div>
            )}
            <p className="mt-2 text-sm text-ink-muted">1 transmission a month. No spam, no trackers.</p>
          </form>
        </div>
        {footerColumns.map((col, i) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-4 font-mono text-xs font-normal tracking-[0.16em] text-cyan">
              0{i + 1} · {col.title.toUpperCase()}
            </h3>
            <ul className="flex flex-col gap-1">
              {col.links.map((l) => {
                const id = l.toLowerCase();
                const internal = ['districts', 'augments', 'characters', 'lore', 'gallery'].includes(id);
                return (
                  <li key={l}>
                    <a
                      href={internal ? `#${id}` : '#'}
                      onClick={internal ? (e) => { e.preventDefault(); scrollToId(id); } : undefined}
                      className="inline-flex min-h-[36px] items-center text-ink-muted transition-colors hover:text-cyan"
                    >
                      {l}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      {/* giant outlined wordmark */}
      <p
        aria-hidden="true"
        className="select-none whitespace-nowrap px-4 text-center font-display font-black leading-none tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgba(0,240,255,0.35)]"
        style={{ fontSize: 'clamp(2.25rem, 12.5vw, 15rem)' }}
      >
        NEON//GRID
      </p>

      <div className="container-grid flex flex-col items-start justify-between gap-4 border-t border-line py-6 md:flex-row md:items-center">
        <span className="hud-label">© 2087 NEON//GRID · ALL SIGNALS RESERVED</span>
        <span className="hud-label" style={{ color: '#2BFF88' }}>
          ● ALL SYSTEMS NOMINAL
        </span>
        <button type="button" onClick={toTop} className="hud-label min-h-[44px] hover:text-cyan">
          BACK TO TOP ↑
        </button>
      </div>
    </footer>
  );
}
