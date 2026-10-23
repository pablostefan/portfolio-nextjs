import { useTranslations } from "next-intl";
import { KineticText } from "./KineticText";
import { SemanticsSpecimen } from "./SemanticsSpecimen";
import { MorphixCompare } from "./MorphixCompare";
import { EaseCurve } from "./EaseCurve";

function Figure({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`pb-4 ${className}`}>
      <span className="glyph-cell display tabular block text-[clamp(3.6rem,11vw,9.5rem)] leading-[1.05]">
        <KineticText
          text={value}
          rest={{ wdth: 110, wght: 850 }}
          peak={{ wdth: 150, wght: 900 }}
          onView
          radius={200}
        />
      </span>
      <span className="mt-2 block max-w-[22ch] text-[16px] leading-snug">
        {label}
      </span>
    </div>
  );
}

export function Cases() {
  const t = useTranslations("cases");

  return (
    <section id="cases" aria-labelledby="cases-title">
      <h2 id="cases-title" className="sr-only">
        {t("title")}
      </h2>

      {/* SOMA */}
      <article
        className="stock-bottle bg-bottle px-4 py-24 text-paper sm:px-8 sm:py-32"
        aria-labelledby="case-soma"
      >
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-10 text-paper-soft">
            <Figure
              value="250+"
              label={t("soma.figure_a")}
              className="text-paper"
            />
            <Figure
              value="−40%"
              label={t("soma.figure_b")}
              className="text-paper"
            />
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-[16px] text-paper-soft">{t("soma.kicker")}</p>
            <h3
              id="case-soma"
              className="display text-[clamp(3.5rem,8vw,7rem)]"
              style={{ fontVariationSettings: '"wdth" 140, "wght" 900' }}
            >
              {t("soma.name")}
            </h3>
            <p
              className="display max-w-[20ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]"
              style={{ fontVariationSettings: '"wdth" 90, "wght" 600' }}
            >
              {t("soma.headline")}
            </p>
            <p className="max-w-[58ch] text-[18px] leading-[1.6]">
              {t("soma.body")}
            </p>
            <SemanticsSpecimen
              caption={t("soma.specimen")}
              showLabel={t("soma.show")}
              hideLabel={t("soma.hide")}
            />
          </div>
        </div>
      </article>

      {/* Morphix */}
      <article
        className="bg-fog px-4 py-24 text-ink sm:px-8 sm:py-32"
        aria-labelledby="case-morphix"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <div className="flex flex-col gap-7">
            <h3
              id="case-morphix"
              className="display text-[clamp(3.5rem,8vw,7rem)]"
              style={{ fontVariationSettings: '"wdth" 70, "wght" 900' }}
            >
              {t("morphix.name")}
            </h3>
            <p
              className="display max-w-[18ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]"
              style={{ fontVariationSettings: '"wdth" 90, "wght" 600' }}
            >
              {t("morphix.headline")}
            </p>
            <p className="max-w-[56ch] text-[18px] leading-[1.6]">
              {t("morphix.body")}
            </p>
            <div className="max-w-md pb-4 text-ink">
              <span className="glyph-cell display tabular block text-[clamp(3.5rem,8vw,6.5rem)] leading-[1.05] text-rust">
                <KineticText
                  text={t("morphix.value")}
                  rest={{ wdth: 85, wght: 850 }}
                  peak={{ wdth: 120, wght: 900 }}
                  onView
                  stagger={40}
                  radius={160}
                />
              </span>
              <span className="mt-2 block text-[16px]">
                {t("morphix.figure")}
              </span>
            </div>
            <a
              href="https://github.com/pablostefan/morphix"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[17px] font-medium underline decoration-2 hover:text-rust"
            >
              {t("morphix.link")}
            </a>
          </div>
          <MorphixCompare
            label={t("morphix.compare_label")}
            before={t("morphix.before")}
            after={t("morphix.after")}
            diffs={[t("morphix.diff_1"), t("morphix.diff_2")]}
            note={t("morphix.illustration")}
          />
        </div>
      </article>

      {/* Motion */}
      <article
        className="bg-ink px-4 py-24 text-fog sm:px-8 sm:py-32"
        aria-labelledby="case-motion"
      >
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="flex flex-col gap-7">
            <h3
              id="case-motion"
              className="display text-[clamp(3.5rem,8vw,7rem)] text-vermilion"
              style={{ fontVariationSettings: '"wdth" 120, "wght" 900' }}
            >
              {t("motion.name")}
            </h3>
            <p
              className="display max-w-[20ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]"
              style={{ fontVariationSettings: '"wdth" 90, "wght" 600' }}
            >
              {t("motion.headline")}
            </p>
            <p className="max-w-[58ch] text-[18px] leading-[1.6] text-fog/85">
              {t("motion.body")}
            </p>
            <div className="max-w-md pb-4">
              <span className="glyph-cell display tabular block text-[clamp(3.6rem,11vw,9.5rem)] leading-[1.05] text-fog">
                <KineticText
                  text="650+"
                  rest={{ wdth: 110, wght: 850 }}
                  onView
                  radius={200}
                />
              </span>
              <span className="mt-2 block text-[16px] text-fog">
                {t("motion.figure")}
              </span>
            </div>
          </div>
          <EaseCurve caption={t("motion.curve")} />
        </div>
      </article>
    </section>
  );
}
