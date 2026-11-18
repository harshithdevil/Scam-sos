import { memo, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Check,
  Cloud,
  HardDrive,
  LogIn,
  LogOut,
  Printer,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { ReportingProfileData } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import {
  EMPTY_REPORTING_PROFILE,
  PROFILE_LIMITS,
  type ProfileFieldKey,
  type ProfileValidationErrorCode,
} from '../utils/profileValidation';
import { BottomSheet } from './BottomSheet';
import { TACTILE_BUTTON_MOTION } from './MotionPrimitives';

interface ReportingProfileSheetProps {
  t: TranslationBundle;
}

export const ReportingProfileSheet = memo(function ReportingProfileSheet({
  t,
}: ReportingProfileSheetProps) {
  const {
    user,
    authActionLoading,
    authErrorCode,
    clearAuthError,
    signInWithGoogle,
    signOutUser,
    profileSheetOpen,
    closeReportingProfile,
    profile,
    profileSaving,
    profileSyncError,
    storageLocation,
    saveProfile,
    deleteAllMyData,
    withdrawConsent,
  } = useReportingProfile();

  const [draft, setDraft] = useState<ReportingProfileData>(profile);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ProfileFieldKey, ProfileValidationErrorCode>>
  >({});
  const [statusNotice, setStatusNotice] = useState<'saved' | 'deleted' | 'sync_error' | null>(
    null
  );

  useEffect(() => {
    if (profileSheetOpen) {
      setDraft(profile);
      setFieldErrors({});
      setStatusNotice(null);
    }
  }, [profile, profileSheetOpen]);

  function handleChange(field: ProfileFieldKey, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (statusNotice) {
      setStatusNotice(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusNotice(null);
    const outcome = await saveProfile(draft);
    if (!outcome.ok) {
      if (outcome.fieldErrors) {
        setFieldErrors(outcome.fieldErrors);
      } else if (outcome.syncError) {
        setStatusNotice('sync_error');
      }
      return;
    }
    setFieldErrors({});
    setStatusNotice('saved');
  }

  async function handleDelete() {
    await deleteAllMyData();
    setDraft(EMPTY_REPORTING_PROFILE);
    setFieldErrors({});
    setStatusNotice('deleted');
  }

  function handleExportPdf() {
    closeReportingProfile();
    window.setTimeout(() => {
      window.print();
    }, 150);
  }

  const inputFields: Array<{
    key: ProfileFieldKey;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    mono?: boolean;
    maxLength: number;
  }> = [
    { key: 'fullName', maxLength: PROFILE_LIMITS.fullName },
    { key: 'phone', type: 'tel', inputMode: 'tel', maxLength: PROFILE_LIMITS.phone },
    { key: 'email', type: 'email', maxLength: PROFILE_LIMITS.email },
    { key: 'cityState', maxLength: PROFILE_LIMITS.cityState },
    { key: 'bankName', maxLength: PROFILE_LIMITS.bankName },
    { key: 'accountLast4', inputMode: 'numeric', maxLength: PROFILE_LIMITS.accountLast4 },
    { key: 'scamDateTime', maxLength: PROFILE_LIMITS.scamDateTime },
    { key: 'amountLost', inputMode: 'decimal', maxLength: PROFILE_LIMITS.amountLost },
    { key: 'transactionId', mono: true, maxLength: PROFILE_LIMITS.transactionId },
    { key: 'scammerContact', maxLength: PROFILE_LIMITS.scammerContact },
  ];

  return (
    <BottomSheet
      open={profileSheetOpen}
      onClose={closeReportingProfile}
      title={t.profile.title}
      titleId="reporting-profile-sheet-title"
      closeLabel={t.pwa.closeLabel}
    >
      <div className="space-y-4">
        {/* Honesty Notice */}
        <div className="rounded-[20px] border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3.5 text-xs leading-relaxed text-[#F5E6B8]">
          {t.profile.honestyNotice}
        </div>

        {/* Auth & Storage Badge Bar */}
        <div className="space-y-2.5 rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5E6B8]">
              {storageLocation === 'account' ? (
                <>
                  <Cloud className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.profile.storageAccountBadge}</span>
                </>
              ) : (
                <>
                  <HardDrive className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.profile.storageDeviceBadge}</span>
                </>
              )}
            </div>

            {user ? (
              <motion.button
                type="button"
                disabled={authActionLoading}
                onClick={signOutUser}
                {...TACTILE_BUTTON_MOTION}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-[var(--border-glass)] bg-[var(--surface-sheet)] px-3 py-1 text-xs font-semibold text-cyber-secondary hover:border-[#D4AF37]/45 hover:text-[#F5E6B8]"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.auth.signOut}</span>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                disabled={authActionLoading}
                onClick={signInWithGoogle}
                {...TACTILE_BUTTON_MOTION}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-[#D4AF37]/45 bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#F5E6B8] hover:bg-[#D4AF37]/25"
              >
                <LogIn className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>{authActionLoading ? t.auth.signingIn : t.auth.signInGoogle}</span>
              </motion.button>
            )}
          </div>

          <p className="text-xs text-cyber-secondary">
            {user
              ? `${t.auth.signedInAs}: ${user.email ?? user.displayName ?? 'Google'}`
              : `${t.auth.guestBadge} · ${t.auth.guestDesc}`}
          </p>

          {authErrorCode && (
            <div
              role="alert"
              className="flex items-start justify-between gap-2 rounded-xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-2 text-xs text-[#F5F2EA]"
            >
              <span>{t.auth.errors[authErrorCode]}</span>
              <button
                type="button"
                onClick={clearAuthError}
                className="shrink-0 font-semibold text-[#F5E6B8] underline"
              >
                {t.pwa.closeLabel}
              </button>
            </div>
          )}
        </div>

        {/* Strict Secret Warning */}
        <div
          role="note"
          className="flex items-start gap-2.5 rounded-xl border border-[#F43F5E]/45 bg-[#F43F5E]/12 px-3.5 py-2.5 text-xs font-semibold text-[#F5F2EA]"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#F43F5E]" aria-hidden="true" />
          <span>{t.profile.secretWarning}</span>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            {inputFields.map(({ key, type, inputMode, mono, maxLength }) => {
              const errCode = fieldErrors[key];
              return (
                <div key={key} className="space-y-1">
                  <label
                    htmlFor={`profile-${key}`}
                    className="block text-xs font-semibold text-cyber-secondary"
                  >
                    {t.profile.fields[key]}
                  </label>
                  <input
                    id={`profile-${key}`}
                    type={type ?? 'text'}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    value={draft[key]}
                    onChange={(e) => {
                      const nextVal =
                        key === 'accountLast4'
                          ? e.target.value.replace(/\D/g, '').slice(0, 4)
                          : e.target.value;
                      handleChange(key, nextVal);
                    }}
                    placeholder={t.profile.placeholders[key]}
                    className={`cyber-input min-h-[42px] w-full rounded-xl px-3 py-2 text-xs sm:text-sm ${
                      mono ? 'font-mono-cyber' : ''
                    }`}
                  />
                  {errCode && (
                    <p role="alert" className="text-[11px] font-medium text-[#F43F5E]">
                      {t.profile.errors[errCode]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="profile-shortDescription"
              className="block text-xs font-semibold text-cyber-secondary"
            >
              {t.profile.fields.shortDescription}
            </label>
            <textarea
              id="profile-shortDescription"
              rows={3}
              maxLength={PROFILE_LIMITS.shortDescription}
              value={draft.shortDescription}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder={t.profile.placeholders.shortDescription}
              className="cyber-input w-full rounded-xl px-3 py-2 text-xs leading-relaxed sm:text-sm"
            />
            {fieldErrors.shortDescription && (
              <p role="alert" className="text-[11px] font-medium text-[#F43F5E]">
                {t.profile.errors[fieldErrors.shortDescription]}
              </p>
            )}
          </div>

          {/* Feedback messages */}
          {(statusNotice === 'sync_error' || profileSyncError) && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-[#FBBF24]/45 bg-[#FBBF24]/10 px-3.5 py-2 text-xs text-[#F5F2EA]"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#FBBF24]" aria-hidden="true" />
              <span>{t.profile.syncErrorNote}</span>
            </div>
          )}

          {statusNotice === 'saved' && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-[#34D399]/45 bg-[#34D399]/10 px-3.5 py-2 text-xs font-medium text-[#34D399]"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.profile.savedNote}</span>
            </div>
          )}

          {statusNotice === 'deleted' && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-medium text-[#F5E6B8]"
            >
              <Trash2 className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.profile.deletedNote}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <motion.button
              type="submit"
              disabled={profileSaving}
              {...TACTILE_BUTTON_MOTION}
              className="cta-primary inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-2 text-xs font-bold hover:brightness-105 disabled:opacity-70 sm:text-sm"
            >
              {profileSaving ? t.profile.savingBtn : t.profile.saveBtn}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleExportPdf}
              {...TACTILE_BUTTON_MOTION}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/40 bg-[var(--surface-input)] px-3.5 py-2 text-xs font-semibold text-[#F5E6B8] hover:bg-[#D4AF37]/15"
            >
              <Printer className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.profile.exportPdfBtn}</span>
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-glass)] pt-3">
            <motion.button
              type="button"
              onClick={handleDelete}
              {...TACTILE_BUTTON_MOTION}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-3.5 py-1.5 text-xs font-semibold text-[#F43F5E] hover:bg-[#F43F5E]/20"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.profile.deleteBtn}</span>
            </motion.button>

            <button
              type="button"
              onClick={withdrawConsent}
              className="text-xs font-medium text-cyber-secondary underline underline-offset-4 hover:text-[#F5E6B8]"
            >
              {t.consent.withdrawBtn}
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
});
