"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { TilePanel } from "./TilePanel";

const INDEX = [
  "system",
  "cases",
  "career",
  "voices",
  "index",
  "contact",
] as const;

export function Cover() {
  const t = useTranslations("cover");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const other = locale === "pt" ? "en" : "pt";
  const [recompose, setRecompose] = useState(0);

  return (
    <section
      id="cover"
      aria-labelledby="cover-name"
      className="bg-glaze text-ink"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b-2 border-ink px-4 py-4 text-[15px] sm:px-8">
        <a href="#top" className="font-semibold no-underline">
          pablostefan.com.br
        </a>
        <nav
          aria-label={nav("label")}
          className="order-3 w-full md:order-none md:w-auto"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {INDEX.map((key) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="underline decoration-transparent transition-[text-decoration-color] duration-150 hover:decoration-cobalt"
                >
                  {nav(key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href={`/${other}`}
          hrefLang={other}
          className="border-2 border-ink px-3 py-1.5 text-[14px] font-medium no-underline transition-colors duration-150 hover:bg-ink hover:text-glaze"
        >
          {nav("switch_locale")}
        </Link>
      </header>

      <TilePanel
        count={84}
        seed={1957}
        recompose={recompose}
        className="[--cols:6] [--rows:11] [aspect-ratio:var(--cols)/var(--rows)] md:[--cols:12] md:[--rows:7]"
      >
        <div className="panel-block flex flex-col justify-end bg-glaze px-[calc(var(--cell)*0.2)] pb-[calc(var(--cell)*0.22)] [--x:0] [--y:1] [--w:5] [--h:3] md:[--x:1] md:[--y:2] md:[--w:7]">
          <h1
            id="cover-name"
            className="display text-[calc(var(--cell)*1.02)] leading-[0.9] md:text-[calc(var(--cell)*1.28)]"
          >
            Pablo
            <br />
            Stefan
          </h1>
        </div>

        <div className="panel-block flex flex-col justify-between gap-4 bg-glaze p-5 [--x:1] [--y:5] [--w:5] [--h:4] md:[--x:8] md:[--y:2] md:[--w:3] md:[--h:3] lg:p-6">
          <p className="text-[clamp(1.2rem,1.75vw,1.7rem)] font-semibold leading-[1.3]">
            {t("line")}
          </p>
          <div className="flex flex-col gap-4">
            <p className="text-[16px] leading-snug text-ink-soft">
              {t("role")} {t("org")}
              <br />
              {t("place")}
            </p>
            <a
              href="mailto:pablo.stefan.dev@gmail.com"
              className="inline-flex min-h-12 items-center justify-center bg-cobalt px-5 text-[16px] font-semibold text-glaze no-underline transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              {t("cta")}
            </a>
          </div>
        </div>

        <div className="panel-block flex items-center justify-center bg-ink [--x:3] [--y:10] [--w:3] [--h:1] md:[--x:9] md:[--y:6] md:[--w:3]">
          <button
            type="button"
            onClick={() => setRecompose((n) => n + 1)}
            className="flex h-full w-full items-center justify-center gap-3 px-4 text-[15px] font-semibold text-ochre transition-colors duration-150 hover:bg-cobalt hover:text-glaze"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 9a6 6 0 1 1-1.76-4.24M15 2v3.5h-3.5" />
            </svg>
            {t("recompose")}
          </button>
        </div>
      </TilePanel>
    </section>
  );
}
