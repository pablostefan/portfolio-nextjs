# AGENTS.md — Portfólio pablostefan.com.br

> Documento de contexto para agentes de IA (Copilot, v0.dev, Cursor, etc.).  
> Leia este arquivo **inteiro** antes de qualquer alteração no projeto.

---

## 1. Visão Geral

Portfólio pessoal auto-atualizado de **Pablo Stefan** (Software Architect - Mobile/Flutter @ XP Inc).  
Construído com **Next.js 16 (App Router)**, design **painel de azulejos** (ver `DESIGN.md`), bilíngue **PT/EN**.

| Item | Valor |
|------|-------|
| URL produção | `https://pablostefan.com.br` |
| Repositório | `https://github.com/pablostefan/portfolio-nextjs` |
| Deploy | Vercel |
| GitHub username | `pablostefan` |
| LinkedIn | `in/pablosgpereira` |
| Email | `pablo.stefan.dev@gmail.com` |
| Medium | `https://medium.com/@pablo.stefan` |

---

## 2. Stack Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15.x |
| Linguagem | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.x |
| Animações | Framer Motion | 12.x |
| i18n | next-intl | 4.x |
| Ícones | lucide-react | latest |
| Fontes | next/font (Bricolage Grotesque + Hanken Grotesk + JetBrains Mono) | — |
| Package manager | **npm** (nunca yarn/pnpm) | 10.x |
| Deploy | Vercel | — |
| Node | 22.x | — |

---

## 3. Estrutura de Pastas

```
portfolio-nextjs/
├── app/
│   ├── [locale]/                  # pt | en
│   │   ├── layout.tsx             # Layout com next-intl provider
│   │   └── page.tsx               # Página principal (todas as seções)
│   └── api/
│       ├── github/
│       │   └── route.ts           # GET /api/github — projetos do GitHub
│       └── linkedin/
│           └── route.ts           # GET /api/linkedin — headline + foto
├── components/
│   └── azulejo/                   # Seções e peças do painel de azulejos
│       ├── TileArt.tsx            # Uma face de azulejo em SVG (8 motivos)
│       ├── TilePanel.tsx          # Parede de azulejos: entrada, hover e recompor
│       ├── SiteNav.tsx            # Aba de navegação fixa
│       ├── Cover.tsx              # Capa (h1) sobre o painel
│       ├── System.tsx             # Uma peça, muitas composições (scroll)
│       ├── Cases.tsx              # SOMA, Morphix, Motion
│       ├── Career.tsx             # Trajetória
│       ├── Voices.tsx             # Recomendações verificadas
│       ├── IndexSection.tsx       # Projetos, certificações, formação
│       └── Colophon.tsx           # Contato
├── messages/
│   ├── pt.json                    # Strings em português
│   └── en.json                    # Strings em inglês
├── data/
│   └── profile.json               # About + Experience (manual, bilíngue)
├── lib/
│   ├── github.ts                  # Fetch projetos GitHub (ISR)
│   ├── linkedin.ts                # Fetch LinkedIn /v2/me
│   └── utils.ts                   # Helpers gerais
├── types/
│   └── index.ts                   # Interfaces TypeScript
├── public/
│   └── og-image.png               # Open Graph image
├── .github/
│   └── workflows/
│       └── update-profile.yml     # GitHub Action: processa LinkedIn export
├── middleware.ts                  # Redirect / → /pt (ou idioma do browser)
├── i18n.ts                        # Configuração next-intl
├── next.config.ts                 # Config Next.js (ISR, headers, i18n)
├── tailwind.config.ts             # Design tokens customizados
├── .env.local                     # Variáveis de ambiente (não commitar)
└── AGENTS.md                      # Este arquivo
```

---

## 4. Design System

A fonte da verdade é **`DESIGN.md`** (tokens no frontmatter, regras no corpo) e `PRODUCT.md` (público, posicionamento, provas). Os tokens vivem em `app/globals.css` via `@theme`.

