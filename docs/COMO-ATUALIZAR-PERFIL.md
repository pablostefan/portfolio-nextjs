# Como Atualizar o Perfil e Certificações

Guia prático para atualizar os dados do site a partir de PDFs do LinkedIn e certificados.

---

## Visão Geral

O site usa **GitHub Actions** para processar PDFs automaticamente. O fluxo é:

```
Upload de PDF → git push main → Action roda script → JSON atualizado → deploy automático
```

Existem **dois pipelines independentes**:

| Pipeline | Pasta de upload | Script | JSON gerado | Workflow |
|----------|----------------|--------|-------------|----------|
| **Perfil LinkedIn** | `uploads/linkedin/` | `parse-linkedin-pdf.js` + `enhance-profile-ai.js` | `data/profile.json` | `update-profile-pdf.yml` |
| **Certificações** | `uploads/certs/` | `parse-cert-pdfs.js` | `data/certifications.json` | `update-certifications.yml` |

---

## 1. Atualizar Perfil (LinkedIn PDF)

### Passo a passo

1. **Exportar PDF do LinkedIn**
   - Abra seu perfil no LinkedIn
   - Clique em `Mais` → `Salvar como PDF`
   - Salve o arquivo (qualquer nome `.pdf`)

2. **Colocar o PDF na pasta certa**
   ```bash
   cp ~/Downloads/Profile.pdf uploads/linkedin/
   ```

3. **Fazer push para main**
   ```bash
   git add uploads/linkedin/
   git commit -m "chore: upload LinkedIn PDF for profile update"
   git push
   ```

4. **O que acontece automaticamente:**
   - GitHub Action detecta o PDF em `uploads/linkedin/`
   - `parse-linkedin-pdf.js` extrai: resumo (about), experiências, skills
   - `enhance-profile-ai.js` melhora o texto PT e gera tradução EN com IA (GPT-4o)
   - `data/profile.json` é atualizado
   - O PDF é **deletado** do repositório (privacidade)
   - Commit automático: `"chore: update profile from LinkedIn PDF [skip ci]"`
   - `deploy.yml` faz deploy na Vercel

5. **Verificar resultado**
   - Veja o diff no commit gerado pela Action
   - Acesse o site para confirmar as mudanças

### Opção: pular a IA

Caso queira apenas o parse bruto (sem melhoria de texto), use o workflow manualmente:

- Vá em **Actions** → **Update Profile from LinkedIn PDF** → **Run workflow**
- Marque a checkbox `skip_ai = true`

### Opção: rodar localmente

```bash
# Apenas parse (sem IA)
npm run update-profile:pdf

# Parse + IA (precisa de GITHUB_TOKEN ou OPENAI_API_KEY)
GITHUB_TOKEN=ghp_xxx npm run update-profile

# Apenas IA (assumindo que parse já rodou)
GITHUB_TOKEN=ghp_xxx npm run update-profile:ai
```

### O que o parser extrai do PDF

| Campo | Origem no PDF | Destino no JSON |
|-------|--------------|----------------|
| Resumo/About | Seção "Summary" | `about.pt` / `about.en` |
| Experiências | Seção "Experience" | `experience[]` com título, empresa, período, descrição |
| Skills | Seção "Skills" (top 10) | `skills[]` |

> **Merge inteligente:** o parser preserva traduções EN que já existem no `profile.json`. Só sobrescreve campos que vieram do PDF.

---

## 2. Adicionar Certificações (PDFs)

### Passo a passo

