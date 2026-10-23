"use client";

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { layPanel, rng } from "@/lib/tiles";
import type { Motif, PaletteEntry } from "@/lib/tiles";
import { TileArt } from "./TileArt";

interface TilePanelProps {
  /** Tiles to lay; extra rows are clipped by the panel's height */
  count: number;
  seed: number;
  motifs?: Motif[];
  palette?: PaletteEntry[];
  /** Sets --cols (and the height) per breakpoint */
  className?: string;
  style?: CSSProperties;
  /** Hover turns the tile under a fine pointer a quarter */
  interactive?: boolean;
  /** Hold the laying-in until the panel scrolls into view */
  onView?: boolean;
  /** Each change gives every tile a new turn, same pieces, new composition */
  recompose?: number;
  children?: ReactNode;
}

const LAY_SPREAD_MS = 700;
const RECOMPOSE_SPREAD_MS = 450;

function turnTile(el: HTMLElement, by: number, delay = 0) {
  const turn = Number(el.dataset.turn ?? 0) + by;
  el.dataset.turn = String(turn);
  el.style.setProperty("--rot", `${turn * 90}deg`);
  el.style.setProperty("--delay", `${delay}ms`);
}

/**
 * A wall of tiles. Rotation lives on the DOM (data-turn and --rot) rather than
 * in React state, so hovering a tile never re-renders the panel.
 */
export function TilePanel({
  count,
  seed,
  motifs,
  palette,
  className = "",
  style,
  interactive = true,
  onView = false,
  recompose = 0,
  children,
}: TilePanelProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiles = useMemo(
    () => layPanel(count, seed, { motifs, palette }),
    [count, seed, motifs, palette],
  );
  const delays = useMemo(() => {
    const next = rng(seed ^ 0x9e3779b9);
    return tiles.map(() => Math.round(next() * LAY_SPREAD_MS));
  }, [tiles, seed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !onView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        delete root.dataset.wait;
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [onView]);

  useEffect(() => {
    if (!recompose) return;
    const root = rootRef.current;
    if (!root) return;
    const next = rng(seed + recompose * 7919);
    root.querySelectorAll<HTMLElement>("[data-tile]").forEach((el) => {
      turnTile(
        el,
        1 + Math.floor(next() * 3),
        reduce ? 0 : Math.round(next() * RECOMPOSE_SPREAD_MS),
      );
    });
  }, [recompose, seed, reduce]);

  const onPointerOver = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive || reduce || e.pointerType === "touch") return;
    const el = (e.target as Element).closest<HTMLElement>("[data-tile]");
    if (!el || el.dataset.busy) return;
    // One turn per visit: the tile stays still until the pointer leaves it.
    el.dataset.busy = "1";
    turnTile(el, 1);
    el.addEventListener("pointerleave", () => delete el.dataset.busy, {
      once: true,
    });
  };

  return (
    <div
      ref={rootRef}
      className={`panel relative overflow-hidden ${className}`}
      style={style}
      data-wait={onView ? "" : undefined}
    >
      <div
        className="panel-grid"
        aria-hidden="true"
        onPointerOver={onPointerOver}
      >
        {tiles.map((tile, i) => (
          <span
            key={i}
            data-tile=""
            data-turn={tile.turn}
            className="tile tile-in"
            style={
              {
                "--rot": `${tile.turn * 90}deg`,
                "--in": `${delays[i]}ms`,
              } as CSSProperties
            }
          >
            <TileArt
              motif={tile.motif}
              ground={tile.ground}
              figure={tile.figure}
            />
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
