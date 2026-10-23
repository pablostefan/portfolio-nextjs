"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import type { Motif } from "@/lib/tiles";
import { TileArt } from "./TileArt";

interface TileCascadeProps {
  replayLabel: string;
  caption: string;
}

const MOTIFS: Motif[] = ["quarter", "half", "lens", "arc", "tri", "dot"];
const DURATION = 450;
const STAGGER = 60;

/**
 * The motion tokens at work: six tiles turn a quarter each with the same
 * duration, curve and stagger. It plays once in view and on demand.
 */
export function TileCascade({ replayLabel, caption }: TileCascadeProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTurns((n) => n + 1);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <figure className="flex flex-col gap-5">
      <div ref={ref} className="grid grid-cols-6 gap-1.5" aria-hidden="true">
        {MOTIFS.map((motif, i) => (
          <span key={motif} className="aspect-square overflow-hidden">
            <TileArt
              motif={motif}
              ground={i % 2 ? "ochre" : "glaze"}
              figure="ink"
              className="block h-full w-full"
              style={
                {
                  transform: `rotate(${turns * 90}deg)`,
                  transition: reduce
                    ? "none"
                    : `transform ${DURATION}ms cubic-bezier(0.23, 1, 0.32, 1) ${i * STAGGER}ms`,
                } as CSSProperties
              }
            />
          </span>
        ))}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-4">
        <code className="font-mono text-[13px] leading-relaxed text-ash">
          {caption}
        </code>
        {!reduce && (
          <button
            type="button"
            onClick={() => setTurns((n) => n + 1)}
            className="min-h-11 border-2 border-glaze px-4 text-[15px] font-semibold text-glaze transition-colors duration-150 hover:border-ochre hover:text-ochre"
          >
            {replayLabel}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
