export type ArchetypeKey =
  | 'viral-hook'
  | 'talking-head'
  | 'cinematic-vibe'
  | 'educational'
  | 'brand-product'
  | 'event-coverage'
  | 'day-in-my-life'
  | 'manifesto'
  | 'archive-mode'

export interface ArchetypeDNA {
  key: ArchetypeKey
  label: string
  emoji: string
  tagline: string
  youllGet: string[]
  hookStyle: string
  shotLanguage: string
  editRhythm: string
  musicDirection: string
  captionTone: string
}

export const ARCHETYPES: ArchetypeDNA[] = [
  {
    key: 'viral-hook',
    label: 'Viral Hook',
    emoji: '⚡',
    tagline: 'Built to stop the scroll in 2 seconds',
    youllGet: ['Punchy 3-word hook', 'Fast-cut script', 'Trending audio cues', 'Aggressive CTA'],
    hookStyle: 'pattern interrupt, bold claim, shock or curiosity gap in first 2 seconds',
    shotLanguage: 'quick zoom-ins, reaction cuts, text overlays, high energy movement',
    editRhythm: 'cuts every 1-2 seconds, beat-synced, jump cuts, no breathing room',
    musicDirection: 'trending audio, high BPM, drop on key moment',
    captionTone: 'short punchy lines, strong CTA, 3-5 relevant hashtags',
  },
  {
    key: 'talking-head',
    label: 'Talking Head',
    emoji: '🎙️',
    tagline: 'You on camera, building trust',
    youllGet: ['Direct conversational hook', 'Structured script', 'Minimal B-roll notes', 'Clean caption'],
    hookStyle: 'direct address, personal story opener, or bold opinion statement',
    shotLanguage: 'medium close-up, eye contact with lens, clean background, occasional cutaway',
    editRhythm: 'jump cuts to remove silence, 3-5 sec clips, natural pacing',
    musicDirection: 'low background music or none, voice is the hero',
    captionTone: 'conversational, first person, relatable, soft CTA',
  },
  {
    key: 'cinematic-vibe',
    label: 'Cinematic Vibe',
    emoji: '🎞️',
    tagline: 'No words needed — the visual does the talking',
    youllGet: ['Visual-first hook', 'Mood-driven shot list', 'Atmospheric music cues', 'Sparse poetic caption'],
    hookStyle: 'no text for first 2-3 seconds, visual reveal, atmosphere over information',
    shotLanguage: 'wide establishing shots, extreme close-ups, static holds, slow push-ins',
    editRhythm: '0.5x–0.7x speed, 3-5 second holds, cuts on music transitions',
    musicDirection: 'ambient or instrumental, 70-90 BPM, emotional arc',
    captionTone: 'one line, lowercase, poetic, no hashtag spam',
  },
  {
    key: 'educational',
    label: 'Educational',
    emoji: '🧠',
    tagline: 'Teach something valuable, build authority',
    youllGet: ['Problem-first hook', 'Step-by-step script', 'Screen/demo shot notes', 'SEO-friendly caption'],
    hookStyle: 'lead with the problem or surprising fact, promise a clear takeaway',
    shotLanguage: 'screen recordings, over-shoulder demos, text callouts, numbered overlays',
    editRhythm: 'steady pacing, pause on key points, text reinforces audio',
    musicDirection: 'light lo-fi background, never distracting',
    captionTone: 'informative, numbered tips, keyword-rich, save-worthy',
  },
  {
    key: 'brand-product',
    label: 'Brand / Product',
    emoji: '🏷️',
    tagline: 'Sell without feeling like an ad',
    youllGet: ['Aspirational hook', 'Benefit-led script', 'Product shot list', 'Conversion CTA'],
    hookStyle: 'lead with the transformation or result, not the product features',
    shotLanguage: 'product hero shots, lifestyle context, detail close-ups, clean flat lays',
    editRhythm: 'smooth transitions, color-consistent cuts, reveal moments',
    musicDirection: 'upbeat but premium, 100-120 BPM, brand-safe',
    captionTone: 'aspirational, benefit-focused, clear CTA, link in bio mention',
  },
  {
    key: 'event-coverage',
    label: 'Event Coverage',
    emoji: '🎪',
    tagline: 'You were there. Make them feel it.',
    youllGet: ['Energy-driven hook', 'On-ground shot list', 'Fast edit notes', 'FOMO caption'],
    hookStyle: 'most exciting moment first, crowd energy or spectacle as opener',
    shotLanguage: 'wide crowd shots, intimate candids, speaker/performer close-ups, signage details',
    editRhythm: 'fast cuts, 1-2 seconds each, energy matches event intensity',
    musicDirection: 'event audio or high-energy track matching the vibe',
    captionTone: 'experiential, you-had-to-be-there energy, tag people/brands',
  },
  {
    key: 'day-in-my-life',
    label: 'Day in My Life',
    emoji: '☀️',
    tagline: 'Invite them into your world',
    youllGet: ['Curiosity hook', 'Loose narrative arc', 'Candid shot list', 'Personal caption'],
    hookStyle: 'start mid-action, tease the most interesting part of the day',
    shotLanguage: 'handheld candids, POV shots, transition moments, food/space details',
    editRhythm: 'warm pacing, time-of-day structure, natural light transitions',
    musicDirection: 'warm lo-fi or indie, matches personal mood',
    captionTone: 'personal, reflective, invites comments, authentic',
  },
  {
    key: 'manifesto',
    label: 'Manifesto',
    emoji: '🔥',
    tagline: 'One bold idea. Unapologetic.',
    youllGet: ['Statement hook', 'Single-argument script', 'Stark visual direction', 'No-hashtag caption'],
    hookStyle: 'single declarative statement, controversial or counter-narrative, no softening',
    shotLanguage: 'stark compositions, negative space, direct eye contact, minimal props',
    editRhythm: 'deliberate pacing, long holds on key lines, silence used intentionally',
    musicDirection: 'minimal or none, voice carries full weight',
    captionTone: 'one or two lines, no punctuation softening, no hashtags',
  },
  {
    key: 'archive-mode',
    label: 'Archive Mode',
    emoji: '📼',
    tagline: 'Looks like a memory. Feels like nostalgia.',
    youllGet: ['Found-footage hook', 'Nostalgic shot list', 'Lo-fi grain edit notes', 'Lowercase poetic caption'],
    hookStyle: 'mid-memory opener, no context given, pulls viewer in through curiosity',
    shotLanguage: 'handheld shaky cam, overexposed or underexposed moments, candid unposed',
    editRhythm: 'grain overlay, vhs-style cuts, slow moments interspersed with fast',
    musicDirection: 'lo-fi, vinyl crackle, slowed reverb tracks',
    captionTone: 'lowercase, fragmented sentences, no emojis, journal-entry feel',
  },
]