'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, Code2, Globe, BookMarked, MessageCircle } from 'lucide-react';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedBlob } from '@/components/ui/AnimatedBlob';

const PRIMARY_CONTACT = {
  key: 'email_label',
  icon: Mail,
  label: 'pablo.stefan.dev@gmail.com',
  href: 'mailto:pablo.stefan.dev@gmail.com',
} as const;

const SOCIAL_ITEMS = [
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
  {
    key:   'whatsapp_label',
    icon:  MessageCircle,
    label: '+55 16 99137-3324',
    href:  'https://wa.me/5516991373324',
    color: 'text-emerald-300',
    glow:  'hover:shadow-glow-sm-cyan',
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

      <div className="relative z-10 mx-auto max-w-4xl">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} className="mb-10" />

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <GlassCard glow="violet" className="p-5 sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-[11px] text-accent-light">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              {t('availability_note')}
            </div>

            <a
              href={PRIMARY_CONTACT.href}
              aria-label={`${t(PRIMARY_CONTACT.key)}: ${PRIMARY_CONTACT.label}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-glass-border bg-glass-bg p-4 transition-all duration-300 hover:border-accent/30 hover:bg-glass-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="min-w-0">
                <p className="mb-1 font-mono text-xs text-content-muted">{t(PRIMARY_CONTACT.key)}</p>
                <p className="truncate font-display text-lg font-semibold text-content transition-colors group-hover:text-accent-light sm:text-xl">
                  {PRIMARY_CONTACT.label}
                </p>
              </div>

              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-cyan"
              >
                <Mail size={20} aria-hidden="true" />
              </motion.div>
            </a>
          </GlassCard>
        </motion.div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SOCIAL_ITEMS.map(({ key, icon: Icon, label, href, color, glow }, i) => (
            <motion.li
              key={key}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t(key)}: ${label}`}
                className={[
                  'group flex h-full flex-col justify-between gap-4 rounded-2xl p-5',
                  'border border-glass-border bg-glass-bg backdrop-blur-[16px]',
                  'transition-all duration-300 hover:-translate-y-1',
                  'hover:border-accent/25 hover:bg-glass-bg-hover',
                  glow,
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                ].join(' ')}
              >
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border bg-glass-bg ${color}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </motion.div>

                <div>
                  <p className="mb-1 font-mono text-xs text-content-muted">{t(key)}</p>
                  <p className="font-semibold text-content transition-colors duration-200 group-hover:text-accent-light">
                    {label}
                  </p>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
