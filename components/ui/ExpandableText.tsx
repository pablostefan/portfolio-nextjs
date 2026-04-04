'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ExpandableTextProps {
  text: string;
  expandLabel: string;
  collapseLabel: string;
}

export function ExpandableText({ text, expandLabel, collapseLabel }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLParagraphElement>(null);

  return (
    <div>
      <div className="relative md:overflow-visible">
        <motion.div
          initial={false}
          animate={
            shouldReduceMotion
              ? undefined
              : { height: expanded ? 'auto' : contentRef.current ? Math.min(contentRef.current.scrollHeight, 216) : 216 }
          }
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className={expanded ? '' : 'overflow-hidden md:!h-auto md:overflow-visible'}
        >
          <p
            ref={contentRef}
            className={[
              'leading-relaxed text-content-secondary',
              !expanded
                ? '[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:9] md:block'
                : '',
            ].join(' ')}
          >
            {text}
          </p>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="mt-5 inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-mono text-accent-light transition-colors hover:border-accent/45 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 md:hidden"
      >
        {expanded ? collapseLabel : expandLabel}
      </button>
    </div>
  );
}