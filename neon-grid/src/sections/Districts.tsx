import { useEffect, useRef, useState } from 'react';
import { districts } from '../data/content';
import { gsap } from '../lib/SmoothScroll';
import { SectionHeader, StatBar } from '../components/ui';
import { useIsMobile } from '../hooks/useIsMobile';
import { useReducedMotion } from '../hooks/useReducedMotion';

type District = (typeof districts)[number];

const dangerColor = (lvl: number) => (lvl >= 9 ? '#FF2A6D' : lvl >= 7 ? '#F5E642' : '#00F0FF');

function DistrictCard({ d, active, onFocus }: { d: District; active: boolean; onFocus?: () => void }) {
  return (
    <article
      onFocus={onFocus}
      onMouseEnter={onFocus}
      className={`group relative flex h-full shrink-0 flex-col overflow-hidden clip-cut border bg-surface transition-[transform,box-shadow,border-color] duration-slow ease-cyber ${
        active ? 'border-cyan/60 shadow-glow-cyan lg:scale-[1.02]' : 'border-line'
      }`}
      data-cursor="ENTER"
      aria-labelledby={`district-${d.num}`}
    >
      <div className="relative h-[52%] min-h-[220px] overflow-hidden">
        <img
          src={d.img}
          alt={d.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-[transform,filter] duration-slow ease-cyber group-hover:scale-105"
          style={{ objectPosition: d.pos, filter: active ? 'none' : 'saturate(0.55) brightness(0.75)' }}
        />
        {/* RGB-split hover distortion */}
        <img aria-hidden="true" src={d.img} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 mix-blend-screen transition-opacity duration-fast group-hover:opacity-60" style={{ objectPosition: d.pos, transform: 'translateX(-6px)', filter: 'hue-rotate(160deg) saturate(3)' }} />
        <img aria-hidden="true" src={d.img} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 mix-blend-screen transition-opacity duration-fast group-hover:opacity-40" style={{ objectPosition: d.pos, transform: 'translateX(6px)', filter: 'hue-rotate(-60deg) saturate(3)' }} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
        <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.14em] text-ink">SECTOR {d.num}</span>
        <span aria-hidden="true" className="absolute bottom-4 right-4 bg-magenta/80 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-ink opacity-0 transition-opacity duration-fast group-hover:opacity-100">
          SIGNAL INTERFERENCE
        </span>
        <span className="absolute right-4 top-4 font-display text-4xl font-black text-transparent [-webkit-text-stroke:1px_rgba(232,241,255,.5)]">{d.num}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: d.accent }}>
          {d.type}
        </span>
        <h3 id={`district-${d.num}`} className="font-display text-2xl font-bold tracking-[0.06em] md:text-3xl">
          {d.name}
        </h3>
        <p className="text-ink-muted">{d.desc}</p>
        <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
          <StatBar label="DANGER" value={d.danger} color={dangerColor(d.danger)} valueLabel={`LVL ${d.danger}`} compact />
          <dl className="grid grid-cols-3 gap-2 font-mono text-[11px] tracking-[0.12em]">
            <div>
              <dt className="text-ink-muted">POP</dt>
              <dd className="text-ink">{d.pop}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">CURFEW</dt>
              <dd className="text-ink">{d.curfew}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">STATUS</dt>
              <dd style={{ color: d.accent }}>{d.status}</dd>
            </div>
          </dl>
          <a href="#join" className="inline-flex min-h-[44px] items-center gap-2 font-body font-bold uppercase tracking-[0.12em] text-cyan hover:text-ink">
            Enter <span aria-hidden="true">→</span>
            <span className="sr-only">{d.name}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Districts() {
  const mobile = useIsMobile(1200);
  const reduced = useReducedMotion();
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Desktop: pin the section and scroll the track horizontally.
  useEffect(() => {
    if (mobile || reduced || !pin.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = () => track.current!.scrollWidth - window.innerWidth + 80;
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(3, Math.round(self.progress * 3))),
        },
      });
    });
    return () => ctx.revert();
  }, [mobile, reduced]);

  // Mobile: snap carousel — track the card in view.
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setActive(Math.round(el.scrollLeft / (el.scrollWidth / districts.length)));
  };

  const horizontal = !mobile && !reduced;

  return (
    <section id="districts" aria-labelledby="districts-title" className="relative bg-void">
      <div ref={pin} className={horizontal ? 'flex h-screen flex-col justify-center overflow-hidden pt-[var(--nav-h)]' : 'py-20 md:py-28'}>
        <div className="container-grid">
          <SectionHeader
            id="districts-title"
            index="01"
            label="DISTRICTS"
            meta="04 ZONES"
            title="Choose your turf"
            intro="Four districts, four sets of rules. Pick where you jack in — the city remembers."
          />
        </div>

        {horizontal ? (
          <div ref={track} className="flex h-[min(560px,62vh)] gap-8 pl-[var(--gutter)] will-change-transform">
            {districts.map((d, i) => (
              <div key={d.num} className="h-full w-[min(440px,32vw)] shrink-0">
                <DistrictCard d={d} active={i === active} onFocus={() => setActive(i)} />
              </div>
            ))}
          </div>
        ) : (
          <div
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none]"
            aria-label="District cards — swipe to browse"
            tabIndex={0}
          >
            {districts.map((d, i) => (
              <div key={d.num} className="h-[580px] w-[85%] shrink-0 snap-center md:w-[46%]">
                <DistrictCard d={d} active={i === active} />
              </div>
            ))}
          </div>
        )}

        <div className="container-grid mt-6 flex items-center justify-between">
          <span className="hud-label">
            ACTIVE ZONE <span className="text-cyan">{districts[active].num}</span> / 04 · {districts[active].short}
          </span>
          <div className="flex gap-2" aria-hidden="true">
            {districts.map((d, i) => (
              <span key={d.num} className={`h-1 transition-all duration-base ${i === active ? 'w-8 bg-cyan shadow-glow-cyan' : 'w-4 bg-ink-muted/40'}`} />
            ))}
          </div>
          <span className="hud-label hidden md:inline">{horizontal ? 'SCROLL ↓ TO TRAVERSE →' : 'SWIPE ↔'}</span>
        </div>
      </div>
    </section>
  );
}
