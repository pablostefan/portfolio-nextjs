#!/usr/bin/env node
/**
 * parse-linkedin-pdf.js
 * Parses a LinkedIn Profile PDF and updates data/profile.json
 *
 * Usage:
 *   node scripts/parse-linkedin-pdf.js [path/to/linkedin.pdf]
 *   npm run update-profile              (uses ./linkedin.pdf by default — gitignored)
 *
 * PDF structure per entry:
 *   COMPANY NAME
 *   [TENURE SUMMARY]   (optional — e.g. "2 anos 4 meses")
 *   Job Title
 *   month de YYYY - month de YYYY (duration)   ← DATE ANCHOR
 *   City, Region
 *   [Intro paragraph]
 *   • bullet text (may wrap to next line)
 *   ...
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const PROFILE_PATH = path.join(ROOT, 'data', 'profile.json');
const CERTS_PATH   = path.join(ROOT, 'data', 'certifications.json');
const DEFAULT_PDF  = path.join(ROOT, 'linkedin.pdf');

// ─── Month maps ───────────────────────────────────────────────────────────────

const PT_MONTHS = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
];
const EN_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function translateMonths(str) {
  let result = str;
  PT_MONTHS.forEach((pt, i) => {
    // Replace "<month> de <year>" → "<Month> <year>" (remove 'de' in English)
    result = result.replace(
      new RegExp(pt + '\\s+de\\s+(\\d{4})', 'gi'),
      EN_MONTHS[i] + ' $1',
    );
    // Fallback: plain month name
    result = result.replace(new RegExp('\\b' + pt + '\\b', 'gi'), EN_MONTHS[i]);
  });
  return result;
}

// ─── Regex patterns ───────────────────────────────────────────────────────────

const DATE_LINE_RE = new RegExp(
  `^(${PT_MONTHS.join('|')})\\s+de\\s+\\d{4}\\s*[-–]`,
  'i'
);

// "2 anos 4 meses" | "10 meses" | "1 ano 1 mês"
const TENURE_RE = /^\d+\s+(ano|anos|m[eê]s|meses)\b/i;

// Bullet character
const BULLET_RE = /^[•·]\s*/;

// Location line heuristic: short, contains comma
const LOCATION_RE = /^[A-Za-zÀ-ú\s]+,\s+[A-Za-zÀ-ú\s]+$/;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanLines(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .filter(l => !/^Page\s+\d+\s+of\s+\d+$/i.test(l));
}

// PT sentence fragments / connectors that start continuation lines, NOT company names.
// This lets lowercase-starting brands like "nav9" or "fiibo" pass while rejecting
// description continuations that start with PT prepositions / conjunctions.
const FRAGMENT_RE = /^(e\s|de\s|do\s|da\s|dos\s|das\s|que\s|com\s|em\s|no\s|na\s|nos\s|nas\s|por\s|para\s|ou\s|ao\s|às?\s|um\s+|uma\s+|se\s|ao\s|os\s|as\s|os\s|sob\s|até\s|pelo\s|pela\s|pelos\s|pelas\s)/i;

/**
 * A line is likely a company/employer name if:
 * - Short (≤ 60 chars)
 * - No bullet prefix
 * - Not a date line
 * - Not a tenure summary
 * - No parentheses (job titles like "Desenvolvedor Mobile (Flutter)" have them)
 * - Does not start with common PT sentence fragments/prepositions/conjunctions
 */
function isLikelyCompany(line) {
  if (!line || line.trim() === '') return false;
  if (BULLET_RE.test(line)) return false;
  if (DATE_LINE_RE.test(line)) return false;
  if (TENURE_RE.test(line)) return false;
  if (/[()]/.test(line)) return false;            // job titles have parentheses
  if (line.length > 60) return false;             // description lines are long
  if (FRAGMENT_RE.test(line)) return false;       // continuation of description
  return true;
}

/**
 * Build bilingual { pt, en } period from a LinkedIn date line.
 * Input: "julho de 2025 - Present (10 meses)"
 * Output: { pt: "julho de 2025 — Atual", en: "July 2025 — Present" }
 */
function buildPeriod(dateLine) {
  const clean = dateLine.replace(/\s*\([^)]*\)/g, '').trim();
  const [startRaw, endRaw = ''] = clean.split(/\s*[-–]\s*/);

  const startPt = (startRaw ?? '').trim();
  const endStr  = (endRaw ?? '').trim();
  const isPresent = !endStr || /^present$/i.test(endStr) || /^atual$/i.test(endStr);

  return {
    pt: isPresent
      ? `${startPt} — Atual`
      : `${startPt} — ${endStr}`,
    en: isPresent
      ? `${translateMonths(startPt)} — Present`
      : `${translateMonths(startPt)} — ${translateMonths(endStr)}`,
  };
}

