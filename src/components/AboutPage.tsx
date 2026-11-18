import { memo } from 'react';
import { motion } from 'motion/react';
import { Check, Lock, X } from 'lucide-react';
import type { TranslationBundle } from '../i18n/translations';
import { DisclaimerBanner } from './DisclaimerBanner';
import { IOS_SPRING, LIST_STAGGER_DELAY } from './MotionPrimitives';

interface AboutPageProps {
  t: TranslationBundle;
}

export const AboutPage = memo(function AboutPage({ t }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-cyber-primary sm:text-4xl">
          {t.about.title}
        </h1>
        <p className="text-sm leading-relaxed text-cyber-secondary sm:text-base">
          {t.about.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Does */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={IOS_SPRING}
          className="glass-surface-elevated space-y-4 rounded-[20px] p-6"
        >
          <h2 className="font-display text-xl font-bold text-[#F5E6B8]">
            {t.about.doesTitle}
          </h2>
          <ul className="space-y-3">
            {t.about.doesItems.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
                className="flex items-start gap-3 text-sm leading-relaxed text-cyber-primary"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" aria-hidden="true" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Does NOT */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ ...IOS_SPRING, delay: 0.04 }}
          className="glass-surface space-y-4 rounded-[20px] p-6"
        >
          <h2 className="font-display text-xl font-bold text-cyber-primary">
            {t.about.doesNotTitle}
          </h2>
          <ul className="space-y-3">
            {t.about.doesNotItems.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...IOS_SPRING, delay: idx * LIST_STAGGER_DELAY }}
                className="flex items-start gap-3 text-sm leading-relaxed text-cyber-secondary"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#F43F5E]" aria-hidden="true" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>

      <section className="glass-surface space-y-2.5 rounded-[20px] p-6">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-cyber-primary">
            {t.about.privacyTitle}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-cyber-secondary">
          {t.about.privacyDesc}
        </p>
      </section>

      <DisclaimerBanner text={t.disclaimer} />
    </div>
  );
});

export default AboutPage;
