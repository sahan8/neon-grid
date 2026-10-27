# NEON//GRID

An immersive 3D cyberpunk website built from the NEON//GRID design system (see `../NEON-GRID-Design-System`).
Year 2087. 40 million souls. One network.

**Stack:** Vite · React 18 · TypeScript · Tailwind CSS · Three.js (React Three Fiber, drei, postprocessing) · GSAP ScrollTrigger · Lenis · Framer Motion · React Hook Form + Zod.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run typecheck` | TypeScript check only |
| `npm run build` | Type check + production build into `dist/` |
| `npm run preview` | Serve the production build at http://localhost:4173 |

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo. Vercel detects Vite automatically
   (build command `npm run build`, output `dist`).
3. `vercel.json` already handles SPA routing (so `/anything` shows the 404 page) and
   long-term caching for hashed assets.
4. After the first deploy, replace `https://neon-grid.vercel.app` with your real URL in
   `index.html` (canonical + Open Graph tags), `public/robots.txt` and `public/sitemap.xml`.

## Project structure

```
src/
  components/ui/        Button, HudLabel/Chip/SectionHeader, StatBar, TiltCard, Modal, Input/Select/Checkbox, Cursor, ScrambleText
  components/layout/    Nav (+ sound toggle, live Neo-Tokyo clock), MobileMenu, Footer, ScrollProgress
  sections/             Loader, Hero, Districts, Augments, Characters, Lore, Gallery, Join
  three/                CityScene, AugmentViewer, DataTunnel, SceneShell (lazy + fallback + pause), effects/PostFX
  hooks/                useReducedMotion, useIsMobile/useIsTouch, useWebGLSupport, useGyro, useInView
  lib/                  boot (loader readiness), SmoothScroll (Lenis + GSAP), sound (Web Audio)
  data/content.ts       All copy, stats and image references from the design
  styles/               tokens.css (design tokens), globals.css
  assets/               images (12 WebP), models/, audio/ (empty, ready for your files)
  pages/                Home, NotFound
public/                 favicon, apple-touch icon, OG image, robots.txt, sitemap.xml, manifest
```

Design tokens live in two places that mirror each other: `tailwind.config.js`
(utility classes like `bg-void`, `text-cyan`, `shadow-glow-magenta`, `font-display`)
and `src/styles/tokens.css` (CSS variables).

## How the requirements are met

- **Responsive (390 / 834 / 1440 / 1920):** mobile-first Tailwind with `sm 480`, `md 768`,
  `lg 1200`, `xl 1920`. Districts pins and scrolls horizontally on desktop and becomes a
  snap carousel below 1200px; Characters is 4 / 2 columns or a swipe carousel; modals become
  bottom sheets on mobile.
- **Lazy 3D + loader:** every scene loads through `React.lazy` + `Suspense` inside
  `SceneShell`. The 3D libraries are kept out of the first-paint bundle. The boot loader
  waits for webfonts and the hero scene's first rendered frame (9s safety cap).
- **Fallbacks:** no WebGL, `prefers-reduced-motion` or Save-Data → static images
  (hero, augments, join). Reduced motion also turns off Lenis, scroll-jacking and glitch flicker.
- **Adaptive quality:** device tier from screen size, CPU cores and memory decides DPR,
  tower/rain/traffic counts, reflections and FX. `PerformanceMonitor` drops the hero to
  the low tier live if frame rate falls.
- **Pausing:** each canvas switches to `frameloop="demand"` when off-screen
  (IntersectionObserver) or the tab is hidden; the hero also holds while the loader is up.
- **Accessibility:** skip link, landmarks, one H1 per page, real buttons and links,
  keyboard-operable carousels, tabs and lightbox (← → Esc), focus-trapped dialogs that return
  focus, visible focus rings, `aria-label`s on icon buttons, alt text on all content images,
  form errors announced with `role="alert"`.
- **SEO:** meta description, canonical, Open Graph and Twitter tags, OG image
  (1200×630), favicon, apple-touch icon, manifest, robots.txt, sitemap.xml.

## Things to replace

- **3D models:** `AugmentViewer` uses procedural placeholder models. Download CC-licensed
  models (Sketchfab, Poly Pizza, Quaternius), compress them, put them in `public/models/`
  and load them with drei's `useGLTF('/models/titan_mk4.glb')`:

  ```bash
  npx @gltf-transform/cli optimize input.glb public/models/titan_mk4.glb --compress draco --texture-compress ktx2
  ```

- **Join form backend:** `submitToBackend()` in `src/sections/Join.tsx` is a stub. Point it
  at Formspree, Resend, or a Vercel serverless function.
- **Audio:** sound is synthesised with Web Audio (off by default, 30% volume). Drop real
  loops into `src/assets/audio/` and swap them in `src/lib/sound.ts` if you want.
- **Fixer and Rogue AI portraits:** these two characters use stylised CSS holograms until
  you generate their images. Add the files and set `img` in `src/data/content.ts`.
- **Links:** social, Terms and Privacy links point to `#`.

## Performance tips

- Run Lighthouse on the deployed site in Chrome DevTools, in an Incognito window and in
  Mobile mode. Local dev mode is much slower than the production build.
- If mobile Performance is under 85, the first lever is the hero: lower `Towers` and
  `Rain` counts for the low tier in `src/three/CityScene.tsx`.
