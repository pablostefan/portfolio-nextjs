'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedDividerProps {
  className?: string;
}

export function AnimatedDivider({ className = '' }: AnimatedDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative mx-auto flex h-6 w-full max-w-5xl items-center ${className}`}
    >
      {/* Base gradient line — gentle breathing opacity */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.5, 1, 0.5] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Soft shimmer — slow, subtle, blended */}
      <motion.div
        className="absolute top-1/2 h-[1px] w-1/3 -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.25) 40%, rgba(6,182,212,0.2) 60%, transparent 100%)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: ['-100%', '400%'] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 7,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />

      {/* Soft glow behind shimmer */}
      <motion.div
        className="absolute top-1/2 h-3 w-1/3 -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.04) 40%, rgba(6,182,212,0.03) 60%, transparent 100%)',
          filter: 'blur(6px)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: ['-100%', '400%'] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 7,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />
    </div>
  );
}
