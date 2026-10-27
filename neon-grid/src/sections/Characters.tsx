import { useState } from 'react';
import { characters, type Character } from '../data/content';
import { Chip, Modal, SectionHeader, StatBar, TiltCard } from '../components/ui';

/** Portrait: generated image, or a stylised CSS hologram for characters without one. */
function Portrait({ c, className = '' }: { c: Character; className?: string }) {
  if (c.img) {
    return <img src={c.img} alt={c.alt} loading="lazy" decoding="async" className={`h-full w-full object-cover object-top ${className}`} />;
  }
  return (
    <div role="img" aria-label={c.alt} className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: `radial-gradient(circle at 50% 40%, ${c.accent}40, rgba(5,6,10,0) 60%), linear-gradient(to bottom, #0E0A20, #05060A)` }}>
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        {c.role === 'ROGUE AI' ? (
          <div className="relative h-40 w-40">
            <span className="absolute inset-0 rounded-full border-2" style={{ borderColor: c.accent, boxShadow: `0 0 20px ${c.accent}, inset 0 0 20px ${c.accent}` }} />
            <span className="absolute inset-[-14px] rotate-[-16deg] rounded-full border border-cyan" style={{ transform: 'rotateX(70deg)' }} />
            <span className="absolute inset-[-26px] rounded-full border border-dashed" style={{ borderColor: c.accent, transform: 'rotateX(70deg) rotate(24deg)' }} />
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ boxShadow: `0 0 16px #fff, 0 0 30px ${c.accent}` }} />
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            <span className="h-10 w-48 rounded-[50%] border-b-4" style={{ background: '#2A2610', borderColor: c.accent, boxShadow: `0 6px 16px ${c.accent}55` }} />
            <span className="-mt-3 h-24 w-20 rounded-b-[45%] bg-[#1A1F2C]" />
            <span className="absolute top-12 h-3 w-16" style={{ background: 'linear-gradient(90deg, #05060A, #2A2F3E, #05060A)', border: `1px solid ${c.accent}`, boxShadow: `0 0 10px ${c.accent}88` }} />
            <span className="mt-1 h-20 w-40" style={{ background: 'linear-gradient(#141821, #0B0E17)', clipPath: 'polygon(22% 0, 78% 0, 100% 100%, 0 100%)', boxShadow: `inset 0 2px 0 ${c.accent}` }} />
          </div>
        )}
      </div>
      <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(to bottom, rgba(232,241,255,.06) 0 2px, transparent 2px 4px)' }} />
    </div>
  );
}

function CharacterCard({ c, i, onOpen }: { c: Character; i: number; onOpen: () => void }) {
  return (
    <TiltCard accent={c.accent} className="h-full border border-line hover:shadow-[0_0_12px_var(--accent),0_24px_48px_rgba(0,0,0,.6)]">
      <button type="button" onClick={onOpen} className="flex h-full w-full flex-col text-left" data-cursor="VIEW" aria-label={`Open dossier: ${c.code}, ${c.role}`}>
        <div className="relative h-[300px] overflow-hidden md:h-[320px]">
          <Portrait c={c} className="transition-transform duration-slow ease-cyber group-hover:scale-105" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
          <span className="absolute left-3 top-3">
            <Chip color={c.accent}>{c.faction}</Chip>
          </span>
          <span className="absolute right-3 top-3 font-mono text-xs text-ink-muted">0{i + 1}</span>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden py-1 text-center font-mono text-[10px] tracking-[0.14em] text-magenta group-hover:block">
            ERR_ID MISMATCH · ALT FEED
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: c.accent }}>
            {c.role}
          </span>
          <h3 className="font-display text-2xl font-black tracking-[0.04em]">{c.code}</h3>
          <div className="flex flex-col gap-2">
            {c.stats.map(([k, v]) => (
              <StatBar key={k} label={k} value={v} color={c.accent} compact />
            ))}
          </div>
          <p className="text-ink-muted">“{c.quote}”</p>
          <span className="mt-auto font-mono text-xs tracking-[0.14em] text-cyan">OPEN DOSSIER →</span>
        </div>
      </button>
    </TiltCard>
  );
}

