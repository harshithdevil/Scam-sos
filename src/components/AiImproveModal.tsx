import { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import type { Language, ReportingProfileData } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { BottomSheet } from './BottomSheet';
import { TACTILE_BUTTON_MOTION } from './MotionPrimitives';

interface AiImproveModalProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  t: TranslationBundle;
  emailSubject: string;
  emailBody: string;
  profile: ReportingProfileData;
  onApplyImproved: (subject: string, body: string) => void;
}

export const AiImproveModal = memo(function AiImproveModal({
  open,
  onClose,
  language,
  t,
  emailSubject,
  emailBody,
  profile,
  onApplyImproved,
}: AiImproveModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nonEmptyProfileEntries = useMemo(() => {
    return (Object.keys(profile) as Array<keyof ReportingProfileData>)
      .filter((key) => Boolean(profile[key]?.trim()))
      .map((key) => ({
        key,
        label: t.profile.fields[key],
        value: profile[key].trim(),
      }));
  }, [profile, t.profile.fields]);

  async function handleConfirmSend() {
    setErrorMsg(null);
    setLoading(true);
    try {
      const sharedFields: Record<string, string> = {};
      for (const item of nonEmptyProfileEntries) {
        sharedFields[item.key] = item.value;
      }

      const res = await fetch('/api/improve-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          emailSubject,
          emailBody,
          sharedFields,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        emailSubject?: string;
        emailBody?: string;
        error?: string;
      };

      if (!res.ok) {
        if (data.error === 'no_key') {
          setErrorMsg(t.aiImprove.errorNoKey);
        } else if (data.error === 'forbidden_secret') {
          setErrorMsg(t.aiImprove.errorSecret);
        } else {
          setErrorMsg(t.aiImprove.errorApi);
        }
        return;
      }

      if (data.emailSubject && data.emailBody) {
        onApplyImproved(data.emailSubject, data.emailBody);
        onClose();
      } else {
        setErrorMsg(t.aiImprove.errorApi);
      }
    } catch {
      setErrorMsg(t.aiImprove.errorApi);
    } finally {
      setLoading(false);
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t.aiImprove.modalTitle}
      titleId="ai-improve-modal-title"
      closeLabel={t.pwa.closeLabel}
    >
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-cyber-secondary sm:text-sm">
          {t.aiImprove.modalNotice}
        </p>

        {/* Exact Profile Fields Preview */}
        <div className="space-y-2 rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4">
          <p className="text-xs font-bold text-[#F5E6B8]">
            {t.aiImprove.previewFieldsHeading}
          </p>
          {nonEmptyProfileEntries.length === 0 ? (
            <p className="text-xs text-cyber-secondary">{t.aiImprove.noProfileFieldsNote}</p>
          ) : (
            <dl className="grid gap-1.5 text-xs">
              {nonEmptyProfileEntries.map((item) => (
                <div key={item.key} className="flex flex-wrap justify-between gap-2">
                  <dt className="text-cyber-secondary">{item.label}:</dt>
                  <dd
                    className={`font-medium text-cyber-primary ${
                      item.key === 'transactionId' ? 'font-mono-cyber' : ''
                    }`}
                  >
                    {item.key === 'accountLast4' ? `XXXX${item.value}` : item.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Exact Draft Preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-[#F5E6B8]">{t.aiImprove.previewDraftHeading}</p>
          <div className="max-h-48 overflow-y-auto rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-3.5 text-xs leading-relaxed text-cyber-primary">
            <p className="mb-2 font-semibold text-[#F5E6B8]">{emailSubject}</p>
            <p className="whitespace-pre-wrap text-cyber-secondary">{emailBody}</p>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-[#F43F5E]/45 bg-[#F43F5E]/12 px-3.5 py-2.5 text-xs text-[#F5F2EA]"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F43F5E]" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <motion.button
            type="button"
            disabled={loading}
            onClick={handleConfirmSend}
            {...TACTILE_BUTTON_MOTION}
            className="cta-primary inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold hover:brightness-105 disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loading ? t.aiImprove.loadingText : t.aiImprove.confirmSendBtn}</span>
          </motion.button>

          <motion.button
            type="button"
            disabled={loading}
            onClick={onClose}
            {...TACTILE_BUTTON_MOTION}
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-5 py-2.5 text-sm font-semibold text-cyber-primary hover:border-[#D4AF37]/45 disabled:opacity-70"
          >
            {t.aiImprove.cancelBtn}
          </motion.button>
        </div>
      </div>
    </BottomSheet>
  );
});
