#!/usr/bin/env node
/**
 * parse-cert-pdfs.js
 * Reads every PDF in public/certs/ and rebuilds data/certifications.json
 *
 * Supported formats detected automatically:
 *   - Certiport   (Apple Developer certs)
 *   - XP Educação (Brazilian bootcamp certs)
 *   - Generic     (fallback — uses filename as cert name)
 *
 * Usage:
 *   node scripts/parse-cert-pdfs.js
 *   npm run update-certs
 *
 * Merge behaviour:
 *   - Matches existing entries by credentialId → then by id (filename slug)
 *   - Preserves credentialUrl if it points to credly.com (badge images)
 *   - All other fields overwritten with freshly-parsed data
 */

'use strict';

const fs       = require('fs');
const path     = require('path');
const pdfParse = require('pdf-parse');

const ROOT       = path.resolve(__dirname, '..');
const CERTS_DIR  = path.join(ROOT, 'public', 'certs');
const CERTS_PATH = path.join(ROOT, 'data', 'certifications.json');

// ─── Date parsing ─────────────────────────────────────────────────────────────

const PT_MONTHS = {
  janeiro: '01', fevereiro: '02', março: '03', marco: '03',
  abril: '04', maio: '05', junho: '06',
  julho: '07', agosto: '08', setembro: '09',
  outubro: '10', novembro: '11', dezembro: '12',
};

const EN_MONTHS = {
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
};

