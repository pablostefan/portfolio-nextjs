import { useLocale, useTranslations } from "next-intl";
import data from "@/data/recommendations.json";

type Locale = "pt" | "en";

export function Voices() {
  const t = useTranslations("voices");
  const locale = useLocale() as Locale;

  return (
    <section
      id="voices"
      aria-labelledby="voices-title"
      className="stock-bottle bg-bottle px-4 py-24 text-paper sm:px-8 sm:py-32"
    >
      <h2
        id="voices-title"
        className="display mb-16 text-[clamp(2.8rem,6vw,5.5rem)]"
        style={{ fontVariationSettings: '"wdth" 75, "wght" 850' }}
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
              className="display text-[clamp(1.6rem,2.9vw,2.6rem)] leading-[1.12]"
              style={{ fontVariationSettings: '"wdth" 88, "wght" 500' }}
            >
              <p>“{rec.quote[locale]}”</p>
            </blockquote>
            <figcaption className="border-t border-paper/30 pt-4 text-[16px]">
              <span className="block font-semibold">{rec.name}</span>
              <span className="block text-paper-soft">{rec.role}</span>
              <span className="mt-2 block text-[14px] text-paper-soft">
                {t("source")}
                {locale === "en" ? `. ${t("translated")}.` : "."}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
