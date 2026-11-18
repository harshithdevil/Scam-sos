import { memo, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Cpu,
  HelpCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import type {
  CheckApiResponse,
  Language,
  RiskLevel,
  RoutePath,
} from '../types';
import type { TranslationBundle } from '../i18n/translations';
import {
  analyzeMessageRuleBased,
  getCategoryLabel,
  highlightMessageSegments,
  MAX_MESSAGE_LENGTH,
  validateMessageInput,
} from '../utils/scamDetector';
import {
  createBrowserStore,
  recordClientCheck,
} from '../utils/rateLimiter';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { DisclaimerBanner } from './DisclaimerBanner';
import {
  BADGE_POP_SPRING,
  IOS_SPRING,
  LIST_STAGGER_DELAY,
  TACTILE_BUTTON_MOTION,
} from './MotionPrimitives';

interface CheckPageProps {
  language: Language;
  t: TranslationBundle;
  onNavigate: (path: RoutePath) => void;
}

const RISK_STYLES: Record<
  RiskLevel,
  { badgeClass: string; Icon: typeof ShieldAlert }
> = {
  Critical: {
    badgeClass: 'border-[#F43F5E]/45 bg-[#F43F5E]/15 text-[#F43F5E]',
    Icon: ShieldAlert,
  },
  High: {
    badgeClass: 'border-[#FB923C]/45 bg-[#FB923C]/15 text-[#FB923C]',
    Icon: AlertTriangle,
  },
  Medium: {
    badgeClass: 'border-[#FBBF24]/45 bg-[#FBBF24]/15 text-[#FBBF24]',
    Icon: AlertTriangle,
  },
  Low: {
    badgeClass: 'border-[#34D399]/40 bg-[#34D399]/12 text-[#34D399]',
    Icon: ShieldCheck,
  },
  Unknown: {
    badgeClass: 'border-[#A8A29A]/40 bg-[#A8A29A]/12 text-[#A8A29A]',
    Icon: HelpCircle,
  },
};

export const CheckPage = memo(function CheckPage({ language, t, onNavigate }: CheckPageProps) {
  const isOnline = useOnlineStatus();
  const [messageText, setMessageText] = useState('');
  const [analyzedMessage, setAnalyzedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<CheckApiResponse | null>(null);
  const [offlineAnalyzed, setOfflineAnalyzed] = useState(false);

  const rateStore = useMemo(() => createBrowserStore(), []);

  function runOfflineFallback(text: string) {
    const localResult = analyzeMessageRuleBased(text, language);
    setAnalyzedMessage(text);
    setApiResponse({
      mode: 'fallback',
      fallbackReason: 'api_error',
      result: localResult,
    });
    setOfflineAnalyzed(true);
  }

  async function handleAnalyze(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setOfflineAnalyzed(false);

    const validation = validateMessageInput(messageText);
    if (!validation.valid) {
      const code = validation.errorCode ?? 'empty';
      setErrorMsg(t.check.errors[code]);
      return;
    }

    const rateStatus = recordClientCheck(rateStore);
    if (!rateStatus.allowed) {
      setErrorMsg(t.check.errors.rate_limited);
      return;
    }

    if (!isOnline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      runOfflineFallback(messageText);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/check-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          language,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        if (errData.error === 'empty' || errData.error === 'too_short' || errData.error === 'too_long') {
          setErrorMsg(t.check.errors[errData.error]);
        } else {
          runOfflineFallback(messageText);
        }
        return;
      }

      const data = (await res.json()) as CheckApiResponse;
      setAnalyzedMessage(messageText);
      setApiResponse(data);
    } catch {
      runOfflineFallback(messageText);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessageText('');
    setAnalyzedMessage('');
    setErrorMsg(null);
    setApiResponse(null);
    setOfflineAnalyzed(false);
  }

  function handlePickSample(text: string) {
    setMessageText(text);
    setErrorMsg(null);
  }

  const charCount = messageText.length;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;

  const segments = useMemo(() => {
    if (!apiResponse) return [];
    return highlightMessageSegments(
      analyzedMessage,
      apiResponse.result.flaggedPhrases
    );
  }, [analyzedMessage, apiResponse]);

  const result = apiResponse?.result;
  const riskMeta = result ? RISK_STYLES[result.riskLevel] : null;
  const RiskIcon = riskMeta?.Icon ?? HelpCircle;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-cyber-primary sm:text-4xl">
          {t.check.title}
        </h1>
        <p className="text-sm leading-relaxed text-cyber-secondary sm:text-base">
          {t.check.subtitle}
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleAnalyze} className="glass-surface-elevated space-y-5 rounded-[20px] p-6 sm:p-7">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="scam-message-input"
              className="text-sm font-semibold text-cyber-primary"
            >
              {t.check.inputLabel}
            </label>
            <span
              className={`tabular-nums text-xs ${
                isOverLimit ? 'font-semibold text-[#F43F5E]' : 'text-cyber-secondary'
              }`}
            >
              {charCount.toLocaleString('en-IN')} / {MAX_MESSAGE_LENGTH.toLocaleString('en-IN')}
            </span>
          </div>

          <textarea
            id="scam-message-input"
            rows={5}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={t.check.placeholder}
            aria-describedby="check-char-hint"
            className="cyber-input w-full rounded-[20px] px-4 py-3 text-sm leading-relaxed sm:text-base"
          />

          <p id="check-char-hint" className="text-xs text-cyber-secondary">
            {t.check.charLimitHint} · {t.check.rateLimitNote}
          </p>
        </div>

        {/* Sample Data Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-cyber-secondary">
            <span>{t.check.sampleHeading}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#D4AF37]">
              {t.check.sampleBadge}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.check.samples.map((sample) => (
              <motion.button
                key={sample.id}
                type="button"
                onClick={() => handlePickSample(sample.text)}
                {...TACTILE_BUTTON_MOTION}
                className="min-h-[40px] rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-3.5 py-1.5 text-xs font-medium text-cyber-primary transition-colors hover:border-[#D4AF37]/50 hover:text-[#F5E6B8] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                {sample.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-start gap-2.5 rounded-xl border border-[#F43F5E]/45 bg-[#F43F5E]/12 px-4 py-3 text-sm text-[#F5F2EA]"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F43F5E]" aria-hidden="true" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            type="submit"
            disabled={loading}
            {...TACTILE_BUTTON_MOTION}
            className="cta-primary inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-bold hover:brightness-105 disabled:opacity-75 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loading ? t.check.analyzingBtn : t.check.analyzeBtn}</span>
          </motion.button>

          {messageText.length > 0 && (
            <motion.button
              type="button"
              onClick={handleClear}
              disabled={loading}
              {...TACTILE_BUTTON_MOTION}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-4 py-2.5 text-sm font-medium text-cyber-secondary transition-colors hover:border-[#D4AF37]/40 hover:text-cyber-primary focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>{t.check.clearBtn}</span>
            </motion.button>
          )}
        </div>
      </form>

      {/* Soft Shimmer Skeleton Loading State */}
      {loading && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label={t.check.analyzingBtn}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="glass-surface-elevated space-y-5 rounded-[20px] p-6 sm:p-7"
        >
          <span className="sr-only">{t.check.analyzingBtn}</span>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border-glass)] pb-4">
            <div className="shimmer-bar h-7 w-36 rounded-lg" />
            <div className="shimmer-bar h-7 w-32 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="shimmer-bar h-3 w-24 rounded" />
            <div className="shimmer-bar h-7 w-56 rounded-lg" />
          </div>
          <div className="shimmer-bar h-20 w-full rounded-xl" />
          <div className="space-y-2.5">
            <div className="shimmer-bar h-4 w-11/12 rounded" />
            <div className="shimmer-bar h-4 w-4/5 rounded" />
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !apiResponse && !errorMsg && (
        <div className="glass-surface rounded-[20px] p-6 text-center sm:p-8">
          <h2 className="font-display text-lg font-bold text-cyber-primary">
            {t.check.emptyStateTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-cyber-secondary">
            {t.check.emptyStateDesc}
          </p>
        </div>
      )}

      {/* Result State with Staggered Reveal & Risk Badge Pop */}
      {!loading && apiResponse && result && riskMeta && (
        <section aria-live="polite" className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-surface-elevated space-y-6 rounded-[20px] p-6 sm:p-7"
          >
            {/* Top Mode & Risk Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-glass)] pb-4">
              <div
                data-testid="analysis-mode-badge"
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  apiResponse.mode === 'ai'
                    ? 'border-[#D4AF37]/45 bg-[#D4AF37]/14 text-[#F5E6B8]'
                    : 'border-[#FBBF24]/40 bg-[#FBBF24]/12 text-[#FBBF24]'
                }`}
              >
                {apiResponse.mode === 'ai' ? (
                  <Cpu className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                ) : (
                  <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>
                  {apiResponse.mode === 'ai'
                    ? t.check.modeBadges.ai
                    : t.check.modeBadges.fallback}
                </span>
              </div>

              {/* Risk Level Badge with Exact Spec Colors & Gentle Pop (never "safe") */}
              <motion.div
                key={`${result.riskLevel}-${analyzedMessage.slice(0, 16)}`}
                data-testid="risk-level-badge"
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={BADGE_POP_SPRING}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold ${riskMeta.badgeClass}`}
              >
                <RiskIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {t.check.resultLabels.riskLevel}: {t.check.riskLabels[result.riskLevel]}
                </span>
              </motion.div>
            </div>

            {apiResponse.mode === 'fallback' && (
              <p className="text-xs leading-relaxed text-[#FBBF24]">
                {offlineAnalyzed || !isOnline
                  ? t.offlineCheckNote
                  : apiResponse.fallbackReason === 'api_error'
                    ? t.check.modeBadges.fallbackApiNote
                    : t.check.modeBadges.fallbackNoKeyNote}
              </p>
            )}

            {/* Scam Type */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_SPRING, delay: LIST_STAGGER_DELAY }}
              className="space-y-1"
            >
              <p className="text-xs font-medium text-cyber-secondary">
                {t.check.resultLabels.scamType}
              </p>
              <h2 className="font-display text-xl font-bold text-cyber-primary sm:text-2xl">
                {getCategoryLabel(result.scamType, language)}
              </h2>
            </motion.div>

            {/* Highlighted Message */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_SPRING, delay: LIST_STAGGER_DELAY * 2 }}
              className="space-y-2"
            >
              <p className="text-xs font-medium text-cyber-secondary">
                {t.check.resultLabels.highlightedText}
              </p>
              <div className="rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4 text-sm leading-relaxed text-cyber-primary break-words">
                {segments.map((seg, i) =>
                  seg.flagged ? (
                    <mark
                      key={i}
                      className="mx-0.5 rounded bg-[#F43F5E]/25 px-1 py-0.5 font-semibold text-[#F5F2EA] underline decoration-[#F43F5E] decoration-2 underline-offset-2"
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  )
                )}
              </div>
              {result.flaggedPhrases.length === 0 && (
                <p className="text-xs text-cyber-secondary">{t.check.resultLabels.noPhrases}</p>
              )}
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_SPRING, delay: LIST_STAGGER_DELAY * 3 }}
              className="space-y-1.5"
            >
              <h3 className="text-sm font-semibold text-[#F5E6B8]">
                {t.check.resultLabels.explanation}
              </h3>
              <p className="text-sm leading-relaxed text-cyber-primary">
                {result.explanation}
              </p>
            </motion.div>

            {/* Staggered Advice Items (<=30ms each) */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#F5E6B8]">
                {t.check.resultLabels.advice}
              </h3>
              <ul className="space-y-2">
                {result.advice.map((tip, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...IOS_SPRING,
                      delay: Math.min((idx + 4) * LIST_STAGGER_DELAY, 0.2),
                    }}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-cyber-primary"
                  >
                    <span className="tabular-nums mt-1 text-xs font-bold text-[#D4AF37]">
                      0{idx + 1}
                    </span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Escalate to SOS */}
            <div className="border-t border-[var(--border-glass)] pt-4">
              <motion.button
                type="button"
                onClick={() => onNavigate('/sos')}
                {...TACTILE_BUTTON_MOTION}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/14 px-4 py-2.5 text-sm font-semibold text-[#F5E6B8] transition-colors hover:bg-[#D4AF37]/24 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <span>{t.check.resultLabels.nextActionCta}</span>
                <ArrowRight className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>

          <DisclaimerBanner text={t.disclaimer} />
        </section>
      )}
    </div>
  );
});

export default CheckPage;
