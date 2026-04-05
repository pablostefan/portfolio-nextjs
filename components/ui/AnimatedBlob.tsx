'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface AnimatedBlobProps {
  variant?: 'violet' | 'cyan' | 'indigo';
  className?: string;
  size?: number;
}

const configs: Record<
  'violet' | 'cyan' | 'indigo',
  { gradient: string; animate: Record<string, number[]>; duration: number }
> = {
  violet: {
    gradient: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
    animate: { x: [0, 50, -35, 0], y: [0, -35, 25, 0], scale: [1, 1.18, 0.9, 1] },
    duration: 9,
  },
  cyan: {
    gradient: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
    animate: { x: [0, -40, 30, 0], y: [0, 30, -25, 0], scale: [1, 0.9, 1.15, 1] },
    duration: 11,
  },
  indigo: {
    gradient: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
    animate: { x: [0, 30, -50, 0], y: [0, -25, 35, 0], scale: [1, 1.1, 0.88, 1] },
    duration: 13,
  },
};

const parallaxFactors: Record<'violet' | 'cyan' | 'indigo', number> = {
  violet: 0.08,
  cyan: 0.12,
  indigo: 0.1,
};

export function AnimatedBlob({ variant = 'violet', className = '', size = 700 }: AnimatedBlobProps) {
  const shouldReduceMotion = useReducedMotion();
  const { gradient, animate, duration } = configs[variant];
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 3000], [0, 3000 * parallaxFactors[variant]]);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ y: shouldReduceMotion ? 0 : yOffset }}
    >
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: gradient,
          willChange: 'transform',
          filter: 'blur(80px)',
        }}
        animate={shouldReduceMotion ? {} : animate}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
