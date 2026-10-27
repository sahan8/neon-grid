import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

/**
 * Accessible dialog: focus moves in and is trapped, Esc closes, focus returns
 * to the opener, page scroll is locked. Becomes a bottom sheet on mobile.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus], button')?.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lenis?.start();
      opener?.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Close dialog" className="absolute inset-0 cursor-default bg-void/85 backdrop-blur-sm" onClick={onClose} tabIndex={-1} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-lenis-prevent
            className={`glass brackets relative max-h-[92vh] w-full overflow-y-auto ${wide ? 'md:max-w-6xl' : 'md:max-w-3xl'}`}
            initial={mobile ? { y: '100%' } : { y: 24, opacity: 0, scale: 0.98 }}
            animate={mobile ? { y: 0 } : { y: 0, opacity: 1, scale: 1 }}
            exit={mobile ? { y: '100%' } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {mobile && <span aria-hidden="true" className="mx-auto mt-2 block h-1 w-10 bg-ink-muted/50" />}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center border border-line text-ink hover:border-cyan hover:text-cyan"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
