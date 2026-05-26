// src/lib/recallMemory.ts
// Utility to retrieve the most relevant style signals for a given user.

import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

// ── ENV ──────────────────────────────────────────────────────────────────────
const hfToken = process.env.HF_TOKEN || ''

// ── EMBEDDING HELPERS (same as in memory.ts) ───────────────────────────────────
async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch(
    'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(hfToken ? { Authorization: `Bearer ${hfToken}` } : {}),
      },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
    },
  )
  if (!res.ok) throw new Error(`HF embedding API error: ${res.status}`)
  const data = await res.json()
  // HF returns float[] for a single string input
  return Array.isArray(data[0]) ? data[0] : data
}

/**
 * Retrieves the top 3 style signals for a user based on a generic query.
 * Falls back to an empty array if the user has no stored memories or on error.
 */
export async function getTopMemories(userId: string): Promise<string[]> {
  // Generic query representing the kind of information we want.
  const query = 'creator style preferences'
  let embedding: number[]
  try {
    embedding = await embedQuery(query)
  } catch (e) {
    console.error('Embedding error in getTopMemories:', e)
    return []
  }

  // Call the same RPC used for RAG – it returns rows with an embedding match.
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_count: 3,
  })

  if (error) {
    console.error('Supabase match_documents RPC error:', error)
    return []
  }

  if (!data || !(data as any[]).length) return []

  // Filter to the requested user and extract the signal_text field.
  const matched = (data as { user_id: string; signal_text: string }[])
    .filter((row) => row.user_id === userId)
    .slice(0, 3)
    .map((row) => row.signal_text)

  return matched
}