function Dossier({ c, i }: { c: Character; i: number }) {
  return (
    <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)]">
      <div className="relative h-72 md:h-auto md:min-h-[560px]">
        <Portrait c={c} />
        <span className="hud-label absolute bottom-3 left-3">SUBJECT 0{i + 1} · CAM 07</span>
      </div>
      <div className="flex flex-col gap-5 p-6 md:p-8">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">
          DOSSIER // FILE 0{i + 1}-{c.fileId} · CLEARANCE OMEGA · DO NOT DISTRIBUTE
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip color={c.accent}>{c.faction}</Chip>
          <Chip>{c.role}</Chip>
        </div>
        <h3 className="font-display text-3xl font-black md:text-4xl" data-autofocus tabIndex={-1}>
          {c.code}
        </h3>
        <p className="font-mono text-xs text-ink-muted">
          REAL NAME: <span className="bg-ink text-ink">████████</span> · {c.realNote}
        </p>
        <div>
          <h4 className="mb-2 font-mono text-xs tracking-[0.14em] text-cyan">// BIO</h4>
          <p className="text-ink">{c.bio}</p>
        </div>
        <div>
          <h4 className="mb-2 font-mono text-xs tracking-[0.14em] text-cyan">// ABILITIES</h4>
          <ul className="flex flex-col">
            {c.abilities.map(([name, desc, tag], k) => (
              <li key={name} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-start gap-3 border-b border-line py-3">
                <span className="font-mono text-xs text-ink-muted">0{k + 1}</span>
                <span>
                  <span className="block font-semibold">{name}</span>
                  <span className="text-sm text-ink-muted">{desc}</span>
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: tag === 'ULT' ? '#FF2A6D' : tag === 'PASSIVE' ? '#F5E642' : '#00F0FF' }}>
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="flex flex-col gap-4 border-t border-line bg-void/60 p-6 md:border-l md:border-t-0" aria-label="Bounty record">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-muted">NCPD // BOUNTY NET · #{c.fileId}</p>
        <p className="font-display text-4xl font-black text-magenta" style={{ textShadow: '0 0 8px #FF2A6D' }}>
          WANTED
        </p>
        <p className="font-mono text-sm text-ink">{c.condition}</p>
        <div>
          <span className="hud-label block">REWARD</span>
          <span className="font-mono text-2xl font-bold text-yellow">{c.bounty}</span>
        </div>
        <dl className="flex flex-col gap-2">
          {c.record.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[90px_minmax(0,1fr)] gap-2">
              <dt className="hud-label text-[10px]">{k}</dt>
              <dd className="text-sm">{v}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto inline-block -rotate-6 self-start border-2 border-magenta px-3 py-1 font-display text-sm font-black tracking-[0.1em] text-magenta">
          {c.stamp}
        </span>
      </aside>
    </div>
  );
}

export function Characters() {
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section id="characters" aria-labelledby="characters-title" className="relative bg-void py-20 md:py-28">
      <div className="container-grid">
        <SectionHeader id="characters-title" index="03" label="CHARACTERS" meta="04 FILES · CLASSIFIED" title="Know your crew" intro="Hover to scan. Click to open the dossier." />
      </div>
      {/* Grid on tablet/desktop, swipe carousel on mobile */}
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1760px] md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-4"
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.scrollWidth / characters.length)))}
      >
        {characters.map((c, i) => (
          <div key={c.code} className="w-[82%] shrink-0 snap-center md:w-auto">
            <CharacterCard c={c} i={i} onOpen={() => setOpen(i)} />
          </div>
        ))}
      </div>
      <p className="hud-label container-grid mt-4 md:hidden">
        <span className="text-cyan">0{active + 1}</span> / 04 · SWIPE ↔ · TAP FOR FILE
      </p>

      <Modal open={open !== null} onClose={() => setOpen(null)} label={open !== null ? `Dossier: ${characters[open].code}` : 'Dossier'} wide>
        {open !== null && <Dossier c={characters[open]} i={open} />}
      </Modal>
    </section>
  );
}
