import { VercelRequest, VercelResponse } from '@vercel/node'
import { ChatGroq } from '@langchain/groq'
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
} from '../src/lib/knowledge.js'
import { ARCHETYPES } from '../src/lib/archetypes.js';
import { getTopMemories } from '../src/lib/recallMemory.js';

// ── ENV ──────────────────────────────────────────────────────────────────────
const groqApiKey = process.env.VITE_GROQ_API_KEY
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!
const hfToken = process.env.HF_TOKEN || ''

// ── CLIENTS ──────────────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: groqApiKey,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
})

const supabase = createClient(supabaseUrl, supabaseKey)

// ── EMBEDDING via HuggingFace (free, no paid key needed) ─────────────────────
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
    }
  )
  if (!res.ok) throw new Error(`HF embedding API error: ${res.status}`)
  const data = await res.json()
  // HF returns float[] for single string input
  return Array.isArray(data[0]) ? data[0] : data
}

// ── VECTOR SIMILARITY SEARCH ──────────────────────────────────────────────────
async function getRagContext(query: string, k = 3): Promise<string> {
  try {
    const embedding = await embedQuery(query)
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: k,
    })
    if (error || !data?.length) return ''
    return (data as { content: string }[]).map((d) => d.content).join('\n\n---\n\n')
  } catch (err) {
    // RAG fail → silently fall back to static knowledge, never crash
    console.error('RAG retrieval failed, using static knowledge:', err)
    return ''
  }
}

// ── STATIC KNOWLEDGE (fallback + base context) ───────────────────────────────
const formatKnowledge = () => {
  const hooks = HOOK_FORMULAS.map((h) => `- ${h.name}: ${h.pattern}`).join('\n')
  const shots = SHOT_TYPES.map((s) => `- ${s.name}: ${s.use}`).join('\n')
  const scripts = SCRIPT_STRUCTURES.map((s) => `- ${s.name}: ${s.pattern}`).join('\n')
  const edits = EDIT_PATTERNS.map((e) => `- ${e.name}: ${e.rule}`).join('\n')
  const publish = PUBLISH_STRATEGIES.map(
    (p) => `Platform: ${p.platform}\nCaption formula: ${p.captionFormula}`
  ).join('\n\n')
  const visualNarratives = VISUAL_NARRATIVE_STRUCTURES.map(
    (v) => `- ${v.name}: ${v.pattern}`
  ).join('\n')
  const aesthetics = AESTHETIC_STYLES.map(
    (a) => `- ${a.name}: ${a.description} | Color: ${a.colorGrade} | Music: ${a.music}`
  ).join('\n')
  const transitions = TRANSITION_TYPES.map(
    (t) => `- ${t.name}: ${t.description}`
  ).join('\n')
  const musicSync = MUSIC_SYNC_PATTERNS.map(
    (m) => `- ${m.name}: ${m.pattern}`
  ).join('\n')
  return { hooks, shots, scripts, edits, publish, visualNarratives, aesthetics, transitions, musicSync }
}

// ── PLATFORM CONTEXT ─────────────────────────────────────────────────────────
const platformContext: Record<string, string> = {
  instagram: 'Format for Instagram Reels. Hook under 3 seconds. Casual tone. Caption needs 5 relevant hashtags.',
  youtube: 'Format for YouTube Shorts. Hook under 5 seconds. SEO-friendly language. Include title and description.',
  linkedin: 'Format for LinkedIn video. Professional tone. Hook addresses a business pain point. No hashtag spam.',
}

