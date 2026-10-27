import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navLinks } from '../../data/content';
import { scrollToId } from '../../lib/boot';
import { Button } from '../ui';
import { SoundToggle } from './Nav';

/** Full-screen overlay menu below 1200px: huge stacked links with index numbers. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const go = (id: string) => {
    onClose();
    window.setTimeout(() => scrollToId(id), 280);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-void/95 pt-[var(--nav-h)] backdrop-blur-xl lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav aria-label="Mobile" className="container-grid flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className="glitch group flex min-h-[56px] items-baseline gap-4 border-b border-line py-2 font-display text-[clamp(2rem,9vw,3.5rem)] font-black uppercase tracking-[0.06em] text-ink hover:text-cyan"
                    data-text={l.label}
                  >
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button onClick={() => go('join')}>Jack in</Button>
              <SoundToggle />
            </div>
          </nav>
          <div className="container-grid flex items-center justify-between border-t border-line py-5">
            <span className="hud-label">SECTOR 07 · SYS.ONLINE</span>
            <ul className="flex gap-2" aria-label="Social links">
              {['X', 'IG', 'YT', 'DC'].map((s) => (
                <li key={s}>
                  <a href="#" aria-label={`NEON//GRID on ${s}`} className="grid h-11 w-11 place-items-center border border-line font-mono text-xs text-ink-muted hover:border-cyan hover:text-cyan">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