/**
 * Merge continuations into their bullet.
 *
 * Lines like:
 *   "• Organização do ciclo de vida de componentes (criação, evolução e"
 *   "depreciação)"
 * should become one bullet.
 *
 * Heuristic: a continuation line is non-empty, doesn't start with "•",
 * doesn't match a date/tenure/likely-company pattern,
 * and follows immediately after a bullet line.
 */
function mergeBulletContinuations(lines) {
  const merged = [];

  for (const line of lines) {
    if (BULLET_RE.test(line)) {
      merged.push(line.replace(BULLET_RE, '').trim());
    } else if (merged.length > 0 && line.length > 0
               && !DATE_LINE_RE.test(line) && !TENURE_RE.test(line)
               && !isLikelyCompany(line)) {
      // continuation of previous bullet
      merged[merged.length - 1] += ' ' + line.trim();
    }
    // else: header/intro lines not starting with bullet — skip for bullets list
  }

  return merged.map(b => b.replace(/[;,]\s*$/, '').trim()).filter(Boolean);
}

// ─── Section extractors ───────────────────────────────────────────────────────

function extractSummary(lines) {
  const start = lines.findIndex(l => /^Resumo$/i.test(l));
  const end   = lines.findIndex((l, i) => i > start && /^Experi[eê]ncia$/i.test(l));
  if (start === -1) return '';
  const slice = lines.slice(start + 1, end > start ? end : start + 40);
  // Join into single paragraph, collapse extra spaces
  return slice.filter(l => l.length > 0).join(' ').replace(/\s{2,}/g, ' ').trim();
}

function extractExperience(lines) {
  const expStart = lines.findIndex(l => /^Experi[eê]ncia$/i.test(l));
  const expEnd   = lines.findIndex((l, i) => i > expStart && /^Forma[çc][aã]o/i.test(l));
  if (expStart === -1) return [];

  const expLines = lines.slice(
    expStart + 1,
    expEnd > expStart ? expEnd : undefined,
  );

  // ── Find all date line indices (main anchors) ──────────────────────────────
  const dateIndices = expLines
    .map((l, i) => DATE_LINE_RE.test(l) ? i : -1)
    .filter(i => i !== -1);

  if (dateIndices.length === 0) return [];

  let lastCompany = '';

  return dateIndices.map((dateIdx, entryNum) => {
    const dateLine = expLines[dateIdx];

    // ── Title: the line immediately before the date line ──────────────────────
    const title = (expLines[dateIdx - 1] ?? '').trim();

    // ── Company detection ────────────────────────────────────────────────────
    // Pattern A: COMPANY / TITLE / DATE           → look at D-2
    // Pattern B: COMPANY / TENURE / TITLE / DATE  → look at D-3 (D-2 is tenure)
    // Pattern C: TITLE / DATE  (shared company)   → inherit lastCompany

    const prevTwo   = (expLines[dateIdx - 2] ?? '').trim();
    const prevThree = (expLines[dateIdx - 3] ?? '').trim();

    let company = lastCompany;

    if (TENURE_RE.test(prevTwo)) {
      // Pattern B
      if (isLikelyCompany(prevThree)) {
        company = prevThree;
      }
    } else if (isLikelyCompany(prevTwo)) {
      // Pattern A
      company = prevTwo;
    }
    // else: Pattern C — inherit lastCompany

    if (company) lastCompany = company;

    // ── Description: collect everything between date+1 and next date ──────────
    const nextDateIdx = dateIndices[entryNum + 1] ?? expLines.length;

    // D+1 = location line (skip) — detect by LOCATION_RE or just skip first line
    const rawDescLines = expLines.slice(dateIdx + 2, nextDateIdx);

    // Intro paragraph: non-bullet lines before first bullet
    let intro = '';
    let firstBulletIdx = rawDescLines.findIndex(l => BULLET_RE.test(l));
    if (firstBulletIdx > 0) {
      intro = rawDescLines
        .slice(0, firstBulletIdx)
        .filter(l => !TENURE_RE.test(l) && !isLikelyCompany(l) && l.length > 10)
        .join(' ')
        .trim();
    }

    // Bullets (with continuations)
    const bulletLines = firstBulletIdx >= 0
      ? rawDescLines.slice(firstBulletIdx)
      : rawDescLines;

    const bullets = mergeBulletContinuations(bulletLines);

    // Build description string
    let descPt = '';
    if (intro) descPt = intro;
    if (bullets.length > 0) {
      const bulletsStr = bullets.join('. ');
      descPt = descPt ? `${descPt} ${bulletsStr}` : bulletsStr;
    }
    if (!descPt) {
      descPt = `Atuei como ${title} na ${company}.`;
    }

    const isCurrentEntry = /Present/i.test(dateLine) || /Atual/i.test(dateLine);

    return {
      title:  { pt: title, en: title },
      company,
      period: buildPeriod(dateLine),
      description: {
        pt: descPt,
        // Keep EN empty initially — will be preserved from existing if available
        en: descPt,
      },
      current: isCurrentEntry,
    };
  })
  .sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return 0;
  });
}

