import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/layout/Nav';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Signal lost — 404 · NEON//GRID';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <header className="container-grid flex h-[var(--nav-h)] items-center justify-between">
        <Link to="/" aria-label="NEON//GRID home" className="text-xl">
          <Logo />
        </Link>
        <span className="hud-label" style={{ color: '#FF3B3B' }}>
          ● SIGNAL 0%
        </span>
      </header>

      <div className="container-grid grid flex-1 items-center gap-10 py-10 md:grid-cols-2">
        {/* Broken hologram */}
        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[420px]">
          <div className="flicker absolute inset-0 grid place-items-center">
            <span className="font-display text-[clamp(6rem,22vw,14rem)] font-black leading-none text-transparent [-webkit-text-stroke:2px_#00F0FF]" style={{ filter: 'drop-shadow(0 0 12px #00F0FF)' }}>
              404
            </span>
          </div>
          <div className="absolute inset-0 grid place-items-center opacity-60" style={{ transform: 'translate(6px, 3px)' }}>
            <span className="font-display text-[clamp(6rem,22vw,14rem)] font-black leading-none text-transparent [-webkit-text-stroke:2px_#FF2A6D]" style={{ clipPath: 'polygon(0 20%, 100% 20%, 100% 45%, 0 45%)' }}>
              404
            </span>
          </div>
          <div className="absolute bottom-6 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-[50%] bg-cyan/30 blur-md" />
          <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(to bottom, rgba(0,240,255,.08) 0 2px, transparent 2px 5px)' }} />
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-mono text-sm tracking-[0.14em] text-magenta">ERR_404 // NODE NOT FOUND</p>
          <h1 className="glitch is-glitching text-h1 font-black" data-text="Signal lost">
            Signal lost
          </h1>
          <p className="max-w-md text-lg text-ink-muted">
            The page you’re looking for was disconnected from the grid — or never existed. Your link is safe; this node just isn’t answering.
          </p>
          <pre className="glass overflow-x-auto p-4 font-mono text-xs leading-6 text-ink-muted">
            {`> trace ${typeof window !== 'undefined' ? window.location.pathname : '/'}
> hop 01 node-07 ......... 12ms
> hop 02 relay-harbour .... 48ms
`}
            <span className="text-danger">{'> hop 03 ??? ............. TIMEOUT'}</span>
          </pre>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="clip-cut inline-flex h-14 items-center bg-magenta px-8 font-bold uppercase tracking-[0.12em] text-void hover:bg-magenta-hover hover:shadow-glow-magenta">
              Return to grid →
            </Link>
            <a href="mailto:hello@neon-grid.example?subject=Broken%20link" className="clip-cut inline-flex h-14 items-center border border-cyan px-8 font-bold uppercase tracking-[0.12em] text-cyan hover:bg-cyan/10">
              Report broken link
            </a>
          </div>
          <p className="hud-label">
            TRY:{' '}
            {['districts', 'augments', 'characters'].map((s, i) => (
              <span key={s}>
                {i > 0 && ' · '}
                <Link to={`/#${s}`} className="text-cyan hover:underline">
                  {s.toUpperCase()}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
