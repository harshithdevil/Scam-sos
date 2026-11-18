import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimate,
  useReducedMotion,
} from 'motion/react';
import type { Language, RoutePath } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { ReportingProfileProvider } from './context/ReportingProfileContext';
import { AmbientOrbs } from './components/AmbientOrbs';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { PAGE_TRANSITION } from './components/MotionPrimitives';

// Lazy-loaded pages & modal sheets for lightweight mobile initial bundle
const HomePage = lazy(() => import('./components/HomePage'));
const CheckPage = lazy(() => import('./components/CheckPage'));
const SosPage = lazy(() => import('./components/SosPage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const SettingsSheet = lazy(() =>
  import('./components/SettingsSheet').then((m) => ({ default: m.SettingsSheet }))
);
const ConsentSheet = lazy(() =>
  import('./components/ConsentSheet').then((m) => ({ default: m.ConsentSheet }))
);
const ReportingProfileSheet = lazy(() =>
  import('./components/ReportingProfileSheet').then((m) => ({
    default: m.ReportingProfileSheet,
  }))
);

const VALID_PATHS: RoutePath[] = ['/', '/check', '/sos', '/resources', '/about'];

function normalizePath(pathname: string): RoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return VALID_PATHS.includes(clean as RoutePath) ? (clean as RoutePath) : '/';
}

function PageShimmerFallback() {
  return (
    <div className="mx-auto max-w-4xl space-y-5 py-6">
      <div className="shimmer-bar h-8 w-56 rounded-xl" />
      <div className="shimmer-bar h-40 w-full rounded-[20px]" />
      <div className="shimmer-bar h-28 w-full rounded-[20px]" />
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('scam_sos_lang')
          : null;
      if (saved === 'en' || saved === 'hi' || saved === 'te') return saved;
    } catch {
      // Ignore storage failures
    }
    return 'en';
  });

  const [ultraDark, setUltraDark] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined'
        ? window.localStorage.getItem('scam_sos_ultra_dark') === 'true'
        : false;
    } catch {
      return false;
    }
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const [langScope, animateLang] = useAnimate();
  const prevLangRef = useRef<Language>(language);

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(normalizePath(window.location.pathname));
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('scam_sos_ultra_dark', String(ultraDark));
    } catch {
      // Ignore storage failures
    }
    document.documentElement.classList.toggle('ultra-dark', ultraDark);
  }, [ultraDark]);

  useEffect(() => {
    try {
      window.localStorage.setItem('scam_sos_lang', language);
    } catch {
      // Ignore storage failures
    }
    document.documentElement.lang = language;

    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      if (!prefersReducedMotion && langScope.current) {
        animateLang(
          langScope.current,
          { opacity: [0.48, 1] },
          { duration: 0.18, ease: 'easeOut' }
        );
      }
    }
  }, [language, prefersReducedMotion, langScope, animateLang]);

  const navigate = useCallback(
    (path: RoutePath) => {
      if (path !== currentPath) {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
      }
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    },
    [currentPath, prefersReducedMotion]
  );

  const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setSettingsOpen(false), []);
  const handleToggleUltraDark = useCallback(() => setUltraDark((prev) => !prev), []);

  const t = TRANSLATIONS[language];

  return (
    <MotionConfig reducedMotion="user">
      <ReportingProfileProvider>
        <div className="relative min-h-screen bg-[var(--bg-base)] text-cyber-primary print:bg-white print:text-slate-900">
          <AmbientOrbs ultraDark={ultraDark} />

          <div className="relative z-10">
            <Navbar
              currentPath={currentPath}
              onNavigate={navigate}
              language={language}
              onLanguageChange={setLanguage}
              onOpenSettings={handleOpenSettings}
              t={t}
            />

            <OfflineBanner message={t.offlineBanner} />

            <main
              ref={langScope}
              className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 md:pb-12 print:px-0 print:py-4"
            >
              <Suspense fallback={<PageShimmerFallback />}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentPath}
                    initial={PAGE_TRANSITION.initial}
                    animate={PAGE_TRANSITION.animate}
                    exit={PAGE_TRANSITION.exit}
                    transition={PAGE_TRANSITION.transition}
                  >
                    {currentPath === '/' && <HomePage onNavigate={navigate} t={t} />}
                    {currentPath === '/check' && (
                      <CheckPage language={language} t={t} onNavigate={navigate} />
                    )}
                    {currentPath === '/sos' && <SosPage language={language} t={t} />}
                    {currentPath === '/resources' && (
                      <ResourcesPage t={t} onNavigate={navigate} />
                    )}
                    {currentPath === '/about' && <AboutPage t={t} />}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </main>
          </div>

          <Suspense fallback={null}>
            <SettingsSheet
              open={settingsOpen}
              onClose={handleCloseSettings}
              ultraDark={ultraDark}
              onToggleUltraDark={handleToggleUltraDark}
              language={language}
              onLanguageChange={setLanguage}
              t={t}
            />
            <ConsentSheet t={t} />
            <ReportingProfileSheet t={t} />
          </Suspense>
        </div>
      </ReportingProfileProvider>
    </MotionConfig>
  );
}
