'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
}

const drawEasing = [0.22, 1, 0.36, 1] as const;

export function Logo({ size = 32, className = '' }: LogoProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="48" height="48" rx="12" fill="url(#logo-grad)" />

      {/* P letterform */}
      <motion.path
        d="M 10 35 V 13 H 16 C 22 13 22 23 16 23 H 10"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: drawEasing, delay: 0.3 }}
      />

      {/* S letterform */}
      <motion.path
        d="M 36 16 C 36 13 28 13 28 18 C 28 23 36 25 36 30 C 36 35 28 35 28 32"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: drawEasing, delay: 0.6 }}
      />
    </svg>
  );
}
