import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { Database, Lock, ShieldCheck } from 'lucide-react';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import { BottomSheet } from './BottomSheet';
import { TACTILE_BUTTON_MOTION } from './MotionPrimitives';

interface ConsentSheetProps {
  t: TranslationBundle;
}

export const ConsentSheet = memo(function ConsentSheet({ t }: ConsentSheetProps) {
  const {
    consentSheetOpen,
    closeConsentSheet,
    grantConsent,
    declineConsent,
    user,
  } = useReportingProfile();

  const [submitting, setSubmitting] = useState(false);

  async function handleAllow() {
    setSubmitting(true);
    try {
      await grantConsent();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDecline() {
    setSubmitting(true);
    try {
      await declineConsent();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BottomSheet
      open={consentSheetOpen}
      onClose={closeConsentSheet}
      title={t.consent.title}
      titleId="consent-sheet-title"
      closeLabel={t.pwa.closeLabel}
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-cyber-secondary">
          {t.consent.subtitle}
        </p>

        <div className="space-y-3 rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4">
          <div className="flex items-start gap-2.5">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#F5E6B8]">{t.consent.whatLabel}</p>
              <p className="text-xs leading-relaxed text-cyber-primary">{t.consent.whatDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t border-[var(--border-glass)] pt-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#F5E6B8]">{t.consent.whyLabel}</p>
              <p className="text-xs leading-relaxed text-cyber-primary">{t.consent.whyDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 border-t border-[var(--border-glass)] pt-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#F5E6B8]">{t.consent.whereLabel}</p>
              <p className="text-xs leading-relaxed text-cyber-primary">
                {user && user.emailVerified
                  ? t.consent.whereDescAccount
                  : t.consent.whereDescDevice}
              </p>
            </div>
          </div>
        </div>

        <p className="rounded-xl border border-[#34D399]/30 bg-[#34D399]/10 px-3.5 py-2.5 text-xs leading-relaxed text-cyber-primary">
          {t.consent.neverSharedNote}
        </p>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <motion.button
            type="button"
            disabled={submitting}
            onClick={handleAllow}
            {...TACTILE_BUTTON_MOTION}
            className="cta-primary inline-flex min-h-[46px] flex-1 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold hover:brightness-105 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            {t.consent.allowBtn}
          </motion.button>

          <motion.button
            type="button"
            disabled={submitting}
            onClick={handleDecline}
            {...TACTILE_BUTTON_MOTION}
            className="inline-flex min-h-[46px] flex-1 items-center justify-center rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-4 py-2.5 text-sm font-semibold text-cyber-primary transition-colors hover:border-[#D4AF37]/45 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            {t.consent.declineBtn}
          </motion.button>
        </div>
      </div>
    </BottomSheet>
  );
});
