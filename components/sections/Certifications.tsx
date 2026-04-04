'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { GradientText } from '@/components/ui/GradientText';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Certification } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCertDate(isoOrPartial: string): string {
  const d = new Date(isoOrPartial);
  if (Number.isNaN(d.getTime())) return isoOrPartial;
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
}

function isExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
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
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04] shadow-lg">
        <Image
          src={cert.badgeImageUrl}
          alt={`${cert.issuer} badge`}
          fill
          className="object-contain p-1"
          sizes="56px"
        />
      </div>
    );
  }

  const initials = cert.issuer.slice(0, 2).toUpperCase();

  return (
    <div
      aria-label={cert.issuer}
      className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl font-display text-base font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/20" />
      <span className="absolute inset-0 z-10 flex items-center justify-center">{initials}</span>
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
      className="rounded p-0.5 text-content-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    >
      {copied
        ? <Check size={11} className="text-emerald-400" aria-hidden="true" />
        : <Copy size={11} aria-hidden="true" />}
    </button>
  );
}

// ─── CertCard ─────────────────────────────────────────────────────────────────

interface CertCardProps {
  cert: Certification;
  index: number;
  tIssued: string;
  tExpires: string;
  tNoExpiry: string;
  tVerify: string;
  tValid: string;
  tExpired: string;
  tViewCredy: string;
  tCredentialId: string;
}

function CertCard({
  cert,
  index,
  tIssued,
  tExpires,
  tNoExpiry,
  tVerify,
  tValid,
  tExpired,
  tViewCredy,
  tCredentialId,
}: CertCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const expired   = isExpired(cert.expiryDate);
  const isCredly  = cert.credentialUrl?.includes('credly.com') ?? false;
  const [from]    = hashGradient(cert.issuer);

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
        glow={expired ? 'none' : 'violet'}
        className="relative flex h-full flex-col overflow-hidden p-6"
      >
        {/* Top accent line with issuer colour */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${from}cc, transparent)` }}
        />

        {/* Avatar + title */}
        <div className="mb-4 flex items-center gap-3">
          <IssuerAvatar cert={cert} />

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-bold leading-snug text-content">
              {cert.name}
            </h3>
            <p className="mt-0.5 font-mono text-xs text-accent-light">
              {cert.issuer}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="mb-4 h-px bg-white/[0.06]" />

        {/* Dates */}
        <dl className="mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="shrink-0 text-content-muted">{tIssued}</dt>
            <dd className="whitespace-nowrap font-mono text-content-secondary">{formatCertDate(cert.issueDate)}</dd>
          </div>
          {cert.expiryDate ? (
            <div className="flex items-center justify-between gap-4">
              <dt className={['shrink-0', expired ? 'text-red-400/70' : 'text-content-muted'].join(' ')}>{tExpires}</dt>
              <dd className={['whitespace-nowrap font-mono', expired ? 'text-red-400' : 'text-content-secondary'].join(' ')}>
                {formatCertDate(cert.expiryDate)}
              </dd>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <dt className="shrink-0 text-content-muted">{tNoExpiry}</dt>
              <dd className="font-mono text-emerald-400/60">∞</dd>
            </div>
          )}
        </dl>

        {/* Credential ID */}
        {cert.credentialId && (
          <>
            <div aria-hidden="true" className="mb-3 h-px bg-white/[0.06]" />
            <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
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
          </>
        )}

        {/* Verify link */}
        {cert.credentialUrl && (
          <div className="mt-auto">
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tVerify} — ${cert.name}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <ExternalLink size={12} aria-hidden="true" />
              {isCredly ? tViewCredy : tVerify}
            </a>
          </div>
        )}
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
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <GradientText>{t('title')}</GradientText>
          </h2>
          <p className="mt-3 font-mono text-sm uppercase tracking-widest text-content-muted">
            {t('subtitle')}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, i) => (
            <li key={cert.id}>
              <CertCard
                cert={cert}
                index={i}
                tIssued={t('issued')}
                tExpires={t('expires')}
                tNoExpiry={t('no_expiry')}
                tVerify={t('verify')}
                tValid={t('valid')}
                tExpired={t('expired')}
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
