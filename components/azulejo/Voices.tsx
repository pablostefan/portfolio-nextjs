import { useLocale, useTranslations } from "next-intl";
import data from "@/data/recommendations.json";
import type { Motif } from "@/lib/tiles";
import { TileArt } from "./TileArt";

type Locale = "pt" | "en";

const MARKS: Motif[] = ["lens", "half"];

export function Voices() {
  const t = useTranslations("voices");
  const locale = useLocale() as Locale;

  return (
    <section
      id="voices"
      aria-labelledby="voices-title"
      className="bg-cobalt px-4 py-24 text-glaze sm:px-8 sm:py-32"
    >
      <h2
        id="voices-title"
        className="display mb-16 text-[clamp(2.8rem,6vw,5.5rem)]"
      >
        {t("title")}
      </h2>
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        {data.recommendations.map((rec, i) => (
          <figure
            key={rec.name}
            className={`flex flex-col gap-8 ${i === 1 ? "lg:pt-40" : ""}`}
          >
            <blockquote
              lang={locale === "en" ? "en" : "pt-BR"}
              className="display text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.15] font-medium tracking-[-0.02em]"
            >
              <p>“{rec.quote[locale]}”</p>
            </blockquote>
            <figcaption className="flex items-center gap-4 border-t-2 border-glaze/40 pt-5 text-[16px]">
              <span className="size-14 shrink-0" aria-hidden="true">
                <TileArt
                  motif={MARKS[i % MARKS.length]}
                  ground="glaze"
                  figure="cobalt"
                  className="block h-full w-full"
                />
              </span>
              <span>
                <span className="block font-semibold">{rec.name}</span>
                <span className="block text-glaze-soft">{rec.role}</span>
                <span className="mt-1 block text-[14px] text-glaze-soft">
                  {t("source")}
                  {locale === "en" ? `. ${t("translated")}.` : "."}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
