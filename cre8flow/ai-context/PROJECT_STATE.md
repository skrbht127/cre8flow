# PROJECT_STATE.md — Cre8Flow

## Project Overview
**Cre8Flow** = AI-powered content workflow OS for reels/video creators.
- Monetisable SaaS (freemium). Goal: first revenue ASAP.
- Also serves as Cantilever internship interview portfolio demo.
- Constraint: zero money to spend. All free APIs/services only.
- **STATUS: MVP SHIPPED ✅ — Live on Vercel**

## Live URLs
- **Production**: https://cre8flow.vercel.app (update with actual URL)
- **GitHub**: https://github.com/skrbht127/cre8flow
- **Supabase project**: https://supabase.com/dashboard/project/vmqwbgzyohjqqzfgbegt

## Product Vision
A 5-stage pipeline tool: `Hook → Script → Shoot Plan → Edit Notes → Publish Strategy`

One input (video idea) → AI agent reasons across ALL 5 stages → grounded outputs via Creator Knowledge Base (RAG-style JSON injection for MVP, pgvector in v2).

Not just a pipeline tracker — a "content OS" that knows creator craft (hook formulas, shot types, script structures, edit patterns, publish strategies).

## Stack (LOCKED)
```
Frontend     → React + Vite + TypeScript → Vercel
Backend      → Vercel serverless functions in /api folder (Node.js)
AI Layer     → LangChain + @langchain/groq (Llama 3.3 70B via Groq API)
Database     → Supabase (Postgres) — RLS disabled for MVP
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
- Windows machine (PowerShell quirks apply: use Remove-Item not rmdir, cd D:\Desktop etc.)
- Node v26.2.0, npm v11.13.0, Bun v1.3.14, Vercel CLI installed globally via npm.

## Architecture — File Structure
```
cre8flow/                        ← C:\Users\HP\cre8flow
├── api/
│   └── generate.ts              ← Vercel serverless fn (LangChain + Groq) ✅
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx         ← workflow list + create new ✅
│   │   └── WorkflowPage.tsx     ← 5-stage pipeline view + Generate All ✅
│   ├── components/
│   │   └── BlockCard.tsx        ← accordion block card ✅
│   ├── lib/
│   │   ├── knowledge.ts         ← Creator KB (hooks, shots, scripts — RAG data) ✅
│   │   └── supabase.ts          ← Supabase client + types ✅
│   ├── App.tsx                  ← React Router routes ✅
│   ├── main.tsx                 ← BrowserRouter entry ✅
│   └── index.css                ← Tailwind base styles ✅
├── tailwind.config.js           ← custom dark theme config ✅
├── postcss.config.js            ✅
├── vite.config.ts               ✅
└── vercel.json                  ← SPA + API rewrites ✅
```

## Supabase Tables (created ✅)
```sql
workflows (id uuid PK, name text, created_at timestamptz)
blocks (id uuid PK, workflow_id uuid FK, type text, title text, notes text, status text, order_index int)
waitlist (id uuid PK, email text unique, created_at timestamptz)
```
RLS disabled on all 3 tables for MVP.

## Implementation Roadmap
**MVP (COMPLETE ✅)**
1. ✅ Env setup (Node, Bun, Git, Vercel CLI)
2. ✅ Fresh Vite project scaffolded at C:\Users\HP\cre8flow
3. ✅ Dependencies installed (react-router-dom, supabase, langchain, groq, lucide-react etc.)
4. ✅ Tailwind v3 configured with custom dark theme
5. ✅ Folder structure created
6. ✅ knowledge.ts — full Creator KB (5 arrays, 30+ entries)
7. ✅ supabase.ts — client + types + BLOCK_META
8. ✅ tailwind.config.js — custom dark theme
9. ✅ src/index.css — base styles
10. ✅ src/main.tsx — BrowserRouter setup
11. ✅ src/App.tsx — Routes setup
12. ✅ api/generate.ts — LangChain + Groq, all 5 stages, parallel generation
13. ✅ vercel.json — SPA + API rewrites
14. ✅ src/pages/HomePage.tsx — workflow list + create
15. ✅ src/pages/WorkflowPage.tsx — pipeline builder + Generate All
16. ✅ src/components/BlockCard.tsx — accordion with status
17. ✅ .env setup (Supabase URL + anon key + Groq key)
18. ✅ Supabase DB tables (workflows, blocks, waitlist)
19. ✅ Deployed to Vercel — LIVE

**v2 (next sprint)**
- [ ] Freemium gate — free users see Hook + Script only, Pro waitlist modal on locked stages
- [ ] Waitlist email capture — api/waitlist.ts + modal UI
- [ ] Auth (Supabase Auth)
- [ ] pgvector RAG (replace JSON injection with real vector search)
- [ ] Stripe subscription
- [ ] Export workflow as PDF/Markdown
- [ ] User personal style memory (upload past scripts → embeddings → personalized generation)
- [ ] Custom pipeline stages

## Key Technical Decisions (locked, don't revisit)
- Vercel over HuggingFace: better UX, zero cold start
- JSON KB injection over ChromaDB: ChromaDB can't run in Vercel serverless
- Groq over Claude/Gemini: free tier, fast inference, real interview talking point
- Tailwind v3 over v4: stability, postcss compatibility
- React Router DOM over TanStack Router: simpler for plain Vite SPA
- Single "Generate All" button over per-block generate: better UX + cleaner freemium gate

## Important Technical Notes
- `api/generate.ts` imports from `../src/lib/knowledge.js` (needs .js extension for ESM/node16)
- Vercel env vars must be set in dashboard (not just .env) for production
- `vercel.json` uses `rewrites` only (not `routes`) to avoid MIME type conflicts with Vite
- PowerShell: use `Remove-Item -Recurse -Force` not `rmdir /s /q`
- To redeploy: `vercel --prod` from project directory
- To unlink Vercel project: `Remove-Item -Recurse -Force .vercel` then re-run `vercel --prod`

## Future Vision
- Template marketplace (creators sell pipelines to other creators)
- Team workflows + real-time collaboration
- Style personalization via user's past content
- Multi-platform output (Reels, TikTok, Shorts simultaneously)
- HYBE/entertainment industry version (K-pop content production pipelines)
