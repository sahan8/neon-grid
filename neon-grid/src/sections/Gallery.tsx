import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gallery, type GalleryCat } from '../data/content';
import { Modal, SectionHeader } from '../components/ui';

const FILTERS: ('ALL' | GalleryCat)[] = ['ALL', 'STREETS', 'TECH', 'PEOPLE'];
const catColor: Record<GalleryCat, string> = { STREETS: '#FF2A6D', TECH: '#00F0FF', PEOPLE: '#F5E642' };

export function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL');
  const [open, setOpen] = useState<number | null>(null);
  const shown = gallery.filter((g) => filter === 'ALL' || g.cat === filter);

  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)),
    [shown.length],
  );

  // Lightbox keyboard: ← → navigate, F fullscreen (Esc handled by Modal).
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key.toLowerCase() === 'f') document.querySelector<HTMLElement>('[data-lightbox-img]')?.requestFullscreen?.().catch(() => {});
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step]);

  // Touch swipe in the lightbox.
  const touchX = useRef<number | null>(null);
  const cur = open !== null ? shown[open] : null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-void py-20 md:py-28">
      <div className="container-grid">
        <SectionHeader id="gallery-title" index="05" label="GALLERY" meta={`${shown.length} FRAMES`} title="Captured frames" />

        <div role="tablist" aria-label="Filter gallery" className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const sel = f === filter;
            const count = f === 'ALL' ? gallery.length : gallery.filter((g) => g.cat === f).length;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={sel}
                onClick={() => setFilter(f)}
                className={`inline-flex min-h-[44px] items-center gap-2 border px-4 font-mono text-xs tracking-[0.14em] transition-all duration-fast ${
                  sel ? 'border-cyan bg-cyan/10 text-cyan shadow-glow-cyan' : 'border-line text-ink-muted hover:border-cyan/50 hover:text-ink'
                }`}
              >
                {f} <span className={sel ? 'text-ink' : ''}>{String(count).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        <motion.ul layout className="columns-2 gap-3 md:columns-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {shown.map((g, i) => (
              <motion.li
                layout
                key={g.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="mb-3 break-inside-avoid md:mb-5"
              >
                <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden text-left" data-cursor="VIEW" aria-label={`Open ${g.title}`}>
                  <img
                    src={g.img}
                    alt={g.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover transition-transform duration-slow ease-cyber group-hover:scale-105 ${g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                    style={{ objectPosition: g.pos ?? '50% 50%' }}
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-base group-hover:opacity-100" style={{ background: 'repeating-linear-gradient(to bottom, rgba(232,241,255,.06) 0 2px, transparent 2px 4px)' }} />
                  <span className="absolute left-2.5 top-2.5 inline-flex h-[22px] items-center border bg-void/70 px-2 font-mono text-[10px] tracking-[0.14em]" style={{ color: catColor[g.cat], borderColor: catColor[g.cat] }}>
                    {g.cat}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-void to-transparent p-3 transition-transform duration-base ease-cyber group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <span className="block font-mono text-xs tracking-[0.12em] text-ink">
                      #{String(i + 1).padStart(2, '0')} · {g.title.toUpperCase()}
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.12em] text-ink-muted">{g.meta}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)} label={cur ? `Gallery: ${cur.title}` : 'Gallery'} wide>
        {cur && (
          <div
            className="flex flex-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="relative bg-void">
              <img data-lightbox-img src={cur.img} alt={cur.alt} className="max-h-[70vh] w-full object-contain" />
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-line bg-void/70 text-xl text-ink hover:border-cyan hover:text-cyan">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-line bg-void/70 text-xl text-ink hover:border-cyan hover:text-cyan">
                →
              </button>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 p-5">
              <div>
                <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: catColor[cur.cat] }}>
                  {cur.cat}
                </span>
                <p className="font-display text-xl font-bold">{cur.title}</p>
                <p className="font-mono text-xs text-ink-muted">{cur.meta}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl text-ink" aria-live="polite">
                  {String((open ?? 0) + 1).padStart(2, '0')} <span className="text-ink-muted">/ {String(shown.length).padStart(2, '0')}</span>
                </p>
                <p className="hud-label hidden md:block">← → NAVIGATE · ESC CLOSE · F FULLSCREEN</p>
                <p className="hud-label md:hidden">SWIPE ← →</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
