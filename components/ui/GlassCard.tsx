'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  glow?: 'violet' | 'cyan' | 'none';
}

const glowMap = {
  violet: 'hover:border-glass-border-hover hover:shadow-glow-violet',
  cyan:   'hover:border-accent-cyan/30 hover:shadow-glow-cyan',
  none:   '',
};

export function GlassCard({
  hover = false,
  glow = 'none',
  className = '',
  children,
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={hover && !shouldReduceMotion ? { y: -6, scale: 1.015 } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={[
        'relative bg-glass-bg backdrop-blur-[16px]',
        'border border-glass-border rounded-2xl',
        'transition-all duration-300',
        glowMap[glow],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.div>
  );
}
