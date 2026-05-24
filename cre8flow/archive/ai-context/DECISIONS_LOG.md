# DECISIONS_LOG.md — Cre8Flow

## D1 — Niche to video/reels creators (not generic)
**Decision:** Product targets reels/video creators specifically, not generic content pipeline.
**Why:** Faster PMF, niche focus yields quicker first revenue.
**Rejected:** Generic "content pipeline for any creator type."

---

## D2 — Freemium monetisation (not pay-once or pure subscription)
**Decision:** Free tier (3 workflows, AI on Hook + Script only) → Pro tier (all stages, unlimited, personalization).
**Why:** Freemium gets users in the door, paid conversion later.
**Rejected:** Pay-once, full subscription from day 1.

---

## D3 — Waitlist over Stripe (for now)
**Decision:** No Stripe integration in MVP. Use "Join Pro Waitlist" email capture.
**Why:** Stripe setup adds overhead; need users first.
**Rejected:** Stripe from day 1.

---

## D4 — Feature depth before auth
**Decision:** No user auth in MVP. Public anonymous workflows.
**Why:** Auth adds no immediate product value; focus on AI features.
**Rejected:** Adding Supabase Auth first.

---

## D5 — Move out of Lovable entirely
**Decision:** Export from Lovable to GitHub, build outside Lovable permanently.
**Why:** Lovable's build config unsuitable for LangChain/Groq.
**Rejected:** Staying in Lovable.

---

## D6 — Vercel over HuggingFace Spaces for backend
**Decision:** Vercel serverless functions in /api folder.
**Why:** Better UX, zero cold start, free tier.
**Rejected:** HF FastAPI (cold start).

---

## D7 — Groq API (Llama 3.3 70B) as LLM
**Decision:** Groq free tier as primary LLM.
**Why:** Zero cost, fast, interview talking point.
**Rejected:** Claude API, Gemini.

---

## D8 — JSON knowledge base injection (not ChromaDB/pgvector) for MVP
**Decision:** Store KB as TypeScript JSON arrays, inject directly.
**Why:** Simpler, works in Vercel serverless.
**Rejected:** ChromaDB, Pinecone, pgvector (setup time).

---

## D9 — Abandon content-flow-builder repo, fresh Vite project
**Decision:** Start fresh Vite project, not migrate Lovable repo.
**Why:** Lovable config locked to Cloudflare, too much overhead.
**Rejected:** Complex migration.

---

## D10 — Tailwind CSS v3 (not v4)
**Decision:** Use tailwindcss@3.
**Why:** Stability, proven with Vite.
**Rejected:** Tailwind v4.

---

## D11 — React Router DOM (not TanStack Router)
**Decision:** Use react-router-dom.
**Why:** Simpler for plain Vite SPA.
**Rejected:** TanStack Router.

---

## D12 — All 5 AI stages from one "Generate All" button
**Decision:** Single button generates all stages.
**Why:** Better UX, easier freemium gating.
**Tradeoff:** Less granular control.
