import { memo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  PhoneCall,
  Search,
  ShieldAlert,
  ExternalLink,
  UserRound,
} from 'lucide-react';
import type { RoutePath, ScamCategory } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import { PWAInstallButton } from './PWAInstallButton';
import { BottomSheet } from './BottomSheet';
import {
  IOS_SPRING,
  LIST_STAGGER_DELAY,
  TACTILE_BUTTON_MOTION,
  TACTILE_CARD_MOTION,
} from './MotionPrimitives';

interface HomePageProps {
  onNavigate: (path: RoutePath) => void;
  t: TranslationBundle;
}

export const HomePage = memo(function HomePage({ onNavigate, t }: HomePageProps) {
  const { openReportingProfile } = useReportingProfile();
  const [selectedPattern, setSelectedPattern] = useState<{
    key: ScamCategory;
    title: string;
    desc: string;
  } | null>(null);

  return (
    <div className="space-y-16 pb-12 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12">
        <div className="relative mx-auto max-w-4xl text-left sm:text-center">
          <p className="text-xs font-semibold tracking-wide text-[#D4AF37] sm:text-sm">
            {t.home.heroEyebrow}
          </p>
          <h1
            className="mt-3 font-display text-4xl font-extrabold tracking-tight text-cyber-primary sm:text-5xl lg:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            {t.home.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cyber-secondary sm:mx-auto sm:text-lg">
            {t.home.heroSubtitle}
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <motion.button
              type="button"
              onClick={() => onNavigate('/sos')}
              {...TACTILE_BUTTON_MOTION}
              className="cta-primary inline-flex min-h-[50px] items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-6 py-3 text-base font-bold transition-[filter] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t.home.primaryCta}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => onNavigate('/check')}
              {...TACTILE_BUTTON_MOTION}
              className="glass-surface inline-flex min-h-[50px] items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-6 py-3 text-base font-semibold text-cyber-primary transition-colors duration-150 hover:border-[#D4AF37]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <Search className="h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.home.secondaryCta}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={openReportingProfile}
              {...TACTILE_BUTTON_MOTION}
              className="glass-surface inline-flex min-h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold text-[#F5E6B8] transition-colors duration-150 hover:border-[#D4AF37]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <UserRound className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.profile.openProfileCta}</span>
            </motion.button>
          </div>
        </div>

        {/* Immediate 1930 Emergency Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.04 }}
          className="glass-surface-elevated mx-auto mt-10 flex max-w-4xl flex-col items-start justify-between gap-4 rounded-[20px] p-6 sm:flex-row sm:items-center sm:p-7"
        >
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-bold text-cyber-primary sm:text-xl">
              {t.home.callBannerTitle}
            </h2>
            <p className="text-sm leading-relaxed text-cyber-secondary">
              {t.home.callBannerSub}
            </p>
          </div>
          <motion.a
            href="tel:1930"
            {...TACTILE_BUTTON_MOTION}
            className="font-mono-cyber inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/14 px-5 py-2.5 text-sm font-bold text-[#F5E6B8] transition-colors duration-150 hover:bg-[#D4AF37]/24 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <PhoneCall className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.home.callNowLabel}</span>
          </motion.a>
        </motion.div>
      </section>

      {/* 3-Step How It Works */}
      <section aria-labelledby="how-it-works-heading" className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <h2
            id="how-it-works-heading"
            className="font-display text-2xl font-bold tracking-tight text-cyber-primary sm:text-3xl"
          >
            {t.home.howTitle}
          </h2>
          <p className="mt-2 text-sm text-cyber-secondary sm:text-base">{t.home.howSubtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {t.home.steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
              className="glass-surface flex flex-col justify-between rounded-[20px] p-6"
            >
              <div>
                <span className="tabular-nums text-sm font-bold text-[#D4AF37]">
                  {step.num}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-cyber-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyber-secondary">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scam Types Grid */}
      <section aria-labelledby="scam-types-heading" className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <h2
            id="scam-types-heading"
            className="font-display text-2xl font-bold tracking-tight text-cyber-primary sm:text-3xl"
          >
            {t.home.scamTypesTitle}
          </h2>
          <p className="mt-2 text-sm text-cyber-secondary sm:text-base">
            {t.home.scamTypesSubtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.scamTypes.map((item, idx) => (
            <motion.button
              key={item.key}
              type="button"
              onClick={() => setSelectedPattern(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={TACTILE_CARD_MOTION.whileTap}
              whileHover={TACTILE_CARD_MOTION.whileHover}
              transition={{ ...IOS_SPRING, delay: Math.min(idx * LIST_STAGGER_DELAY, 0.15) }}
              className="glass-surface group flex flex-col justify-between rounded-[20px] p-6 text-left transition-colors duration-150 hover:border-[#D4AF37]/40 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-cyber-primary group-hover:text-[#F5E6B8]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyber-secondary">
                  {item.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Footer with Official Resources */}
      <footer className="mx-auto max-w-6xl border-t border-[var(--border-glass)] pt-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-md space-y-2">
            <h2 className="font-display text-base font-bold text-cyber-primary">
              {t.home.footerHeading}
            </h2>
            <p className="text-xs leading-relaxed text-cyber-secondary sm:text-sm">
              {t.home.footerNote}
            </p>
            <p className="text-xs leading-relaxed text-cyber-secondary">
              {t.disclaimer}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
            <motion.a
              href="tel:1930"
              {...TACTILE_BUTTON_MOTION}
              className="font-mono-cyber inline-flex min-h-[40px] items-center gap-1.5 text-[#F5E6B8] hover:text-[#D4AF37]"
            >
              <PhoneCall className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>1930</span>
            </motion.a>
            <motion.a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              {...TACTILE_BUTTON_MOTION}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-[#D4AF37] hover:text-[#F5E6B8]"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.a>
            <motion.button
              type="button"
              onClick={() => onNavigate('/resources')}
              {...TACTILE_BUTTON_MOTION}
              className="min-h-[40px] text-cyber-secondary underline decoration-[#6F6A62] underline-offset-4 hover:text-cyber-primary"
            >
              {t.nav.resources}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => onNavigate('/about')}
              {...TACTILE_BUTTON_MOTION}
              className="min-h-[40px] text-cyber-secondary underline decoration-[#6F6A62] underline-offset-4 hover:text-cyber-primary"
            >
              {t.nav.about}
            </motion.button>
            <PWAInstallButton
              installLabel={t.pwa.installLabel}
              iosTitle={t.pwa.iosTitle}
              iosSteps={t.pwa.iosSteps}
              closeLabel={t.pwa.closeLabel}
            />
          </div>
        </div>
      </footer>

      {/* Swipeable iOS Bottom Sheet for Scam Pattern Quick Actions */}
      <BottomSheet
        open={Boolean(selectedPattern)}
        onClose={() => setSelectedPattern(null)}
        title={selectedPattern?.title ?? ''}
        titleId="scam-pattern-sheet-title"
        closeLabel={t.pwa.closeLabel}
      >
        {selectedPattern && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-cyber-primary">
              {selectedPattern.desc}
            </p>
            <p className="rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-3.5 text-xs leading-relaxed text-cyber-secondary">
              {t.home.callBannerSub}
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => {
                  setSelectedPattern(null);
                  onNavigate('/sos');
                }}
                {...TACTILE_BUTTON_MOTION}
                className="cta-primary inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.home.primaryCta}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setSelectedPattern(null);
                  onNavigate('/check');
                }}
                {...TACTILE_BUTTON_MOTION}
                className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-4 py-2.5 text-sm font-semibold text-cyber-primary hover:border-[#D4AF37]/50"
              >
                <Search className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.home.secondaryCta}</span>
              </motion.button>
            </div>
            <motion.a
              href="tel:1930"
              {...TACTILE_BUTTON_MOTION}
              className="font-mono-cyber inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/14 px-4 py-2 text-sm font-bold text-[#F5E6B8] hover:bg-[#D4AF37]/24"
            >
              <PhoneCall className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.home.callNowLabel}</span>
            </motion.a>
          </div>
        )}
      </BottomSheet>
    </div>
  );
});

export default HomePage;
