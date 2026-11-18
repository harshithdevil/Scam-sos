import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOS_SPRING } from './MotionPrimitives';
import { BottomSheet } from './BottomSheet';

interface PWAInstallButtonProps {
  installLabel: string;
  iosTitle: string;
  iosSteps: string;
  closeLabel: string;
}

export const PWAInstallButton = memo(function PWAInstallButton({
  installLabel,
  iosTitle,
  iosSteps,
  closeLabel,
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <motion.button
        type="button"
        onClick={install}
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -1.5 }}
        transition={IOS_SPRING}
        className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 px-3.5 py-1.5 text-xs font-semibold text-[#F5E6B8] transition-colors hover:bg-[#D4AF37]/20 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
      >
        <Download className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
        <span>{installLabel}</span>
      </motion.button>
    );
  }

  if (isIOS) {
    return (
      <>
        <motion.button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1.5 }}
          transition={IOS_SPRING}
          className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 px-3.5 py-1.5 text-xs font-semibold text-[#F5E6B8] transition-colors hover:bg-[#D4AF37]/20 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          <Download className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <span>{installLabel}</span>
        </motion.button>

        <BottomSheet
          open={showIOSGuide}
          onClose={() => setShowIOSGuide(false)}
          title={iosTitle}
          titleId="ios-install-title"
          closeLabel={closeLabel}
        >
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-cyber-secondary">{iosSteps}</p>
            <motion.button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              transition={IOS_SPRING}
              className="cta-primary min-h-[44px] w-full rounded-xl px-4 py-2 text-sm font-bold"
            >
              {closeLabel}
            </motion.button>
          </div>
        </BottomSheet>
      </>
    );
  }

  return null;
});
