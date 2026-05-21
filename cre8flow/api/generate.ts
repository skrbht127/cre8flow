import { VercelRequest, VercelResponse } from '@vercel/node'
import { ChatGroq } from '@langchain/groq'
import { PromptTemplate } from '@langchain/core/prompts'
import { HOOK_FORMULAS, SHOT_TYPES, SCRIPT_STRUCTURES, EDIT_PATTERNS, PUBLISH_STRATEGIES } from '../src/lib/knowledge.js'

const groqApiKey = process.env.VITE_GROQ_API_KEY

if (!groqApiKey) {
  throw new Error('Missing VITE_GROQ_API_KEY env var')
}

const llm = new ChatGroq({
  apiKey: groqApiKey,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
})

// Format knowledge base for injection
const formatKnowledge = () => {
  const hooks = HOOK_FORMULAS.map((h) => `- ${h.name}: ${h.pattern}`).join('\n')
  const shots = SHOT_TYPES.map((s) => `- ${s.name}: ${s.use}`).join('\n')
  const scripts = SCRIPT_STRUCTURES.map((s) => `- ${s.name}: ${s.pattern}`).join('\n')
  const edits = EDIT_PATTERNS.map((e) => `- ${e.name}: ${e.rule}`).join('\n')
  const publish = PUBLISH_STRATEGIES.map((p) => `Platform: ${p.platform}\nCaption: ${p.captionFormula}`).join('\n\n')

  return { hooks, shots, scripts, edits, publish }
}

const generateStage = async (stage: string, topic: string, kb: ReturnType<typeof formatKnowledge>) => {
  const prompts: Record<string, string> = {
    hook: `You are a viral content expert. Create a compelling hook for a short-form video about: "${topic}"
    
Available hook formulas:
${kb.hooks}

Return ONLY the hook text (1-2 sentences, max 50 words). No explanation.`,

    script: `You are a scriptwriter for short-form video. Write a script that follows the hook below and explains the topic.
Topic: "${topic}"

Available script structures:
${kb.scripts}

Return ONLY the script (conversational, 100-150 words). No explanation.`,

    shoot: `You are a videographer. Create a shot list for filming a video about: "${topic}"

Available shot types:
${kb.shots}

Return ONLY a shot list with 4-5 shots, including type, angle, and duration. No explanation.`,

    edit: `You are a video editor. Provide editing notes for a video about: "${topic}"

Available edit patterns:
${kb.edits}

Return ONLY editing advice (3-4 key points on pacing, cuts, timing). No explanation.`,

    publish: `You are a social media strategist. Create a publish strategy for a video about: "${topic}"

Platform strategies:
${kb.publish}

Return ONLY caption, hashtags, and CTA for Instagram Reels. No explanation.`,
  }

  const prompt = prompts[stage]
  if (!prompt) throw new Error(`Unknown stage: ${stage}`)

  const message = await llm.invoke(prompt)
  return typeof message.content === 'string' ? message.content : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { topic } = req.body

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' })
  }

  try {
    const kb = formatKnowledge()

    const [hook, script, shoot, edit, publish] = await Promise.all([
      generateStage('hook', topic, kb),
      generateStage('script', topic, kb),
      generateStage('shoot', topic, kb),
      generateStage('edit', topic, kb),
      generateStage('publish', topic, kb),
    ])

    return res.status(200).json({
      hook,
      script,
      shoot,
      edit,
      publish,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return res.status(500).json({ error: 'Generation failed' })
  }
}