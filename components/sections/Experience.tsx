'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import profileData from '@/data/profile.json';
import type { Locale } from '@/i18n';

type ExperienceEntry = (typeof profileData.experience)[number];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const bulletVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

function TimelineItem({
  entry,
  index,
  locale,
  currentLabel,
  showDetailsLabel,
  hideDetailsLabel,
}: {
  entry: ExperienceEntry;
  index: number;
  locale: Locale;
  currentLabel: string;
  showDetailsLabel: string;
  hideDetailsLabel: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const bullets: string[] = entry.bullets?.[locale] ?? [];
  const hasBullets = bullets.length > 0;

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -32 }}
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
        {/* Header */}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-content">
              {entry.title[locale]}
            </h3>
            <p className="font-semibold text-accent-light">{entry.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-sm text-content-muted">{entry.period[locale]}</span>
            {entry.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent-light">
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-light" />
                {currentLabel}
              </span>
            )}
          </div>
        </div>

        {/* Summary description */}
        <p className="leading-relaxed text-content-secondary">
          {entry.description[locale]}
        </p>

        {/* Expand / collapse bullets */}
        {hasBullets && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="mt-4 flex items-center gap-1.5 rounded text-sm text-accent-light transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <motion.span
                aria-hidden="true"
                animate={shouldReduceMotion ? undefined : { rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-center"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
              {expanded ? hideDetailsLabel : showDetailsLabel}
            </button>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="bullets"
                  initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.ul
                    variants={shouldReduceMotion ? undefined : listVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 space-y-2.5"
                    aria-label={`${entry.title[locale]} — ${entry.company}`}
                  >
                    {bullets.map((bullet, bi) => (
                      <motion.li
                        key={bi}
                        variants={shouldReduceMotion ? undefined : bulletVariants}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-content-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400"
                        />
                        {bullet}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
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
              showDetailsLabel={t('show_details')}
              hideDetailsLabel={t('hide_details')}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
