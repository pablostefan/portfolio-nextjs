"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Glaze, Motif, Turn } from "@/lib/tiles";
import { TileArt } from "./TileArt";

interface TileDiffProps {
  mainLabel: string;
  prLabel: string;
  showLabel: string;
  hideLabel: string;
  diffs: [string, string];
  note: string;
}

interface Cell {
  motif: Motif;
  turn: Turn;
  ground: Glaze;
  figure: Glaze;
}

const MAIN: Cell[] = [
  { motif: "quarter", turn: 2, ground: "glaze", figure: "cobalt" },
  { motif: "quarter", turn: 3, ground: "glaze", figure: "cobalt" },
  { motif: "bar", turn: 0, ground: "cobalt", figure: "glaze" },
  { motif: "dot", turn: 0, ground: "glaze", figure: "ink" },
  { motif: "quarter", turn: 1, ground: "glaze", figure: "cobalt" },
  { motif: "quarter", turn: 0, ground: "glaze", figure: "cobalt" },
  { motif: "bar", turn: 0, ground: "cobalt", figure: "glaze" },
  { motif: "half", turn: 2, ground: "cobalt", figure: "glaze" },
  { motif: "tri", turn: 0, ground: "cobalt", figure: "glaze" },
  { motif: "tri", turn: 1, ground: "cobalt", figure: "glaze" },
  { motif: "lens", turn: 0, ground: "glaze", figure: "cobalt" },
  { motif: "half", turn: 0, ground: "cobalt", figure: "glaze" },
];

// The PR turns one piece out of the pattern and fires another in a color outside the tokens.
const CHANGED: Record<number, { n: 1 | 2; cell: Partial<Cell> }> = {
  5: { n: 1, cell: { turn: 1 } },
  10: { n: 2, cell: { figure: "ochre" } },
};

function Wall({
  label,
  pr,
  show,
}: {
  label: string;
  pr: boolean;
  show: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[13px] text-ink-soft">{label}</span>
      <div className="grid grid-cols-4 border-2 border-ink" aria-hidden="true">
        {MAIN.map((base, i) => {
          const change = CHANGED[i];
          const cell = pr && change ? { ...base, ...change.cell } : base;
          return (
            <span key={i} className="relative aspect-square">
              <TileArt
                {...cell}
                className="block h-full w-full"
                style={{ transform: `rotate(${cell.turn * 90}deg)` }}
              />
              <AnimatePresence>
                {show && change && (
                  <motion.span
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { clipPath: "inset(0 100% 0 0)" }
                    }
                    animate={
                      reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.77, 0, 0.175, 1],
                      delay: change.n * 0.08,
                    }}
                    className="absolute inset-0 flex items-start justify-end border-[3px] border-dashed border-ink"
                  >
                    <span className="tabular bg-ink px-1.5 font-mono text-[12px] leading-5 text-ochre">
                      {change.n}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Morphix in miniature: the same wall before and after a PR, with the differences called out. */
export function TileDiff({
  mainLabel,
  prLabel,
  showLabel,
  hideLabel,
  diffs,
  note,
}: TileDiffProps) {
  const [show, setShow] = useState(true);
  return (
    <figure className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <Wall label={mainLabel} pr={false} show={show} />
        <Wall label={prLabel} pr show={show} />
      </div>
      <figcaption className="flex flex-col gap-4">
        <ol className="grid gap-1 text-[16px]">
          {diffs.map((d, i) => (
            <li key={d} className="flex items-baseline gap-3">
              <span className="tabular bg-ink px-1.5 font-mono text-[12px] leading-5 text-ochre">
                {i + 1}
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[14px] text-ink-soft">{note}</span>
          <button
            type="button"
            aria-pressed={show}
            onClick={() => setShow((v) => !v)}
            className="min-h-11 border-2 border-ink px-4 text-[15px] font-semibold transition-colors duration-150 hover:bg-ink hover:text-glaze"
          >
            {show ? hideLabel : showLabel}
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
