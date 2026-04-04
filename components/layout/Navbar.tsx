'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const NAV_KEYS = ['about', 'experience', 'projects', 'certifications', 'contact'] as const;
type NavKey = (typeof NAV_KEYS)[number];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hovered, setHovered]       = useState<NavKey | null>(null);
  const shouldReduceMotion          = useReducedMotion();
  const t                           = useTranslations('nav');
  const locale                      = useLocale();
  const pathname                    = usePathname();

  useEffect(() => {
    const handle = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  const otherLocale      = locale === 'pt' ? 'en' : 'pt';
  const localeSwitchHref = pathname.replace(
    new RegExp(`^/${locale}(/|$)`),
    `/${otherLocale}$1`,
  ) || `/${otherLocale}`;

  return (
    <>
      <motion.header
        initial={shouldReduceMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || isMenuOpen
            ? 'bg-bg-base/80 backdrop-blur-[20px] border-b border-glass-border shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : '',
        ].join(' ')}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link
              href={`/${locale}#top`}
              className="group flex items-center gap-2.5 rounded-lg px-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Logo size={28} />
              <span className="hidden font-mono text-xs text-content-muted sm:block">
                pablostefan.com.br
              </span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
              {NAV_KEYS.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative rounded-lg px-4 py-2 text-sm text-content-secondary transition-colors duration-200 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {hovered === key && (
                    <motion.span
                      layoutId="nav-bg"
                      className="absolute inset-0 rounded-lg bg-glass-bg-hover"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{t(key)}</span>
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <Link
                href={localeSwitchHref}
                aria-label={`Switch to ${otherLocale === 'pt' ? 'Português' : 'English'}`}
                className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-glass-bg px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:bg-glass-bg-hover hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className={locale === 'pt' ? 'text-accent-light font-semibold' : ''}>PT</span>
                <span className="text-white/20">╱</span>
                <span className={locale === 'en' ? 'text-accent-light font-semibold' : ''}>EN</span>
              </Link>

              <button
                onClick={() => setIsMenuOpen((o) => !o)}
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMenuOpen}
                className="relative rounded-lg p-2 text-content-secondary transition-all duration-200 hover:bg-glass-bg-hover hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.span key="x"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span key="menu"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-glass-border md:hidden"
            >
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-4">
                {NAV_KEYS.map((key, i) => (
                  <motion.a
                    key={key}
                    href={`#${key}`}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.22 }}
                    className="rounded-lg px-4 py-3 text-sm text-content-secondary transition-all duration-200 hover:bg-glass-divider hover:text-content"
                  >
                    {t(key)}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
