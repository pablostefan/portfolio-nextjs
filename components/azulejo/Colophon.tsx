import { useTranslations } from "next-intl";
import { TilePanel } from "./TilePanel";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pablosgpereira" },
  { label: "GitHub", href: "https://github.com/pablostefan" },
  { label: "Medium", href: "https://medium.com/@pablo.stefan" },
];

export function Colophon() {
  const t = useTranslations("colophon");
  const email = t("email");

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="bg-cobalt text-ink"
    >
      <TilePanel
        count={96}
        seed={1960}
        onView
        className="[--cols:6] [--rows:12] [aspect-ratio:var(--cols)/var(--rows)] md:[--cols:12] md:[--rows:7]"
      >
        <div className="panel-block flex flex-col justify-between gap-6 bg-glaze p-5 [--x:0] [--y:1] [--w:6] [--h:8] sm:p-8 md:[--x:1] md:[--y:1] md:[--w:8] md:[--h:5]">
          <div className="flex flex-col gap-5">
            <h2
              id="contact-title"
              className="display text-[clamp(2.8rem,7vw,6.5rem)]"
            >
              {t("title")}
            </h2>
            <p className="max-w-[34ch] text-[clamp(1.15rem,1.8vw,1.6rem)] font-medium leading-[1.3]">
              {t("line")}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <a
              href={`mailto:${email}`}
              className="display w-fit break-all text-[clamp(1.4rem,3.6vw,3.4rem)] leading-none text-cobalt underline decoration-[0.06em] underline-offset-[0.14em] transition-[text-decoration-color] duration-150 hover:decoration-transparent"
            >
              {email}
            </a>
            <ul className="flex flex-wrap gap-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center border-2 border-ink px-5 text-[17px] font-semibold no-underline transition-colors duration-150 hover:bg-ink hover:text-glaze"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TilePanel>
      <div className="flex flex-wrap justify-between gap-4 bg-ink px-4 py-5 text-[14px] text-ash sm:px-8">
        <span>
          © {new Date().getFullYear()} {t("copyright")}
        </span>
        <span>{t("set_in")}</span>
      </div>
    </footer>
  );
}
