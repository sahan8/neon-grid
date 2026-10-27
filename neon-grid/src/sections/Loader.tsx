import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBootProgress } from '../lib/boot';
import { images } from '../data/content';
import { Button, ArrowIcon } from '../components/ui';
import { SoundToggle } from '../components/layout/Nav';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LOG: { at: number; t: string; c: string }[] = [
  { at: -1, t: 'NEON//GRID OS v1.0 · tty07 · build 2087.10.27', c: '#8A93A8' },
  { at: 0, t: '> INITIALISING NEURAL LINK...', c: '#E8F1FF' },
  { at: 10, t: '  [OK] cortex handshake · 12ms', c: '#2BFF88' },
  { at: 22, t: '> DECRYPTING CITY GRID...', c: '#E8F1FF' },
  { at: 36, t: '  [OK] 2,048 nodes mapped', c: '#2BFF88' },
  { at: 50, t: '> LOADING SECTOR DATA...', c: '#E8F1FF' },
  { at: 78, t: '> CALIBRATING OPTICS...', c: '#E8F1FF' },
  { at: 90, t: '  [OK] chrome synced · 0 faults', c: '#2BFF88' },
  { at: 100, t: '> ALL SYSTEMS NOMINAL. WELCOME, RUNNER.', c: '#00F0FF' },
];

/**
 * Boot screen. Progress = the slower of a minimum boot animation and the real
 * asset readiness (fonts + hero 3D scene). "Enter the grid" appears at 100%.
 */
export function Loader({ onEnter }: { onEnter: () => void }) {
  const real = useBootProgress();
  const reduced = useReducedMotion();
  const [anim, setAnim] = useState(reduced ? 100 : 0);
  const [open, setOpen] = useState(true);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (reduced) return;
    // Time-based (~2.4s to full) so a busy main thread can't stall the bar.
    const start = performance.now();
    const id = window.setInterval(() => setAnim(Math.min(100, ((performance.now() - start) / 2400) * 100)), 50);
    return () => window.clearInterval(id);
  }, [reduced]);

  // The bar animates freely but holds at 95% until every asset reports ready.
  const shown = Math.round(Math.min(anim, real >= 100 ? 100 : 95));
  const done = shown >= 100;

  useEffect(() => {
    if (done) enterRef.current?.focus();
  }, [done]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const enter = () => {
    setOpen(false);
    onEnter();
  };

  const lines = LOG.filter((l) => shown >= l.at).map((l) => (l.at === 50 ? { ...l, t: `${l.t} ${done ? '100% [OK]' : shown + '%'}` } : l));
  const filled = Math.round(shown / 5);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="NEON//GRID boot sequence"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void px-4"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={images.loaderBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.25 + shown / 200 }} />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(5,6,10,.2) 20%, rgba(5,6,10,.92) 100%)' }} />

          <div className="hud-label absolute left-5 right-5 top-5 flex justify-between md:left-10 md:right-10 md:top-8">
            <span className="inline-flex items-center gap-2">
              <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: done ? '#2BFF88' : '#F5E642', color: done ? '#2BFF88' : '#F5E642' }} />
              NEON//GRID OS v1.0
            </span>
            <span>BOOT SEQ 0x07</span>
          </div>

          <div className="relative flex w-full max-w-[760px] flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="font-display text-[clamp(2.1rem,8vw,6rem)] font-black leading-none tracking-[0.08em] text-ink" style={{ textShadow: '0 0 8px #00F0FF, 0 0 24px rgba(0,240,255,.5)' }}>
                NEON<span className="text-magenta">//</span>GRID
              </p>
              <p className="font-mono text-[10px] tracking-[0.24em] text-cyan md:text-xs">// NEURAL INTERFACE BOOT SEQUENCE</p>
            </div>

            <div className="glass brackets relative w-full">
              <div className="flex h-8 items-center justify-between border-b border-line px-3 font-mono text-[11px] tracking-[0.14em] text-ink-muted">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="h-2 w-2 bg-magenta" />
                  <span className="h-2 w-2 bg-yellow" />
                  <span className="h-2 w-2 bg-cyan" />
                </span>
                <span>TERMINAL · TTY07</span>
                <span>T+{(shown * 0.06).toFixed(2)}s</span>
              </div>
              <div role="log" aria-live="polite" className="flex h-[200px] flex-col justify-end overflow-hidden px-4 py-3 font-mono text-xs leading-7 md:h-[236px] md:text-sm">
                {lines.map((l, i) => (
                  <div key={l.at} className="truncate" style={{ color: l.c }}>
                    {l.t}
                    {i === lines.length - 1 && !done && <span className="caret ml-1" aria-hidden="true" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-2 flex items-end justify-between">
                <div>
                  <span className="hud-label block text-[11px]">STATUS</span>
                  <span className="font-mono text-sm tracking-[0.12em]" style={{ color: done ? '#2BFF88' : '#00F0FF' }}>
                    {shown < 50 ? 'INITIALISING NEURAL LINK' : done ? 'LINK ESTABLISHED' : 'LOADING SECTOR DATA'}
                  </span>
                </div>
                <span aria-hidden="true" className="font-mono text-4xl font-bold leading-none md:text-6xl" style={{ color: done ? '#2BFF88' : '#E8F1FF' }}>
                  {String(shown).padStart(3, '0')}
                  <span className="text-xl text-ink-muted md:text-3xl">%</span>
                </span>
              </div>
              <div role="progressbar" aria-label="Boot progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shown} className="grid gap-[2px] md:gap-1" style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}>
                {Array.from({ length: 20 }, (_, i) => {
                  const on = i < filled;
                  return (
                    <span
                      key={i}
                      className="h-3.5 md:h-[18px]"
                      style={{
                        background: on ? '#00F0FF' : 'rgba(0,240,255,0.04)',
                        border: `1px solid ${on ? '#00F0FF' : 'rgba(0,240,255,0.22)'}`,
                        boxShadow: on ? '0 0 6px rgba(0,240,255,.8)' : 'none',
                        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex h-14 w-full items-center justify-center gap-3">
              {done ? (
                <motion.div className="flex w-full items-center justify-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Button ref={enterRef} onClick={enter} icon={<ArrowIcon />} className="flex-1 md:flex-none">
                    Enter the grid
                  </Button>
                  <SoundToggle />
                </motion.div>
              ) : (
                <span className="font-mono text-xs tracking-[0.2em] text-ink-muted">AWAITING LINK...</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
