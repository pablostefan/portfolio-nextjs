"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";

interface Row {
  key: "l1" | "l2" | "l3" | "l4";
  size: number;
  className: string;
  wght: number;
  /** Only the large rows open from condensed; small text stays at normal width */
  scrub?: boolean;
}

const ROWS: Row[] = [
  {
    key: "l1",
    size: 96,
    wght: 800,
    scrub: true,
    className: "text-[clamp(2.1rem,7vw,6rem)] leading-[0.95] max-w-[16ch]",
  },
  {
    key: "l2",
    size: 56,
    wght: 650,
    scrub: true,
    className: "text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.02] max-w-[24ch]",
  },
  {
    key: "l3",
    size: 32,
    wght: 480,
    className: "text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.18] max-w-[40ch]",
  },
  {
    key: "l4",
    size: 20,
    wght: 400,
    className: "text-[1.25rem] leading-[1.5] max-w-[62ch]",
  },
];

function WaterfallRow({ row, text }: { row: Row; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 55%"],
  });
  // Each line opens from condensed to normal width as it reaches reading height.
  const wdth = useTransform(scrollYProgress, [0, 1], [62, 100], {
    clamp: true,
  });
  const settings = useTransform(
    wdth,
    (w) => `"wdth" ${w.toFixed(1)}, "wght" ${row.wght}`,
  );

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ink/25 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8"
    >
      <span
        className="tabular pt-[0.35em] font-mono text-[13px] text-ink-soft"
        aria-hidden="true"
      >
        {row.size}
      </span>
      <motion.p
        className={`display tracking-[-0.015em] ${row.className}`}
        style={{
          fontVariationSettings:
            reduce || !row.scrub ? `"wdth" 100, "wght" ${row.wght}` : settings,
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export function Waterfall() {
  const t = useTranslations("statement");

  return (
    <section
      aria-labelledby="waterfall-title"
      className="bg-fog px-4 py-24 text-ink sm:px-8 sm:py-32"
    >
      <h2 id="waterfall-title" className="sr-only">
        {t("title")}
      </h2>
      <div className="border-b border-ink/25">
        {ROWS.map((row) => (
          <WaterfallRow key={row.key} row={row} text={t(row.key)} />
        ))}
      </div>
    </section>
  );
}
