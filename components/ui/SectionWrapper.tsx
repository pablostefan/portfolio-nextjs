'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

const initialMap: Record<Direction, { opacity: number; y?: number; x?: number; scale?: number }> = {
  up:    { opacity: 0, y: 48 },
  left:  { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  scale: { opacity: 0, scale: 0.95 },
};

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  direction?: Direction;
}

export function SectionWrapper({ children, id, className = '', direction = 'up' }: SectionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={shouldReduceMotion ? false : initialMap[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={['py-24 px-4 overflow-x-clip', className].join(' ')}
    >
      {children}
    </motion.section>
  );
}
