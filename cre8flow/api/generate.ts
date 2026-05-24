import { VercelRequest, VercelResponse } from '@vercel/node'
import { ChatGroq } from '@langchain/groq'
import {
  HOOK_FORMULAS,
  SHOT_TYPES,
  SCRIPT_STRUCTURES,
  EDIT_PATTERNS,
  PUBLISH_STRATEGIES,
  VIDEO_TYPES,
  VISUAL_NARRATIVE_STRUCTURES,
  MUSIC_SYNC_PATTERNS,
  AESTHETIC_STYLES,
  TRANSITION_TYPES,
} from '../src/lib/knowledge.js'

const groqApiKey = process.env.VITE_GROQ_API_KEY

const llm = new ChatGroq({
  apiKey: groqApiKey,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
})

const formatKnowledge = () => {
  const shayariFilm = VISUAL_NARRATIVE_STRUCTURES.find(v => v.name === 'The Shayari Film')
  const shayariFilmStr = shayariFilm ? `- ${shayariFilm.name}: ${shayariFilm.pattern} (Music Sync: ${shayariFilm.musicSync})` : ''
  const textTiming = EDIT_PATTERNS.find(e => e.name === 'Text-on-Screen Timing')
  const textTimingStr = textTiming ? `- ${textTiming.name}: ${textTiming.rule} (Tip: ${textTiming.tip})` : ''

  const hooks = HOOK_FORMULAS.map((h) => `- ${h.name}: ${h.pattern}`).join('\n')
  const shots = SHOT_TYPES.map((s) => `- ${s.name}: ${s.use}`).join('\n')
  const scripts = SCRIPT_STRUCTURES.map((s) => `- ${s.name}: ${s.pattern}`).join('\n')
  const edits = EDIT_PATTERNS.map((e) => `- ${e.name}: ${e.rule}`).join('\n')
  const publish = PUBLISH_STRATEGIES.map(
    (p) => `Platform: ${p.platform}\nCaption: ${p.captionFormula}`
  ).join('\n\n')
  return { hooks, shots, scripts, edits, publish, visualNarratives, aesthetics, transitions, musicSync, shayariFilmStr, textTimingStr }
}

const platformContext: Record<string, string> = {
  instagram: 'Format for Instagram Reels. Hook under 3 seconds. Use casual tone. Caption needs 5 relevant hashtags.',
  youtube: 'Format for YouTube Shorts. Hook under 5 seconds. Use SEO-friendly language. Include title and description.',
  linkedin: 'Format for LinkedIn video. Professional tone. Hook addresses a business pain point. No hashtag spam.',
}

const generateStage = async (
  stage: string,
  topic: string,
  kb: ReturnType<typeof formatKnowledge>,
  platform: string = 'instagram'
) => {
  const ctx = platformContext[platform] || platformContext.instagram

  const prompts: Record<string, string> = {
    hook: `You are a viral content expert. Create a compelling hook for a short-form video about: "${topic}"\n\nAvailable hook formulas:\n${kb.hooks}\n\nAdditional context:\n${kb.visualNarratives}\n${kb.musicSync}\n${kb.aesthetics}\n${kb.transitions}\n\nReturn ONLY the hook text (1-2 sentences, max 50 words). No explanation.\n\nPlatform context: ${ctx}`
    script: `You are a scriptwriter for short-form video. Write a script for the topic.\nTopic: "${topic}"\n\nAvailable script structures:\n${kb.scripts}\n\nReturn ONLY the script (conversational, 100-150 words). No explanation.\n\nPlatform context: ${ctx}`,
    shoot: `You are a videographer. Create a shot list for filming a video about: "${topic}"\n\nAvailable shot types:\n${kb.shots}\n\nReturn ONLY a shot list with 4-5 shots, including type, angle, and duration. No explanation.\n\nPlatform context: ${ctx}`,
    edit: `You are a video editor. Provide editing notes for a video about: "${topic}"\n\nAvailable edit patterns:\n${kb.edits}\n\nReturn ONLY editing advice (3-4 key points on pacing, cuts, timing). No explanation.\n\nPlatform context: ${ctx}`,
    publish: `You are a social media strategist. Create a publish strategy for a video about: "${topic}"\n\nPlatform strategies:\n${kb.publish}\n\nReturn ONLY caption, hashtags, and CTA. No explanation.\n\nPlatform context: ${ctx}`,
  }

  const message = await llm.invoke(prompts[stage])
  return typeof message.content === 'string' ? message.content : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { topic, isPro, platform = 'instagram', singleStage } = req.body
  if (!topic) return res.status(400).json({ error: 'Missing topic' })

  if (singleStage) {
    try {
      const kb = formatKnowledge()
      const content = await generateStage(singleStage, topic, kb, platform)
      return res.status(200).json({ [singleStage]: content })
    } catch (error) {
      console.error('Single stage error:', error)
      return res.status(500).json({ error: 'Generation failed' })
    }
  }

  const stagesToGenerate = isPro
    ? ['hook', 'script', 'shoot', 'edit', 'publish']
    : ['hook', 'script']

  try {
    const kb = formatKnowledge()
    const results = await Promise.all(
      stagesToGenerate.map((stage) => generateStage(stage, topic, kb, platform))
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
