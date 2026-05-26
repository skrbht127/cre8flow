import { createClient } from '@supabase/supabase-js'
import {
  HOOK_FORMULAS,
  SHOT_TYPES,
  SCRIPT_STRUCTURES,
  EDIT_PATTERNS,
  PUBLISH_STRATEGIES,
  VISUAL_NARRATIVE_STRUCTURES,
  MUSIC_SYNC_PATTERNS,
  AESTHETIC_STYLES,
  TRANSITION_TYPES,
} from '../src/lib/knowledge'
import { pipeline } from '@xenova/transformers'

// Bun auto-loads .env — no dotenv needed
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// ── BUILD CHUNKS FROM KNOWLEDGE ───────────────────────────────────────────────
const chunks: { content: string; category: string }[] = []

for (const h of HOOK_FORMULAS) {
  chunks.push({
    content: `Hook formula: ${h.name}\nType: ${h.type}\nPattern: ${h.pattern}\nExample: ${h.example}\nBest for: ${h.bestFor}`,
    category: 'hook_formula',
  })
}

for (const s of SCRIPT_STRUCTURES) {
  chunks.push({
    content: `Script structure: ${s.name}\nPattern: ${s.pattern}\nBreakdown: ${s.breakdown.join(' | ')}\nIdeal length: ${s.idealLength}\nBest for: ${s.bestFor}`,
    category: 'script_structure',
  })
}

for (const v of VISUAL_NARRATIVE_STRUCTURES) {
  chunks.push({
    content: `Visual narrative: ${v.name}\nPattern: ${v.pattern}\nActs: ${v.acts.join(' | ')}\nBest for: ${v.bestFor}\nMusic sync: ${v.musicSync}`,
    category: 'visual_narrative',
  })
}

for (const e of EDIT_PATTERNS) {
  chunks.push({
    content: `Edit pattern: ${e.name}\nType: ${e.type}\nRule: ${e.rule}\nTiming: ${e.timing}\nVibe: ${e.vibe}\nPlatforms: ${e.platforms}`,
    category: 'edit_pattern',
  })
}

for (const a of AESTHETIC_STYLES) {
  chunks.push({
    content: `Aesthetic style: ${a.name}\nDescription: ${a.description}\nColor grade: ${a.colorGrade}\nGrain: ${a.grain}\nSpeed: ${a.speed}\nMusic: ${a.music}\nAvoid: ${a.avoid}`,
    category: 'aesthetic',
  })
}

for (const m of MUSIC_SYNC_PATTERNS) {
  chunks.push({
    content: `Music sync pattern: ${m.name}\nPattern: ${m.pattern}\nTip: ${m.tip}`,
    category: 'music_sync',
  })
}

for (const p of PUBLISH_STRATEGIES) {
  chunks.push({
    content: `Publish strategy: ${p.platform}\nBest time: ${p.bestTime}\nCaption formula: ${p.captionFormula}\nHashtag strategy: ${p.hashtagStrategy}\nCTA options: ${p.ctaFormulas.join(' | ')}\nAesthetic note: ${p.aestheticNote}`,
    category: 'publish_strategy',
  })
}

for (const s of SHOT_TYPES) {
  chunks.push({
    content: `Shot type: ${s.name}\nUse: ${s.use}\nSpecs: ${s.specs}\nTip: ${s.tip}`,
    category: 'shot_type',
  })
}

for (const t of TRANSITION_TYPES) {
  chunks.push({
    content: `Transition: ${t.name}\nDifficulty: ${t.difficulty}\nDescription: ${t.description}\nBest when: ${t.bestWhen}\nTip: ${t.tip}`,
    category: 'transition',
  })
}

let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    console.log('Loading embedding model locally (first run downloads ~23MB)...')
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    console.log('Model loaded.\n')
  }
  return embedder
}

async function embedText(text: string): Promise<number[]> {
  const pipe = await getEmbedder()
  const output = await pipe(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data) as number[]
}


// ── SEED ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱 Seeding ${chunks.length} knowledge chunks into pgvector...\n`)

  // Clear existing documents
  const { error: clearError } = await supabase.from('documents').delete().neq('id', 0)
  if (clearError) {
    console.error('Failed to clear existing documents:', clearError)
    process.exit(1)
  }
  console.log('✓ Cleared existing documents\n')

  let success = 0
  let failed = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const preview = chunk.content.split('\n')[0]
    process.stdout.write(`[${i + 1}/${chunks.length}] ${preview}... `)

    try {
      const embedding = await embedText(chunk.content)
      const { error } = await supabase.from('documents').insert({
        content: chunk.content,
        category: chunk.category,
        embedding,
      })
      if (error) throw error
      console.log('✓')
      success++
    } catch (err) {
      console.log('✗ FAILED')
      console.error('  Error:', err)
      failed++
    }
  }

  console.log(`\n─────────────────────────────`)
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed:  ${failed}`)
  console.log(`Total chunks: ${chunks.length}`)
  console.log('─────────────────────────────\n')
}

seed()