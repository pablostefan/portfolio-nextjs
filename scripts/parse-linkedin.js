#!/usr/bin/env node
/**
 * parse-linkedin.js
 * Processes LinkedIn Data Export and updates data/profile.json
 *
 * Expected LinkedIn export structure (after unzip to ./linkedin_data/):
 *   linkedin_data/Profile.csv      — personal info + headline + summary
 *   linkedin_data/Positions.csv    — work experience
 *
 * No external dependencies — uses only Node.js built-ins.
 *
 * Usage:
 *   node scripts/parse-linkedin.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const LINKEDIN_DIR = path.join(ROOT, 'linkedin_data');
const PROFILE_PATH = path.join(ROOT, 'data', 'profile.json');

// ─── Minimal RFC 4180 CSV parser (no external deps) ───────────────────────────

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const rows  = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row    = [];
    let   field  = '';
    let   quoted = false;

    for (let i = 0; i < line.length; i++) {
      const ch   = line[i];
      const next = line[i + 1];

      if (quoted) {
        if (ch === '"' && next === '"') { field += '"'; i++; }
        else if (ch === '"')            { quoted = false; }
        else                            { field += ch; }
      } else {
        if (ch === '"')  { quoted = true; }
        else if (ch === ',') { row.push(field.trim()); field = ''; }
        else { field += ch; }
      }
    }
    row.push(field.trim());
    rows.push(row);
  }

  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (row[i] ?? '').trim(); });
    return obj;
  });
}

function readCsv(filename) {
  const filepath = path.join(LINKEDIN_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠  ${filename} not found — skipping`);
    return [];
  }
  return parseCsv(fs.readFileSync(filepath, 'utf-8'));
}

// ─── Month translation (EN abbreviations from LinkedIn CSV → Portuguese) ───────

const EN_ABBR_TO_PT = {
  Jan: 'janeiro', Feb: 'fevereiro', Mar: 'março',   Apr: 'abril',
  May: 'maio',    Jun: 'junho',     Jul: 'julho',    Aug: 'agosto',
  Sep: 'setembro',Oct: 'outubro',   Nov: 'novembro', Dec: 'dezembro',
};

function csvDateToPt(dateStr) {
  if (!dateStr || !dateStr.trim()) return '';
  // LinkedIn CSV: "Jan 2025" → "janeiro de 2025"
  return dateStr.trim().replace(
    /^([A-Za-z]{3})\s+(\d{4})$/,
    (_, mon, year) => `${EN_ABBR_TO_PT[mon] ?? mon.toLowerCase()} de ${year}`,
  );
}

function csvDateToEn(dateStr) {
  if (!dateStr || !dateStr.trim()) return '';
  // LinkedIn CSV: "Jan 2025" → "January 2025"
  const EN_FULL = {
    Jan: 'January',  Feb: 'February', Mar: 'March',    Apr: 'April',
    May: 'May',      Jun: 'June',     Jul: 'July',      Aug: 'August',
    Sep: 'September',Oct: 'October',  Nov: 'November',  Dec: 'December',
  };
  return dateStr.trim().replace(
    /^([A-Za-z]{3})\s+(\d{4})$/,
    (_, mon, year) => `${EN_FULL[mon] ?? mon} ${year}`,
  );
}

// Returns { pt, en } period object
function formatPeriod(startedOn, finishedOn) {
  if (!startedOn) return { pt: '', en: '' };
  const current = !finishedOn || finishedOn.trim() === '';
  return {
    pt: current
      ? `${csvDateToPt(startedOn)} — Atual`
      : `${csvDateToPt(startedOn)} — ${csvDateToPt(finishedOn)}`,
    en: current
      ? `${csvDateToEn(startedOn)} — Present`
      : `${csvDateToEn(startedOn)} — ${csvDateToEn(finishedOn)}`,
  };
}

function isCurrent(finishedOn) {
  return !finishedOn || finishedOn.trim() === '';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(LINKEDIN_DIR)) {
    console.error('❌  ./linkedin_data/ directory not found.');
    console.error('    Unzip the LinkedIn export to ./linkedin_data/ first.');
    process.exit(1);
  }

  const existing = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'));

  // ── Profile.csv ─────────────────────────────────────────────────────────────
  const profiles = readCsv('Profile.csv');
  const profile  = profiles[0] ?? {};

  const summary = (profile['Summary'] ?? profile['Headline'] ?? '').trim();
  const about   = summary
    ? { pt: summary, en: summary }
    : existing.about;

  // ── Positions.csv ────────────────────────────────────────────────────────────
  const positions = readCsv('Positions.csv');

  const experience = positions
    .filter((p) => (p['Company Name'] ?? p['Company'] ?? '').trim())
    .map((p) => {
      const company   = (p['Company Name'] ?? p['Company'] ?? '').trim();
      const titleText = (p['Title'] ?? '').trim();
      const startedOn = p['Started On']  ?? p['Start Date']  ?? '';
      const finishedOn= p['Finished On'] ?? p['End Date']    ?? '';
      const descText  = (p['Description'] ?? '').trim();

      return {
        title:  { pt: titleText, en: titleText },
        company,
        period: formatPeriod(startedOn, finishedOn),
        description: {
          pt: descText || `Trabalhei como ${titleText} na ${company}.`,
          en: descText || `Worked as ${titleText} at ${company}.`,
        },
        current: isCurrent(finishedOn),
      };
    })
    .sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return  1;
      return 0;
    });

  // ── Merge & write ─────────────────────────────────────────────────────────
  const updated = {
    about,
    experience: experience.length > 0 ? experience : existing.experience,
    skills: existing.skills,
    medium: existing.medium,
  };

  fs.writeFileSync(PROFILE_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
  console.log('✅  data/profile.json updated successfully.');
  console.log(`    ${updated.experience.length} position(s) imported.`);
}

main();
