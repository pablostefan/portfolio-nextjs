import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { KineticText } from "./KineticText";

const INDEX = ["cases", "career", "voices", "index", "contact"] as const;

export function Cover() {
  const t = useTranslations("cover");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const other = locale === "pt" ? "en" : "pt";

  return (
    <section
      id="cover"
      aria-labelledby="cover-name"
      className="relative flex min-h-svh flex-col bg-vermilion px-4 pb-6 pt-5 text-ink sm:px-8"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-[15px]">
        <a href="#top" className="font-medium no-underline">
          pablostefan.com.br
        </a>
        <nav
          aria-label={nav("label")}
          className="order-3 w-full sm:order-none sm:w-auto"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {INDEX.map((key) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  className="underline decoration-transparent transition-[text-decoration-color] duration-150 hover:decoration-ink"
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
          className="border border-ink px-3 py-1.5 text-[14px] no-underline transition-colors duration-150 hover:bg-ink hover:text-vermilion"
        >
          {nav("switch_locale")}
        </Link>
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <h1
          id="cover-name"
          className="display -ml-[0.04em] text-[clamp(4.5rem,23vw,24rem)] leading-[0.8]"
        >
          <KineticText text="Pablo" className="block" radius={380} />
          <KineticText
            text="Stefan"
            className="block"
            stagger={60}
            radius={380}
          />
        </h1>
        <p className="mt-6 hidden text-[14px] [@media(hover:hover)_and_(pointer:fine)]:block motion-reduce:hidden">
          {t("hint")}
        </p>
      </div>

      <div className="grid gap-6 border-t-2 border-ink pt-5 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
        <p className="max-w-[26ch] text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-[1.12]">
          {t("line")}
        </p>
        <p className="text-[17px] leading-snug">
          {t("role")}
          <br />
          {t("org")}
          <br />
          {t("place")}
        </p>
        <a
          href="mailto:pablo.stefan.dev@gmail.com"
          className="inline-flex min-h-12 items-center justify-center bg-ink px-6 text-[17px] font-medium text-vermilion no-underline transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
