import { useTranslations } from "next-intl";
import type { Glaze, Motif } from "@/lib/tiles";
import { TileArt } from "./TileArt";
import { SemanticsSpecimen } from "./SemanticsSpecimen";
import { TileDiff } from "./TileDiff";
import { TileCascade } from "./TileCascade";

interface FigureProps {
  value: string;
  label: string;
  motif: Motif;
  ground: Glaze;
  figure: Glaze;
  /** Font size of the number */
  size?: string;
  valueClass?: string;
  labelClass?: string;
}

/** A key number set beside the tile that stands for it. */
function Figure({
  value,
  label,
  motif,
  ground,
  figure,
  size = "text-[clamp(3.6rem,8.5vw,7.5rem)]",
  valueClass = "",
  labelClass = "",
}: FigureProps) {
  return (
    <div className="flex items-end gap-5">
      <span
        className="block size-[clamp(3.5rem,9vw,7.5rem)] shrink-0"
        aria-hidden="true"
      >
        <TileArt
          motif={motif}
          ground={ground}
          figure={figure}
          className="block h-full w-full"
        />
      </span>
      <div className="min-w-0">
        <span
          className={`display tabular block leading-[0.85] ${size} ${valueClass}`}
        >
          {value}
        </span>
        <span
          className={`mt-3 block max-w-[24ch] text-[16px] leading-snug ${labelClass}`}
        >
          {label}
        </span>
      </div>
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
        className="bg-cobalt px-4 py-24 text-glaze sm:px-8 sm:py-32"
        aria-labelledby="case-soma"
      >
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-12">
            <Figure
              value="250+"
              label={t("soma.figure_a")}
              motif="quarter"
              ground="glaze"
              figure="cobalt"
              labelClass="text-glaze-soft"
            />
            <Figure
              value="−40%"
              label={t("soma.figure_b")}
              motif="tri"
              ground="ochre"
              figure="ink"
              labelClass="text-glaze-soft"
            />
          </div>
          <div className="flex flex-col gap-7">
            <p className="font-mono text-[13px] text-glaze-soft">
              {t("soma.kicker")}
            </p>
            <h3
              id="case-soma"
              className="display text-[clamp(3.5rem,8vw,7rem)]"
            >
              {t("soma.name")}
            </h3>
            <p className="display max-w-[20ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-semibold">
              {t("soma.headline")}
            </p>
            <p className="max-w-[56ch] text-[18px] leading-[1.6] text-glaze-soft">
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
        className="bg-glaze px-4 py-24 text-ink sm:px-8 sm:py-32"
        aria-labelledby="case-morphix"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="flex flex-col gap-7">
            <h3
              id="case-morphix"
              className="display text-[clamp(3.5rem,8vw,7rem)] text-cobalt"
            >
              {t("morphix.name")}
            </h3>
            <p className="display max-w-[18ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-semibold">
              {t("morphix.headline")}
            </p>
            <p className="max-w-[56ch] text-[18px] leading-[1.6]">
              {t("morphix.body")}
            </p>
            <Figure
              value={t("morphix.value")}
              label={t("morphix.figure")}
              motif="lens"
              ground="cobalt"
              figure="glaze"
              size="text-[clamp(2rem,6vw,5.5rem)]"
              labelClass="text-ink-soft"
            />
            <a
              href="https://github.com/pablostefan/morphix"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[17px] font-semibold underline decoration-2 hover:text-cobalt"
            >
              {t("morphix.link")}
            </a>
          </div>
          <TileDiff
            mainLabel={t("morphix.before")}
            prLabel={t("morphix.after")}
            showLabel={t("morphix.show")}
            hideLabel={t("morphix.hide")}
            diffs={[t("morphix.diff_1"), t("morphix.diff_2")]}
            note={t("morphix.illustration")}
          />
        </div>
      </article>

      {/* Motion */}
      <article
        className="bg-ink px-4 py-24 text-glaze sm:px-8 sm:py-32"
        aria-labelledby="case-motion"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="flex flex-col gap-7">
            <h3
              id="case-motion"
              className="display text-[clamp(3.5rem,8vw,7rem)] text-ochre"
            >
              {t("motion.name")}
            </h3>
            <p className="display max-w-[20ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] font-semibold">
              {t("motion.headline")}
            </p>
            <p className="max-w-[58ch] text-[18px] leading-[1.6] text-ash">
              {t("motion.body")}
            </p>
            <Figure
              value="650+"
              label={t("motion.figure")}
              motif="arc"
              ground="ochre"
              figure="ink"
              labelClass="text-ash"
            />
          </div>
          <TileCascade
            replayLabel={t("motion.replay")}
            caption={t("motion.tokens")}
          />
        </div>
      </article>
    </section>
  );
}
