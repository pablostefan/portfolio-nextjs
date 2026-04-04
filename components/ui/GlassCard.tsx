'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  glow?: 'violet' | 'cyan' | 'none';
}

const glowMap = {
  violet: 'hover:border-accent/30 hover:shadow-[0_8px_40px_rgba(124,58,237,0.22)]',
  cyan:   'hover:border-accent-cyan/30 hover:shadow-[0_8px_40px_rgba(6,182,212,0.22)]',
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
        'relative bg-white/[0.04] backdrop-blur-[16px]',
        'border border-white/[0.08] rounded-2xl',
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
