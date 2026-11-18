import { memo } from 'react';
import { motion } from 'motion/react';
import {
  LogIn,
  LogOut,
  ShieldCheck,
  SunMedium,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { Language } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import { BottomSheet } from './BottomSheet';
import { PWAInstallButton } from './PWAInstallButton';
import { IOS_SPRING, TAB_SPRING } from './MotionPrimitives';

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  ultraDark: boolean;
  onToggleUltraDark: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationBundle;
}

const LANG_OPTIONS: Array<{ code: Language; label: string; ariaLabel: string }> = [
  { code: 'en', label: 'EN', ariaLabel: 'Switch language to English' },
  { code: 'hi', label: 'हिन्दी', ariaLabel: 'Switch language to Hindi' },
  { code: 'te', label: 'తెలుగు', ariaLabel: 'Switch language to Telugu' },
];

export const SettingsSheet = memo(function SettingsSheet({
  open,
  onClose,
  ultraDark,
  onToggleUltraDark,
  language,
  onLanguageChange,
  t,
}: SettingsSheetProps) {
  const {
    user,
    authActionLoading,
    authErrorCode,
    clearAuthError,
    signInWithGoogle,
    signOutUser,
    consent,
    openConsentSheet,
    withdrawConsent,
    openReportingProfile,
  } = useReportingProfile();

  const consentStatusText =
    consent === 'allowed'
      ? t.consent.statusAllowed
      : consent === 'declined'
        ? t.consent.statusDeclined
        : t.consent.statusUndecided;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t.settings.title}
      titleId="settings-sheet-title"
      closeLabel={t.pwa.closeLabel}
    >
      <div className="space-y-4">
        {/* High-Contrast Ultra-Dark Mode Switch */}
        <div className="rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SunMedium className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span
                  id="ultra-dark-label"
                  className="text-sm font-bold text-cyber-primary"
                >
                  {t.settings.ultraDarkTitle}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-cyber-secondary">
                {t.settings.ultraDarkDesc}
              </p>
            </div>

            <motion.button
              type="button"
              role="switch"
              aria-checked={ultraDark}
              aria-labelledby="ultra-dark-label"
              onClick={onToggleUltraDark}
              whileTap={{ scale: 0.96 }}
              transition={IOS_SPRING}
              className={`relative flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                ultraDark
                  ? 'border-[#D4AF37] bg-[#D4AF37]'
                  : 'border-[var(--border-glass)] bg-[#12121A]'
              }`}
            >
              <motion.span
                animate={{ x: ultraDark ? 22 : 0 }}
                transition={TAB_SPRING}
                className={`h-6 w-6 rounded-full shadow-sm ${
                  ultraDark ? 'bg-[#0B0B0F]' : 'bg-[#F5F2EA]'
                }`}
              />
            </motion.button>
          </div>
          <p className="mt-2.5 text-xs font-medium text-[#F5E6B8]">
            {ultraDark ? t.settings.ultraDarkOn : t.settings.ultraDarkOff}
          </p>
        </div>

        {/* Account & Consent Management */}
        <div className="space-y-3 rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <h3 className="text-sm font-bold text-cyber-primary">
              {t.consent.settingsHeading}
            </h3>
          </div>

          <p className="text-xs text-cyber-secondary">
            {user
              ? `${t.auth.signedInAs}: ${user.email ?? user.displayName ?? 'Google'}`
              : `${t.auth.guestBadge} — ${t.auth.guestDesc}`}
          </p>

          <p className="text-xs font-medium text-[#F5E6B8]">{consentStatusText}</p>

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

          <div className="flex flex-wrap gap-2 pt-1">
            {user ? (
              <motion.button
                type="button"
                disabled={authActionLoading}
                onClick={signOutUser}
                whileTap={{ scale: 0.96 }}
                transition={IOS_SPRING}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-sheet)] px-3.5 py-1.5 text-xs font-semibold text-cyber-primary hover:border-[#D4AF37]/45"
              >
                <LogOut className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.auth.signOut}</span>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                disabled={authActionLoading}
                onClick={signInWithGoogle}
                whileTap={{ scale: 0.96 }}
                transition={IOS_SPRING}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/12 px-3.5 py-1.5 text-xs font-semibold text-[#F5E6B8] hover:bg-[#D4AF37]/20"
              >
                <LogIn className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>{authActionLoading ? t.auth.signingIn : t.auth.signInGoogle}</span>
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={() => {
                onClose();
                openReportingProfile();
              }}
              whileTap={{ scale: 0.96 }}
              transition={IOS_SPRING}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-sheet)] px-3.5 py-1.5 text-xs font-semibold text-[#F5E6B8] hover:border-[#D4AF37]/45"
            >
              <UserRound className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.profile.openProfileCta}</span>
            </motion.button>
          </div>

          {consent === 'allowed' ? (
            <motion.button
              type="button"
              onClick={withdrawConsent}
              whileTap={{ scale: 0.96 }}
              transition={IOS_SPRING}
              className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-3.5 py-1.5 text-xs font-semibold text-[#F43F5E] hover:bg-[#F43F5E]/20"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.consent.withdrawBtn}</span>
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                openConsentSheet();
              }}
              className="text-xs font-medium text-[#D4AF37] underline underline-offset-4 hover:text-[#F5E6B8]"
            >
              {t.consent.grantAgainBtn}
            </button>
          )}
        </div>

        {/* Language Selector Mirror inside Settings */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyber-secondary">
            {t.settings.languageLabel}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LANG_OPTIONS.map((opt) => {
              const active = language === opt.code;
              return (
                <motion.button
                  key={opt.code}
                  type="button"
                  onClick={() => onLanguageChange(opt.code)}
                  aria-label={opt.ariaLabel}
                  aria-pressed={active}
                  whileTap={{ scale: 0.96 }}
                  transition={IOS_SPRING}
                  className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-[#D4AF37] bg-[#D4AF37]/16 text-[#F5E6B8]'
                      : 'border-[var(--border-glass)] bg-[var(--surface-input)] text-cyber-secondary hover:text-cyber-primary'
                  }`}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Offline Install trigger if available */}
        <div className="pt-1">
          <PWAInstallButton
            installLabel={t.pwa.installLabel}
            iosTitle={t.pwa.iosTitle}
            iosSteps={t.pwa.iosSteps}
            closeLabel={t.pwa.closeLabel}
          />
        </div>
      </div>
    </BottomSheet>
  );
});
