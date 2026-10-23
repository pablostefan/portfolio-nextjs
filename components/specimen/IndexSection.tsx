import { useLocale, useTranslations } from "next-intl";
import type { Certification, Project } from "@/types";

interface IndexSectionProps {
  projects: Project[];
  certs: Certification[];
}

function monthYear(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h3
        className="display mb-6 text-[clamp(1.8rem,3vw,2.6rem)]"
        style={{ fontVariationSettings: '"wdth" 100, "wght" 750' }}
      >
        {title}
      </h3>
      <ul className="border-t-2 border-ink">{children}</ul>
    </div>
  );
}

const rowLink =
  "group grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-ink/25 py-4 no-underline transition-colors duration-150 hover:bg-ink hover:text-fog sm:px-2";

export function IndexSection({ projects, certs }: IndexSectionProps) {
  const t = useTranslations("index");
  const locale = useLocale();
  const visible = projects.slice(0, 6);

  return (
    <section
      id="index"
      aria-labelledby="index-title"
      className="bg-fog px-4 py-24 text-ink sm:px-8 sm:py-32"
    >
      <h2
        id="index-title"
        className="display mb-16 text-[clamp(2.8rem,6vw,5.5rem)]"
        style={{ fontVariationSettings: '"wdth" 75, "wght" 850' }}
      >
        {t("title")}
      </h2>
      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        <Column title={t("projects")}>
          {visible.length === 0 && (
            <li className="py-4 text-[17px]">{t("empty")}</li>
          )}
          {visible.map((p) => (
            <li key={p.id}>
              <a href={p.homepage || p.html_url} className={rowLink}>
                <span className="min-w-0">
                  <span className="block text-[19px] font-semibold">
                    {p.name.replace(/[-_]/g, " ")}
                  </span>
                  {p.description && (
                    <span className="mt-1 block text-[15px] leading-snug opacity-80">
                      {p.description}
                    </span>
                  )}
                </span>
                <span className="tabular shrink-0 text-[14px] opacity-70">
                  {p.language ?? ""}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a href="https://github.com/pablostefan" className={rowLink}>
              <span className="text-[17px] font-medium">{t("github")}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-1"
              >
                ↗
              </span>
            </a>
          </li>
        </Column>

        <div className="flex flex-col gap-16">
          <Column title={t("certifications")}>
            {certs.map((c) => (
              <li key={c.id}>
                <a href={c.credentialUrl ?? "#"} className={rowLink}>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold leading-snug">
                      {c.name}
                    </span>
                    <span className="block text-[15px] opacity-80">
                      {c.issuer}
                    </span>
                  </span>
                  <span className="tabular shrink-0 text-[14px] opacity-70">
                    {monthYear(c.issueDate, locale)}
                  </span>
                </a>
              </li>
            ))}
          </Column>
          <Column title={t("education")}>
            <li className="border-b border-ink/25 py-4 text-[17px] font-semibold sm:px-2">
              {t("education_name")}
            </li>
          </Column>
        </div>
      </div>
    </section>
  );
}
