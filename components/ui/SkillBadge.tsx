'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SkillBadgeProps {
  skill: string;
  className?: string;
}

export function SkillBadge({ skill, className = '' }: SkillBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={[
        'inline-flex cursor-default select-none items-center',
        'rounded-lg border border-white/[0.1] bg-white/[0.05]',
        'px-3 py-1.5 font-mono text-sm text-accent-light',
        'transition-colors duration-200',
        'hover:bg-accent/15 hover:border-accent/35 hover:text-white',
        'hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]',
        className,
      ].join(' ')}
    >
      {skill}
    </motion.span>
  );
}
