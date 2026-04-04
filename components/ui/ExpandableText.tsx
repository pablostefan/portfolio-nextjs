'use client';

import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  expandLabel: string;
  collapseLabel: string;
}

export function ExpandableText({ text, expandLabel, collapseLabel }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="relative md:overflow-visible">
        <p
          className={[
            'leading-relaxed text-content-secondary',
            expanded
              ? 'max-h-none'
              : 'overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:9] md:block md:overflow-visible',
          ].join(' ')}
        >
          {text}
        </p>
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