#!/usr/bin/env node
/**
 * enhance-profile-ai.js
 * Reads data/profile.json (already populated with PT by parse-linkedin-pdf.js)
 * and uses an LLM to:
 *   1. Generate/improve English translations for title, description, and about
 *   2. Enrich PT descriptions from raw bullet lists to coherent paragraphs
 *   3. Guarantee all fields match the ExperienceEntry TypeScript type
 *
 * API priority:
 *   1. OPENAI_API_KEY   → OpenAI (gpt-4o)
 *   2. GITHUB_TOKEN     → GitHub Models (gpt-4o — free with GitHub Copilot)
 *
 * Usage (local):
 *   GITHUB_TOKEN=<pat> node scripts/enhance-profile-ai.js
 *   OPENAI_API_KEY=<key> node scripts/enhance-profile-ai.js
 *
 * Usage (CI — secrets.GITHUB_TOKEN is passed by the workflow):
 *   node scripts/enhance-profile-ai.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ROOT         = path.resolve(__dirname, '..');
const PROFILE_PATH = path.join(ROOT, 'data', 'profile.json');
const ENV_PATH     = path.join(ROOT, '.env.local');

// ─── Load local .env.local when running outside CI ────────────────────────────

function loadEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) return;
  fs.readFileSync(ENV_PATH, 'utf-8')
    .split('\n')
    .forEach(line => {
      const m = line.match(/^([A-Z_]+)\s*=\s*(.+)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
}

loadEnvLocal();

const OPENAI_KEY    = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;

// ─── HTTP helper (no external deps) ──────────────────────────────────────────

function post(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, method: 'POST' }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse JSON response: ' + data.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildRequestOptions(model) {
  const useOpenAI = Boolean(OPENAI_KEY);
  return {
    hostname: useOpenAI
      ? 'api.openai.com'
      : 'models.inference.ai.azure.com',
    // OpenAI uses /v1/chat/completions; GitHub Models uses /chat/completions
    path: useOpenAI ? '/v1/chat/completions' : '/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${useOpenAI ? OPENAI_KEY : GITHUB_TOKEN}`,
    },
    model: model ?? (useOpenAI ? 'gpt-4o' : 'gpt-4o'),
  };
}

async function callAI(messages, model) {
  const opts = buildRequestOptions(model);
  const body = JSON.stringify({
    model:           opts.model,
    messages,
    temperature:     0.15,
    max_tokens:      4096,
    response_format: { type: 'json_object' },
  });

  const response = await post(
    { hostname: opts.hostname, path: opts.path, headers: { ...opts.headers, 'Content-Length': Buffer.byteLength(body) } },
    body,
  );

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty AI response');

  try {
    return JSON.parse(content);
  } catch {
    throw new Error('AI returned non-JSON: ' + content.slice(0, 200));
  }
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are a senior technical writer and professional translator specializing in Software Engineer / Tech Lead profiles for the international job market.

Profile owner context:
  Name:          Pablo Stefan
  Current role:  Software Architect — mobile Design System (SOMA) at XP Inc. (Brazil's largest broker/bank)
  Specialties:   Flutter, Dart, mobile architecture, Design Systems, BLoC, Clean Architecture, CI/CD
  Audience:      International tech companies and Brazilian recruiter

Your tasks for EACH experience entry:
  1. titleEn    — Professional English title (keep "Flutter" as-is; "Júnior" → "Junior"; "Pleno" → "Mid-level")
  2. descPt     — Polished PT paragraph(s) from raw bullets. Keep ALL factual info.
                  Coherent prose, not a bulleted list. 3–5 sentences each. First-person, action verbs.
  3. descEn     — Natural, fluent English equivalent of descPt. NOT a literal translation.
                  International portfolio tone. Start with a strong action verb.

For the about section:
  aboutPt / aboutEn — Professional summary (3–5 sentences). Keep concision.

Rules:
  - Return ONLY a JSON object matching the schema below. No markdown, no code fences.
  - Company names are NEVER translated (XP Inc., nav9, Fiibo, Krykto stay as-is).
  - Technical terms stay standard: Flutter, Dart, BLoC, RFCs, ADRs, Crashlytics, Flavors, GraphQL, CI/CD.
  - Preserve ALL factual information from the PT descriptions.
  - Make descriptions compelling for an international portfolio, NOT a resume.

JSON schema to return:
{
  "aboutPt": "string",
  "aboutEn": "string",
  "experiences": [
    {
      "i": 0,
      "titleEn": "string",
      "descPt": "string",
      "descEn": "string"
    }
  ]
}
`.trim();

function buildUserPrompt(profile) {
  const expPayload = profile.experience.map((e, i) => ({
    i,
    company:    e.company,
    titlePt:    e.title?.pt ?? '',
    periodPt:   e.period?.pt ?? '',
    isCurrent:  e.current,
    descPt:     e.description?.pt ?? '',
  }));

  return [
    'Here is the current profile data. Enhance and translate it.',
    '',
    '=== ABOUT (PT) ===',
    profile.about?.pt || '(empty)',
    '',
    '=== EXPERIENCES (PT) ===',
    JSON.stringify(expPayload, null, 2),
  ].join('\n');
}

// ─── Merge AI result back to profile ─────────────────────────────────────────

function applyAIResult(profile, result) {
  const updated = structuredClone ? structuredClone(profile) : JSON.parse(JSON.stringify(profile));

  if (result.aboutPt || result.aboutEn) {
    updated.about = {
      pt: result.aboutPt || updated.about?.pt || '',
      en: result.aboutEn || updated.about?.en || '',
    };
  }

  (result.experiences ?? []).forEach(({ i, titleEn, descPt, descEn }) => {
    if (!updated.experience[i]) return;
    const e = updated.experience[i];
    updated.experience[i] = {
      ...e,
      title: {
        pt: e.title.pt,
        en: titleEn?.trim() || e.title.en || e.title.pt,
      },
      description: {
        pt: descPt?.trim() || e.description.pt,
        en: descEn?.trim() || e.description.en || e.description.pt,
      },
    };
  });

  return updated;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!OPENAI_KEY && !GITHUB_TOKEN) {
    console.error('❌  No API key found.');
    console.error('    Set GITHUB_TOKEN (GitHub Models) or OPENAI_API_KEY in .env.local or environment.');
    process.exit(1);
  }

  const apiName = OPENAI_KEY ? 'OpenAI (gpt-4o)' : 'GitHub Models (gpt-4o)';
  console.log(`\n🤖  Enhancing profile with ${apiName}...\n`);

  const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'));

  // ── Call AI ──────────────────────────────────────────────────────────────────
  let result;
  try {
    result = await callAI(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: buildUserPrompt(profile) },
      ],
    );
  } catch (err) {
    console.error('❌  AI call failed:', err.message);
    console.warn('⚠   Skipping AI enhancement — profile.json unchanged.');
    process.exit(0); // soft fail: don't break CI
  }

  // ── Validate AI returned required fields ─────────────────────────────────────
  if (!result.experiences || !Array.isArray(result.experiences)) {
    console.error('❌  AI returned unexpected schema:', JSON.stringify(result).slice(0, 200));
    console.warn('⚠   Skipping AI enhancement.');
    process.exit(0);
  }

  const updated = applyAIResult(profile, result);
  fs.writeFileSync(PROFILE_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf-8');

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log('✅  data/profile.json enhanced!\n');
  console.log('    About PT:', updated.about.pt.slice(0, 80) + '...');
  console.log('    About EN:', updated.about.en.slice(0, 80) + '...\n');
  updated.experience.forEach((e, i) => {
    const mark = e.current ? '●' : ' ';
    console.log(`  ${mark} [${i}] ${e.company} — ${e.title.en}`);
    console.log(`       ${e.description.en.slice(0, 90)}...`);
  });
  console.log('');
}

main().catch(err => {
  console.error('❌  Unexpected error:', err.message);
  process.exit(0); // soft fail
});
