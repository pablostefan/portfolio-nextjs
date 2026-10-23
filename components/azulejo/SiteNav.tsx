"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SECTIONS = [
  "system",
  "cases",
  "career",
  "voices",
  "index",
  "contact",
] as const;

/**
 * The cover prints its own index. Once the cover scrolls away, a black tab
 * slides in from the top edge carrying the same index and the language switch.
 */
export function SiteNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [pastCover, setPastCover] = useState(false);
  const other = locale === "pt" ? "en" : "pt";

  useEffect(() => {
    const cover = document.getElementById("cover");
    if (!cover) return;
    const io = new IntersectionObserver(
      ([entry]) => setPastCover(!entry.isIntersecting),
      {
        rootMargin: "-20% 0px 0px 0px",
      },
    );
    io.observe(cover);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href="#system"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-glaze"
      >
        {t("skip")}
      </a>
      <AnimatePresence>
        {pastCover && (
          <motion.nav
            key="tab"
            aria-label={t("label")}
            initial={
              reduce ? { opacity: 0 } : { transform: "translateY(-110%)" }
            }
            animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
            exit={reduce ? { opacity: 0 } : { transform: "translateY(-110%)" }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
          >
            <div className="flex max-w-full items-center gap-1 overflow-x-auto bg-ink px-2 py-2 text-[15px] text-glaze">
              <a
                href="#top"
                className="display shrink-0 px-3 py-2 text-[17px] text-ochre"
              >
                PS
              </a>
              {SECTIONS.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="hidden shrink-0 px-3 py-2 transition-colors duration-150 hover:text-ochre sm:inline-block"
                >
                  {t(key)}
                </a>
              ))}
              <a
                href="#contact"
                className="shrink-0 px-3 py-2 hover:text-ochre sm:hidden"
              >
                {t("contact")}
              </a>
              <Link
                href={`/${other}`}
                hrefLang={other}
                className="ml-1 shrink-0 border border-glaze/40 px-3 py-1.5 text-[13px] transition-colors duration-150 hover:border-ochre hover:text-ochre"
              >
                {t("switch_locale")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