/** "11 de setembro de 2024" or "setembro de 2024" → "2024-09" */
function parsePtDate(text) {
  const m = text.match(/\b(?:\d{1,2}\s+de\s+)?(\w+)\s+de\s+(\d{4})\b/i);
  if (!m) return null;
  const month = PT_MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${month}` : null;
}

/** "June 4, 2025" or "June 2025" → "2025-06" */
function parseEnDate(text) {
  const m = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{0,2},?\s*(\d{4})\b/i,
  );
  if (!m) return null;
  const month = EN_MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${month}` : null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Format detection ─────────────────────────────────────────────────────────

function detectFormat(text) {
  const t = text.toLowerCase();
  if (t.includes('certiport') || t.includes('verify.certiport.com')) return 'certiport';
  if (
    t.includes('xp educação') ||
    t.includes('xp educacao') ||
    t.includes('xpeducacao') ||
    t.includes('certificado de conclusão') ||
    t.includes('faculdade xp')
  )
    return 'xpeducacao';
  return 'generic';
}

// ─── Format parsers ───────────────────────────────────────────────────────────

function parseCertiport(text) {
  // Cert name: grab "App Development with Swift\nCertified User" style blocks
  const nameMatch =
    text.match(/App\s+Development\s+with\s+Swift[\s\n]+Certified\s+User/i) ||
    text.match(/([A-Z][A-Za-z\s]+(?:Certified|Associate|Professional|Specialist|Expert)[A-Za-z\s]*)/);

  const name = nameMatch
    ? nameMatch[0].replace(/\s*\n\s*/g, ' ').trim()
    : 'Apple Certification';

  // Credential code like "Cw3V-DwzA" or "A1B2-C3D4"
  const codeMatch = text.match(/\b([A-Z0-9]{4}-[A-Z0-9]{4})\b/);
  const credentialId = codeMatch ? codeMatch[1] : null;

  return {
    name,
    issuer: 'Certiport',
    issueDate: parseEnDate(text),
    credentialId,
    credentialUrl: 'https://verify.certiport.com',
  };
}

function parseXpEducacao(text) {
  // Course name: after "profissional " and before ", no período" or newline
  const courseMatch = text.match(/profissional\s+([^\n,]+)/i);
  const name = courseMatch
    ? courseMatch[1].trim()
    : 'Certificado XP Educação';

  // Date: "11 de setembro de 2024"
  const issueDate = parsePtDate(text);

  // Credential: 32-char lowercase hex appended at the bottom
  const codeMatch = text.match(/\b([0-9a-f]{32})\b/i);
  const credentialId = codeMatch ? codeMatch[1].toLowerCase() : null;

  return {
    name,
    issuer: 'XP Educação',
    issueDate,
    credentialId,
    credentialUrl: 'https://certificados.xpeducacao.com.br',
  };
}

function parseGeneric(text, filename) {
  const baseName = path.basename(filename, '.pdf');
  const words = baseName.replace(/[-_]/g, ' ').trim();
  const name = words.charAt(0).toUpperCase() + words.slice(1);

  return {
    name,
    issuer: 'Unknown',
    issueDate: parseEnDate(text) ?? parsePtDate(text),
    credentialId: null,
    credentialUrl: null,
  };
}

// ─── Parse a single PDF ───────────────────────────────────────────────────────

async function parseCertPdf(filePath) {
  const buffer     = fs.readFileSync(filePath);
  const { text }   = await pdfParse(buffer);
  const filename   = path.basename(filePath);
  const id         = slugify(filename.replace(/\.pdf$/i, ''));
  const format     = detectFormat(text);

  let data;
  if (format === 'certiport')   data = parseCertiport(text);
  else if (format === 'xpeducacao') data = parseXpEducacao(text);
  else                          data = parseGeneric(text, filename);

  return { id, ...data };
}

// ─── Merge ────────────────────────────────────────────────────────────────────

function mergeCertifications(freshParsed, existing) {
  const result = [...existing];

  for (const cert of freshParsed) {
    const idx = result.findIndex(
      (e) =>
        e.id === cert.id ||
        (cert.credentialId && e.credentialId === cert.credentialId),
    );

    if (idx >= 0) {
      result[idx] = {
        ...result[idx],
        ...cert,
        // Keep Credly URL if already set manually
        credentialUrl: result[idx].credentialUrl?.includes('credly.com')
          ? result[idx].credentialUrl
          : (cert.credentialUrl ?? result[idx].credentialUrl),
      };
    } else {
      result.push(cert);
    }
  }

  // Sort: valid first (by issueDate desc), expired last
  result.sort((a, b) => {
    const aExp = a.expiryDate && new Date(a.expiryDate) < new Date();
    const bExp = b.expiryDate && new Date(b.expiryDate) < new Date();
    if (aExp !== bExp) return aExp ? 1 : -1;
    return (b.issueDate ?? '').localeCompare(a.issueDate ?? '');
  });

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
    console.log('📁  public/certs/ criado.');
  }

  const pdfFiles = fs
    .readdirSync(CERTS_DIR)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => path.join(CERTS_DIR, f));

  if (pdfFiles.length === 0) {
    console.log('⚠️  Nenhum PDF encontrado em public/certs/ — certifications.json não alterado.');
    return;
  }

  console.log(`📄  Processando ${pdfFiles.length} PDF(s) em public/certs/...\n`);

  const freshParsed = [];
  for (const file of pdfFiles) {
    try {
      const cert = await parseCertPdf(file);
      freshParsed.push(cert);
      console.log(`  ✓ ${path.basename(file)}`);
      console.log(`    → "${cert.name}" | ${cert.issuer} | ${cert.issueDate ?? 'sem data'}`);
      if (cert.credentialId) console.log(`    → ID: ${cert.credentialId}`);
    } catch (err) {
      console.warn(`  ⚠  ${path.basename(file)} falhou: ${err.message}`);
    }
  }

  const existing = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf-8')).certifications ?? [];
  const merged   = mergeCertifications(freshParsed, existing);

  fs.writeFileSync(
    CERTS_PATH,
    JSON.stringify({ certifications: merged }, null, 2) + '\n',
    'utf-8',
  );

  console.log(`\n✅  data/certifications.json atualizado — ${merged.length} certificação(ões).\n`);

  merged.forEach((c) => {
    const credly = c.credentialUrl?.includes('credly.com') ? ' [Credly ✓]' : '';
    console.log(`    • [${c.id}] ${c.name} — ${c.issuer}${credly}`);
  });
  console.log('');
}

main().catch((err) => {
  console.error('❌  Erro:', err.message);
  process.exit(1);
});
