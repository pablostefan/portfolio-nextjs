"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface EaseCurveProps {
  caption: string;
}

// cubic-bezier(0.23, 1, 0.32, 1) drawn in a 400 × 400 box, y pointing up.
const P0 = { x: 0, y: 400 };
const P1 = { x: 92, y: 0 };
const P2 = { x: 128, y: 0 };
const P3 = { x: 400, y: 0 };
const PATH = `M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`;

/** The entrance curve the motion tokens share, traced as the section scrolls past. */
export function EaseCurve({ caption }: EaseCurveProps) {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const t = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  // pathLength draws by arc length, so the dot follows the same measure to stay on the stroke tip.
  const point = (v: number) => {
    const path = pathRef.current;
    if (!path) return P0;
    return path.getPointAtLength(v * path.getTotalLength());
  };
  const cx = useTransform(t, (v) => point(v).x);
  const cy = useTransform(t, (v) => point(v).y);
  const guideX = useTransform(cx, (v) => `translateX(${v}px)`);

  return (
    <figure ref={ref} className="relative w-full max-w-[30rem]">
      <svg
        viewBox="-24 -24 448 448"
        className="w-full overflow-visible"
        role="img"
        aria-label={caption}
      >
        <g stroke="currentColor" strokeOpacity="0.25" strokeWidth="1">
          {[0, 100, 200, 300, 400].map((v) => (
            <line key={`h${v}`} x1="0" x2="400" y1={v} y2={v} />
          ))}
          {[0, 100, 200, 300, 400].map((v) => (
            <line key={`v${v}`} y1="0" y2="400" x1={v} x2={v} />
          ))}
        </g>
        <g
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="4 6"
        >
          <line x1={P0.x} y1={P0.y} x2={P1.x} y2={P1.y} />
          <line x1={P3.x} y1={P3.y} x2={P2.x} y2={P2.y} />
        </g>
        <motion.path
          ref={pathRef}
          d={PATH}
          fill="none"
          stroke="var(--color-vermilion)"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : t }}
        />
        {!reduce && (
          <>
            <motion.line
              y1="0"
              y2="400"
              x1="0"
              x2="0"
              stroke="var(--color-vermilion)"
              strokeOpacity="0.5"
              style={{ transform: guideX }}
            />
            <motion.circle
              r="11"
              fill="var(--color-vermilion)"
              style={{ cx, cy }}
            />
          </>
        )}
        <circle cx={P1.x} cy={P1.y} r="5" fill="currentColor" />
        <circle cx={P2.x} cy={P2.y} r="5" fill="currentColor" />
      </svg>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-[14px] text-fog/75">
        <span>{caption}</span>
        <code className="font-mono text-[13px] text-fog">
          cubic-bezier(0.23, 1, 0.32, 1)
        </code>
      </figcaption>
    </figure>
  );
}
