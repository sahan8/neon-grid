import { useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_<>';

/** Text that "decodes" from random characters on hover (link micro-interaction). */
export function ScrambleText({ text, className = '' }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const reduced = useReducedMotion();

  const run = () => {
    if (reduced) return;
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const total = text.length * 2;
    const tick = () => {
      frame++;
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < frame / 2 ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      );
      if (frame < total) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <span className={className} onMouseEnter={run} onFocus={run} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
