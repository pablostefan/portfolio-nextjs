'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Globe, Mail, BookMarked } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';

const socials = [
  { icon: Code2,      label: 'GitHub',   href: 'https://github.com/pablostefan' },
  { icon: Globe,      label: 'LinkedIn', href: 'https://linkedin.com/in/pablosgpereira' },
  { icon: Mail,       label: 'Email',    href: 'mailto:pablo.stefan.dev@gmail.com' },
  { icon: BookMarked, label: 'Medium',   href: 'https://medium.com/@pablo.stefan' },
];

interface FooterClientProps {
  madeWith: string;
  using: string;
}

export function FooterClient({ madeWith, using }: FooterClientProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl flex flex-col items-center gap-7"
    >
      <GradientText as="p" animated className="font-display text-lg font-bold tracking-tight">
        Pablo Stefan
      </GradientText>

      <ul className="flex items-center gap-3" aria-label="Social links">
        {socials.map(({ icon: Icon, label, href }, i) => (
          <motion.li
            key={label}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              aria-label={label}
              className="group flex items-center justify-center rounded-xl border border-glass-border bg-glass-bg p-2.5 text-content-muted transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light hover:shadow-glow-sm-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Icon size={18} />
            </a>
          </motion.li>
        ))}
      </ul>

      <p className="text-center font-mono text-xs text-content-muted">
        © {new Date().getFullYear()} Pablo Stefan
        <span aria-hidden="true" className="mx-2 text-white/20">·</span>
        {madeWith}{' '}
        <span aria-hidden="true" className="text-pink-400">♥</span>{' '}
        {using}{' '}
        <span className="text-content-secondary">Next.js</span>
        {' & '}
        <span className="text-content-secondary">Framer Motion</span>
      </p>
    </motion.div>
  );
}
