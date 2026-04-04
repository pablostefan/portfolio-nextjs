---
mode: agent
description: >
  Atualiza data/profile.json a partir do conteúdo do PDF do LinkedIn.
  Anexe o PDF exportado do LinkedIn e rode este prompt para gerar
  descrições completas em PT e EN automaticamente.
---

# Atualizar Perfil a partir do LinkedIn

Você vai ler o conteúdo do PDF do LinkedIn anexado pelo usuário e atualizar
`data/profile.json` com informações completas em **português (pt)** e **inglês (en)**.

## Passo 1 — contexto

Leia os seguintes arquivos para entender a estrutura atual:
- `data/profile.json`
- `types/index.ts` (interface `ExperienceEntry` e `Profile`)

## Passo 2 — processar o conteúdo do LinkedIn

O usuário anexou o PDF exportado do LinkedIn. A partir dele, extraia:

### About / Resumo
- Texto completo da seção "Resumo" do LinkedIn
- Gere `about.pt` em português profissional (3–5 frases, primeira pessoa, impactante)
- Gere `about.en` em inglês natural para portfólio internacional (NÃO tradução literal)

### Experiências
Para cada posição, extraia:
- `company` — nome da empresa (nunca traduzir)
- `title.pt` / `title.en` — cargo em PT e EN
  - "Desenvolvedor Mobile Júnior (Flutter)" → EN: "Junior Mobile Developer (Flutter)"
  - "Arquiteto de Software" → EN: "Software Architect"
- `period.pt` / `period.en` — período no formato:
  - PT: `"julho de 2025 — Atual"` (atual) ou `"abril de 2024 — dezembro de 2024"`
  - EN: `"July 2025 — Present"` (atual) ou `"April 2024 — December 2024"`
- `description.pt` / `description.en` — descrição rica:
  - Substitua listas de bullets por **parágrafos coesos** (3–5 frases cada)
  - Preserve TODAS as informações factuais dos bullets
  - PT: tom profissional brasileiro, primeira pessoa, verbos de ação
  - EN: tom natural para portfólio internacional, NÃO tradução literal
- `current: true` apenas para a posição presente / "Atual"

### Skills
- Atualize `skills[]` com todas as tecnologias mencionadas nas experiências
- Prioridade: Flutter, Dart, Design Systems, Clean Architecture, e tecnologias recentes

## Passo 3 — regras de qualidade

- Termos técnicos permanecem em inglês: Flutter, Dart, BLoC, RFCs, ADRs,
  Crashlytics, Flavors, GraphQL, CI/CD, REST, Firebase, Fastlane
- Descrições para portfólio (não para currículo): mais narrativas, menos listas
- Cada descrição deve ter 2–4 frases completas — nunca uma lista de bullets
- `medium` permanece `"https://medium.com/@pablo.stefan"`

## Passo 4 — escrever o arquivo

Use a ferramenta de edição para atualizar `data/profile.json` com o JSON completo.

## Passo 5 — validar

Após salvar, execute `npx tsc --noEmit` para confirmar que os tipos estão corretos.

---

## Referência: Pablo Stefan

- **Cargo atual**: Software Architect no Design System mobile (SOMA) — XP Inc.
- **Especialidades**: Flutter, mobile architecture, Design Systems, BLoC, CI/CD
- **GitHub**: `pablostefan`
- **LinkedIn**: `pablosgpereira`
- **Medium**: `@pablo.stefan`
