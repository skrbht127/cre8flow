# DECISIONS_LOG.md — Cre8Flow

## D1 — Niche to video/reels creators (not generic)
**Decision:** Product targets reels/video creators specifically, not generic content pipeline.  
**Why:** User understands this niche intimately. Niching = faster PMF = faster first revenue. Generic tools lose to specialized ones.  
**Rejected:** Generic "content pipeline for any creator type."

---

## D2 — Freemium monetisation (not pay-once or pure subscription)
**Decision:** Free tier (3 workflows, AI on Hook + Script only) → Pro tier (all stages, unlimited, personalization).  
**Why:** User in financial crisis, needs revenue fastest path. Freemium gets users in the door, paywall converts the hooked. One-time purchase leaves money on the table long-term.  
**Rejected:** Pay-once, full subscription from day 1.

---

## D3 — Waitlist over Stripe (for now)
**Decision:** No Stripe integration in MVP. "Join Pro Waitlist" email capture instead.  
**Why:** Stripe setup + webhooks + subscription management = half a day minimum. Zero users exist; payment infra before users is waste. Ship today → collect emails → validate → add Stripe v2.  
**Rejected:** Stripe from day 1.

---

## D4 — Feature depth before auth
**Decision:** No user auth in MVP. Public-use, anonymous workflows.  
**Why:** Auth is foundational but doesn't add visible product value for demo/validation. Feature depth (AI quality, 5-stage pipeline, knowledge base) = differentiation. Auth in v2 when charging.  
**Rejected:** Adding Supabase Auth first.

---

## D5 — Move out of Lovable entirely
**Decision:** Export from Lovable to GitHub, build outside Lovable permanently.  
**Why:** Lovable is boxed into its own build config + Cloudflare Workers. Can't run LangChain/Groq/custom API routes inside it. Real product needs real infrastructure.  
**Rejected:** Staying in Lovable, keeping Lovable as UI editor while building Python backend in parallel.

---

## D6 — Vercel over HuggingFace Spaces for backend
**Decision:** Vercel serverless functions in /api folder (not HuggingFace FastAPI).  
**Why:** HF CPU Spaces have ~30s cold start — unacceptable for a monetisable product. UX was explicitly prioritised over interview optics. Vercel = zero cold start, free, frontend+backend unified deployment.  
**Rejected:** HuggingFace Spaces + FastAPI (better for Cantilever interview optics, but worse UX).  
**Tradeoff:** Slight loss on "impressive tech stack on paper" for interview vs better actual product.

---

## D7 — Groq API (Llama 3.3 70B) as LLM
**Decision:** Groq free tier as primary LLM, not Claude API, not Gemini.  
**Why:** User has zero budget. Claude API = paid, no free tier. Gemini was used in old Lovable version. Groq free tier is fast, generous, and user already had API key from VoiceBridge project. "Used Groq for fast LLM inference" is a real interview talking point.  
**Rejected:** Claude API (no budget), Gemini API (usable but Groq is faster + better interview story).

---

## D8 — JSON knowledge base injection (not ChromaDB/pgvector) for MVP
**Decision:** Creator Knowledge Base stored as TypeScript JSON arrays in `src/lib/knowledge.ts`, injected directly into LLM prompts. No vector DB for MVP.  
**Why:** ChromaDB cannot run in Vercel serverless functions (needs persistent server). pgvector (Supabase) works but is 2h of setup vs 20min for JSON injection. Under time pressure with zero money, correctness and speed of ship matter more than architectural purity.  
**Rejected:** ChromaDB (can't run in Vercel), Pinecone free tier (extra service), pgvector (right call for v2).  
**Future:** Upgrade to pgvector via Supabase in v2 when building personal style memory feature.

---

## D9 — Abandon content-flow-builder repo, fresh Vite project
**Decision:** Don't migrate/salvage the Lovable export repo. Fresh `bun create vite@latest cre8flow` project.  
**Why:** Lovable exported TanStack Start + Cloudflare Workers config (`wrangler.jsonc` + `@cloudflare/vite-plugin` + `@lovable.dev/vite-tanstack-config`). Completely locked to Lovable's build system. `vite.config.ts` was a single line calling Lovable's proprietary plugin. `src/components/ui` was empty. Fighting this config would take longer than a clean start.  
**Kept from old repo:** The logic pattern from `workflow.$id.tsx` (Block types, BLOCK_META, BlockRow accordion UI, status tracking). Supabase keys from `.env`.  
**Rejected:** Surgical removal of Cloudflare from TanStack Start (too risky/slow under time pressure).

---

## D10 — Tailwind CSS v3 (not v4)
**Decision:** Install tailwindcss@3 explicitly.  
**Why:** Old Lovable repo used Tailwind v4 (with `@tailwindcss/vite` plugin). Tailwind v4 has different PostCSS setup, less stable ecosystem. v3 + postcss.config.js = proven, documented, works cleanly with Vite.  
**Rejected:** Tailwind v4 (different config pattern, potential breaking changes).

---

## D11 — React Router DOM (not TanStack Router)
**Decision:** Use react-router-dom for client-side routing.  
**Why:** Old repo used TanStack Router (part of TanStack Start framework). Since we're on plain Vite + React, react-router-dom is simpler, no framework coupling, everyone knows it.  
**Rejected:** TanStack Router (over-engineering for a plain Vite SPA).

---

## D12 — All 5 AI stages from one "Generate All" button
**Decision:** Single "Generate All 5 Stages" button, not per-block AI buttons.  
**Why:** Old Lovable version had per-block generate on idea + script only. The product vision is an agent that reasons across all stages from one input. One button = better UX + clearer value prop + easier to gate (free gets 2 stages, pro gets all 5).  
**Tradeoff:** Less granular control per block. Acceptable for MVP.
