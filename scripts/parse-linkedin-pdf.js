#!/usr/bin/env node
/**
 * parse-linkedin-pdf.js
 * Parses a LinkedIn Profile PDF and updates data/profile.json
 *
 * Usage:
 *   node scripts/parse-linkedin-pdf.js [path/to/linkedin.pdf]
 *   npm run update-profile              (uses ./linkedin.pdf by default — gitignored)
 *
 * Requirements: pdf-parse (installed as devDependency)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const PROFILE_PATH = path.join(ROOT, 'data', 'profile.json');
const DEFAULT_PDF  = path.join(ROOT, 'linkedin.pdf');

// Portuguese month names as they appear in LinkedIn PDFs
const PT_MONTHS_RE = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
].join('|');

// Matches: "julho de 2025 - Present (10 meses)"  or  "janeiro de 2025 - julho de 2025 (7 meses)"
const DATE_LINE_RE = new RegExp(
  `^(${PT_MONTHS_RE})\\s+de\\s+\\d{4}\\s*[-–]`,
  'i'
);

// Matches LinkedIn tenure summary line: "2 anos 4 meses" | "10 meses"
const TENURE_RE = /^\d+\s+(ano|anos|mês|mes|meses)/i;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPeriod(dateLine) {
  const clean = dateLine.replace(/\s*\([^)]*\)/g, '').trim(); // remove "(X meses)"
  const parts = clean.split(/\s*[-–]\s*/);
  const start = (parts[0] ?? '').trim();
  const end   = (parts[1] ?? '').trim();
  if (!end || /^present$/i.test(end)) return `${start} — Atual`;
  return `${start} — ${end}`;
}

function cleanLines(text) {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => !/^Page\s+\d+\s+of\s+\d+$/i.test(l)) // remove "Page X of Y"
    .filter(Boolean);
}

// ─── Section extractors ───────────────────────────────────────────────────────

function extractSummary(lines) {
  const start = lines.findIndex(l => /^Resumo$/i.test(l));
  const end   = lines.findIndex(l => /^Experiência$/i.test(l));
  if (start === -1) return '';
  const slice = lines.slice(start + 1, end > start ? end : start + 30);
  return slice.join(' ').trim();
}

function extractExperience(lines) {
  const expStart  = lines.findIndex(l => /^Experiência$/i.test(l));
  const expEnd    = lines.findIndex(l => /^Formação/i.test(l));
  if (expStart === -1) return [];

  const expLines = lines.slice(expStart + 1, expEnd > expStart ? expEnd : undefined);

  // Use date lines as anchors — they are uniquely formatted
  const dateIndices = expLines
    .map((l, i) => DATE_LINE_RE.test(l) ? i : -1)
    .filter(i => i !== -1);

  if (dateIndices.length === 0) return [];

  return dateIndices.map((dateIdx, entryNum) => {
    const dateLine = expLines[dateIdx];

    // Walk backwards from date line to find title and company
    // Ignore LinkedIn's total-tenure lines like "2 anos 4 meses"
    const prevMeaningful = [];
    for (let i = dateIdx - 1; i >= 0 && prevMeaningful.length < 3; i--) {
      const l = expLines[i];
      if (!l || DATE_LINE_RE.test(l)) break;
      if (!TENURE_RE.test(l)) prevMeaningful.unshift(l);
    }

    const title   = prevMeaningful[prevMeaningful.length - 1] ?? '';
    const company = prevMeaningful[prevMeaningful.length - 2] ?? title;

    // Collect bullet points until next entry's date line
    const nextDateIdx = dateIndices[entryNum + 1] ?? expLines.length;
    const bullets = expLines
      .slice(dateIdx + 1, nextDateIdx)
      .filter(l => l.startsWith('•') || l.startsWith('·'))
      .map(l => l.replace(/^[•·]\s*/, '').replace(/;\s*$/, '').trim())
      .filter(Boolean);

    const description = bullets.join('. ');

    return {
      title:  { pt: title, en: title },
      company,
      period: formatPeriod(dateLine),
      description: {
        pt: description || `Atuei como ${title} na ${company}.`,
        en: description || `Worked as ${title} at ${company}.`,
      },
      current: /Present/i.test(dateLine),
    };
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const pdfPath = process.argv[2] ?? DEFAULT_PDF;

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌  PDF não encontrado: ${pdfPath}`);
    console.error('');
    console.error('    Como usar:');
    console.error('    1. Baixe o PDF do seu perfil no LinkedIn');
    console.error('       (Perfil → Mais → Salvar como PDF)');
    console.error('    2. Coloque o arquivo como linkedin.pdf na raiz do projeto');
    console.error('       (está no .gitignore — não será commitado)');
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

  console.log(`📄  Lendo: ${path.basename(pdfPath)}`);

  const buffer       = fs.readFileSync(pdfPath);
  const { text }     = await pdfParse(buffer);
  const lines        = cleanLines(text);

  const summaryText  = extractSummary(lines);
  const experience   = extractExperience(lines);

  const existing = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'));

  const updated = {
    about: summaryText
      ? { pt: summaryText, en: summaryText }
      : existing.about,
    experience: experience.length > 0
      ? experience.sort((a, b) => (a.current === b.current ? 0 : a.current ? -1 : 1))
      : existing.experience,
    skills: existing.skills,   // always preserved — update manually
    medium: existing.medium,   // always preserved
  };

  fs.writeFileSync(PROFILE_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');

  console.log('✅  data/profile.json atualizado com sucesso!');
  console.log(`    Resumo:     ${summaryText ? 'atualizado ✓' : 'não encontrado — mantido existente'}`);
  console.log(`    Experiência: ${updated.experience.length} posição(ões) importada(s)`);
}

main().catch(err => {
  console.error('❌  Erro:', err.message);
  process.exit(1);
});
