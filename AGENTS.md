# AGENTS.md — Portfólio pablostefan.com.br

> Documento de contexto para agentes de IA (Copilot, v0.dev, Cursor, etc.).  
> Leia este arquivo **inteiro** antes de qualquer alteração no projeto.

---

## 1. Visão Geral

Portfólio pessoal auto-atualizado de **Pablo Stefan** (Flutter Developer Pleno na XP Inc).  
Construído com **Next.js 15 (App Router)**, design **Glassmorphism premium**, bilíngue **PT/EN**.

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
| Fontes | next/font (Space Grotesk + Inter + JetBrains Mono) | — |
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
│   ├── layout/
│   │   ├── Navbar.tsx             # Navegação com seletor de idioma
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx               # Título animado + CTA
│   │   ├── About.tsx              # Bio + skills
│   │   ├── Experience.tsx         # Histórico profissional
│   │   ├── Projects.tsx           # Projetos do GitHub
│   │   └── Contact.tsx            # Formulário e links sociais
│   └── ui/
│       ├── GlassCard.tsx          # Card glassmorphism reutilizável
│       ├── GradientText.tsx       # Texto com gradiente violet→cyan
│       ├── AnimatedBlob.tsx       # Blobs SVG animados no background
│       ├── TypewriterText.tsx     # Efeito digitação no Hero
│       ├── SkillBadge.tsx         # Badge de tecnologia
│       └── SectionWrapper.tsx     # Wrapper com scroll reveal
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

### 4.1 Paleta de Cores

```css
/* Fundos */
--bg-base:        #030712;   /* Preto profundo */
--bg-surface:     #0F172A;   /* Superfície cards */

/* Accent */
--violet:         #7C3AED;   /* Principal */
--violet-light:   #A78BFA;
--cyan:           #06B6D4;   /* Secundário */
--indigo:         #4F46E5;

/* Neutros */
--text-primary:   #F9FAFB;
--text-secondary: #94A3B8;
--text-muted:     #475569;

/* Glass */
--glass-bg:       rgba(255,255,255,0.04);
--glass-border:   rgba(255,255,255,0.08);
--glass-blur:     16px;
```

### 4.2 Tipografia

| Uso | Fonte | Peso |
|-----|-------|------|
| Títulos H1–H2 | Space Grotesk | 700 |
| Corpo de texto | Inter | 400 / 500 |
| Labels, código | JetBrains Mono | 400 |

### 4.3 Glass Card (padrão para todos os cards)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

Em Tailwind: `bg-white/[0.04] backdrop-blur-[16px] border border-white/[0.08] rounded-2xl`

### 4.4 Gradientes

```css
/* Texto gradiente */
.gradient-text {
  background: linear-gradient(135deg, #7C3AED, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Blob background */
.blob-gradient {
  background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
}
```

### 4.5 AnimatedBlobs

Três blobs no background em posições fixas, animados com Framer Motion (`animate={{ x, y, scale }}`  
`transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}`). Usar `will-change: transform` e `aria-hidden="true"`.

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

## 9. Wireframes das Seções

### Hero
```
┌─────────────────────────────────────────────────┐
│  [Blob animado violet]          [Blob cyan]      │
│                                                  │
│              Olá, eu sou                        │
│   ██████████████████████████████               │
│           Pablo Stefan                          │
│   ──────────────────────────────               │
│   [TypewriterText: Flutter Developer /          │
│    Mobile Engineer / Open Source Dev]           │
│                                                  │
│   [Ver Projetos ↓]   [Entrar em Contato →]      │
└─────────────────────────────────────────────────┘
```

### About
```
┌───────────────────────────────────────┐
│  Sobre Mim                            │
│  [Foto LinkedIn]  Texto do about.pt   │
│                   (profile.json)      │
│  Tecnologias:                         │
│  [Flutter] [Dart] [Next.js] [...]     │
└───────────────────────────────────────┘
```

