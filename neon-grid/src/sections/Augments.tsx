import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { augments, finishes } from '../data/content';
import { SceneShell } from '../three/SceneShell';
import { Button, SectionHeader, StatBar, Chip } from '../components/ui';

const loadViewer = () => import('../three/AugmentViewer');

const rarityColor: Record<string, string> = { LEGENDARY: '#F5E642', EPIC: '#FF2A6D', MYTHIC: '#B48CFF' };

export function Augments() {
  const [idx, setIdx] = useState(0);
  const [finish, setFinish] = useState(0);
  const [hotspot, setHotspot] = useState(-1);
  const [equipped, setEquipped] = useState<Record<string, boolean>>({});
  const a = augments[idx];
  const color = finishes[finish].color;
  const part = hotspot >= 0 ? a.parts[hotspot] : null;

  const choose = (i: number) => {
    setIdx(i);
    setHotspot(-1);
  };

  return (
    <section id="augments" aria-labelledby="augments-title" className="relative overflow-x-clip bg-void py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${color}14, transparent 60%)` }} />
      <div className="container-grid relative">
        <SectionHeader id="augments-title" index="02" label="AUGMENTS" meta="RIPPERDOC CATALOGUE" title="Upgrade the hardware" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
          {/* 3D viewer */}
          <div className="glass brackets relative aspect-square w-full md:aspect-[4/3] lg:aspect-auto lg:min-h-[600px]" data-cursor="DRAG">
            <SceneShell
              load={loadViewer}
              className="absolute inset-0"
              props={{ item: a.id, color, parts: a.parts, hotspot, onHotspot: (i: number) => setHotspot(i === hotspot ? -1 : i) }}
              fallback={<img src={a.img} alt={a.alt} loading="lazy" className="h-full w-full object-contain p-6" style={{ filter: finish === 1 ? 'hue-rotate(140deg) saturate(1.15)' : finish === 2 ? 'saturate(0.12) brightness(1.15) contrast(1.1)' : 'none' }} />}
            />
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
              <span className="hud-label">[3D] · {a.file}</span>
              <span className="hud-label">{a.tris}</span>
            </div>
            <span className="hud-label pointer-events-none absolute bottom-4 left-4 bg-void/70 px-2 py-1">DRAG TO ROTATE · TAP NODES</span>

            {/* Hotspot callout (also reachable via the node list for keyboard/no-WebGL users) */}
            <AnimatePresence>
              {part && (
                <motion.div
                  key={part.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass absolute bottom-14 right-4 z-10 w-[min(300px,calc(100%-32px))] p-4"
                  role="status"
                >
                  <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color }}>
                    NODE 0{hotspot + 1} // {part.code}
                  </span>
                  <p className="mt-1 font-display text-lg font-bold">{part.t}</p>
                  <p className="text-sm text-ink-muted">{part.d}</p>
                  <p className="mt-2 font-mono text-xs text-ink">{part.spec}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-label">AUGMENT {a.num} / 03</span>
              <Chip>{a.cls}</Chip>
              <Chip color={rarityColor[a.rarity]}>{a.rarity}</Chip>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={a.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
                <h3 className="font-display text-3xl font-black tracking-[0.04em] md:text-4xl">{a.name}</h3>
                <p className="mt-2 text-lg text-ink-muted">{a.tagline}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-3">
              {a.stats.map(([k, v]) => (
                <StatBar key={k} label={k} value={v} color={color} />
              ))}
            </div>

            <dl className="grid grid-cols-3 border border-line">
              {a.specs.map(([k, v]) => (
                <div key={k} className="border-r border-line p-3 last:border-r-0">
                  <dt className="hud-label text-[10px]">{k}</dt>
                  <dd className="font-mono text-sm" style={{ color: k === 'HUMANITY' ? '#FF2A6D' : '#E8F1FF' }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div>
              <span className="hud-label mb-2 block">NODES</span>
              <ul className="flex flex-col">
                {a.parts.map((p, i) => (
                  <li key={p.code}>
                    <button
                      type="button"
                      onClick={() => setHotspot(i === hotspot ? -1 : i)}
                      aria-pressed={hotspot === i}
                      className={`flex min-h-[44px] w-full items-center justify-between border-b border-line text-left transition-colors hover:text-cyan ${hotspot === i ? 'text-cyan' : 'text-ink'}`}
                    >
                      <span>
                        <span className="mr-3 font-mono text-xs text-ink-muted">0{i + 1}</span>
                        {p.t}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">{p.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <fieldset>
              <legend className="hud-label mb-2">FINISH · {finishes[finish].label}</legend>
              <div className="flex gap-3">
                {finishes.map((f, i) => (
                  <label key={f.id} className="relative grid h-11 w-11 cursor-pointer place-items-center" title={f.label}>
                    <input type="radio" name="finish" value={f.id} checked={finish === i} onChange={() => setFinish(i)} className="peer sr-only" />
                    <span className="sr-only">{f.label}</span>
                    <span
                      aria-hidden="true"
                      className="h-8 w-8 border-2 border-transparent peer-checked:border-ink peer-focus-visible:shadow-glow-cyan"
                      style={{ background: f.id === 'chrome' ? 'linear-gradient(135deg, #F2F6FF, #8A93A8 50%, #E8F1FF 70%, #5A6378)' : f.color, boxShadow: finish === i ? `0 0 10px ${f.color}` : 'none' }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <div>
                <span className="hud-label block">PRICE</span>
                <span className="font-mono text-3xl font-bold text-ink">{a.price}</span>
                <span className="mt-1 block font-mono text-[11px] tracking-[0.12em]" style={{ color: a.stock.startsWith('LOW') ? '#F5E642' : '#2BFF88' }}>
                  ● {a.stock}
                </span>
              </div>
              <Button onClick={() => setEquipped((e) => ({ ...e, [a.id]: !e[a.id] }))} aria-pressed={!!equipped[a.id]} magnetic>
                {equipped[a.id] ? 'Equipped ✓' : 'Equip'}
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail switcher */}
        <div role="tablist" aria-label="Choose augment" className="mt-8 grid grid-cols-3 gap-3 md:gap-4">
          {augments.map((it, i) => (
            <button
              key={it.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => choose(i)}
              className={`flex min-h-[64px] items-center gap-3 border p-2 text-left transition-[border-color,background] duration-fast md:p-3 ${i === idx ? 'border-cyan bg-cyan/5 shadow-glow-cyan' : 'border-line hover:border-cyan/50'}`}
            >
              <img src={it.img} alt="" aria-hidden="true" loading="lazy" className="hidden h-12 w-12 object-cover sm:block" />
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.14em] text-ink-muted">
                  {it.num} · {it.cls.split(' ·')[0]}
                </span>
                <span className="block truncate text-sm font-semibold md:text-base">{it.name}</span>
                <span className="hidden font-mono text-xs text-cyan md:block">{it.price}</span>
              </span>
              {i === idx && <span className="ml-auto hidden font-mono text-[10px] tracking-[0.14em] text-cyan lg:block">VIEWING</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