Resumo:
- Esmaltes: cobalt `#1C3F94`, glaze `#EEF1F5`, ink `#111318`, ochre `#F0B323`; secundários ink-soft `#4A4D55`, glaze-soft `#C9D3EC`, ash `#9AA0AB`.
- Display: **Bricolage Grotesque**. Corpo: **Hanken Grotesk**. Rótulos: **JetBrains Mono**.
- Ornamento é só azulejo (`lib/tiles.ts` + `TileArt`). Movimento só gira, assenta ou recorta azulejos. Nada de gradientes, glassmorphism, sombras ou cantos arredondados.
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` para entradas, `cubic-bezier(0.77, 0, 0.175, 1)` para movimento na tela.

---

## 5. Internacionalização (i18n)

- **Biblioteca**: `next-intl`
- **Locales**: `pt` (padrão), `en`
- **URLs**:
  - `pablostefan.com.br/pt` → Português
  - `pablostefan.com.br/en` → English
  - `pablostefan.com.br/` → redireciona para idioma do browser (middleware)

### 5.1 Estrutura messages/pt.json

```json
{
  "nav": {
    "about": "Sobre", "experience": "Experiência",
    "projects": "Projetos", "contact": "Contato"
  },
  "hero": {
    "greeting": "Olá, eu sou",
    "role": "Flutter Developer",
    "typewriter": ["Flutter Developer", "Mobile Engineer", "Open Source Dev"],
    "subtitle": "Construindo experiências móveis de alto impacto",
    "cta_projects": "Ver Projetos",
    "cta_contact": "Entrar em Contato"
  },
  "about": {
    "title": "Sobre Mim",
    "skills_title": "Tecnologias"
  },
  "experience": {
    "title": "Experiência",
    "current": "Atual"
  },
  "projects": {
    "title": "Projetos",
    "view_github": "Ver no GitHub",
    "view_demo": "Demo"
  },
  "contact": {
    "title": "Contato",
    "subtitle": "Vamos conversar",
    "email_label": "Email",
    "github_label": "GitHub",
    "linkedin_label": "LinkedIn",
    "medium_label": "Medium"
  }
}
```

---

## 6. Fontes de Dados

### 6.1 GitHub API — Projetos (Automático, ISR)

- **Endpoint**: `GET https://api.github.com/users/pablostefan/repos`
- **Filtro**: repos com topic `portfolio` ou repos pinados via GraphQL
- **Revalidate**: `3600` (1h) — ISR do Next.js
- **Token**: `GITHUB_TOKEN` (env var, aumenta rate limit)
- **Dados usados**: `name`, `description`, `html_url`, `homepage`, `topics`, `stargazers_count`, `language`, `updated_at`

> **Ação manual necessária**: Adicionar topic `portfolio` nos repos desejados no GitHub.  
> Candidatos: empiricus, animated_charts, movie_app, parallax_effect, regex_pattern_text_field

### 6.2 LinkedIn API — Headline + Foto (Automático)

- **Endpoint**: `GET https://api.linkedin.com/v2/me`
- **Scope**: `r_basicprofile`
- **Dados disponíveis**: `localizedFirstName`, `localizedLastName`, `vanityName`, foto via `/v2/me?projection=(id,profilePicture(...))`
- **Limitação importante**: `about/summary` e `experience` **NÃO estão disponíveis** em nenhum tier público da API
- **Token**: `LINKEDIN_ACCESS_TOKEN` (env var, server-side only — nunca expor no client)

### 6.3 profile.json — About + Experience (Manual)

Atualizado manualmente 1-2x por ano ou via GitHub Action com LinkedIn export.

```json
{
  "about": {
    "pt": "Desenvolvedor Flutter Pleno na XP Inc...",
    "en": "Flutter Developer at XP Inc..."
  },
  "experience": [
    {
      "title": { "pt": "Desenvolvedor Flutter Pleno", "en": "Flutter Developer" },
      "company": "XP Inc",
      "period": "2023 — Atual",
      "description": {
        "pt": "Descrição em português...",
        "en": "Description in English..."
      },
      "current": true
    }
  ],
  "skills": ["Flutter", "Dart", "Next.js", "TypeScript", "Firebase", "REST APIs", "Git"],
  "medium": "https://medium.com/@pablo.stefan"
}
```

---

## 7. Interfaces TypeScript (types/index.ts)

```typescript
export interface Project {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface ExperienceEntry {
  title: { pt: string; en: string };
  company: string;
  period: string;
  description: { pt: string; en: string };
  current: boolean;
}

export interface Profile {
  about: { pt: string; en: string };
  experience: ExperienceEntry[];
  skills: string[];
  medium: string;
}

export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline?: string;
  photoUrl?: string;
}
```

