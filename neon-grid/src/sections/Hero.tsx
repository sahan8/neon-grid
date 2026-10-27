import { useEffect, useRef } from 'react';
import { images } from '../data/content';
import { scrollToId } from '../lib/boot';
import { gsap } from '../lib/SmoothScroll';
import { SceneShell } from '../three/SceneShell';
import { Button, ArrowIcon, HudLabel } from '../components/ui';
import { useGyro } from '../hooks/useGyro';
import { useIsTouch } from '../hooks/useIsMobile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useWebGLSupport } from '../hooks/useWebGLSupport';

const loadCity = () => import('../three/CityScene');

export function Hero({ entered }: { entered: boolean }) {
  const copy = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const webgl = useWebGLSupport();
  const gyro = useGyro();

  // Scroll: text group rises 80px and fades out by 40% of the hero; cue fades after 5%.
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(copy.current, { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: '40% top', scrub: true } });
      gsap.to(cue.current, { opacity: 0, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: '5% top', scrub: true } });
    });
    return () => ctx.revert();
  }, [reduced]);

  // Glitch burst on the headline right after entering.
  useEffect(() => {
    if (!entered || reduced || !h1.current) return;
    const el = h1.current;
    el.classList.add('is-glitching');
    const t = window.setTimeout(() => el.classList.remove('is-glitching'), 600);
    return () => window.clearTimeout(t);
  }, [entered, reduced]);

  const fallback = (
    <picture>
      <source media="(max-width: 767px)" srcSet={images.heroMobile} />
      <img
        src={images.heroDesktop}
        alt="Street-level view of a neon megacity at night: towering skyscrapers with holographic billboards, flying cars and a lone figure on a wet street"
        className="h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );

  return (
    <section id="top" aria-labelledby="hero-title" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <SceneShell load={loadCity} props={{ tilt: gyro.tilt }} fallback={fallback} className="absolute inset-0" eager readyKey="hero" paused={!entered} />

      {/* Readability scrims (mobile: bottom-up; desktop: left-to-right) */}
      <div aria-hidden="true" className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(5,6,10,.97) 0%, rgba(5,6,10,.9) 38%, rgba(5,6,10,.4) 58%, rgba(5,6,10,0) 72%)' }} />
      <div aria-hidden="true" className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(5,6,10,.88) 0%, rgba(5,6,10,.55) 34%, rgba(5,6,10,0) 60%), linear-gradient(to top, rgba(5,6,10,.6), rgba(5,6,10,0) 30%)' }} />

      {/* HUD corners */}
      <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+16px)] hidden md:block [text-shadow:0_1px_6px_rgba(5,6,10,.95)]">
        <div className="container-grid flex justify-between">
          <div className="flex flex-col gap-1">
            <HudLabel>LAT 35.6762° N</HudLabel>
            <HudLabel>LON 139.6503° E</HudLabel>
          </div>
          <div className="flex flex-col items-end gap-1">
            <HudLabel dot="#2BFF88">SYS.ONLINE</HudLabel>
            <HudLabel>NODE 07 · 2087.10.27</HudLabel>
            <HudLabel>RAIN 92% · VIS 1.2 KM</HudLabel>
          </div>
        </div>
      </div>

      <div className="relative flex h-full items-end pb-24 md:items-center md:pb-0">
        <div ref={copy} className="container-grid">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-cyan">// TRANSMISSION 001 · NEO-TOKYO</p>
          <h1 id="hero-title" ref={h1} className="glitch max-w-[12ch] text-h1 font-black text-ink" data-text="Welcome to the grid">
            Welcome to the grid
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink md:text-xl">
            Year 2087. 40 million souls.
            <br />
            One network.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <Button onClick={() => scrollToId('join')} icon={<ArrowIcon />} magnetic>
              Jack in
            </Button>
            <Button variant="secondary" onClick={() => scrollToId('districts')}>
              Explore districts
            </Button>
          </div>
          {touch && webgl && gyro.supported && !gyro.enabled && (
            <button type="button" onClick={gyro.enable} className="hud-label mt-5 min-h-[44px] text-cyan underline-offset-4 hover:underline">
              ◎ Enable tilt parallax
            </button>
          )}
        </div>
      </div>

      <div ref={cue} className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 md:bottom-9">
        <span className="hud-label text-ink">SCROLL TO DIVE ↓</span>
      </div>
    </section>
  );
}
