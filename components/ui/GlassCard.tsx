'use client';

import { type ReactNode, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  hover?: boolean;
  glow?: 'violet' | 'cyan' | 'none';
}

const glowMap = {
  violet: 'hover:border-glass-border-hover hover:shadow-glow-violet',
  cyan:   'hover:border-accent-cyan/30 hover:shadow-glow-cyan',
  none:   '',
};

const springConfig = { stiffness: 280, damping: 22 };

export function GlassCard({
  hover = false,
  glow = 'none',
  className = '',
  children,
  style,
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, springConfig);
  const smoothY = useSpring(rotateY, springConfig);

  const tiltEnabled = hover && !shouldReduceMotion;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || !tiltEnabled) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(y * -6);
      rotateY.set(x * 6);
    },
    [tiltEnabled, rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      whileHover={hover && !shouldReduceMotion ? { y: -6, scale: 1.015 } : undefined}
      transition={{ type: 'spring', ...springConfig }}
      onMouseMove={tiltEnabled ? handleMouseMove : undefined}
      onMouseLeave={tiltEnabled ? handleMouseLeave : undefined}
      style={{
        ...(tiltEnabled
          ? { rotateX: smoothX, rotateY: smoothY, transformPerspective: 800 }
          : {}),
        ...style,
      }}
      className={[
        'relative overflow-hidden bg-glass-bg backdrop-blur-[16px]',
        'border border-glass-border rounded-2xl',
        'transition-all duration-300',
        'hover:bg-glass-bg-hover',
        glowMap[glow],
        className,
      ].join(' ')}
      {...props}
    >
      {/* Subtle inner top-edge highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent"
      />
      {children}
    </motion.div>
  );
}