---

## 8. Variáveis de Ambiente

Criar `.env.local` na raiz (baseado em `.env.example`):

```env
# GitHub (aumentar rate limit — gerar em github.com/settings/tokens)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx

# LinkedIn (obter no LinkedIn Developer Portal)
LINKEDIN_ACCESS_TOKEN=AQV...

# App URL para Open Graph
NEXT_PUBLIC_APP_URL=https://pablostefan.com.br
```

> **Segurança**: `LINKEDIN_ACCESS_TOKEN` deve ser usado APENAS em API Routes server-side  
> (`app/api/linkedin/route.ts`). Nunca usar em Client Components.

---

## 9. Seções

Capa → O sistema → Cases (SOMA, Morphix, Motion) → Trajetória → Recomendações → Índice → Contato. Detalhes de cada componente em `DESIGN.md` › Components.

---

## 10. Acessibilidade (WCAG 2.1 AA)

- Contraste mínimo: **4.5:1** texto normal, **3:1** texto grande
- Azulejos são decoração: `aria-hidden="true"`; todo texto fica fora dos painéis
- Suporte a `prefers-reduced-motion`: usar `useReducedMotion()` do Framer Motion antes de qualquer animação
- Navegação por teclado: `focus-visible` com contorno definido em `app/globals.css`
- `<html lang="pt">` ou `<html lang="en">` conforme locale
- Hierarquia correta de headings: único `<h1>` por página
- Links externos: `target="_blank" rel="noopener noreferrer"`
- Imagens: `alt` descritivo em todas

---

## 11. Performance

- **ISR**: `export const revalidate = 3600` nos Server Components que buscam GitHub
- **next/image**: para foto do LinkedIn (otimização automática)
- **next/font**: Bricolage Grotesque + Hanken Grotesk + JetBrains Mono (zero CLS)
- **Server Components por padrão**: apenas `"use client"` onde estritamente necessário
- **TilePanel**: a rotação vive no DOM (`data-turn`, `--rot`), então hover não re-renderiza o React

---

## 12. GitHub Action — LinkedIn Export

Arquivo: `.github/workflows/update-profile.yml`

**Fluxo manual:**
1. Baixar LinkedIn Data Export (Settings → Privacy → Get a copy of your data)
2. Disparar workflow via `workflow_dispatch` com URL do `.zip`
3. Action processa `Profile.csv` + `Positions.csv` → atualiza `data/profile.json`
4. Commit automático no repositório

```yaml
name: Update Profile from LinkedIn Export
on:
  workflow_dispatch:
    inputs:
      linkedin_zip_url:
        description: 'URL do arquivo LinkedIn Export (.zip)'
        required: true
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Processar export
        run: |
          curl -L "${{ github.event.inputs.linkedin_zip_url }}" -o linkedin.zip
          unzip linkedin.zip -d linkedin_data
          node scripts/parse-linkedin.js
      - name: Commit
        run: |
          git config user.email "action@github.com"
          git config user.name "GitHub Action"
          git add data/profile.json
          git commit -m "chore: update profile from LinkedIn export" || echo "No changes"
          git push
```

---

## 13. Ordem de Implementação

### Fase 1 — Setup Base
- [x] `app/globals.css` — design tokens via `@theme` (Tailwind v4 usa CSS, não `tailwind.config.ts`)
- [x] `next.config.ts` (i18n locales, headers de segurança)
- [x] `i18n.ts` (configuração next-intl)
- [x] `middleware.ts` (redirect `/` → locale do browser)
- [x] `messages/pt.json` e `messages/en.json`
- [x] `types/index.ts`
- [x] `data/profile.json`
- [x] `.env.example`

### Fase 2 — Layout e UI Base
- [x] `components/ui/AnimatedBlob.tsx`
- [x] `components/ui/GlassCard.tsx`
- [x] `components/ui/GradientText.tsx`
- [x] `components/ui/SectionWrapper.tsx`
- [x] `components/ui/TypewriterText.tsx`
- [x] `components/ui/SkillBadge.tsx`
- [x] `components/layout/Navbar.tsx`
- [x] `components/layout/Footer.tsx`
- [x] `app/[locale]/layout.tsx`

