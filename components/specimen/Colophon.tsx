import { useTranslations } from "next-intl";
import { KineticText } from "./KineticText";

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
      className="bg-vermilion px-4 pt-24 pb-8 text-ink sm:px-8 sm:pt-32"
    >
      <h2
        id="contact-title"
        className="display text-[clamp(2.6rem,11vw,10rem)]"
      >
        <KineticText
          text={t("title")}
          rest={{ wdth: 100, wght: 850 }}
          onView
          stagger={45}
        />
      </h2>
      <p className="mt-8 max-w-[34ch] text-[clamp(1.3rem,2.2vw,1.9rem)] font-medium leading-[1.15]">
        {t("line")}
      </p>

      <a
        href={`mailto:${email}`}
        className="display mt-14 block break-all text-[clamp(1.7rem,5.4vw,5.2rem)] leading-none underline decoration-[0.06em] underline-offset-[0.14em] transition-[text-decoration-color] duration-150 hover:decoration-transparent"
        style={{ fontVariationSettings: '"wdth" 80, "wght" 750' }}
      >
        {email}
      </a>

      <ul className="mt-12 flex flex-wrap gap-3">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center border-2 border-ink px-5 text-[17px] font-medium no-underline transition-colors duration-150 hover:bg-ink hover:text-vermilion"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-24 flex flex-wrap justify-between gap-4 border-t-2 border-ink pt-5 text-[14px]">
        <span>
          © {new Date().getFullYear()} {t("copyright")}
        </span>
        <span>{t("set_in")}</span>
      </div>
    </footer>
  );
}
