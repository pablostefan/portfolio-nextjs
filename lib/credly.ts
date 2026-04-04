import type { Certification } from '@/types';
import certificationsData from '@/data/certifications.json';

// ─── Credly OBI v2 response shape ─────────────────────────────────────────────

interface OBIAssertion {
  badge?: {
    name?: string;
    description?: string;
    image?: string | { id?: string };
    issuer?: {
      name?: string;
      image?: string | { id?: string };
    };
  };
  issuedOn?: string;
  expires?: string | { endDate?: string };
}

function extractCredlyUuid(url: string): string | null {
  // https://www.credly.com/badges/UUID
  // https://www.credly.com/badges/UUID/public_url
  const m = url.match(/credly\.com\/badges\/([0-9a-f-]{36})/i);
  return m ? m[1] : null;
}

function extractImageUrl(field: string | { id?: string } | undefined): string | undefined {
  if (!field) return undefined;
  if (typeof field === 'string') return field.startsWith('data:') ? undefined : field;
  return field.id?.startsWith('data:') ? undefined : field.id;
}

/**
 * Tries to fetch badge image URL from the public Credly OBI v2 assertion endpoint.
 * Returns undefined on any error — callers must handle the fallback.
 */
async function fetchCredlyBadgeImage(assertionId: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.credly.com/v1/obi/v2/assertions/${assertionId}`,
      { next: { revalidate: 86_400 } },  // cache 24 h
    );
    if (!res.ok) return undefined;
    const data: OBIAssertion = await res.json();
    return extractImageUrl(data.badge?.image);
  } catch {
    return undefined;
  }
}

/**
 * Reads certifications from data/certifications.json and enriches each entry:
 *  1. Credly OBI v2 API  → badge image (if credentialUrl is a Credly URL)
 *  2. No external calls   → renders issuer initials avatar as fallback (in the UI)
 *
 * Cached per-fetch with ISR revalidate: 86400 (24 h).
 */
export async function fetchEnrichedCertifications(): Promise<Certification[]> {
  const raw = (certificationsData as { certifications: Certification[] }).certifications;
  if (!raw || raw.length === 0) return [];

  const enriched = await Promise.all(
    raw.map(async (cert): Promise<Certification> => {
      if (!cert.credentialUrl) return cert;

      const uuid = extractCredlyUuid(cert.credentialUrl);
      if (!uuid) return cert;

      const badgeImageUrl = await fetchCredlyBadgeImage(uuid);
      return { ...cert, badgeImageUrl };
    }),
  );

  // Sort: no-expiry / future-expiry first, then by issueDate desc
  return enriched.sort((a, b) => {
    const aExpired = a.expiryDate ? new Date(a.expiryDate) < new Date() : false;
    const bExpired = b.expiryDate ? new Date(b.expiryDate) < new Date() : false;
    if (aExpired !== bExpired) return aExpired ? 1 : -1;
    return (b.issueDate ?? '').localeCompare(a.issueDate ?? '');
  });
}
