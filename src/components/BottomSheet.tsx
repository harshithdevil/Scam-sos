import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { X } from 'lucide-react';
import { IOS_SPRING, SHEET_SPRING } from './MotionPrimitives';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  closeLabel: string;
  children: ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  title,
  titleId,
  closeLabel,
  children,
}: BottomSheetProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.y > 85 || info.velocity.y > 450) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Solid Dimmed Backdrop without blur for mobile smoothness (tap outside to dismiss) */}
          <motion.div
            data-testid="bottom-sheet-backdrop"
            onClick={onClose}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="fixed inset-0 bg-[#0B0B0F]/82"
          />

          {/* Spring-Animated Swipeable Bottom Sheet (solid semi-opaque surface) */}
          <motion.div
            initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0.94 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%', opacity: 0.94 }}
            transition={prefersReducedMotion ? { duration: 0 } : SHEET_SPRING}
            drag={prefersReducedMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            className="glass-sheet relative z-10 max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[20px] px-5 pb-7 pt-3 sm:mb-4 sm:rounded-[20px] sm:px-6"
          >
            {/* iOS Grabber Handle */}
            <div
              aria-hidden="true"
              className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--border-top-highlight)]"
            />

            <div className="flex items-start justify-between gap-3">
              <h2
                id={titleId}
                className="font-display text-lg font-bold text-cyber-primary sm:text-xl"
              >
                {title}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -1 }}
                transition={IOS_SPRING}
                className="flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] text-cyber-secondary transition-colors hover:border-[#D4AF37]/50 hover:text-[#F5E6B8] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>

            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
