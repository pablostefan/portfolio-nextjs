'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, Code2, Globe, BookMarked } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';

const CONTACT_ITEMS = [
  {
    key:   'email_label',
    icon:  Mail,
    label: 'pablo.stefan.dev@gmail.com',
    href:  'mailto:pablo.stefan.dev@gmail.com',
    color: 'text-accent-cyan',
    glow:  'hover:shadow-glow-sm-cyan',
  },
  {
    key:   'github_label',
    icon:  Code2,
    label: 'github.com/pablostefan',
    href:  'https://github.com/pablostefan',
    color: 'text-accent-light',
    glow:  'hover:shadow-glow-sm-violet',
  },
  {
    key:   'linkedin_label',
    icon:  Globe,
    label: 'linkedin.com/in/pablosgpereira',
    href:  'https://linkedin.com/in/pablosgpereira',
    color: 'text-accent-light',
    glow:  'hover:shadow-glow-sm-violet',
  },
  {
    key:   'medium_label',
    icon:  BookMarked,
    label: 'medium.com/@pablo.stefan',
    href:  'https://medium.com/@pablo.stefan',
    color: 'text-content-secondary',
    glow:  'hover:shadow-glow-sm-violet',
  },
] as const;

export function Contact() {
  const t                  = useTranslations('contact');
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionWrapper id="contact" className="relative overflow-hidden">
      {/* Background blobs */}
      <AnimatedBlob variant="violet" size={500}
        className="-right-24 -top-24 opacity-30" />
      <AnimatedBlob variant="cyan"   size={400}
        className="-bottom-16 -left-16 opacity-25" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} className="mb-12" />

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
                  'border border-glass-border bg-glass-bg backdrop-blur-[16px]',
                  'transition-all duration-300 hover:-translate-y-1',
                  'hover:border-accent/25 hover:bg-glass-bg-hover',
                  glow,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                ].join(' ')}
              >
                {/* Icon circle */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass-bg ${color} transition-transform duration-300 group-hover:scale-110`}>
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
