'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Copy, Check, ShieldCheck, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Certification } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCertDate(isoOrPartial: string): string {
  const d = new Date(isoOrPartial);
  if (Number.isNaN(d.getTime())) return isoOrPartial;
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

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

// ─── IssuerAvatar ────────────────────────────────────────────────────────────

function IssuerAvatar({ cert }: { cert: Certification }) {
  const [from, to] = hashGradient(cert.issuer);

  if (cert.badgeImageUrl) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-glass-border bg-glass-bg shadow-lg">
        <Image
          src={cert.badgeImageUrl}
          alt={`${cert.issuer} badge`}
          fill
          className="object-contain p-1"
          sizes="44px"
        />
      </div>
    );
  }

  const initials = cert.issuer.slice(0, 2).toUpperCase();

  return (
    <div
      aria-label={cert.issuer}
      className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/20" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold leading-none tracking-wide text-white">
        {initials}
      </span>
    </div>
  );
}

// ─── CopyButton ──────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copiar ID"
      className="rounded-md p-1 text-content-muted transition-colors hover:bg-glass-bg-hover hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {copied
        ? <Check size={12} className="text-emerald-400" aria-hidden="true" />
        : <Copy size={12} aria-hidden="true" />}
    </button>
  );
}

// ─── CertCard ─────────────────────────────────────────────────────────────────

interface CertCardProps {
  cert: Certification;
  index: number;
  tIssued: string;
  tVerify: string;
  tViewCredy: string;
  tCredentialId: string;
}

function CertCard({
  cert,
  index,
  tIssued,
  tVerify,
  tViewCredy,
  tCredentialId,
}: CertCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCredly  = cert.credentialUrl?.includes('credly.com') ?? false;

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlassCard
        hover
        glow="violet"
        className="group/cert relative flex h-full flex-col overflow-hidden p-0"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          {/* Avatar + title */}
          <div className="flex items-start gap-3.5">
            <IssuerAvatar cert={cert} />

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-bold leading-snug text-content">
                {cert.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-accent-light">
                {cert.issuer}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="mx-5 h-px bg-glass-divider" />

        {/* Body */}
        <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
          {/* Dates */}
          <dl className="mb-4 space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar size={11} className="shrink-0 text-content-muted" aria-hidden="true" />
              <dt className="shrink-0 text-content-muted">{tIssued}</dt>
              <dd className="ml-auto whitespace-nowrap font-mono text-content-secondary">{formatCertDate(cert.issueDate)}</dd>
            </div>
          </dl>

          {/* Credential ID */}
          {cert.credentialId && (
            <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-glass-border bg-glass-bg px-3 py-2">
              <div className="min-w-0">
                <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-content-muted">
                  {tCredentialId}
                </p>
                <p className="truncate font-mono text-xs text-content-secondary">
                  {cert.credentialId}
                </p>
              </div>
              <CopyButton value={cert.credentialId} />
            </div>
          )}

          {/* Verify link */}
          {cert.credentialUrl && (
            <div className="mt-auto">
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tVerify} — ${cert.name}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-glass-border bg-glass-bg px-4 py-2.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <ShieldCheck size={13} aria-hidden="true" />
                {isCredly ? tViewCredy : tVerify}
              </a>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Section (kept as client component so CopyButton works) ──────────────────

interface CertificationsClientProps {
  certs: Certification[];
}

export function CertificationsClient({ certs }: CertificationsClientProps) {
  const t = useTranslations('certifications');

  if (certs.length === 0) return null;

  return (
    <SectionWrapper id="certifications">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        {/* Grid */}
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, i) => (
            <li key={cert.id}>
              <CertCard
                cert={cert}
                index={i}
                tIssued={t('issued')}
                tVerify={t('verify')}
                tViewCredy={t('view_credly')}
                tCredentialId={t('credential_id')}
              />
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
