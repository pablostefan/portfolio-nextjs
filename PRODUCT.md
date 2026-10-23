# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, hiring managers and engineering leads at Brazilian fintech and large tech companies (Nubank, BTG Pactual, Stark Bank, XP and similar) evaluating Pablo for Staff Mobile Engineer, Mobile Architect or Mobile Tech Lead roles. They arrive from LinkedIn or a job application, usually on a laptop and sometimes on a phone, and decide within a minute whether he is worth a conversation. (Inferred from the LinkedIn career analysis of 2026-10-13 and Pablo's applications; not yet confirmed by Pablo.)

Secondary: designers and engineers in the Flutter and design-system community who find him through Medium, GitHub or LinkedIn posts.

## Product Purpose

The personal portfolio of Pablo Stefan (Pablo Stefan Gomes Pereira), Software Architect, Mobile/Flutter, at XP Inc. It exists to get him hired or approached for senior mobile architecture roles. Success is a visitor understanding in seconds that he builds the systems other teams build apps with, believing it from concrete evidence, and reaching out.

## Positioning

He architects SOMA, the Flutter design system behind the XP, Rico and Clear apps, and he built Morphix, the tool that shows component and semantics diffs on every pull request. Few mobile engineers can show design-system governance, accessibility at scale and motion architecture as their own shipped work.

## Operating Context

Visitors come from LinkedIn (linkedin.com/in/pablosgpereira), GitHub (pablostefan), Medium (@pablo.stefan) or a direct link to pablostefan.com.br. The site is bilingual: Portuguese at /pt (default) and English at /en.

## Capabilities and Constraints

- Next.js 16 App Router, TypeScript, Tailwind CSS 4, Framer Motion (Motion) 12, next-intl. npm only. Deployed on Vercel.
- Content lives in `data/profile.json` (about, experience, skills), `data/certifications.json` and `messages/{pt,en}.json`, updated by scripts from LinkedIn exports. The redesign must keep reading from these files.
- Projects come live from the GitHub API (`lib/github.ts`, Morphix featured); certifications are enriched at runtime (`lib/credly.ts`).
- Must keep: language switch, contact links (email, LinkedIn, GitHub, Medium), SEO metadata and OG image routes.

## Brand Commitments

- Name shown as "Pablo Stefan". Domain pablostefan.com.br.
- Portrait at `public/avatar.jpg`. Existing "PS" monogram logo at `public/logo.png` (may be redrawn).
- Pablo asked for a site that is beautiful, creative and full of animation and motion, and that does not look AI-generated or simple. The previous dark violet/cyan glassmorphism look is rejected, and so was a light paper "design-system spec sheet" prototype.

## Evidence on Hand

- SOMA at XP Inc. (since Jul 2025): accessibility across 250+ components following WCAG; widget-testing standard that cut support requests 40% per sprint; animated chart library built with CustomPainter and AnimatedBuilder; component governance from creation to deprecation; decisions recorded in RFCs and ADRs; serves the XP, Rico and Clear apps.
- Morphix (Jun–Sep 2026, with Guilherme Muller Costa): visual and semantics diff of components on every PR; estimated US$ 6,240/year savings in licensing.
- Animation architecture used in 650+ points of the app.
- Career: Krykto (2022–2024, junior to mid, led a team of three, payment-terminal app with native Android SDK, crypto wallet app), Fiibo (2024, offline-first, white-label), nav9 (2025, Feature Lead on the Caju app), XP Inc. (2025–present).
- Side project: Treineaqui (May–Aug 2024), a platform for gyms.
- LinkedIn recommendations from Lucas Reis (Staff Product Designer, ex-XP/BTG/Magalu), Guilherme Muller Costa (Software Architect, XP) and Iago Lima (Flutter Developer). Only short excerpts were read; quote only what is verified.
- Education: Universidade Federal do Rio Grande do Norte.
- Certifications: App Development with Swift Certified User (Certiport, 2025), Desenvolvedor Mobile Multiplataforma and Arquiteto de Software (XP Educação, 2024).
- Absent, never invent: client logos beyond his employers, app store metrics, user counts, salaries, more testimonial text than was read.

## Product Principles

1. Show the work, not adjectives: every claim comes with the concrete system, number or artifact behind it.
2. Architect over app developer: lead with systems, governance and decisions, not a list of technologies.
3. One clear position, Flutter and design systems at scale; do not dilute it with unrelated stacks.
4. Motion is part of the proof: he designs animation architecture, so the site's motion must be crafted, purposeful and performant.
5. Accessible by default, as his own work is.

## Accessibility & Inclusion

WCAG 2.2 AA. Respect prefers-reduced-motion everywhere; keyboard navigation and visible focus throughout.
