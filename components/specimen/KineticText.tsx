"use client";

import { Fragment, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

interface Axes {
  wdth: number;
  wght: number;
}

interface KineticTextProps {
  text: string;
  /** Resting axes once the entrance settles */
  rest?: Axes;
  /** Axes a glyph reaches right under the pointer */
  peak?: Axes;
  /** Axes the entrance starts from */
  from?: Axes;
  /** Pointer influence radius in px */
  radius?: number;
  /** Delay between glyphs during the entrance, in ms */
  stagger?: number;
  /** Start the entrance only when scrolled into view */
  onView?: boolean;
  className?: string;
}

const LERP = 0.16;
const ENTRANCE_MS = 1100;

function axesString(a: Axes) {
  return `"wdth" ${a.wdth.toFixed(1)}, "wght" ${a.wght.toFixed(0)}`;
}

/**
 * Variable-font text whose glyphs widen and gain weight near the pointer.
 * Glyphs enter from a hairline through a CSS animation, so the entrance runs
 * before hydration; JS then takes over for pointer tracking on fine pointers.
 * Reduced motion renders the resting axes with no entrance and no tracking.
 */
export function KineticText({
  text,
  rest = { wdth: 100, wght: 800 },
  peak = { wdth: 150, wght: 900 },
  from = { wdth: 50, wght: 100 },
  radius = 260,
  stagger = 55,
  onView = false,
  className,
}: KineticTextProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  let count = 0;
  const words = text.split(" ").map((word) => {
    const offset = count;
    count += Array.from(word).length;
    return { word, offset };
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;

    const glyphs = glyphRefs.current.filter(
      (g): g is HTMLSpanElement => g !== null,
    );
    const current = glyphs.map(() => ({ ...rest }));
    const centers = glyphs.map(() => ({ x: 0, y: 0 }));
    const handed = glyphs.map(() => false);
    const pointer = { x: -9999, y: -9999, active: false };
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let start = performance.now();
    let frame = 0;
    let visible = true;
    let started = !onView;

    const tick = (now: number) => {
      frame = 0;
      if (!visible || !started) return;
      let busy = false;
      glyphs.forEach((g, i) => {
        if (!handed[i]) {
          if (now - start < i * stagger + ENTRANCE_MS) {
            busy = true;
            return;
          }
          // Entrance finished: freeze the resting axes inline and drop the animation.
          g.style.fontVariationSettings = axesString(current[i]);
          g.style.animation = "none";
          handed[i] = true;
        }
        if (!fine) return;
        const r = g.getBoundingClientRect();
        centers[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        let target = rest;
        if (pointer.active) {
          const d = Math.hypot(
            pointer.x - centers[i].x,
            pointer.y - centers[i].y,
          );
          const k = Math.max(0, 1 - d / radius);
          const eased = k * k * (3 - 2 * k);
          target = {
            wdth: rest.wdth + (peak.wdth - rest.wdth) * eased,
            wght: rest.wght + (peak.wght - rest.wght) * eased,
          };
        }
        const c = current[i];
        const dw = target.wdth - c.wdth;
        const dg = target.wght - c.wght;
        if (Math.abs(dw) > 0.05 || Math.abs(dg) > 0.5) {
          c.wdth += dw * LERP;
          c.wght += dg * LERP;
          g.style.fontVariationSettings = axesString(c);
          busy = true;
        }
      });
      if (busy) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started) {
          started = true;
          start = performance.now();
          root.dataset.play = "true";
        }
        if (visible) wake();
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      wake();
    };
    const onLeave = () => {
      pointer.active = false;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
    // Axes objects are configuration, read once per mount.
  }, [reduce, text]);

  return (
    <span
      ref={rootRef}
      className={`kinetic ${className ?? ""}`}
      aria-label={text}
      role="text"
      data-on-view={onView ? "true" : undefined}
      style={
        {
          "--from-wdth": from.wdth,
          "--from-wght": from.wght,
          "--rest-wdth": rest.wdth,
          "--rest-wght": rest.wght,
          "--stagger": `${stagger}ms`,
        } as CSSProperties
      }
    >
      {words.map(({ word, offset }, w) => (
        // Glyphs of one word stay on one line; lines may only break at spaces.
        <Fragment key={`${word}-${w}`}>
          {w > 0 && " "}
          <span className="whitespace-nowrap">
            {Array.from(word).map((ch, j) => {
              const i = offset + j;
              return (
                <span
                  key={`${ch}-${i}`}
                  ref={(el) => {
                    glyphRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="kinetic-glyph"
                  style={{ "--i": i } as CSSProperties}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
