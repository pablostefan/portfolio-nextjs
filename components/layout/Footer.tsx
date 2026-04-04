import { Code2, Globe, Mail, BookMarked } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';

const socials = [
  { icon: Code2,      label: 'GitHub',   href: 'https://github.com/pablostefan' },
  { icon: Globe,      label: 'LinkedIn', href: 'https://linkedin.com/in/pablosgpereira' },
  { icon: Mail,       label: 'Email',    href: 'mailto:pablo.stefan.dev@gmail.com' },
  { icon: BookMarked, label: 'Medium',   href: 'https://medium.com/@pablo.stefan' },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-white/[0.06] py-14 px-4">
      {/* Top gradient line */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-px w-80 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
      />

      <div className="mx-auto max-w-6xl flex flex-col items-center gap-7">
        <GradientText as="p" animated className="font-display text-lg font-bold tracking-tight">
          Pablo Stefan
        </GradientText>

        <ul className="flex items-center gap-3" aria-label="Social links">
          {socials.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className="group flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-content-muted transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light hover:shadow-[0_0_24px_rgba(124,58,237,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>

        <p className="text-center font-mono text-xs text-content-muted">
          © {new Date().getFullYear()} Pablo Stefan
          <span aria-hidden="true" className="mx-2 text-white/20">·</span>
          Feito com{' '}
          <span aria-hidden="true" className="text-pink-400">♥</span>{' '}
          usando{' '}
          <span className="text-content-secondary">Next.js</span>
          {' & '}
          <span className="text-content-secondary">Framer Motion</span>
        </p>
      </div>
    </footer>
  );
}
