"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import profile from "@/data/profile.json";
import type { ExperienceEntry } from "@/types";

type Locale = "pt" | "en";

interface StageProps {
  entry: ExperienceEntry;
  weight: number;
  locale: Locale;
  currentLabel: string;
}

function Stage({ entry, weight, locale, currentLabel }: StageProps) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 65%"],
  });
  // The company name gains its stage's weight as it scrolls up to reading height.
  const wght = useTransform(scrollYProgress, [0, 1], [100, weight], {
    clamp: true,
  });
  const settings = useTransform(
    wght,
    (w) => `"wdth" 100, "wght" ${w.toFixed(0)}`,
  );
  const readout = useTransform(wght, (w) => `wght ${Math.round(w)}`);

  return (
    <li
      ref={ref}
      className="relative grid gap-x-10 gap-y-4 border-t border-ink/25 py-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
    >
      <div className="flex min-w-0 items-baseline gap-5">
        <motion.span
          className="tabular w-20 shrink-0 font-mono text-[13px] text-ink-soft"
          aria-hidden="true"
        >
          {reduce ? `wght ${weight}` : readout}
        </motion.span>
        <motion.h3
          className="display min-w-0 text-[clamp(3rem,9vw,8rem)] leading-[0.9]"
          style={{
            fontVariationSettings: reduce
              ? `"wdth" 100, "wght" ${weight}`
              : settings,
          }}
        >
          {entry.company}
        </motion.h3>
      </div>
      <div className="flex flex-col gap-3 md:pt-3">
        <p className="flex flex-wrap items-baseline gap-x-3 text-[15px] text-ink-soft">
          <span>{entry.period[locale]}</span>
          {entry.current && (
            <span className="bg-ink px-2 py-0.5 text-[13px] text-vermilion">
              {currentLabel}
            </span>
          )}
        </p>
        <p className="text-[19px] font-semibold leading-snug">
          {entry.title[locale]}
        </p>
        <p className="max-w-[60ch] text-[17px] leading-[1.6]">
          {entry.description[locale]}
        </p>
      </div>
    </li>
  );
}

export function Career() {
  const t = useTranslations("career");
  const locale = (useLocale() as Locale) ?? "pt";
  const entries = profile.experience as ExperienceEntry[];
  const n = entries.length;

  return (
    <section
      id="career"
      aria-labelledby="career-title"
      className="bg-fog px-4 py-24 text-ink sm:px-8 sm:py-32"
    >
      <div className="mb-14 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <h2
          id="career-title"
          className="display text-[clamp(2.8rem,6vw,5.5rem)]"
          style={{ fontVariationSettings: '"wdth" 75, "wght" 850' }}
        >
          {t("title")}
        </h2>
        <p className="max-w-[40ch] text-[19px] leading-snug">{t("intro")}</p>
      </div>
      <ol className="border-b border-ink/25">
        {entries.map((entry, i) => (
          <Stage
            key={`${entry.company}-${entry.period.en}`}
            entry={entry}
            // Newest first: 900 at the top, stepping down to a hairline 200 for the first job.
            weight={Math.round(900 - (i * 700) / Math.max(1, n - 1))}
            locale={locale}
            currentLabel={t("current")}
          />
        ))}
      </ol>
    </section>
  );
}
