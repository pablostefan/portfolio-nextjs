'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, Code2, Globe, BookMarked } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';

const CONTACT_ITEMS = [
  {
    key:   'email_label',
    icon:  Mail,
    label: 'pablo.stefan.dev@gmail.com',
    href:  'mailto:pablo.stefan.dev@gmail.com',
    color: 'text-accent-cyan',
    glow:  'hover:shadow-[0_0_28px_rgba(6,182,212,0.25)]',
  },
  {
    key:   'github_label',
    icon:  Code2,
    label: 'github.com/pablostefan',
    href:  'https://github.com/pablostefan',
    color: 'text-accent-light',
    glow:  'hover:shadow-[0_0_28px_rgba(124,58,237,0.25)]',
  },
  {
    key:   'linkedin_label',
    icon:  Globe,
    label: 'linkedin.com/in/pablosgpereira',
    href:  'https://linkedin.com/in/pablosgpereira',
    color: 'text-accent-light',
    glow:  'hover:shadow-[0_0_28px_rgba(124,58,237,0.25)]',
  },
  {
    key:   'medium_label',
    icon:  BookMarked,
    label: 'medium.com/@pablo.stefan',
    href:  'https://medium.com/@pablo.stefan',
    color: 'text-content-secondary',
    glow:  'hover:shadow-[0_0_28px_rgba(124,58,237,0.25)]',
  },
] as const;

export function Contact() {
  const t                  = useTranslations('contact');
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="contact" className="relative overflow-hidden bg-bg-surface/20">
      {/* Background blobs */}
      <AnimatedBlob variant="violet" size={500}
        className="-right-24 -top-24 opacity-30" />
      <AnimatedBlob variant="cyan"   size={400}
        className="-bottom-16 -left-16 opacity-25" />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        <p className="mb-12 text-center text-lg text-content-secondary">
          {t('subtitle')}
        </p>

        {/* Contact cards */}
        <ul className="flex flex-col gap-4">
          {CONTACT_ITEMS.map(({ key, icon: Icon, label, href, color, glow }, i) => (
            <motion.li
              key={key}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={`${t(key)}: ${label}`}
                className={[
                  'group flex items-center gap-5 rounded-2xl p-5',
                  'border border-white/[0.08] bg-white/[0.04] backdrop-blur-[16px]',
                  'transition-all duration-300 hover:-translate-y-1',
                  'hover:border-accent/25 hover:bg-white/[0.07]',
                  glow,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                ].join(' ')}
              >
                {/* Icon circle */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05] ${color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={22} aria-hidden="true" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 font-mono text-xs text-content-muted">{t(key)}</p>
                  <p className="truncate font-semibold text-content transition-colors duration-200 group-hover:text-accent-light">
                    {label}
                  </p>
                </div>

                {/* Arrow */}
                <motion.span
                  aria-hidden="true"
                  className="text-content-muted transition-colors duration-200 group-hover:text-accent-light"
                  animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
