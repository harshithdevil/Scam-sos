import { memo } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, PhoneCall, ShieldCheck } from 'lucide-react';
import type { RoutePath } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { DisclaimerBanner } from './DisclaimerBanner';
import {
  IOS_SPRING,
  LIST_STAGGER_DELAY,
  TACTILE_BUTTON_MOTION,
} from './MotionPrimitives';

interface ResourcesPageProps {
  t: TranslationBundle;
  onNavigate: (path: RoutePath) => void;
}

export const ResourcesPage = memo(function ResourcesPage({ t, onNavigate }: ResourcesPageProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-cyber-primary sm:text-4xl">
          {t.resources.title}
        </h1>
        <p className="text-sm leading-relaxed text-cyber-secondary sm:text-base">
          {t.resources.subtitle}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {t.resources.cards.map((card, idx) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
            className="glass-surface-elevated flex flex-col justify-between gap-5 rounded-[20px] p-6"
          >
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#D4AF37]">{card.badge}</p>
              <h2 className="font-display text-lg font-bold text-cyber-primary">
                {card.title}
              </h2>
              <p className="text-sm leading-relaxed text-cyber-secondary">{card.desc}</p>
            </div>

            {card.href ? (
              <motion.a
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...TACTILE_BUTTON_MOTION}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                  card.href.startsWith('tel:')
                    ? 'font-mono-cyber border-[#D4AF37]/45 bg-[#D4AF37]/14 text-[#F5E6B8] hover:bg-[#D4AF37]/24'
                    : 'border-[var(--border-glass)] bg-[var(--surface-input)] text-[#F5E6B8] hover:border-[#D4AF37]/50'
                }`}
              >
                {card.href.startsWith('tel:') ? (
                  <PhoneCall className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                ) : (
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                )}
                <span>{card.actionText}</span>
              </motion.a>
            ) : (
              <motion.button
                type="button"
                onClick={() => onNavigate('/sos')}
                {...TACTILE_BUTTON_MOTION}
                className="cta-primary inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold hover:brightness-105"
              >
                <span>{card.actionText}</span>
              </motion.button>
            )}
          </motion.article>
        ))}
      </div>

      <section className="glass-surface space-y-4 rounded-[20px] p-6">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold text-cyber-primary">
            {t.resources.bankChecklistTitle}
          </h2>
        </div>

        <ul className="space-y-3">
          {t.resources.bankChecklistItems.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_SPRING, delay: Math.min((idx + 3) * LIST_STAGGER_DELAY, 0.18) }}
              className="flex items-start gap-3 text-sm leading-relaxed text-cyber-primary"
            >
              <span className="tabular-nums mt-0.5 text-xs font-bold text-[#D4AF37]">
                0{idx + 1}
              </span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <DisclaimerBanner text={t.disclaimer} />
    </div>
  );
});

export default ResourcesPage;
