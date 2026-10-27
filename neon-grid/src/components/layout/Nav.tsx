import { useEffect, useState } from 'react';
import { navLinks } from '../../data/content';
import { scrollToId } from '../../lib/boot';
import { useSound } from '../../lib/sound';
import { Button, ScrambleText } from '../ui';
import { MobileMenu } from './MobileMenu';

function useNeoTokyoClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-black uppercase tracking-[0.08em] ${className}`}>
      NEON<span className="text-magenta">//</span>GRID
    </span>
  );
}

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const [on, set] = useSound();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Sound"
      onClick={() => set(!on)}
      className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 border border-cyan/40 px-3 font-mono text-[11px] tracking-[0.14em] text-cyan transition-colors hover:bg-cyan/10"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" />
        {on ? <path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /> : <path d="M16 9l5 6M21 9l-5 6" />}
      </svg>
      {!compact && <span>{on ? 'SOUND ON' : 'SOUND OFF'}</span>}
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useNeoTokyoClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,box-shadow,backdrop-filter] duration-base ease-cyber ${
          scrolled ? 'border-b border-cyan/15 bg-surface/60 shadow-[0_12px_32px_rgba(0,0,0,.45)] backdrop-blur-[16px]' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Main" className="container-grid flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); (window as Window & { __lenis?: { scrollTo: (n: number) => void } }).__lenis?.scrollTo(0); }} aria-label="NEON//GRID home" className="text-lg md:text-xl">
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l, i) => {
              const cur = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(l.id);
                    }}
                    aria-current={cur ? 'true' : undefined}
                    className={`group inline-flex min-h-[44px] items-center gap-2 font-body text-[15px] font-semibold uppercase tracking-[0.12em] transition-colors ${cur ? 'text-cyan' : 'text-ink hover:text-cyan'}`}
                  >
                    <span className={`font-mono text-[10px] ${cur ? 'text-cyan' : 'text-ink-muted'}`}>0{i + 1}</span>
                    <ScrambleText text={l.label} />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hud-label hidden xl:inline-flex" aria-label={`Neo-Tokyo time ${clock}`}>
              NEO-TOKYO {clock}
            </span>
            <div className="hidden md:block">
              <SoundToggle compact />
            </div>
            <Button size="md" className="hidden md:inline-flex" onClick={() => scrollToId('join')} magnetic>
              Jack in
            </Button>
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center border border-cyan/40 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-cyan transition-transform duration-base ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
              <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-cyan transition-opacity duration-fast ${menuOpen ? 'opacity-0' : ''}`} />
              <span aria-hidden="true" className={`absolute h-0.5 w-5 bg-cyan transition-transform duration-base ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
