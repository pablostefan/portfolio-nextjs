'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { SkillBadge } from '@/components/ui/SkillBadge';

interface SkillBadgeListProps {
  skills: string[];
}

export function SkillBadgeList({ skills }: SkillBadgeListProps) {
  const shouldReduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 12 },
    show:   { opacity: 1, scale: 1,   y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.ul
      variants={shouldReduceMotion ? undefined : container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      className="flex flex-wrap justify-center gap-3"
      aria-label="Skills list"
    >
      {skills.map((skill) => (
        <motion.li key={skill} variants={shouldReduceMotion ? undefined : itemVariant}>
          <SkillBadge skill={skill} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
