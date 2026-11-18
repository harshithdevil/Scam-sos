import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineBannerProps {
  message: string;
}

export const OfflineBanner = memo(function OfflineBanner({ message }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-[#FBBF24]/40 bg-[#12121A] px-4 py-2 text-xs font-medium text-[#F5F2EA] print:hidden"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-center">
            <WifiOff className="h-3.5 w-3.5 shrink-0 text-[#FBBF24]" aria-hidden="true" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
