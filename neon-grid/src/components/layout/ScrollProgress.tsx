import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin cyan → magenta progress bar across the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg, #00F0FF, #FF2A6D)', boxShadow: '0 0 8px rgba(0,240,255,.6)' }}
    />
  );
}
