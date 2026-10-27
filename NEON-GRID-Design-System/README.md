# NEON//GRID — Design System & Website Design

Source files of the NEON//GRID design canvas (exported 27 Oct 2026).
Cyberpunk 3D website concept: design system, every section in desktop / tablet / mobile,
interaction states, motion & 3D spec, and responsive breakpoint matrix.

## What's inside

- `project/canvas.json` — the canvas index: every artboard, its size and position.
- `project/*.dc.html` — 72 artboards (Design Component HTML), grouped below.
- `images/` — the 12 generated image assets (WebP).

### Design system (7 artboards)
| File | Contents |
| --- | --- |
| Main.dc.html | Cover & colour tokens |
| Typography.dc.html | Type scale: Orbitron / Rajdhani / JetBrains Mono |
| Foundations.dc.html | Spacing, grid, shape, effects, motion tokens |
| Actions.dc.html | Buttons, navigation, chips |
| Cards.dc.html | Cards, meters, inputs |
| Feedback.dc.html | Overlays, loaders, page chrome |
| Guidelines.dc.html | Usage rules & accessibility |

### Screens
Boot loader, Navigation, Hero, Districts, Augments (3D viewer), Characters, Lore timeline,
Gallery, Join form, Footer, 404 — each with desktop and mobile versions plus hover,
error, loading and success states. `MotionSpec.dc.html` and `Breakpoints.dc.html`
document motion and responsive rules; `BP-*` files show Hero, Augments and Join at
390 / 834 / 1440 / 1920 px.

## Viewing the files

The `.dc.html` artboards are component source files: they rely on a design-canvas runtime
(`support.js`, not included), so opening one directly in a browser will not render it fully.
Read them as the build reference for the real site in `../neon-grid` (React + Three.js):
colours, fonts, spacing, copy and interaction logic are all readable in the source.

Images in the artboards are referenced as `/_blob/<id>` uploads; the same images are
included in `images/` with readable names.