### Fase 3 — APIs
- [x] `lib/github.ts`
- [x] `lib/linkedin.ts`
- [x] `lib/utils.ts`
- [x] `app/api/github/route.ts`
- [x] `app/api/linkedin/route.ts`

### Fase 4 — Seções
- [x] `components/sections/Hero.tsx`
- [x] `components/sections/About.tsx`
- [x] `components/sections/Experience.tsx`
- [x] `components/sections/Projects.tsx`
- [x] `components/sections/Contact.tsx`

### Fase 5 — Página Principal
- [x] `app/[locale]/page.tsx`

### Fase 6 — Automação
- [x] `scripts/parse-linkedin.js`
- [x] `.github/workflows/update-profile.yml`

### Fase 7 — Deploy
- [x] Conectar repo ao Vercel (`vercel --prod`)
- [x] Domínio `pablostefan.com.br` adicionado ao projeto Vercel
- [x] Env var `NEXT_PUBLIC_APP_URL` configurada na Vercel
- [ ] Adicionar `GITHUB_TOKEN` nas env vars do painel Vercel
- [ ] Adicionar `LINKEDIN_ACCESS_TOKEN` nas env vars do painel Vercel
- [ ] Configurar DNS no HostGator: registro `A` apontando `pablostefan.com.br → 76.76.21.21`
- [ ] Conectar repositório GitHub ao projeto Vercel (painel: pablo-stefan/portfolio-nextjs → Settings → Git)

---

## 14. Regras para Agentes de IA

### ✅ PODE fazer
- Criar/editar arquivos dentro da estrutura da seção 3
- Seguir os tokens e regras de `DESIGN.md`
- Adicionar traduções em `messages/pt.json` **E** `messages/en.json` simultaneamente
- Criar novos componentes em `components/azulejo/` seguindo `DESIGN.md`

### ❌ NÃO PODE fazer
- Usar `yarn` ou `pnpm` — apenas **npm**
- Criar Client Components (`"use client"`) sem necessidade real
- Expor tokens com prefixo `NEXT_PUBLIC_` (exc. `NEXT_PUBLIC_APP_URL`)
- Fazer requests ao LinkedIn no client-side
- Usar bibliotecas de UI externas (shadcn, MUI, Chakra) — apenas Tailwind + componentes próprios
- Alterar a paleta ou a direção de `DESIGN.md` sem aprovação explícita
- Usar ícones `Github` ou `Linkedin` do lucide-react — eles **não existem** na v1.7.0; usar `Code2` e `Globe` respectivamente
- Em `Variants` do Framer Motion, usar `{}` como valor de fallback para `shouldReduceMotion` — usar `undefined`

### Convenções de Código
- Componentes: **named export** (não default)
- Props: interface TypeScript explícita sempre
- Tailwind: ordem `layout > spacing > visual > interactive`
- Framer Motion: sempre `useReducedMotion()` antes de animar
- Strings de UI: sempre via `useTranslations()` do next-intl

### Checklist antes de commitar
- [ ] Sem `console.log` em produção
- [ ] Todas as strings de UI em `messages/pt.json` e `messages/en.json`
- [ ] `aria-label` em ícones standalone, `alt` em todas as imagens
- [ ] Sem secrets hardcoded

---

## 15. Comandos Úteis

```bash
npm install           # Instalar dependências
npm run dev           # Dev local (http://localhost:3000)
npm run build         # Build de produção
npx tsc --noEmit      # Type-check
npm run lint          # Lint
vercel --prod         # Deploy (requer Vercel CLI)
```

---

## 16. LinkedIn Developer Setup

1. Acessar [linkedin.com/developers](https://www.linkedin.com/developers/)
2. Criar App com produto **"Sign In with LinkedIn using OpenID Connect"**
3. OAuth 2.0 redirect URL: `https://pablostefan.com.br/api/auth/callback`
4. Scope necessário: `r_basicprofile` (ou `profile` no OIDC)
5. Salvar token em `LINKEDIN_ACCESS_TOKEN` no Vercel e `.env.local`

> O token expira em 60 dias. Para produção, implementar refresh token flow.

---

*Última atualização: Outubro 2026*  
*Mantido por: Pablo Stefan — pablo.stefan.dev@gmail.com*
