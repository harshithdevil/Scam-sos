import { memo, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Cloud,
  Copy,
  ExternalLink,
  HardDrive,
  PhoneCall,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';
import type {
  Language,
  SosFormData,
  SosIncidentType,
  SosTimeWindow,
} from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { useReportingProfile } from '../context/ReportingProfileContext';
import {
  generateSosPlan,
  INCIDENT_LABELS,
  TIME_WINDOW_LABELS,
  validateSosInput,
} from '../utils/sosGenerator';
import { DisclaimerBanner } from './DisclaimerBanner';
import { AiImproveModal } from './AiImproveModal';
import {
  CHECK_SPRING,
  IOS_SPRING,
  LIST_STAGGER_DELAY,
  TACTILE_BUTTON_MOTION,
} from './MotionPrimitives';

interface SosPageProps {
  language: Language;
  t: TranslationBundle;
}

const INCIDENT_ORDER: SosIncidentType[] = [
  'shared_otp',
  'paid_upi',
  'clicked_link',
  'shared_card',
  'account_hacked',
  'other',
];

const TIME_ORDER: SosTimeWindow[] = [
  'under_15m',
  '15m_to_1h',
  '1h_to_6h',
  'over_6h',
];

export const SosPage = memo(function SosPage({ language, t }: SosPageProps) {
  const {
    consent,
    profile,
    storageLocation,
    openReportingProfile,
    deleteAllMyData,
  } = useReportingProfile();

  const activeProfile = consent === 'allowed' ? profile : undefined;
  const hasAnyProfileData = useMemo(
    () =>
      Boolean(
        activeProfile &&
          Object.values(activeProfile).some((val) => typeof val === 'string' && val.trim().length > 0)
      ),
    [activeProfile]
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<SosFormData>({
    incidents: [],
    amountLost: '',
    timeSince: 'under_15m',
  });
  const [validationErrors, setValidationErrors] = useState<{
    incidents?: boolean;
    amount?: 'required' | 'invalid';
  }>({});

  // Prefill Step 1 amountLost from saved Reporting Profile only if user hasn't typed an amount yet
  useEffect(() => {
    if (consent === 'allowed' && profile.amountLost && !formData.amountLost.trim()) {
      setFormData((prev) => ({ ...prev, amountLost: profile.amountLost }));
    }
  }, [consent, profile.amountLost, formData.amountLost]);

  const generated = useMemo(
    () => generateSosPlan(formData, language, activeProfile),
    [formData, language, activeProfile]
  );

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailEditedByUser, setEmailEditedByUser] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAppliedBanner, setAiAppliedBanner] = useState(false);

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [checkedEvidence, setCheckedEvidence] = useState<Record<string, boolean>>({});

  // Support ?autostart=1 to open Step 2 directly with a deterministic sample if requested
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && step === 1 && formData.incidents.length === 0) {
      const sample: SosFormData = {
        incidents: ['paid_upi', 'shared_otp'],
        amountLost: '15000',
        timeSince: 'under_15m',
      };
      setFormData(sample);
      const plan = generateSosPlan(sample, language, activeProfile);
      setEmailSubject(plan.emailSubject);
      setEmailBody(plan.emailBody);
      setStep(2);
    }
  }, []);

  // Keep email synchronized when language or saved profile changes unless manually edited
  useEffect(() => {
    if (step === 2 && !emailEditedByUser) {
      setEmailSubject(generated.emailSubject);
      setEmailBody(generated.emailBody);
    }
  }, [generated.emailSubject, generated.emailBody, step, emailEditedByUser]);

  function toggleIncident(incident: SosIncidentType) {
    setFormData((prev) => {
      const exists = prev.incidents.includes(incident);
      const next = exists
        ? prev.incidents.filter((i) => i !== incident)
        : [...prev.incidents, incident];
      return { ...prev, incidents: next };
    });
    if (validationErrors.incidents) {
      setValidationErrors((prev) => ({ ...prev, incidents: false }));
    }
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const check = validateSosInput(formData);
    if (!check.valid) {
      setValidationErrors({
        incidents: Boolean(check.errors.incidents),
        amount: check.errors.amountLost,
      });
      return;
    }

    const plan = generateSosPlan(formData, language, activeProfile);
    setEmailSubject(plan.emailSubject);
    setEmailBody(plan.emailBody);
    setEmailEditedByUser(false);
    setAiAppliedBanner(false);
    setValidationErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleResetEmail() {
    setEmailSubject(generated.emailSubject);
    setEmailBody(generated.emailBody);
    setEmailEditedByUser(false);
    setAiAppliedBanner(false);
  }

  async function copyToClipboard(text: string, type: 'script' | 'email') {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }

    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  }

  function toggleEvidence(id: string) {
    setCheckedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const evidenceDoneCount = generated.evidenceItems.filter(
    (item) => checkedEvidence[item.id]
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header & Step Progress */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-glass)] pb-5 sm:flex-row sm:items-end print:border-slate-300">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-wide text-[#D4AF37] print:text-slate-700">
            {t.tagline}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-cyber-primary sm:text-4xl print-text-dark">
            {t.sos.title}
          </h1>
          <p className="text-sm text-cyber-secondary print-muted-dark">{t.sos.subtitle}</p>
        </div>

        {/* Interactive Step Switcher */}
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] p-1 print:hidden">
          <motion.button
            type="button"
            onClick={() => setStep(1)}
            whileTap={{ scale: 0.96 }}
            transition={IOS_SPRING}
            className={`min-h-[38px] whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              step === 1
                ? 'cta-primary'
                : 'text-cyber-secondary hover:text-cyber-primary'
            }`}
          >
            {t.sos.step1Label}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => {
              const check = validateSosInput(formData);
              if (check.valid) {
                const plan = generateSosPlan(formData, language, activeProfile);
                setEmailSubject(plan.emailSubject);
                setEmailBody(plan.emailBody);
                setStep(2);
              } else {
                setValidationErrors({
                  incidents: Boolean(check.errors.incidents),
                  amount: check.errors.amountLost,
                });
              }
            }}
            whileTap={{ scale: 0.96 }}
            transition={IOS_SPRING}
            className={`min-h-[38px] whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold ${
              step === 2
                ? 'cta-primary'
                : 'text-cyber-secondary hover:text-cyber-primary'
            }`}
          >
            {t.sos.step2Label}
          </motion.button>
        </div>
      </div>

      {/* Honesty Notice & Optional Reporting Profile Quick Bar */}
      <div className="glass-surface flex flex-col justify-between gap-3 rounded-[20px] p-4 sm:flex-row sm:items-center print:hidden">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#F5E6B8]">{t.profile.title}</span>
            {storageLocation === 'account' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-2 py-0.5 text-[11px] font-medium text-[#F5E6B8]">
                <Cloud className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.profile.storageAccountBadge}</span>
              </span>
            )}
            {storageLocation === 'device' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#D4AF37]/35 bg-[#D4AF37]/12 px-2 py-0.5 text-[11px] font-medium text-[#F5E6B8]">
                <HardDrive className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.profile.storageDeviceBadge}</span>
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-cyber-secondary">
            {t.profile.honestyNotice}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <motion.button
            type="button"
            onClick={openReportingProfile}
            {...TACTILE_BUTTON_MOTION}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/14 px-3.5 py-1.5 text-xs font-semibold text-[#F5E6B8] hover:bg-[#D4AF37]/24"
          >
            <UserRound className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.profile.openProfileCta}</span>
          </motion.button>

          {hasAnyProfileData && (
            <motion.button
              type="button"
              onClick={deleteAllMyData}
              {...TACTILE_BUTTON_MOTION}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-3 py-1.5 text-xs font-semibold text-[#F43F5E] hover:bg-[#F43F5E]/20"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.profile.deleteBtn}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* STEP 1: Guided Input Form */}
      {step === 1 && (
        <motion.form
          onSubmit={handleGenerate}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="glass-surface-elevated space-y-7 rounded-[20px] p-6 sm:p-8"
        >
          {/* 1. Incident Chips */}
          <fieldset className="space-y-3">
            <legend className="text-base font-bold text-cyber-primary">
              {t.sos.whatHappenedLabel}
            </legend>
            <p className="text-xs text-cyber-secondary">{t.sos.whatHappenedHint}</p>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {INCIDENT_ORDER.map((inc) => {
                const selected = formData.incidents.includes(inc);
                return (
                  <motion.button
                    key={inc}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleIncident(inc)}
                    {...TACTILE_BUTTON_MOTION}
                    className={`flex min-h-[50px] items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                      selected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/16 text-cyber-primary'
                        : 'border-[var(--border-glass)] bg-[var(--surface-input)] text-cyber-secondary hover:border-[#D4AF37]/50 hover:text-cyber-primary'
                    }`}
                  >
                    <span>{INCIDENT_LABELS[language][inc]}</span>
                    {selected && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={CHECK_SPRING}
                      >
                        <Check className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {validationErrors.incidents && (
              <p role="alert" className="flex items-center gap-2 text-xs font-medium text-[#F43F5E]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t.sos.validationErrors.incidentsRequired}</span>
              </p>
            )}
          </fieldset>

          {/* 2. Amount Lost */}
          <div className="space-y-2.5">
            <label htmlFor="sos-amount-input" className="block text-base font-bold text-cyber-primary">
              {t.sos.amountLabel}
            </label>
            <div className="relative max-w-md">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-[#D4AF37]"
              >
                ₹
              </span>
              <input
                id="sos-amount-input"
                type="text"
                inputMode="numeric"
                value={formData.amountLost}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d.,]/g, '');
                  setFormData((prev) => ({ ...prev, amountLost: cleaned }));
                  if (validationErrors.amount) {
                    setValidationErrors((prev) => ({ ...prev, amount: undefined }));
                  }
                }}
                placeholder={t.sos.amountPlaceholder}
                className="cyber-input tabular-nums min-h-[48px] w-full rounded-xl py-3 pl-9 pr-4 text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {t.sos.amountPresets.map((preset) => (
                <motion.button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, amountLost: preset }));
                    setValidationErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  {...TACTILE_BUTTON_MOTION}
                  className="tabular-nums min-h-[38px] rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-3.5 py-1 text-xs font-medium text-cyber-primary transition-colors hover:border-[#D4AF37]/50 hover:text-[#F5E6B8]"
                >
                  ₹{Number(preset).toLocaleString('en-IN')}
                </motion.button>
              ))}
            </div>

            {validationErrors.amount && (
              <p role="alert" className="flex items-center gap-2 text-xs font-medium text-[#F43F5E]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {validationErrors.amount === 'required'
                    ? t.sos.validationErrors.amountRequired
                    : t.sos.validationErrors.amountInvalid}
                </span>
              </p>
            )}
          </div>

          {/* 3. Time Since Incident */}
          <fieldset className="space-y-3">
            <legend className="text-base font-bold text-cyber-primary">
              {t.sos.timeSinceLabel}
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {TIME_ORDER.map((win) => {
                const selected = formData.timeSince === win;
                return (
                  <motion.button
                    key={win}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFormData((prev) => ({ ...prev, timeSince: win }))}
                    {...TACTILE_BUTTON_MOTION}
                    className={`min-h-[48px] rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                      selected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/16 text-cyber-primary'
                        : 'border-[var(--border-glass)] bg-[var(--surface-input)] text-cyber-secondary hover:border-[#D4AF37]/50 hover:text-cyber-primary'
                    }`}
                  >
                    {TIME_WINDOW_LABELS[language][win]}
                  </motion.button>
                );
              })}
            </div>
          </fieldset>

          <div className="pt-2">
            <motion.button
              type="submit"
              {...TACTILE_BUTTON_MOTION}
              className="cta-primary inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold hover:brightness-105 sm:w-auto focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              <span>{t.sos.generateBtn}</span>
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* STEP 2: Polished Obsidian & Gold SOS Response Kit */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Toolbar: Edit + Print / PDF */}
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <motion.button
              type="button"
              onClick={() => setStep(1)}
              {...TACTILE_BUTTON_MOTION}
              className="glass-surface inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-cyber-primary transition-colors hover:border-[#D4AF37]/45"
            >
              <ArrowLeft className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.sos.editInputsBtn}</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => window.print()}
              {...TACTILE_BUTTON_MOTION}
              className="cta-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold hover:brightness-105"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>{t.sos.printPdfBtn}</span>
            </motion.button>
          </div>

          {/* Contextual Golden Hour Note */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="glass-surface-elevated rounded-[20px] p-5 text-sm leading-relaxed text-cyber-primary sm:p-6 print:text-slate-800"
          >
            {generated.urgencyNote}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Stacked Timeline + Call Script + Evidence Checklist */}
            <div className="space-y-6 lg:col-span-6">
              {/* a) Action Plan as Stacked Timeline */}
              <section className="glass-surface space-y-5 rounded-[20px] p-6 sm:p-7">
                <div>
                  <h2 className="font-display text-xl font-bold text-cyber-primary print-text-dark">
                    {t.sos.step2Sections.actionPlanTitle}
                  </h2>
                  <p className="mt-1 text-xs text-cyber-secondary print-muted-dark">
                    {t.sos.step2Sections.actionPlanSub}
                  </p>
                </div>

                <div className="relative pl-11">
                  <div
                    aria-hidden="true"
                    className="sos-timeline-line absolute bottom-6 left-[15px] top-4 w-[1.5px] print:bg-slate-300 print:shadow-none"
                  />

                  <ol className="space-y-6">
                    {generated.steps.map((action, idx) => {
                      const isFirst = idx === 0;
                      const isTel = action.actionHref?.startsWith('tel:');
                      return (
                        <motion.li
                          key={action.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
                          className="relative"
                        >
                          <span
                            className={`tabular-nums absolute -left-11 top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold print:border print:border-slate-400 print:bg-slate-200 print:text-slate-900 ${
                              isFirst
                                ? 'cta-primary'
                                : 'border border-[#D4AF37]/40 bg-[#12121A] text-[#F5E6B8]'
                            }`}
                          >
                            0{action.priority}
                          </span>

                          <div className="space-y-2 border-b border-[var(--border-glass)] pb-5 last:border-b-0 last:pb-0">
                            <h3 className="text-sm font-bold text-cyber-primary sm:text-base print-text-dark">
                              {action.title}
                            </h3>
                            <p className="text-xs leading-relaxed text-cyber-secondary sm:text-sm print-muted-dark">
                              {action.summary}
                            </p>
                            {action.actionHref && action.actionLabel && (
                              <motion.a
                                href={action.actionHref}
                                target={action.actionHref.startsWith('http') ? '_blank' : undefined}
                                rel={
                                  action.actionHref.startsWith('http')
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                {...TACTILE_BUTTON_MOTION}
                                className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors print:hidden ${
                                  isTel
                                    ? 'font-mono-cyber border-[#D4AF37]/45 bg-[#D4AF37]/14 text-[#F5E6B8] hover:bg-[#D4AF37]/24'
                                    : 'border-[var(--border-glass)] bg-[var(--surface-input)] text-[#F5E6B8] hover:border-[#D4AF37]/50'
                                }`}
                              >
                                {isTel ? (
                                  <PhoneCall className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                                ) : (
                                  <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                                )}
                                <span>{action.actionLabel}</span>
                              </motion.a>
                            )}
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
              </section>

              {/* c) 30-second 1930 Call Script */}
              <section className="glass-surface space-y-3 rounded-[20px] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-bold tracking-tight text-[#F5E6B8] sm:text-lg print-text-dark">
                      {t.sos.step2Sections.callScriptTitle}
                    </h2>
                    <p className="mt-1 text-xs text-cyber-secondary print-muted-dark">
                      {t.sos.step2Sections.callScriptSub}
                    </p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => copyToClipboard(generated.callScript, 'script')}
                    {...TACTILE_BUTTON_MOTION}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D4AF37]/40 bg-[var(--surface-input)] px-3 py-1.5 text-xs font-semibold text-[#F5E6B8] transition-colors hover:bg-[#D4AF37]/16 print:hidden"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
                        <span>{t.sos.step2Sections.copiedLabel}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                        <span>{t.sos.step2Sections.copyScriptBtn}</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <blockquote className="rounded-[20px] border border-[var(--border-glass)] bg-[var(--surface-input)] p-4 text-sm leading-relaxed text-cyber-primary print:border-slate-300 print:bg-slate-50 print:text-slate-900">
                  {generated.callScript}
                </blockquote>
              </section>

              {/* d) Evidence Checklist */}
              <section className="glass-surface space-y-3 rounded-[20px] p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold text-cyber-primary print-text-dark">
                      {t.sos.step2Sections.evidenceTitle}
                    </h2>
                    <p className="mt-1 text-xs text-cyber-secondary print-muted-dark">
                      {t.sos.step2Sections.evidenceSub}
                    </p>
                  </div>
                  <span className="tabular-nums shrink-0 whitespace-nowrap text-xs font-semibold text-[#D4AF37] print:text-slate-700">
                    {evidenceDoneCount}/{generated.evidenceItems.length}{' '}
                    {t.sos.step2Sections.evidenceProgress}
                  </span>
                </div>

                <ul className="divide-y divide-[var(--border-glass)] print:divide-slate-200">
                  {generated.evidenceItems.map((item, idx) => {
                    const checked = Boolean(checkedEvidence[item.id]);
                    const isUtrItem = item.id === 'utr' || item.id === 'txn_id';
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
                        className="py-1"
                      >
                        <motion.label
                          whileTap={{ scale: 0.98 }}
                          transition={IOS_SPRING}
                          className="flex min-h-[48px] cursor-pointer items-start gap-3 py-2.5 transition-colors hover:text-cyber-primary"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEvidence(item.id)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                              checked
                                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] print:border-slate-900 print:bg-slate-200 print:text-slate-900'
                                : 'border-[var(--border-glass)] bg-[var(--surface-input)] print:border-slate-400'
                            }`}
                          >
                            <AnimatePresence>
                              {checked && (
                                <motion.span
                                  initial={{ scale: 0.4, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.5, opacity: 0 }}
                                  transition={CHECK_SPRING}
                                  className="flex items-center justify-center"
                                >
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                          <div className="space-y-0.5">
                            <span
                              className={`block text-sm font-medium ${
                                checked
                                  ? 'text-cyber-secondary line-through'
                                  : 'text-cyber-primary print-text-dark'
                              }`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`block text-xs text-cyber-secondary print-muted-dark ${
                                isUtrItem ? 'font-mono-cyber' : ''
                              }`}
                            >
                              {item.hint}
                            </span>
                          </div>
                        </motion.label>
                      </motion.li>
                    );
                  })}
                </ul>
              </section>
            </div>

            {/* Right Column: Auto-generated Editable Bank Complaint Email */}
            <div className="lg:col-span-6">
              <section className="glass-surface-elevated space-y-4 rounded-[20px] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-cyber-primary print-text-dark">
                      {t.sos.step2Sections.emailTitle}
                    </h2>
                    <p className="mt-1 text-xs text-cyber-secondary print-muted-dark">
                      {t.sos.step2Sections.emailSub}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <motion.button
                      type="button"
                      onClick={() => setAiModalOpen(true)}
                      {...TACTILE_BUTTON_MOTION}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#D4AF37]/45 bg-[#D4AF37]/14 px-3 py-1.5 text-xs font-semibold text-[#F5E6B8] transition-colors hover:bg-[#D4AF37]/24"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                      <span>{t.aiImprove.buttonLabel}</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleResetEmail}
                      {...TACTILE_BUTTON_MOTION}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[var(--border-glass)] bg-[var(--surface-input)] px-3 py-1.5 text-xs font-medium text-cyber-secondary transition-colors hover:border-[#D4AF37]/45 hover:text-cyber-primary"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.sos.step2Sections.resetEmailBtn}</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          `Subject: ${emailSubject}\n\n${emailBody}`,
                          'email'
                        )
                      }
                      {...TACTILE_BUTTON_MOTION}
                      className="cta-primary inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold hover:brightness-105"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.sos.step2Sections.copiedLabel}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.sos.step2Sections.copyEmailBtn}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {aiAppliedBanner && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-[#34D399]/40 bg-[#34D399]/10 px-3.5 py-2 text-xs font-medium text-[#34D399] print:hidden"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{t.aiImprove.successNote}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="sos-email-subject"
                      className="block text-xs font-semibold text-cyber-secondary print-text-dark"
                    >
                      {t.sos.step2Sections.emailSubjectLabel}
                    </label>
                    <input
                      id="sos-email-subject"
                      type="text"
                      value={emailSubject}
                      onChange={(e) => {
                        setEmailSubject(e.target.value);
                        setEmailEditedByUser(true);
                      }}
                      className="cyber-input min-h-[44px] w-full rounded-xl px-3.5 py-2 text-sm font-medium print:border-slate-300 print:bg-white print:text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="sos-email-body"
                      className="block text-xs font-semibold text-cyber-secondary print-text-dark"
                    >
                      {t.sos.step2Sections.emailBodyLabel}
                    </label>
                    <textarea
                      id="sos-email-body"
                      rows={18}
                      value={emailBody}
                      onChange={(e) => {
                        setEmailBody(e.target.value);
                        setEmailEditedByUser(true);
                      }}
                      className="cyber-input w-full rounded-[20px] p-4 font-sans text-xs leading-relaxed sm:text-sm print:border-slate-300 print:bg-white print:text-slate-900"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <DisclaimerBanner text={t.disclaimer} />
        </div>
      )}

      {/* AI Complaint Preview & Confirm Modal */}
      <AiImproveModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        language={language}
        t={t}
        emailSubject={emailSubject}
        emailBody={emailBody}
        profile={activeProfile ?? {
          fullName: '',
          phone: '',
          email: '',
          cityState: '',
          bankName: '',
          accountLast4: '',
          scamDateTime: '',
          amountLost: '',
          transactionId: '',
          scammerContact: '',
          shortDescription: '',
        }}
        onApplyImproved={(nextSubject, nextBody) => {
          setEmailSubject(nextSubject);
          setEmailBody(nextBody);
          setEmailEditedByUser(true);
          setAiAppliedBanner(true);
        }}
      />
    </div>
  );
});

export default SosPage;
