import { useEffect, useRef, useState } from 'react';
import { lore } from '../data/content';
import { gsap } from '../lib/SmoothScroll';
import { SectionHeader } from '../components/ui';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function Lore() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [reached, setReached] = useState<number>(reduced ? lore.length - 1 : -1);
  const [pct, setPct] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 50%', end: 'bottom 50%', scrub: true, onUpdate: (s) => setPct(Math.round(s.progress * 100)) },
        },
      );
      gsap.utils.toArray<HTMLElement>('[data-lore-item]').forEach((el, i) => {
        gsap.fromTo(el.querySelector('[data-card]'), { opacity: 0, x: i % 2 ? 32 : -32 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%' } });
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 50%', onEnter: () => setReached(i), onLeaveBack: () => setReached(i - 1) } });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="lore" aria-labelledby="lore-title" className="relative bg-void py-20 md:py-28">
      <div className="container-grid">
        <SectionHeader id="lore-title" index="04" label="LORE" meta="2049 → 2087" title="How the grid was built" intro="Thirty-eight years, six turning points. Scroll to replay the record." />

        <div ref={root} className="relative">
          {/* Rail: left on mobile, centred on desktop */}
          <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-cyan/15 md:left-1/2" />
          <div ref={line} aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-[2px] origin-top bg-cyan shadow-glow-cyan md:left-1/2 md:-translate-x-[0.5px]" />

          <ol className="relative flex flex-col gap-12 md:gap-20">
            {lore.map((e, i) => {
              const on = i <= reached;
              const right = i % 2 === 1;
              return (
                <li key={e.year} data-lore-item className="relative grid pl-10 md:grid-cols-2 md:gap-24 md:pl-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-[4px] top-6 h-4 w-4 rotate-45 border-2 transition-all duration-base md:left-1/2 md:-translate-x-1/2 ${on ? 'pulse-dot' : ''}`}
                    style={{ borderColor: e.accent, background: on ? e.accent : '#05060A', color: e.accent, boxShadow: on ? `0 0 10px ${e.accent}, 0 0 24px ${e.accent}88` : 'none' }}
                  />
                  <div data-card className={`glass relative overflow-hidden ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`} style={{ borderColor: on ? `${e.accent}66` : undefined }}>
                    <img src={e.img} alt={e.alt} loading="lazy" decoding="async" className="h-40 w-full object-cover opacity-80 md:h-48" />
                    <div className="p-5 md:p-6">
                      <span className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">EVENT 0{i + 1} / 06</span>
                      <p className="font-display text-4xl font-black md:text-5xl" style={{ color: e.accent, textShadow: on ? `0 0 12px ${e.accent}88` : 'none' }}>
                        {e.year}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-[0.06em]">{e.title}</h3>
                      <p className="mt-2 text-ink-muted">{e.desc}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="hud-label relative mt-12 pl-10 md:pl-0 md:text-center" style={{ color: pct >= 99 ? '#2BFF88' : undefined }}>
            {pct >= 99 ? '// END OF RECORD · TRANSMISSION CONTINUES' : `// RECORD ${pct}% · SCROLL ↓`}
          </p>
        </div>
      </div>
    </section>
  );
}