// ─── Smart merge: preserve manually-translated EN descriptions ────────────────

function mergeWithExisting(newExp, existingExp) {
  return newExp.map(newEntry => {
    // Find matching entry in existing by company + title similarity
    const match = existingExp.find(e =>
      e.company === newEntry.company &&
      (e.title?.pt === newEntry.title.pt || e.title?.en === newEntry.title.pt)
    );

    if (match && match.description?.en && match.description.en !== match.description?.pt) {
      // User had a manual EN translation — preserve it
      return {
        ...newEntry,
        description: {
          pt: newEntry.description.pt,
          en: match.description.en,
        },
      };
    }

    return newEntry;
  });
}

// ─── Certifications extractor ─────────────────────────────────────────────────

/**
 * Extracts the "Licenças e certificações" section from a LinkedIn PDF.
 *
 * PDF structure per entry:
 *   Cert Name
 *   Issuer
 *   Emitido: jan. de 2024   Sem vencimento
 *   Código da credencial: 1234567         (optional)
 *   https://www.credly.com/badges/uuid    (optional)
 */
function extractCertifications(lines) {
  const certStart = lines.findIndex(l =>
    /^Licen[cç]as e certifica[cç][oõ]es$/i.test(l) ||
    /^Licenses? & Certifications?$/i.test(l) ||
    /^Licen[cç]as e certifica[cç][oõ]es acadêmicas$/i.test(l)
  );
  if (certStart === -1) return [];

  // Find the next major section (Formação / Competências / Honras / Idiomas)
  const certEnd = lines.findIndex((l, i) =>
    i > certStart && /^(Forma[cç][aã]o|Compet[eê]ncias|Honras e pr[eê]mios|Idiomas|Projetos|Publications|Awards|Skills|Education|Languages)$/i.test(l)
  );

  const certLines = lines.slice(certStart + 1, certEnd > certStart ? certEnd : certStart + 200);

  const certs = [];
  let i = 0;

  while (i < certLines.length) {
    const nameLine = certLines[i];

    // A cert entry starts with a non-empty line that isn't a URL/date/code
    if (!nameLine || /^https?:\/\//i.test(nameLine) || /^Emitido/i.test(nameLine) ||
        /^C[oó]digo/i.test(nameLine) || nameLine.length < 2) {
      i++;
      continue;
    }

    const cert = {
      id: nameLine.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: nameLine,
      issuer: '',
      issueDate: '',
      expiryDate: undefined,
      credentialId: undefined,
      credentialUrl: undefined,
    };

    i++;

    // Next non-empty line that isn't a date/code/URL → issuer
    while (i < certLines.length) {
      const l = certLines[i].trim();
      if (!l) { i++; continue; }
      if (/^https?:\/\//i.test(l)) break;
      if (/^Emitido/i.test(l)) break;
      if (/^C[oó]digo/i.test(l)) break;
      cert.issuer = l;
      i++;
      break;
    }

    // Scan remaining lines that belong to this entry
    while (i < certLines.length) {
      const l = certLines[i].trim();
      if (!l) { i++; continue; }

      // Stop at what looks like the start of the next cert (a non-URL, non-meta line
      // that follows after we already have the issuer)
      if (cert.issuer && !l.startsWith('http') &&
          !/^Emitido/i.test(l) && !/^C[oó]digo/i.test(l) &&
          !/^Sem vencimento/i.test(l) && !/^Vence:/i.test(l) &&
          l.length > 2) {
        break;
      }

      // "Emitido: jan. de 2024   Vence: jan. de 2026"
      // "Emitido: mar. de 2023   Sem vencimento"
      if (/^Emitido/i.test(l)) {
        const issuedM = l.match(/Emitido:?\s+(.+?)(?:\s{2,}|$)/i);
        if (issuedM) cert.issueDate = issuedM[1].trim();

        const expiresM = l.match(/Vence:?\s+(.+?)(?:\s{2,}|$)/i);
        if (expiresM) cert.expiryDate = expiresM[1].trim();

        const noExpiry = /Sem vencimento/i.test(l);
        if (noExpiry) cert.expiryDate = undefined;

        i++; continue;
      }

      // "Código da credencial: XXXX"
      if (/^C[oó]digo da credencial/i.test(l)) {
        cert.credentialId = l.replace(/^C[oó]digo da credencial:?\s*/i, '').trim();
        i++; continue;
      }

      // URL line
      if (/^https?:\/\//i.test(l)) {
        cert.credentialUrl = l;
        i++; continue;
      }

      i++;
    }

    if (cert.name && cert.issuer) {
      certs.push(cert);
    }
  }

  return certs;
}

// ─── Certifications merge ─────────────────────────────────────────────────────

function mergeCertifications(newCerts, existingCerts) {
  if (!newCerts.length) return existingCerts;

  return newCerts.map(nc => {
    const existing = existingCerts.find(e => e.id === nc.id || e.name === nc.name);
    if (existing) {
      // Preserve credentialUrl if it was manually added to existing
      return {
        ...nc,
        credentialUrl: nc.credentialUrl ?? existing.credentialUrl,
        credentialId:  nc.credentialId  ?? existing.credentialId,
      };
    }
    return nc;
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const pdfPath = process.argv[2] ?? DEFAULT_PDF;

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌  PDF não encontrado: ${pdfPath}`);
    console.error('');
    console.error('    Como usar:');
    console.error('    1. No LinkedIn: Perfil → Mais → Salvar como PDF');
    console.error('    2. Renomeie para linkedin.pdf e coloque na raiz do projeto');
    console.error('    3. Execute: npm run update-profile');
    process.exit(1);
  }

  let pdfParse;
  try {
    pdfParse = require('pdf-parse');
  } catch {
    console.error('❌  pdf-parse não instalado. Execute: npm install --save-dev pdf-parse');
    process.exit(1);
  }

  console.log(`\n📄  Processando: ${path.basename(pdfPath)}\n`);

  const buffer       = fs.readFileSync(pdfPath);
  const { text }     = await pdfParse(buffer);
  const lines        = cleanLines(text);

  const summaryText  = extractSummary(lines);
  const experience   = extractExperience(lines);
  const newCerts     = extractCertifications(lines);
  const existing     = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'));
  const existingCerts = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf-8')).certifications ?? [];

  // Merge: preserve EN descriptions that were manually translated
  const mergedExp = experience.length > 0
    ? mergeWithExisting(experience, existing.experience ?? [])
    : existing.experience;

  const updated = {
    about: summaryText
      ? {
          pt: summaryText,
          en: existing.about?.en ?? summaryText, // preserve manual EN translation if exists
        }
      : existing.about,
    experience: mergedExp,
    skills:  existing.skills,
    medium:  existing.medium,
  };

  fs.writeFileSync(PROFILE_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');

  // ── Write certifications.json ───────────────────────────────────────────────
  const mergedCerts = mergeCertifications(newCerts, existingCerts);
  fs.writeFileSync(CERTS_PATH, JSON.stringify({ certifications: mergedCerts }, null, 2) + '\n', 'utf-8');

  // ── Report ─────────────────────────────────────────────────────────────────
  console.log('✅  data/profile.json atualizado!\n');
  console.log(`    Resumo (PT): ${summaryText ? '✓ atualizado' : '⚠ não encontrado — mantido existente'}`);
  console.log(`    Resumo (EN): ${existing.about?.en ? '✓ preservado' : '⚠ copiado do PT — traduza manualmente'}`);
  console.log(`\n    Experiências: ${updated.experience.length} posição(ões)`);

  updated.experience.forEach(e => {
    const indicator = e.current ? '● ' : '  ';
    console.log(`    ${indicator}${e.title.pt}`);
    console.log(`      ${e.company} | ${e.period.pt} | EN: ${e.period.en}`);
  });

  console.log(`\n    Certificações: ${mergedCerts.length} encontrada(s)`);
  mergedCerts.forEach(c => {
    const credly = c.credentialUrl?.includes('credly.com') ? ' [Credly ✓]' : '';
    console.log(`      • ${c.name} — ${c.issuer}${credly}`);
  });

  console.log('');
}

main().catch(err => {
  console.error('❌  Erro:', err.message);
  console.error(err.stack);
  process.exit(1);
});
