import { Code2, Globe, Mail, BookMarked } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';
import { AnimatedDivider } from '@/components/ui/AnimatedDivider';

const socials = [
  { icon: Code2,      label: 'GitHub',   href: 'https://github.com/pablostefan' },
  { icon: Globe,      label: 'LinkedIn', href: 'https://linkedin.com/in/pablosgpereira' },
  { icon: Mail,       label: 'Email',    href: 'mailto:pablo.stefan.dev@gmail.com' },
  { icon: BookMarked, label: 'Medium',   href: 'https://medium.com/@pablo.stefan' },
] as const;

export function Footer() {
  return (
    <>
      <AnimatedDivider />

      <footer className="relative py-14 px-4">
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
                  className="group flex items-center justify-center rounded-xl border border-glass-border bg-glass-bg p-2.5 text-content-muted transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light hover:shadow-glow-sm-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
    </>
  );
}
