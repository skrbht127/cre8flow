# PROJECT_STATE.md — Cre8Flow

## Project Overview
**Cre8Flow** = AI-powered content workflow OS for reels/video creators.
- Monetisable SaaS (freemium). Goal: first revenue ASAP.
- Also serves as Cantilever internship interview portfolio demo.
- Constraint: zero money to spend. All free APIs/services only.

## Product Vision
A 5-stage pipeline tool: `Hook → Script → Shoot Plan → Edit Notes → Publish Strategy`

One input (video idea) → AI agent reasons across ALL 5 stages → grounded outputs via Creator Knowledge Base (RAG-style JSON injection for MVP, pgvector in v2).

Not just a pipeline tracker — a "content OS" that knows creator craft (hook formulas, shot types, script structures, edit patterns, publish strategies).

## Stack (LOCKED)
```
Frontend     → React + Vite + TypeScript → Vercel
Backend      → Vercel serverless functions in /api folder (Node.js)
AI Layer     → LangChain + @langchain/groq (Llama 3.3 70B via Groq API)
Database     → Supabase (Postgres)
Vector DB    → JSON knowledge base injected into prompts (MVP); pgvector via Supabase (v2)
Payments     → Waitlist/email capture only (no Stripe yet)
Styling      → Tailwind CSS v3 + custom dark theme
Routing      → React Router DOM
```

## Creator Knowledge Base (RAG Foundation)
Structured JSON in `src/lib/knowledge.ts`:
- **HOOK_FORMULAS** — 7 patterns (bold claim, question, contrast, story, number, call-out, result-first)
- **SHOT_TYPES** — 6 types (talking head, B-roll VO, OTS POV, split screen, text-only, screen recording)
- **SCRIPT_STRUCTURES** — 4 structures (Hook→Problem→Solution→CTA, Story Arc, Listicle, Contrast/Flip)
- **EDIT_PATTERNS** — 8 rules (beat cuts, j-cut, l-cut, jump cuts, zoom punch, text timing, first 3s rule, color grading)
- **PUBLISH_STRATEGIES** — 3 platforms (Instagram Reels, TikTok, YouTube Shorts) with caption formulas + timing

## Monetisation Strategy
- **Free tier**: 3 workflows max, AI on Hook + Script only
- **Pro tier**: Unlimited workflows, all 5 AI stages, export, custom pipeline, personal style memory (future RAG personalization)
- **Waitlist CTA**: "Join Pro Waitlist" button → email capture (no payment infra yet)
- Path to revenue: validate waitlist → add Stripe subscription in v2

## Constraints
- No paid APIs. Groq free tier only (already has key from VoiceBridge project).
- No HuggingFace Spaces backend (cold start UX too bad for monetisable product).
- No auth on MVP (feature depth first).
- Windows machine (PowerShell quirks apply: mkdir one at a time, cd D:\Desktop etc.).
- User is non-expert on terminal/dev tools — needs exact copy-paste commands.

## Product Philosophy
- Ship today, validate, then iterate. No over-engineering.
- Every feature should serve two purposes: product value + Cantilever interview demo.
- RAG/LangGraph = moat AND interview talking point.
- Niche to reels/video creators (not generic) for faster PMF.

## Architecture — File Structure
```
cre8flow/                        ← C:\Users\HP\cre8flow
├── api/
│   └── generate.ts              ← Vercel serverless fn (LangChain + Groq)
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx         ← list workflows, create new
│   │   └── WorkflowPage.tsx     ← 5-stage pipeline view
│   ├── components/
│   │   └── BlockCard.tsx        ← individual block accordion
│   ├── lib/
│   │   ├── knowledge.ts         ← Creator KB (hooks, shots, scripts — RAG data)
│   │   └── supabase.ts          ← Supabase client + types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── vercel.json
```

## Supabase Types (locked)
```typescript
type BlockType = 'hook' | 'script' | 'shoot' | 'edit' | 'publish'
type BlockStatus = 'not_started' | 'in_progress' | 'done'

interface Block {
  id: string; workflow_id: string; type: BlockType;
  title: string; notes: string; status: BlockStatus; order_index: number;
}
interface Workflow { id: string; name: string; created_at: string; }
```

## Deployment Decisions
- Vercel chosen over HuggingFace Spaces: better cold start, free, frontend+backend unified
- No HuggingFace FastAPI backend (UX priority > interview optics)
- ChromaDB dropped: can't run in Vercel serverless. pgvector (Supabase) for v2. JSON injection for MVP.
- Lovable/old repo abandoned: too entangled with Cloudflare Workers + @lovable.dev config

## Implementation Roadmap
**MVP (today/current)**
1. ✅ Env setup (Node, Bun, Git)
2. ✅ Fresh Vite project scaffolded at C:\Users\HP\cre8flow
3. ✅ Dependencies installed
4. ✅ Tailwind v3 configured
5. ✅ Folder structure created (src/pages, src/components, src/lib, api/)
6. ✅ knowledge.ts created (full Creator KB)
7. ✅ supabase.ts created (client + types)
8. 🔲 tailwind.config.js — replace with custom dark theme config
9. 🔲 src/index.css — replace with base styles
10. 🔲 src/main.tsx — BrowserRouter setup
11. 🔲 src/App.tsx — Routes setup
12. 🔲 api/generate.ts — Vercel serverless fn (LangChain + Groq, all 5 stages)
13. 🔲 vercel.json — API route rewrites
14. 🔲 src/pages/HomePage.tsx
15. 🔲 src/pages/WorkflowPage.tsx (port from old workflow.$id.tsx)
16. 🔲 src/components/BlockCard.tsx
17. 🔲 .env setup (Supabase keys + Groq key)
18. 🔲 Supabase DB tables (workflows, blocks)
19. 🔲 Deploy to Vercel

**v2 (post-MVP)**
- Auth (Supabase Auth)
- pgvector RAG (replace JSON injection)
- Stripe subscription
- User personal style memory (upload past scripts → embeddings)
- Export workflow as PDF/Notion doc
- Custom pipeline stages

## Future Vision
- Template marketplace (creators sell pipelines to other creators)
- Team features
- Style personalization via user's past content
- Multi-platform output (Reels, TikTok, Shorts simultaneously)

## Important Technical Context
- Old repo `content-flow-builder` (github.com/skrbht-127/content-flow-builder): TanStack Start + Cloudflare Workers. Abandoned. Only `workflow.$id.tsx` had extractable logic.
- New repo: `cre8flow` at github.com/skrbht-127/cre8flow
- Groq API key already exists (reused from VoiceBridge project)
- Supabase keys exist in old `.env` — need to copy VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Vercel API routes: `/api/*.ts` files at root → auto-detected by Vercel as serverless functions. Need `vercel.json` for rewrites with Vite SPA.
- Tailwind v3 (NOT v4) — v4 was in old repo but we installed v3 fresh for stability + postcss compatibility
