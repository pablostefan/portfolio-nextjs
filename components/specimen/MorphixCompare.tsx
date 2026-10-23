"use client";

import { useId, useState } from "react";

interface MorphixCompareProps {
  label: string;
  before: string;
  after: string;
  diffs: string[];
  note: string;
}

interface VersionProps {
  tag: string;
  regressed?: boolean;
}

function Version({ tag, regressed = false }: VersionProps) {
  return (
    <div
      className={`flex h-full flex-col gap-5 p-6 text-ink sm:p-8 ${regressed ? "bg-[#f4d9cf]" : "bg-white"}`}
    >
      <span
        className={`font-mono text-[13px] ${regressed ? "self-end text-ink" : "text-ink-soft"}`}
      >
        {tag}
      </span>
      <div className="mx-auto mt-6 flex w-full max-w-72 flex-1 flex-col gap-4">
        <span className="text-[15px] text-ink-soft">Saldo disponível</span>
        <span
          className="display text-[2.4rem]"
          style={{ fontVariationSettings: '"wdth" 100, "wght" 700' }}
        >
          R$ 12.480,00
        </span>
        <span
          className={`flex w-full items-center justify-center bg-ink text-[16px] font-semibold text-fog ${
            regressed
              ? "h-9 outline-2 outline-offset-4 outline-rust outline-dashed"
              : "h-12"
          }`}
        >
          Investir
        </span>
      </div>
      <pre className="mx-auto w-full max-w-72 font-mono text-[12px] leading-[1.7] whitespace-pre-wrap">
        {regressed
          ? "Semantics\n├ button: true\n├ label: —\n└ size: 288 × 36"
          : 'Semantics\n├ button: true\n├ label: "Investir"\n└ size: 288 × 48'}
      </pre>
    </div>
  );
}

/** Before/after component diff in the spirit of Morphix, driven by a native range input. */
export function MorphixCompare({
  label,
  before,
  after,
  diffs,
  note,
}: MorphixCompareProps) {
  const [split, setSplit] = useState(52);
  const id = useId();

  return (
    <figure>
      <div className="relative isolate h-[26rem] overflow-hidden border-2 border-ink select-none sm:h-[24rem]">
        <div className="absolute inset-0">
          <Version tag={before} />
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
          aria-hidden="true"
        >
          <Version tag={after} regressed />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-vermilion"
          style={{ left: `${split}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-vermilion text-ink">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M7 5 2 10l5 5M13 5l5 5-5 5" />
            </svg>
          </span>
        </div>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 grid gap-3 text-[15px] sm:grid-cols-[1fr_auto]">
        <ul className="grid gap-1">
          {diffs.map((d) => (
            <li key={d} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.55em] h-2 w-2 shrink-0 bg-rust"
              />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <span className="text-[14px] text-ink-soft">{note}</span>
      </figcaption>
    </figure>
  );
}