// ── STAGE GENERATION ─────────────────────────────────────────────────────────
const generateStage = async (
  stage: string,
  topic: string,
  kb: ReturnType<typeof formatKnowledge>,
  platform: string = 'instagram',
  ragContext: string = '',
  archetype: string = '',
  creatorMemory: string[] = []
) => {
  
  // Archetype context lookup
  const archetypeDNA = ARCHETYPES.find(a => a.key === archetype)
  const archetypeContext = archetypeDNA ? `CREATOR ARCHETYPE: ${archetypeDNA.label}\nCreative brief for this archetype:\n- Hook style: ${archetypeDNA.hookStyle}\n- Shot language: ${archetypeDNA.shotLanguage}\n- Edit rhythm: ${archetypeDNA.editRhythm}\n- Music direction: ${archetypeDNA.musicDirection}\n- Caption tone: ${archetypeDNA.captionTone}\nApply this creative DNA across ALL stages of the workflow. Every output should feel distinctly ${archetypeDNA.label}.\n` : ''
  
  // RAG context injected only when available — semantically matched to topic
  const ragSection = ragContext
    ? `\n\nSemantically relevant knowledge for this topic:\n${ragContext}`
    : ''

  const memoryBlock = creatorMemory.length ? `CREATOR MEMORY (your past style signals):\n${creatorMemory.join('\n')}\n\n` : '';

const prompts: Record<string, string> = {
  hook: `${memoryBlock}${archetypeContext}You are a cinematic content director for short-form video.

Create a detailed hook strategy for a video about: "${topic}"

Output EXACTLY in this format:
HOOK TYPE: (choose: Before-Beat Freeze / Motion Tease / Slow Pull / Text Opener / Verbal Hook)
OPENING SHOT: Describe the exact visual — framing, subject, lighting, texture in one specific sentence
MUSIC DIRECTION: Mood + genre + BPM suggestion (e.g. "dark lo-fi electronic, 65-75 BPM, weight by ooyy or similar")
BEAT ACTION: What happens at the drop or hook moment — one action sentence
TEXT OVERLAY: Exact copy + font style + placement (or "none")
WHY IT WORKS: One sentence on the emotional logic

Rules: NO hashtags. NO generic phrases. Be specific and cinematic. Total output under 150 words.

Platform context: ${archetypeContext}${ragContext}${ragSection}`,

  script: `You are a short-form video scriptwriter with cinematic, editorial sensibility.

Write a complete script for: "${topic}"

Output EXACTLY in this format:
STRUCTURE USED: [name from available structures]
SCRIPT:
[Write the full script — spoken lines OR visual beat-by-beat cues if music-driven. 80-120 words. Every word earns its place.]
PACING NOTE: One sentence on rhythm, delivery speed, and tone.

Available structures:
${kb.scripts}

Rules: NO hashtags anywhere in script. Conversational but intentional. If music-driven content, write visual cues not spoken lines.

Platform context: ${archetypeContext}${ragContext}${ragSection}`,

  shoot: `You are a cinematographer who shoots aesthetic short-form content.

Create a shot list for: "${topic}"

Output EXACTLY in this format:
SHOT 1 — [Shot Type]: [Specific visual description] | [Camera movement] | [Duration] | [Lighting]
SHOT 2 — [Shot Type]: [Specific visual description] | [Camera movement] | [Duration] | [Lighting]
SHOT 3 — [Shot Type]: [Specific visual description] | [Camera movement] | [Duration] | [Lighting]
SHOT 4 — [Shot Type]: [Specific visual description] | [Camera movement] | [Duration] | [Lighting]
SHOT 5 — [Shot Type]: [Specific visual description] | [Camera movement] | [Duration] | [Lighting]

AESTHETIC DIRECTION: [DARKROOM / K-Editorial / Warm Film / Abstract] — one sentence on why this fits.

Available shot types:
${kb.shots}

Rules: NO hashtags. Be specific — "extreme close-up of steam rising from black liquid, backlit by window" not just "close-up of coffee".

Platform context: ${archetypeContext}${ragContext}${ragSection}`,

  edit: `You are a video editor known for cinematic, music-driven short-form content.

Write a complete edit strategy for: "${topic}"

Output EXACTLY in this format:
EDIT STYLE: [Pattern name] — one sentence on why
COLOR GRADE: Specific values (e.g. "crushed blacks, green cast in shadows, grain 70-80, slight desaturation")
CUT RHYTHM: Pacing with timing (e.g. "hard cuts every 3-4s on beat hits, one still frame held 2s before drop")
MUSIC SYNC: How to map cuts to song structure — verse/chorus/drop breakdown
TEXT & OVERLAYS: Font style, placement, timing (or "none")

Available edit patterns:
${kb.edits}

Aesthetic references:
${kb.aesthetics}

Rules: NO hashtags. Be precise and immediately actionable. Reference specific patterns by name.

Platform context: ${archetypeContext}${ragContext}${ragSection}`,

  publish: `You are a social media strategist who understands aesthetic content and platform algorithms.

Create a publish strategy for: "${topic}"

Output EXACTLY in this format:
CAPTION:
[Write the full caption — hook line → 2-3 lines of value → CTA. Platform-appropriate tone. No filler.]

HASHTAGS: [6-8 hashtags: 2 large 1M+, 3 medium 100K-500K, 2-3 niche under 50K — hashtags ONLY here, nowhere else in the output]

BEST TIME: [Specific day + time for this platform]

COVER FRAME TIP: [What frame to use as thumbnail/cover and why]

Platform strategies:
${kb.publish}

Rules: Write the caption in full — no placeholders. Hashtags go ONLY in the HASHTAGS section.

Platform context: ${archetypeContext}${ragContext}${ragSection}`,
}
   const message = await llm.invoke(prompts[stage])
  return typeof message.content === 'string' ? message.content : ''
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { topic, isPro, platform = 'instagram', singleStage, archetype, userId } = req.body
  // Retrieve creator memories for personalization if userId is provided
  let creatorMemories: string[] = []
  try {
    creatorMemories = userId ? await getTopMemories(userId) : []
  } catch (err) {
    console.error('Memory recall failed, skipping:', err)
  }
  if (!topic) return res.status(400).json({ error: 'Missing topic' })

  // Embed query once, reuse across all stages
  const ragContext = await getRagContext(topic)

  if (singleStage) {
    try {
      const kb = formatKnowledge()
      const content = await generateStage(singleStage, topic, kb, platform, ragContext, archetype, creatorMemories)
      return res.status(200).json({ [singleStage]: content })
    } catch (error) {
      console.error('Single stage error:', error)
      return res.status(500).json({ error: 'Generation failed' })
    }
  }

  const stagesToGenerate = isPro
    ? ['hook', 'script', 'shoot', 'edit', 'publish']
    : ['hook', 'script', 'shoot', 'edit', 'publish']

  try {
    const kb = formatKnowledge()
    const results = await Promise.all(
      stagesToGenerate.map((stage) => generateStage(stage, topic, kb, platform, ragContext, undefined, creatorMemories))
    )

    const output: Record<string, string> = {}
    stagesToGenerate.forEach((stage, i) => {
      output[stage] = results[i]
    })

    return res.status(200).json(output)
  } catch (error) {
    console.error('Generation error:', error)
    return res.status(500).json({ error: 'Generation failed' })
  }
}