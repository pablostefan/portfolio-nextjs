'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ExpandableTextProps {
  text: string;
  expandLabel: string;
  collapseLabel: string;
}

export function ExpandableText({ text, expandLabel, collapseLabel }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  const paragraphs = useMemo(
    () => text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [text],
  );

  return (
    <div>
      <div className="relative md:overflow-visible">
        <motion.div
          initial={false}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  height: expanded
                    ? 'auto'
                    : contentRef.current
                      ? Math.min(contentRef.current.scrollHeight, 240)
                      : 240,
                }
          }
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className={expanded ? '' : 'overflow-hidden md:!h-auto md:overflow-visible'}
        >
          <div ref={contentRef} className="space-y-5 text-[13px] text-content-secondary sm:text-sm">
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`} className="text-pretty leading-7">
                {paragraph}
              </p>
            ))}
          </div>
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