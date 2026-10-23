"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SemanticsSpecimenProps {
  caption: string;
  showLabel: string;
  hideLabel: string;
}

const NODES = [
  ["role", "button"],
  ["label", '"Investir"'],
  ["hint", '"Abre a ordem de compra"'],
  ["focusable", "true"],
  ["minSize", "48 × 48"],
] as const;

/** A component drawn with the semantics tree a screen reader receives from it. */
export function SemanticsSpecimen({
  caption,
  showLabel,
  hideLabel,
}: SemanticsSpecimenProps) {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();

  return (
    <figure className="border border-glaze/30 p-5 sm:p-7">
      <div className="flex flex-wrap items-start gap-8">
        <div className="relative">
          <span className="flex h-12 min-w-44 items-center justify-center bg-glaze px-6 text-[16px] font-semibold text-cobalt">
            Investir
          </span>
          <AnimatePresence>
            {open && (
              <motion.span
                aria-hidden="true"
                initial={
                  reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }
                }
                animate={
                  reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }
                }
                exit={
                  reduce ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }
                }
                transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
                className="pointer-events-none absolute -inset-2 border-2 border-dashed border-ochre"
              />
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.dl
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "translateX(-8px)" }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateX(0px)" }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 font-mono text-[13px] text-glaze"
            >
              {NODES.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-glaze-soft">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </AnimatePresence>
      </div>
      <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[14px] text-glaze-soft">
        <span>{caption}</span>
        <button
          type="button"
          aria-pressed={open}
          onClick={() => setOpen((v) => !v)}
          className="min-h-11 border border-glaze/50 px-4 text-glaze transition-colors duration-150 hover:border-ochre hover:text-ochre"
        >
          {open ? hideLabel : showLabel}
        </button>
      </figcaption>
    </figure>
  );
}
