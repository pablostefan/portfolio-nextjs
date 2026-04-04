'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, CheckCircle, Clock, Copy, Check } from 'lucide-react';
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
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04]">
        <Image
          src={cert.badgeImageUrl}
          alt={`${cert.issuer} badge`}
          fill
          className="object-contain p-1.5"
          sizes="80px"
        />
      </div>
    );
  }

  const initials = cert.issuer.slice(0, 2).toUpperCase();

  return (
    <div
      aria-label={cert.issuer}
      className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl font-display text-xl font-bold text-white shadow-lg"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* shine overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
      />
      <span className="relative z-10">{initials}</span>
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
        <div className="mb-5 flex items-start gap-4">
          <IssuerAvatar cert={cert} />

          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-display text-base font-bold leading-snug text-content">
              {cert.name}
            </h3>
            <p className="mt-1 font-mono text-sm text-accent-light">
              {cert.issuer}
            </p>

            {/* Status badge */}
            {cert.expiryDate && (
              <span
                className={[
                  'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold',
                  expired
                    ? 'border border-red-500/20 bg-red-500/10 text-red-400'
                    : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
                ].join(' ')}
              >
                {expired
                  ? <Clock size={10} aria-hidden="true" />
                  : <CheckCircle size={10} aria-hidden="true" />}
                {expired ? tExpired : tValid}
              </span>
            )}
          </div>
        </div>

        {/* Dates */}
        <dl className="mb-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-content-muted">{tIssued}</dt>
            <dd className="font-mono text-content-secondary">{formatCertDate(cert.issueDate)}</dd>
          </div>
          {cert.expiryDate ? (
            <div className="flex items-center justify-between">
              <dt className={expired ? 'text-red-400/70' : 'text-content-muted'}>{tExpires}</dt>
              <dd className={['font-mono', expired ? 'text-red-400' : 'text-content-secondary'].join(' ')}>
                {formatCertDate(cert.expiryDate)}
              </dd>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <dt className="text-content-muted">{tNoExpiry}</dt>
              <dd className="font-mono text-emerald-400/70">∞</dd>
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 font-mono text-xs text-content-secondary transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
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
