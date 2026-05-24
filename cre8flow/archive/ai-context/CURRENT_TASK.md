# CURRENT_TASK.md — Cre8Flow

## Exact Current State (session end ~18:57 IST, 21 May 2026)

### What exists on disk at C:\Users\HP\cre8flow:
```
cre8flow/
├── api/                    ← empty folder, created ✅
├── src/
│   ├── pages/              ← empty folder, created ✅
│   ├── components/         ← empty folder, created ✅
│   ├── lib/
│   │   ├── knowledge.ts    ← FULLY WRITTEN ✅ (all 5 KB arrays)
│   │   └── supabase.ts     ← FULLY WRITTEN ✅ (client + types)
│   ├── App.tsx             ← STOCK Vite template (not yet replaced)
│   ├── main.tsx            ← STOCK Vite template (not yet replaced)
│   └── index.css           ← STOCK (not yet replaced)
├── tailwind.config.js      ← STOCK init output (not yet replaced with custom)
├── postcss.config.js       ← created by tailwindcss init ✅
├── vite.config.ts          ← stock Vite React-TS template
├── package.json            ← all deps installed (see below)
└── .env                    ← does NOT exist yet (needs Supabase + Groq keys)
```

### Installed dependencies:
```json
dependencies: react-router-dom, @supabase/supabase-js, lucide-react, clsx, 
              tailwind-merge, sonner, @langchain/groq, @langchain/core, langchain
devDependencies: tailwindcss@3, postcss, autoprefixer, vite, typescript, etc.
```

## Last Action
Session ended after user confirmed folder structure was created (`src/pages`, `src/components`, `src/lib`, `api/` all exist). Claude had just provided content for `knowledge.ts` and `supabase.ts` and asked user to save them + check old `.env` for Supabase keys.

It's unclear whether the user saved `knowledge.ts` and `supabase.ts` — they were given as code blocks to manually create in VS Code. **Assume they need to be verified or recreated.**

## Immediate Next Steps (in order)

### Step 1 — Verify/create knowledge.ts and supabase.ts
Confirm both files exist in `src/lib/`. If not, create them (see PROJECT_STATE.md for full content).

### Step 2 — Get Supabase keys
```
type C:\Users\HP\content-flow-builder\.env
```
Extract `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Step 3 — Create .env in cre8flow
```
VITE_SUPABASE_URL=<from old repo>
VITE_SUPABASE_ANON_KEY=<from old repo>
VITE_GROQ_API_KEY=<existing Groq key from VoiceBridge>
```

### Step 4 — Replace tailwind.config.js
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f0f", surface: "#1a1a1a", border: "#2a2a2a",
        accent: "#7c3aed", "accent-light": "#a78bfa", muted: "#6b7280",
        hook: "#f59e0b", script: "#3b82f6", shoot: "#10b981",
        edit: "#f97316", publish: "#ec4899",
      },
    },
  },
  plugins: [],
};
```

### Step 5 — Replace src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: #0f0f0f; color: #f5f5f5; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #1a1a1a; }
::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 2px; }
```

### Step 6 — Replace src/main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>
)
```

### Step 7 — Replace src/App.tsx
```tsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WorkflowPage from './pages/WorkflowPage'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/workflow/:id" element={<WorkflowPage />} />
    </Routes>
  )
}
```

### Step 8 — Create api/generate.ts (Vercel serverless, LangChain + Groq)
Key logic: receive `{ topic: string }` → inject knowledge base context → call Groq via LangChain → return all 5 stage outputs as JSON.
Route format: `export default function handler(req, res)` using `@vercel/node` types.

### Step 9 — Create vercel.json (SPA + API rewrites)
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/*", "destination": "/index.html" }
  ]
}
```

### Step 10 — Create src/pages/HomePage.tsx
List of workflows, "New Workflow" button → creates in Supabase → routes to /workflow/:id

### Step 11 — Create src/pages/WorkflowPage.tsx
5-stage accordion view. "Generate All" button → calls /api/generate → fills all block notes. Free users limited to 2 stages (hook + script). Pro waitlist modal on locked stages.

### Step 12 — Create src/components/BlockCard.tsx
Accordion block. Color-coded by stage. Status dot. Expandable notes area.

### Step 13 — Supabase DB setup
Run in Supabase SQL editor:
```sql
create table workflows (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz default now());
create table blocks (id uuid primary key default gen_random_uuid(), workflow_id uuid references workflows(id) on delete cascade, type text not null, title text not null, notes text default '', status text default 'not_started', order_index int not null);
```

### Step 14 — Deploy
```
bun add -d vercel
bunx vercel --prod
```
Add env vars in Vercel dashboard.

## Current Blockers
1. `.env` not created — need old Supabase keys + Groq key
2. `api/generate.ts` not written — core AI route
3. Page components not written
4. Supabase tables not created yet
5. Need to verify knowledge.ts + supabase.ts were actually saved

## Environment Status
- Node v26.2.0 ✅
- npm v11.13.0 ✅  
- Bun v1.3.14 ✅
- Git installed ✅
- VS Code installed ✅ (`code .` works)
- Project at `C:\Users\HP\cre8flow` ✅
- All npm deps installed ✅
- Tailwind v3 + postcss initialized ✅
- Folder structure created ✅