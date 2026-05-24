# Overview
This repository hosts **Cre8Flow**, an AI‑powered workflow OS for short‑form video/reels creators. It is a Vercel‑deployed React + Vite SPA with a Supabase backend and LangChain + Groq for AI generation.

# Product Vision
A five‑stage pipeline tool: **Hook → Script → Shoot Plan → Edit Notes → Publish Strategy**. One video‑idea input drives an AI agent that reasons across all stages and returns grounded outputs via a Creator Knowledge Base (RAG‑style JSON injection today, pgvector in v2).

# Stack (locked)
```
Frontend  → React + Vite + TypeScript → Vercel
Backend   → Vercel serverless functions (Node.js) in /api
AI layer  → LangChain + @langchain/groq (Llama 3.3 70B) – free tier only
Database  → Supabase (Postgres) – RLS disabled for MVP
Vector DB → JSON knowledge base (MVP) → pgvector via Supabase (v2)
Payments  → Waitlist/email capture now, Stripe later (v2)
Styling   → Tailwind CSS v3 with custom dark theme
Routing   → React Router DOM
```

# Architecture & Repo Structure
```
cre8flow/
├─ api/
│   └─ generate.ts            # Vercel serverless fn – LangChain + Groq (generates all 5 stages)
├─ src/
│   ├─ pages/
│   │   ├─ HomePage.tsx       # List workflows, create new
│   │   └─ WorkflowPage.tsx   # 5‑stage accordion, "Generate All" button
│   ├─ components/
│   │   └─ BlockCard.tsx      # Accordion block UI, status, regenerate
│   ├─ lib/
│   │   ├─ knowledge.ts       # Creator KB (hooks, shots, scripts, edit patterns, publish strategies)
│   │   └─ supabase.ts        # Supabase client + types
│   ├─ App.tsx                # React Router routes
│   ├─ main.tsx               # BrowserRouter entry
│   └─ index.css              # Tailwind base styles
├─ tailwind.config.js         # Custom dark‑theme config
├─ postcss.config.js
├─ vite.config.ts
├─ vercel.json                # SPA + API rewrites
└─ package.json
```

# Knowledge Base (RAG foundation)
Located in `src/lib/knowledge.ts` – five exported arrays:
- **HOOK_FORMULAS** (7 patterns)
- **SHOT_TYPES** (6 types)
- **SCRIPT_STRUCTURES** (4 structures)
- **EDIT_PATTERNS** (8 rules)
- **PUBLISH_STRATEGIES** (3 platforms)
These are injected into prompts at generation time.

# Monetisation Strategy
- **Free tier** – up to 3 workflows; AI only on Hook + Script stages.
- **Pro tier** – unlimited workflows, all 5 AI stages, export, custom pipeline, future personal‑style memory.
- **Waitlist CTA** – "Join Pro Waitlist" email capture (no Stripe yet). Revenue will be added in v2 after validating demand.

# Constraints
- No paid APIs – Groq free tier only.
- No HuggingFace Spaces – cold‑start latency unacceptable.
- No auth in MVP – feature depth first.
- Developed on Windows (PowerShell quirks).
- Financial constraints – all infrastructure must stay on free tiers.

# Key Decisions (locked)
- Vercel over HuggingFace Spaces for backend.
- JSON KB injection (instead of ChromaDB or pgvector) for MVP.
- Groq as the primary LLM provider.
- Tailwind v3 over v4 for stability.
- React Router DOM over TanStack Router for simplicity.
- Single "Generate All" button for UX and freemium gating.

# Implementation Roadmap
**MVP (complete)**
1. Environment setup (Node 26, Bun 1.3, Vercel CLI)
2. Vite scaffold, Tailwind config, React Router
3. Knowledge base, Supabase client, DB tables (`workflows`, `blocks`, `waitlist`)
4. API `/api/generate` – LangChain + Groq, parallel generation of all 5 stages
5. UI pages, BlockCard component, freemium UI gating
6. `.env` with Supabase & Groq keys
7. Deployed to Vercel – live production URL

**v2 (next sprint)**
- [ ] Freemium gate UI – lock stages beyond Hook + Script for free users
- [ ] Waitlist email capture (modal + `api/waitlist.ts`)
- [ ] Supabase Auth integration
- [ ] pgvector RAG (real vector search)
- [ ] Stripe subscription & billing
- [ ] Export workflow as PDF/Markdown
- [ ] Personal style memory (user script embeddings)
- [ ] Custom pipeline stage builder

# Important Technical Notes
- `api/generate.ts` imports `../src/lib/knowledge.js` (requires `.js` extension for ESM on Vercel).
- All Vercel environment variables must be set in the dashboard **and** locally in `.env` for dev.
- `vercel.json` uses only `rewrites` (no `routes`) to avoid MIME conflicts with Vite.
- PowerShell: use `Remove-Item -Recurse -Force` instead of `rmdir`.
- Redeploy: `vercel --prod` from project root.
- To unlink a Vercel project: `Remove-Item -Recurse -Force .vercel` then `vercel --prod`.

# Future Vision
- Marketplace for creator‑made pipeline templates.
- Real‑time collaborative workflows for teams.
- Style personalization via user‑uploaded scripts and embeddings.
- Multi‑platform publishing (Reels, TikTok, Shorts) with unified export.
- Enterprise version for entertainment studios (e.g., K‑pop content pipelines).
