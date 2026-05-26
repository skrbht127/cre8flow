// src/lib/memory.ts
// Utility to extract style signals from a completed workflow output and store them in Supabase.

import { ChatGroq } from '@langchain/groq'
import { supabase } from './supabase'

// ── ENV ──────────────────────────────────────────────────────────────────────
const groqApiKey = process.env.VITE_GROQ_API_KEY
const hfToken = process.env.HF_TOKEN || ''

// ── LLM CLIENT ───────────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: groqApiKey,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
})

// ── EMBEDDING HELPERS (same pattern as api/generate.ts) ───────────────────────
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
 * Extract three style signals from a completed workflow output using a Groq LLM.
 * Each signal has the shape { text: string, type: 'tone' | 'pacing' | 'visual_style' | 'hook_pattern' }.
 * The function embeds each signal text via HuggingFace and upserts the result into the
 * `user_style_memory` table in Supabase.
 */
export async function extractSignals(workflowOutput: string, userId: string): Promise<void> {
  // Prompt the LLM to produce exactly three distinct signals in JSON format.
  const prompt = `You are a content‑style analyst. From the following workflow output, extract **exactly three** distinct style signals.
  Each signal must be an object with the fields:
    - "text": a short excerpt (max 120 characters) that captures the signal
    - "type": one of the following literal strings: "tone", "pacing", "visual_style", "hook_pattern"
  Return a **JSON array** (no surrounding text) containing the three objects.

Workflow output:
"""
${workflowOutput}
"""`

  const response = await llm.invoke(prompt)
  const raw = typeof response.content === 'string' ? response.content.trim() : ''

  let signals: { text: string; type: string }[] = []
  try {
    signals = JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse LLM JSON response for style signals:', e, 'raw response:', raw)
    return
  }

  // Validate signal shape and allowed types.
  const allowedTypes = new Set(['tone', 'pacing', 'visual_style', 'hook_pattern'])
  const validSignals = signals.filter(
    (s) => typeof s.text === 'string' && allowedTypes.has(s.type),
  )

  // Early‑exit if nothing to store.
  if (validSignals.length === 0) return

  // Embed each signal text.
  const upsertRows = await Promise.all(
    validSignals.map(async (s) => {
      const embedding = await embedQuery(s.text)
      return {
        user_id: userId,
        signal_text: s.text,
        signal_type: s.type,
        embedding,
      }
    }),
  )

  // Upsert into Supabase. Assuming a unique constraint on (user_id, signal_type, signal_text).
  const { error } = await supabase.from('user_style_memory').upsert(upsertRows)
  if (error) {
    console.error('Supabase upsert error for style signals:', error)
  }
}
