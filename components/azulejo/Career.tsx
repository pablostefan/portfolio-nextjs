import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import profile from "@/data/profile.json";
import type { ExperienceEntry } from "@/types";
import { TilePanel } from "./TilePanel";

type Locale = "pt" | "en";

export function Career() {
  const t = useTranslations("career");
  const locale = (useLocale() as Locale) ?? "pt";
  const entries = profile.experience as ExperienceEntry[];
  const n = entries.length;

  return (
    <section
      id="career"
      aria-labelledby="career-title"
      className="bg-glaze px-4 py-24 text-ink sm:px-8 sm:py-32"
    >
      <div className="mb-14 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <h2
          id="career-title"
          className="display text-[clamp(2.8rem,6vw,5.5rem)]"
        >
          {t("title")}
        </h2>
        <p className="max-w-[40ch] text-[19px] leading-snug">{t("intro")}</p>
      </div>
      <ol className="border-b-2 border-ink">
        {entries.map((entry, i) => {
          // Newest first: the current role carries the most pieces, the first job one.
          const pieces = n - i;
          return (
            <li
              key={`${entry.company}-${entry.period.en}`}
              className="grid gap-x-10 gap-y-5 border-t-2 border-ink py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
            >
              <div className="flex min-w-0 flex-col gap-5">
                <TilePanel
                  count={pieces}
                  seed={101 + i * 17}
                  onView
                  className="w-[calc(var(--cols)*clamp(2.75rem,5vw,4rem))]"
                  // The strip is as many cells wide as it has pieces.
                  style={{ "--cols": pieces } as CSSProperties}
                />
                <h3 className="display min-w-0 text-[clamp(2.6rem,7vw,6rem)]">
                  {entry.company}
                </h3>
              </div>
              <div className="flex flex-col gap-3 md:pt-2">
                <p className="flex flex-wrap items-baseline gap-x-3 text-[15px] text-ink-soft">
                  <span>{entry.period[locale]}</span>
                  {entry.current && (
                    <span className="bg-cobalt px-2 py-0.5 text-[13px] font-semibold text-glaze">
                      {t("current")}
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
        })}
      </ol>
    </section>
  );
}