### Experience (timeline vertical)
```
┌───────────────────────────────────────┐
│  Experiência                          │
│  ●─── XP Inc             2023–Atual   │
│  │    Flutter Developer Pleno        │
│  │    Descrição...                   │
│  ●─── Empresa anterior   2021–2023   │
└───────────────────────────────────────┘
```

### Projects (grid de GlassCards)
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐    │
│  │ repo name    │  │ repo name    │    │
│  │ description  │  │ description  │    │
│  │ ⭐ N  [Dart] │  │ ⭐ N  [TS]   │    │
│  │ [GitHub] [→] │  │ [GitHub] [→] │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

### Contact
```
┌───────────────────────────────────────┐
│  Vamos conversar                      │
│  ✉  pablo.stefan.dev@gmail.com       │
│  ⌥  github.com/pablostefan           │
│  in linkedin.com/in/pablosgpereira   │
│  ✍  medium.com/@pablo.stefan         │
└───────────────────────────────────────┘
```

---

## 10. Acessibilidade (WCAG 2.1 AA)

- Contraste mínimo: **4.5:1** texto normal, **3:1** texto grande
- `AnimatedBlob`: `aria-hidden="true"` e `pointer-events: none`
- Suporte a `prefers-reduced-motion`: usar `useReducedMotion()` do Framer Motion antes de qualquer animação
- Navegação por teclado: `focus-visible` com anel violet `ring-2 ring-violet-500`
- `<html lang="pt">` ou `<html lang="en">` conforme locale
- Hierarquia correta de headings: único `<h1>` por página
- Links externos: `target="_blank" rel="noopener noreferrer"`
- Imagens: `alt` descritivo em todas

---

## 11. Performance

- **ISR**: `export const revalidate = 3600` nos Server Components que buscam GitHub
- **next/image**: para foto do LinkedIn (otimização automática)
- **next/font**: Space Grotesk + Inter + JetBrains Mono (zero CLS)
- **Server Components por padrão**: apenas `"use client"` onde estritamente necessário
- **AnimatedBlobs**: `will-change: transform`, não aplicar `backdrop-filter` em elementos com muitos filhos

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
- [ ] `lib/github.ts`
- [ ] `lib/linkedin.ts`
- [ ] `app/api/github/route.ts`
- [ ] `app/api/linkedin/route.ts`

### Fase 4 — Seções
- [ ] `components/sections/Hero.tsx`
- [ ] `components/sections/About.tsx`
- [ ] `components/sections/Experience.tsx`
- [ ] `components/sections/Projects.tsx`
- [ ] `components/sections/Contact.tsx`

### Fase 5 — Página Principal
- [ ] `app/[locale]/page.tsx`

### Fase 6 — Automação
- [ ] `scripts/parse-linkedin.js`
- [ ] `.github/workflows/update-profile.yml`

### Fase 7 — Deploy
- [ ] Conectar repo ao Vercel
- [ ] Configurar domínio `pablostefan.com.br`
- [ ] Adicionar env vars no painel Vercel
- [ ] Configurar CNAME no DNS

---

## 14. Regras para Agentes de IA

### ✅ PODE fazer
- Criar/editar arquivos dentro da estrutura da seção 3
- Usar os componentes UI definidos na seção 4
- Adicionar traduções em `messages/pt.json` **E** `messages/en.json` simultaneamente
- Criar novos componentes em `components/ui/` seguindo o padrão glass

### ❌ NÃO PODE fazer
- Usar `yarn` ou `pnpm` — apenas **npm**
- Criar Client Components (`"use client"`) sem necessidade real
- Expor tokens com prefixo `NEXT_PUBLIC_` (exc. `NEXT_PUBLIC_APP_URL`)
- Fazer requests ao LinkedIn no client-side
- Usar bibliotecas de UI externas (shadcn, MUI, Chakra) — apenas Tailwind + componentes próprios
- Alterar paleta de cores da seção 4 sem aprovação explícita

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

*Última atualização: Abril 2026*  
*Mantido por: Pablo Stefan — pablo.stefan.dev@gmail.com*
