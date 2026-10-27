/** NEON//GRID design tokens — mirrors src/styles/tokens.css and the NEON-GRID-Design-System folder. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // Mobile-first. Design breakpoints: 390 / 834 / 1440 / 1920.
      sm: '480px',
      md: '768px',
      lg: '1200px',
      xl: '1920px',
    },
    extend: {
      colors: {
        void: '#05060A',
        surface: '#0B0E17',
        elevated: '#121726',
        line: 'rgba(0,240,255,0.12)',
        cyan: { DEFAULT: '#00F0FF', dim: 'rgba(0,240,255,0.15)' },
        magenta: { DEFAULT: '#FF2A6D', hover: '#FF4D85', active: '#D91E5B' },
        yellow: { DEFAULT: '#F5E642' },
        violet: { DEFAULT: '#7B2CFF', light: '#B48CFF' },
        ink: { DEFAULT: '#E8F1FF', muted: '#8A93A8' },
        success: '#2BFF88',
        danger: '#FF3B3B',
      },
      fontFamily: {
        display: ['Orbitron', 'Unbounded', 'system-ui', 'sans-serif'],
        body: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        h1: ['clamp(2.5rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '0.08em' }],
        h2: ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '0.08em' }],
        h3: ['1.5rem', { lineHeight: '1.2' }],
        micro: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      spacing: {
        // 4px base scale extras (Tailwind already covers 1=4px … 32=128px)
        18: '4.5rem',
        30: '7.5rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 8px #00F0FF, 0 0 24px rgba(0,240,255,.5)',
        'glow-magenta': '0 0 8px #FF2A6D, 0 0 24px rgba(255,42,109,.5)',
        'glow-violet': '0 0 8px #7B2CFF, 0 0 24px rgba(123,44,255,.5)',
      },
      backgroundImage: {
        synthwave: 'linear-gradient(135deg, #7B2CFF, #FF2A6D 50%, #00F0FF)',
        horizon: 'linear-gradient(to top, rgba(255,42,109,.35), transparent)',
      },
      transitionTimingFunction: {
        cyber: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '600ms',
        cinematic: '1200ms',
      },
    },
  },
  plugins: [],
};
