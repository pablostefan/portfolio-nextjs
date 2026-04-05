'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowDown, Mail } from 'lucide-react';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';
import { GradientText } from '@/components/ui/GradientText';
import { useAfterSplash } from '@/hooks/useAfterSplash';
import { TypewriterText } from '@/components/ui/TypewriterText';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const t                  = useTranslations('hero');
  const shouldReduceMotion = useReducedMotion();
  const splashReady        = useAfterSplash();

  const typewriterTexts: string[] = [
    t('typewriter.0'),
    t('typewriter.1'),
    t('typewriter.2'),
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      aria-label="Hero"
    >
      {/* ── Background blobs ── */}
      <AnimatedBlob variant="violet" size={700}
        className="-left-40 -top-40 opacity-60" />
      <AnimatedBlob variant="cyan"   size={600}
        className="-right-32 top-1/4 opacity-50" />
      <AnimatedBlob variant="indigo" size={500}
        className="bottom-0 left-1/3 opacity-40" />

      {/* ── Noise / grid overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Content ── */}
      <motion.div
        variants={shouldReduceMotion ? undefined : container}
        initial="hidden"
        animate={splashReady ? 'show' : 'hidden'}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Badge */}
        <motion.div variants={shouldReduceMotion ? {} : item} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-sm text-accent-light">
            <span aria-hidden="true" className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-light" />
            {t('role')}
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={shouldReduceMotion ? undefined : item}
          className="mb-3 font-mono text-lg text-content-secondary"
        >
          {t('greeting')}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : item}
          className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
        >
          <GradientText animated>Pablo Stefan</GradientText>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          variants={shouldReduceMotion ? undefined : item}
          className="mb-6 h-10 flex items-center justify-center"
          aria-live="polite"
          aria-label={t('role')}
        >
          <TypewriterText
            texts={typewriterTexts}
            className="font-display text-2xl font-semibold text-content sm:text-3xl"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={shouldReduceMotion ? undefined : item}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-content-secondary"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={shouldReduceMotion ? undefined : item}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-white shadow-glow-violet transition-all duration-300 hover:-translate-y-1 hover:bg-accent/90 hover:shadow-[0_0_50px_rgba(124,58,237,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            {t('cta_projects')}
            <ArrowDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass-bg px-7 py-3.5 font-semibold text-content-secondary backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-accent/10 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <Mail size={18} />
            {t('cta_contact')}
          </a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={(shouldReduceMotion || splashReady) ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
      >
        {/* Staggered chevrons */}
        <div className="flex flex-col items-center -space-y-[5px]">
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              width="14" height="8" viewBox="0 0 14 8" fill="none"
              animate={shouldReduceMotion ? {} : { opacity: [0.15, 0.65, 0.15] }}
              transition={{
                duration: 1.9,
                repeat:   Infinity,
                delay:    i * 0.22,
                ease:     'easeInOut',
              }}
            >
              <path
                d="M1 1l6 6 6-6"
                stroke="url(#chev-grad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="chev-grad" x1="1" y1="1" x2="13" y2="1" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a78bfa" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </motion.svg>
          ))}
        </div>

        {/* Label */}
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-content-muted/60">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
