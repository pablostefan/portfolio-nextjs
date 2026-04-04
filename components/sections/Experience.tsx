'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import profileData from '@/data/profile.json';
import type { Locale } from '@/i18n';

type ExperienceEntry = (typeof profileData.experience)[number];

function TimelineItem({
  entry,
  index,
  locale,
  currentLabel,
}: {
  entry: ExperienceEntry;
  index: number;
  locale: Locale;
  currentLabel: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 pl-4"
    >
      {/* Timeline dot + line */}
      <div className="relative flex flex-col items-center">
        <div className="relative z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg-base shadow-[0_0_16px_rgba(124,58,237,0.6)]">
          {entry.current && (
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-light" />
          )}
        </div>
        <div aria-hidden="true" className="mt-2 w-px flex-1 bg-gradient-to-b from-accent/40 to-transparent" />
      </div>

      {/* Card */}
      <GlassCard hover glow="violet" className="mb-8 flex-1 p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-content">
              {entry.title[locale]}
            </h3>
            <p className="font-semibold text-accent-light">{entry.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-sm text-content-muted">{entry.period}</span>
            {entry.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent-light">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-light" />
                {currentLabel}
              </span>
            )}
          </div>
        </div>
        <p className="leading-relaxed text-content-secondary">
          {entry.description[locale]}
        </p>
      </GlassCard>
    </motion.div>
  );
}

export function Experience() {
  const t      = useTranslations('experience');
  const locale = useLocale() as Locale;

  return (
    <SectionWrapper id="experience" className="bg-bg-surface/30">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* Timeline */}
        <div>
          {profileData.experience.map((entry, i) => (
            <TimelineItem
              key={`${entry.company}-${i}`}
              entry={entry}
              index={i}
              locale={locale}
              currentLabel={t('current')}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
