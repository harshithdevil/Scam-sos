import { memo } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Home,
  Search,
  AlertTriangle,
  BookOpen,
  Info,
  Settings,
  UserRound,
} from 'lucide-react';
import type { Language, RoutePath } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import { IOS_SPRING, TAB_SPRING } from './MotionPrimitives';

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSettings: () => void;
  t: TranslationBundle;
}

const LANG_OPTIONS: Array<{ code: Language; label: string; ariaLabel: string }> = [
  { code: 'en', label: 'EN', ariaLabel: 'Switch language to English' },
  { code: 'hi', label: 'हिन्दी', ariaLabel: 'Switch language to Hindi' },
  { code: 'te', label: 'తెలుగు', ariaLabel: 'Switch language to Telugu' },
];

export const Navbar = memo(function Navbar({
  currentPath,
  onNavigate,
  language,
  onLanguageChange,
  onOpenSettings,
  t,
}: NavbarProps) {
  const { user, consent, openReportingProfile } = useReportingProfile();

  const navItems: Array<{ path: RoutePath; label: string; icon: typeof Home }> = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/sos', label: t.nav.sos, icon: AlertTriangle },
    { path: '/check', label: t.nav.check, icon: Search },
    { path: '/resources', label: t.nav.resources, icon: BookOpen },
    { path: '/about', label: t.nav.about, icon: Info },
  ];

  return (
    <>
      <header className="glass-nav sticky top-0 z-40 h-14 border-b print:hidden">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 px-3 sm:gap-6 sm:px-6">
          {/* Zone 1: Brand Wordmark */}
          <motion.a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            transition={IOS_SPRING}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-base font-bold tracking-tight text-cyber-primary sm:gap-2.5 sm:text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            <ShieldAlert className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            <span className="font-display">{t.brand}</span>
          </motion.a>

          {/* Zone 2: Desktop Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 md:flex"
          >
            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <motion.a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path);
                  }}
                  aria-current={active ? 'page' : undefined}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -1 }}
                  transition={IOS_SPRING}
                  className={`relative shrink-0 whitespace-nowrap py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] ${
                    active ? 'text-[#F5E6B8]' : 'text-cyber-secondary hover:text-cyber-primary'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="top-nav-active-indicator"
                      transition={TAB_SPRING}
                      aria-hidden="true"
                      className="nav-active-glow absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#D4AF37]"
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher + Reporting Profile + Settings */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div
              role="group"
              aria-label="Language selector"
              className="flex shrink-0 items-center rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] p-0.5"
            >
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
                    className={`relative min-h-[34px] shrink-0 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors duration-150 sm:px-2.5 sm:text-xs focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                      active
                        ? 'text-[#0B0B0F]'
                        : 'text-cyber-secondary hover:text-cyber-primary'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lang-pill-highlight"
                        transition={TAB_SPRING}
                        aria-hidden="true"
                        className="cta-primary absolute inset-0 rounded-lg"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              type="button"
              onClick={openReportingProfile}
              aria-label={t.profile.navBtnLabel}
              title={t.profile.navBtnLabel}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              transition={IOS_SPRING}
              className="relative flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-2.5 text-xs font-semibold text-[#F5E6B8] transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <UserRound className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span className="hidden lg:inline">{t.profile.navBtnLabel}</span>
              {(user || consent === 'allowed') && (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
                />
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onOpenSettings}
              aria-label={t.settings.buttonLabel}
              title={t.settings.buttonLabel}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -1 }}
              transition={IOS_SPRING}
              className="flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] text-cyber-secondary transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Zone Navigation with Shared Gliding Active Indicator */}
      <nav
        aria-label="Mobile navigation"
        className="glass-nav fixed bottom-0 left-0 right-0 z-40 grid h-14 grid-cols-5 border-t px-1 md:hidden print:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.path;
          return (
            <motion.a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
              }}
              aria-current={active ? 'page' : undefined}
              whileTap={{ scale: 0.96 }}
              transition={IOS_SPRING}
              className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-medium transition-colors ${
                active ? 'text-[#F5E6B8]' : 'text-cyber-secondary hover:text-cyber-primary'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-active-indicator"
                  transition={TAB_SPRING}
                  aria-hidden="true"
                  className="nav-active-glow absolute inset-x-1.5 inset-y-1 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/14"
                />
              )}
              <Icon
                className={`relative z-10 h-4 w-4 shrink-0 ${active ? 'text-[#D4AF37]' : ''}`}
                aria-hidden="true"
              />
              <span className="relative z-10 max-w-full truncate">{item.label}</span>
            </motion.a>
          );
        })}
      </nav>
    </>
  );
});
