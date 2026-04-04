'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Align content — defaults to 'center' */
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp = {
    hidden:  shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
    },
  };

  const lineGrow = {
    hidden:  shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.15 },
    },
  };

  return (
    <motion.div
      className={`mb-16 flex flex-col gap-3 ${alignClass} ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Main title */}
      <motion.h2
        variants={fadeUp}
        className="font-display text-3xl font-bold leading-tight sm:text-4xl"
      >
        <GradientText animated>{title}</GradientText>
      </motion.h2>

      {/* Animated accent line with glow */}
      <motion.div
        variants={lineGrow}
        style={{ originX: align === 'left' ? 0 : 0.5 }}
        className="relative h-[2px] w-20"
        aria-hidden="true"
      >
        {/* Base line */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-accent-cyan to-transparent opacity-70" />
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-accent-cyan to-transparent opacity-40 blur-[4px]" />
      </motion.div>

      {/* Optional subtitle */}
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-1 font-mono text-sm uppercase tracking-widest text-content-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
