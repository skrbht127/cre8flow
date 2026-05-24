# NEXT_STEPS.md – Immediate Priorities

## 1️⃣ Verify / recreate core files
- Confirm `src/lib/knowledge.ts` exists and contains the five KB arrays (HOOK_FORMULAS, SHOT_TYPES, SCRIPT_STRUCTURES, EDIT_PATTERNS, PUBLISH_STRATEGIES).
- Confirm `src/lib/supabase.ts` exists with Supabase client and type definitions.
- If missing, copy the contents from the archived `PROJECT_STATE.md`.

## 2️⃣ Environment variables
- Locate old `.env` from the previous repo (`content-flow-builder`).
- Extract `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Create a new `.env` in the project root with:
  ```
  VITE_SUPABASE_URL=<value>
  VITE_SUPABASE_ANON_KEY=<value>
  VITE_GROQ_API_KEY=<your-groq-key>
  ```
- Add the same vars in the Vercel dashboard.

## 3️⃣ Tailwind & global CSS
- Replace `tailwind.config.js` with the custom dark‑theme config (see `MASTER_CONTEXT.md`).
- Replace `src/index.css` with the Tailwind base plus styling (see `MASTER_CONTEXT.md`).

## 4️⃣ App entry points
- Overwrite `src/main.tsx` to bootstrap React with `BrowserRouter` and import `App`.
- Overwrite `src/App.tsx` to define routes for `/` (HomePage) and `/workflow/:id` (WorkflowPage).

## 5️⃣ API implementation
- Create `api/generate.ts` – Vercel serverless function that:
  1. Receives `{ topic, isPro, stages }`.
  2. Loads `knowledge.ts` data.
  3. Builds a LangChain chain using the Groq LLM.
  4. Generates output for each requested stage and returns JSON.
- Ensure the import uses `../src/lib/knowledge.js` (ESM .js extension).

## 6️⃣ Vercel configuration
- Create `vercel.json` with SPA rewrite and API rewrite:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "/api/$1" },
      { "source": "/*", "destination": "/index.html" }
    ]
  }
  ```

## 7️⃣ UI pages & components
- `src/pages/HomePage.tsx`: list workflows from Supabase, button to create a new workflow (insert row, navigate to `/workflow/:id`).
- `src/pages/WorkflowPage.tsx`: display five `BlockCard` components, "Generate All" button that POSTs to `/api/generate` with all stage types, update blocks with returned content, enforce freemium gating (hook + script only for free users, show waitlist modal for locked stages).
- `src/components/BlockCard.tsx` is already implemented – ensure it receives props correctly.

## 8️⃣ Supabase schema
- Run the following SQL in the Supabase dashboard (if not already created):
  ```sql
  create table workflows (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz default now());
  create table blocks (id uuid primary key default gen_random_uuid(), workflow_id uuid references workflows(id) on delete cascade, type text not null, title text not null, notes text default '', status text default 'not_started', order_index int not null);
  create table waitlist (id uuid primary key default gen_random_uuid(), email text unique, created_at timestamptz default now());
  ```
- RLS is disabled for MVP.

## 9️⃣ Deploy
- Install Vercel CLI if not present: `npm i -g vercel`.
- Run `vercel --prod` from the project root.
- Verify env vars are set in the Vercel dashboard; the app should be live at the production URL.

## 🚩 Current Blockers (to resolve)
1. `.env` missing – need Supabase keys and Groq key.
2. `api/generate.ts` not yet implemented.
3. UI pages/components still need to be created.
4. Supabase tables may need to be created if not already present.

---

**Next immediate action:** create the `.env` file and implement `api/generate.ts`. Once those are in place, the UI can be wired up and the app redeployed.