1. **Obter os PDFs dos certificados**
   - Certiport (Apple): baixe pelo portal [verify.certiport.com](https://verify.certiport.com)
   - XP Educação: baixe pelo portal da XP
   - Outros: qualquer PDF de certificado funciona (modo genérico)

2. **Colocar os PDFs na pasta certa**
   ```bash
   cp ~/Downloads/certificado_*.pdf uploads/certs/
   cp ~/Downloads/"App Development with Swift.pdf" uploads/certs/
   ```

3. **Fazer push para main**
   ```bash
   git add uploads/certs/
   git commit -m "chore: upload certification PDFs"
   git push
   ```

4. **O que acontece automaticamente:**
   - GitHub Action detecta PDFs em `uploads/certs/`
   - `parse-cert-pdfs.js` detecta o formato de cada PDF automaticamente
   - `data/certifications.json` é atualizado (merge com existentes)
   - Os PDFs são **deletados** do repositório
   - Commit automático: `"chore: update certifications from PDFs [skip ci]"`
   - Deploy automático na Vercel

### Opção: rodar localmente

```bash
npm run update-certs
```

### Formatos de certificado suportados

| Formato | Como detecta | O que extrai |
|---------|-------------|-------------|
| **Certiport** (Apple) | URL `verify.certiport.com` ou código `XXXX-XXXX` | Nome, credential ID, data de emissão |
| **XP Educação** | Texto "xp educa" ou nome do arquivo `certificado_` | Nome do curso, data de conclusão |
| **Genérico** | Fallback | Usa o nome do arquivo como nome do certificado |

### Merge de certificados

- Certificados existentes são **preservados** se não houver PDF novo
- Match por `credentialId` ou `id` (slug do nome do arquivo)
- URLs do **Credly** são preservadas (nunca sobrescritas pelo parser)
- Ordenação: válidos primeiro (por data desc), expirados por último

> **Dica:** para adicionar a URL do badge Credly a um certificado, edite `data/certifications.json` manualmente e adicione o campo `credentialUrl` com o link do Credly. O parser preservará esse valor.

---

## 3. Fluxo Legacy (CSV do LinkedIn)

Existe um workflow mais antigo para processar o **export CSV completo** do LinkedIn:

1. Solicite seus dados em **LinkedIn** → **Settings** → **Get a copy of your data**
2. Faça upload do `.zip` para algum lugar acessível (Google Drive, Dropbox)
3. Vá em **Actions** → **Update Profile from LinkedIn Export** → **Run workflow**
4. Cole a URL direta do `.zip`

> Este fluxo é mais antigo e **não inclui IA**. Prefira o fluxo PDF (seção 1).

---

## 4. Variáveis de Ambiente Necessárias

### No GitHub (Secrets do repositório)

| Secret | Onde configurar | Para quê |
|--------|----------------|----------|
| `GITHUB_TOKEN` | Automático (Actions) | GitHub Models API (IA) — já vem grátis |
| `VERCEL_TOKEN` | Settings → Secrets → Actions | Deploy na Vercel |

### Local (`.env.local` ou variáveis de shell)

| Variável | Para quê |
|----------|----------|
| `GITHUB_TOKEN` | Rodar `enhance-profile-ai.js` localmente via GitHub Models |
| `OPENAI_API_KEY` | Alternativa: usar OpenAI direto em vez de GitHub Models |

> O script de IA tenta `OPENAI_API_KEY` primeiro. Se não encontrar, usa `GITHUB_TOKEN` com GitHub Models (grátis com Copilot).

---

## 5. Estrutura dos Arquivos de Dados

### `data/profile.json`

```jsonc
{
  "about": {
    "pt": "Texto de apresentação em português...",
    "en": "Presentation text in English..."
  },
  "experience": [
    {
      "title": { "pt": "Título PT", "en": "Title EN" },
      "company": "Nome da Empresa",
      "period": { "pt": "julho de 2025 — Atual", "en": "July 2025 — Present" },
      "description": { "pt": "Descrição...", "en": "Description..." },
      "current": true
    }
  ],
  "skills": ["Flutter", "Dart", "TypeScript", "..."],
  "medium": "https://medium.com/@pablo.stefan"
}
```

### `data/certifications.json`

```jsonc
{
  "certifications": [
    {
      "id": "app-development-with-swift-certified-user",
      "name": "App Development with Swift — Certified User",
      "issuer": "Certiport",
      "issueDate": "2025-01",
      "expiryDate": null,
      "credentialId": "Cw3V-DwzA",
      "credentialUrl": "https://verify.certiport.com"
    }
  ]
}
```

---

## 6. Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Action não disparou | PDF não está em `uploads/linkedin/` ou `uploads/certs/` | Verificar o path exato no commit |
| Profile não mudou | PDF não tem seção "Summary" ou "Experience" legível | Verificar o output da Action nos logs |
| IA não rodou | `skip_ai` marcado ou GITHUB_TOKEN sem permissão `models:read` | Verificar permissions do workflow |
| Certificado duplicado | Mesmo `credentialId` já existe | Normal — o parser faz merge e atualiza |
| Deploy não aconteceu | Commit tem `[skip ci]` e deploy.yml ouve push | O push subsequente (da Action) dispara o deploy |
| Texto em EN ficou igual ao PT | IA falhou silenciosamente | Rodar `npm run update-profile:ai` manualmente com token válido |

---

## Resumo Rápido (Cheat Sheet)

```bash
# === ATUALIZAR PERFIL ===
cp ~/Downloads/Profile.pdf uploads/linkedin/
git add uploads/linkedin/ && git commit -m "chore: upload LinkedIn PDF" && git push

# === ADICIONAR CERTIFICADOS ===
cp ~/Downloads/*.pdf uploads/certs/
git add uploads/certs/ && git commit -m "chore: upload cert PDFs" && git push

# === RODAR LOCALMENTE ===
npm run update-profile:pdf          # só parse
npm run update-profile              # parse + IA
npm run update-certs                # certificados
```

---

*Última atualização: Abril 2026*
