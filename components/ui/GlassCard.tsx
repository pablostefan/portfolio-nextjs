'use client';

import { type ReactNode, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  hover?: boolean;
  glow?: 'violet' | 'cyan' | 'indigo' | 'none';
  speed?: 'normal' | 'fast';
}

const glowMap = {
  violet:
    'hover:border-glass-border-hover hover:shadow-glow-violet',
  cyan:
    'hover:border-accent-cyan/30 hover:shadow-glow-cyan',
  indigo:
    'hover:border-indigo-400/28 hover:shadow-glow-indigo',
  none: '',
};

const normalSpringConfig = { stiffness: 280, damping: 22 };
const fastSpringConfig = { stiffness: 320, damping: 28, mass: 0.8 };

export function GlassCard({
  hover = false,
  glow = 'none',
  speed = 'normal',
  className = '',
  children,
  style,
  ...props
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const springConfig = speed === 'fast' ? fastSpringConfig : normalSpringConfig;
  const hoverAnimation = hover && !shouldReduceMotion
    ? { y: speed === 'fast' ? -5 : -6, scale: speed === 'fast' ? 1.012 : 1.015 }
    : undefined;
  const hoverTransition = speed === 'fast'
    ? { type: 'tween' as const, duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    : { type: 'spring' as const, ...springConfig };

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
      whileHover={hoverAnimation}
      transition={hoverTransition}
      onMouseMove={tiltEnabled ? handleMouseMove : undefined}
      onMouseLeave={tiltEnabled ? handleMouseLeave : undefined}
      style={{
        ...(tiltEnabled
          ? { rotateX: smoothX, rotateY: smoothY, transformPerspective: 800 }
          : {}),
        ...style,
      }}
      className={[
        'relative overflow-hidden rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-[16px]',
        'transition-[background-color,border-color,box-shadow]',
        speed === 'fast'
          ? 'duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]'
          : 'duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
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
