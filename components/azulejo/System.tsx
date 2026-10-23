"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { rng } from "@/lib/tiles";
import { TileArt } from "./TileArt";

const SIDE = 4;

// Quarter-disc turns that make each composition, by row and column parity.
const CIRCLES = [
  [2, 3],
  [1, 0],
];
const target = {
  circles: (r: number, c: number) => CIRCLES[r % 2][c % 2],
  bows: (r: number, c: number) => ((r + c) % 2 === 0 ? 0 : 2),
};

/** Turns needed to reach `to` from `from` going clockwise, never backwards. */
const forward = (from: number, to: number) =>
  from + ((((to - from) % 4) + 4) % 4);

const STAGES = ["stage_1", "stage_2", "stage_3"] as const;
// Scroll progress where each composition is fully laid.
const AT = [0.08, 0.45, 0.85];

function ScrubTile({
  progress,
  turns,
}: {
  progress: MotionValue<number>;
  turns: number[];
}) {
  const rotate = useTransform(
    progress,
    [AT[0], AT[1] - 0.12, AT[1], AT[2] - 0.12, AT[2]],
    [turns[0] * 90, turns[0] * 90, turns[1] * 90, turns[1] * 90, turns[2] * 90],
  );
  const transform = useTransform(rotate, (d) => `rotate(${d}deg)`);
  return (
    <motion.span className="block" style={{ transform }}>
      <TileArt
        motif="quarter"
        ground="glaze"
        figure="cobalt"
        className="block h-full w-full"
      />
    </motion.span>
  );
}

function StageLabel({
  progress,
  i,
  label,
}: {
  progress: MotionValue<number>;
  i: number;
  label: string;
}) {
  // Offsets must stay inside 0–1 for scroll-linked animations.
  const lo = i === 0 ? null : (AT[i - 1] + AT[i]) / 2;
  const hi = i === STAGES.length - 1 ? null : (AT[i] + AT[i + 1]) / 2;
  const input = [
    ...(lo === null ? [0] : [lo - 0.01, lo]),
    ...(hi === null ? [1] : [hi, hi + 0.01]),
  ];
  const output = [
    ...(lo === null ? [1] : [0.35, 1]),
    ...(hi === null ? [1] : [1, 0.35]),
  ];
  const opacity = useTransform(progress, input, output);
  return (
    <motion.li style={{ opacity }} className="flex items-baseline gap-3">
      <span className="tabular font-mono text-[13px]">0{i + 1}</span>
      <span>{label}</span>
    </motion.li>
  );
}

/**
 * One tile, sixteen copies. As the section scrolls, every copy turns into
 * place for a new composition: the same piece, another wall.
 */
export function System() {
  const t = useTranslations("system");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const next = rng(31);
  const cells = Array.from({ length: SIDE * SIDE }, (_, k) => {
    const r = Math.floor(k / SIDE);
    const c = k % SIDE;
    const t0 = Math.floor(next() * 4);
    const t1 = forward(t0, target.circles(r, c));
    const t2 = forward(t1, target.bows(r, c));
    return [t0, t1, t2];
  });

  return (
    <section
      id="system"
      ref={ref}
      aria-labelledby="system-title"
      className={`relative bg-glaze text-ink ${reduce ? "" : "lg:h-[300svh]"}`}
    >
      <div className="grid gap-12 px-4 py-24 sm:px-8 lg:sticky lg:top-0 lg:min-h-svh lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-center lg:py-16">
        <div className="flex max-w-[40rem] flex-col gap-7">
          <p className="font-mono text-[13px] text-ink-soft">{t("kicker")}</p>
          <h2
            id="system-title"
            className="display text-[clamp(2.6rem,5.6vw,5rem)]"
          >
            {t("title")}
          </h2>
          <p className="text-[clamp(1.15rem,1.5vw,1.35rem)] leading-[1.5]">
            {t("body")}
          </p>
          <p className="max-w-[52ch] text-[17px] leading-[1.6] text-ink-soft">
            {t("detail")}
          </p>
          {!reduce && (
            <ol
              className="flex flex-col gap-2 border-t-2 border-ink pt-4 text-[17px] font-medium"
              aria-label={t("stages")}
            >
              {STAGES.map((key, i) => (
                <StageLabel
                  key={key}
                  progress={scrollYProgress}
                  i={i}
                  label={t(key)}
                />
              ))}
            </ol>
          )}
        </div>
        <figure className="flex flex-col gap-3">
          <div
            className="grid aspect-square w-full grid-cols-4 border-2 border-ink"
            aria-hidden="true"
          >
            {cells.map((turns, k) =>
              reduce ? (
                <TileArt
                  key={k}
                  motif="quarter"
                  ground="glaze"
                  figure="cobalt"
                  className="block h-full w-full"
                  style={{ transform: `rotate(${turns[1] * 90}deg)` }}
                />
              ) : (
                <ScrubTile key={k} progress={scrollYProgress} turns={turns} />
              ),
            )}
          </div>
          <figcaption className="text-[14px] text-ink-soft">
            {t("caption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
