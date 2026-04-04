import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Award, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { fetchEnrichedCertifications } from '@/lib/credly';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Certification } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCertDate(isoOrPartial: string): string {
  // Handles "2024-01", "2024-01-15", "jan. de 2024", etc.
  const d = new Date(isoOrPartial);
  if (Number.isNaN(d.getTime())) return isoOrPartial;
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

// Generate a deterministic gradient color pair for the initials avatar
const GRADIENT_PAIRS: [string, string][] = [
  ['#7c3aed', '#06b6d4'],
  ['#06b6d4', '#4f46e5'],
  ['#a78bfa', '#7c3aed'],
  ['#4f46e5', '#06b6d4'],
  ['#7c3aed', '#a78bfa'],
];
function hashGradient(str: string): [string, string] {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return GRADIENT_PAIRS[Math.abs(h) % GRADIENT_PAIRS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IssuerAvatar({ cert }: { cert: Certification }) {
  if (cert.badgeImageUrl) {
    return (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04]">
        <Image
          src={cert.badgeImageUrl}
          alt={`${cert.issuer} badge`}
          fill
          className="object-contain p-1"
          sizes="64px"
        />
      </div>
    );
  }

  const initials = cert.issuer.slice(0, 2).toUpperCase();
  const [from, to] = hashGradient(cert.issuer);

  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] font-display text-lg font-bold text-white"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
}

interface StatusBadgeProps {
  cert: Certification;
  validLabel: string;
  expiredLabel: string;
}
function StatusBadge({ cert, validLabel, expiredLabel }: StatusBadgeProps) {
  const expired = isExpired(cert.expiryDate);
  if (!cert.expiryDate) return null;

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
        expired
          ? 'border border-red-500/20 bg-red-500/10 text-red-400'
          : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
      ].join(' ')}
    >
      {expired
        ? <Clock size={10} aria-hidden="true" />
        : <CheckCircle size={10} aria-hidden="true" />}
      {expired ? expiredLabel : validLabel}
    </span>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

interface CertCardProps {
  cert: Certification;
  tIssued: string;
  tExpires: string;
  tNoExpiry: string;
  tVerify: string;
  tValid: string;
  tExpired: string;
  tViewCredy: string;
}

function CertCard({
  cert,
  tIssued,
  tExpires,
  tNoExpiry,
  tVerify,
  tValid,
  tExpired,
  tViewCredy,
}: CertCardProps) {
  const expired = isExpired(cert.expiryDate);
  const isCredly = cert.credentialUrl?.includes('credly.com') ?? false;

  return (
    <GlassCard
      hover
      glow={expired ? 'none' : 'violet'}
      className="flex h-full flex-col p-5"
    >
      {/* Top row: avatar + status */}
      <div className="mb-4 flex items-start gap-4">
        <IssuerAvatar cert={cert} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold leading-snug text-content line-clamp-2">
            {cert.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-content-muted">
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Dates */}
      <dl className="mb-4 space-y-1 text-xs text-content-secondary">
        <div className="flex items-center gap-1.5">
          <dt className="text-content-muted">{tIssued}:</dt>
          <dd className="font-mono">{formatCertDate(cert.issueDate)}</dd>
        </div>
        {cert.expiryDate ? (
          <div className="flex items-center gap-1.5">
            <dt className={expired ? 'text-red-400/70' : 'text-content-muted'}>
              {tExpires}:
            </dt>
            <dd className={['font-mono', expired ? 'text-red-400' : ''].join(' ')}>
              {formatCertDate(cert.expiryDate)}
            </dd>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <dt className="text-content-muted">{tNoExpiry}</dt>
          </div>
        )}
      </dl>

      {/* Footer: status + link */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
        <StatusBadge cert={cert} validLabel={tValid} expiredLabel={tExpired} />

        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${tVerify} ${cert.name}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ExternalLink size={11} aria-hidden="true" />
            {isCredly ? tViewCredy : tVerify}
          </a>
        )}
      </div>
    </GlassCard>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export async function Certifications() {
  const t    = await getTranslations('certifications');
  const certs = await fetchEnrichedCertifications().catch(() => [] as Certification[]);

  if (certs.length === 0) return null;

  return (
    <SectionWrapper id="certifications">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <p className="mt-3 font-mono text-sm text-content-muted tracking-widest uppercase">
            {t('subtitle')}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certs.map((cert) => (
            <li key={cert.id}>
              <CertCard
                cert={cert}
                tIssued={t('issued')}
                tExpires={t('expires')}
                tNoExpiry={t('no_expiry')}
                tVerify={t('verify')}
                tValid={t('valid')}
                tExpired={t('expired')}
                tViewCredy={t('view_credly')}
              />
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
