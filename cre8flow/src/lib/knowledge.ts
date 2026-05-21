export const HOOK_FORMULAS = [
  { id: 'bold-claim', name: 'Bold Claim', pattern: 'Start with a controversial or surprising statement that makes viewers stop scrolling', example: '"This one trick changed my life forever"' },
  { id: 'question', name: 'Question Hook', pattern: 'Open with a question that makes viewers curious about the answer', example: '"Do you know why most people fail at this?"' },
  { id: 'contrast', name: 'Contrast', pattern: 'Show a stark before/after or contradiction to create visual/mental tension', example: '"I was broke. Now I make $10k/month."' },
  { id: 'story', name: 'Story Teaser', pattern: 'Start with "You won\'t believe what happened..." to trigger narrative curiosity', example: '"This is the craziest thing I\'ve ever experienced"' },
  { id: 'number', name: 'Number Hook', pattern: 'Lead with specific numbers or lists to promise concrete value', example: '"3 things nobody tells you about..."' },
  { id: 'relatable', name: 'Relatable Moment', pattern: 'Show a common struggle or situation your audience recognizes immediately', example: '"POV: You\'re scrolling and see this"' },
  { id: 'result-first', name: 'Result First', pattern: 'Show the outcome/payoff first, then explain how you got there', example: '"I quit my job. Here\'s why."' },
];

export const SHOT_TYPES = [
  { id: 'talking-head', name: 'Talking Head', use: 'Direct camera address, personal connection, education, vlogs', angles: 'Eye level, close-up (shoulders up), soft lighting', tips: 'Look slightly off-center, use hand gestures moderately' },
  { id: 'broll-vo', name: 'B-Roll + Voiceover', use: 'Storytelling, tutorials, lifestyle content, product demos', angles: 'Wide, medium, close-up of actions', tips: 'Match cuts to pacing, use 3-5s per shot, vary perspectives' },
  { id: 'ots-pov', name: 'Over-the-Shoulder / POV', use: 'Gaming, tutorials, ASMR, first-person narratives', angles: 'From behind subject looking forward, or true POV', tips: 'Steady cam or gimbal essential, 60fps for smooth motion' },
  { id: 'split-screen', name: 'Split Screen', use: 'Comparison, reaction videos, duets, before/after', angles: 'Two parallel compositions (50/50 or 60/40)', tips: 'Sync audio across both sides, use bold separator' },
  { id: 'text-only', name: 'Text + Graphics', use: 'Quote videos, infographics, trending sounds, captions', angles: 'N/A (designed in post)', tips: 'Bold sans-serif, high contrast, readable in 3 seconds' },
  { id: 'screen-rec', name: 'Screen Recording', use: 'App demos, phone hacks, coding, design walkthroughs', angles: 'Full screen or zoomed regions', tips: 'Cursor highlight, slow down actions, add callout graphics' },
];

export const SCRIPT_STRUCTURES = [
  { id: 'hps-cta', name: 'Hook → Problem → Solution → CTA', pattern: '1) Hook (0-3s): Grab attention\n2) Problem (3-15s): Identify pain point\n3) Solution (15-40s): Show the answer\n4) CTA (40-45s): What to do next', bestFor: 'Educational, how-to, product pitches' },
  { id: 'story-arc', name: 'Story Arc (Hero\'s Journey)', pattern: '1) Setup: Introduce character/situation\n2) Conflict: Obstacle or challenge\n3) Resolution: How it was overcome\n4) Lesson: Takeaway or emotional payoff', bestFor: 'Lifestyle, personal stories, motivational' },
  { id: 'listicle', name: 'Listicle / Top-N Format', pattern: 'Intro (3s) → Item 1 (8s) → Item 2 (8s) → Item 3 (8s) → Outro/CTA (5s)', bestFor: 'Tips, hacks, recommendations, rankings' },
  { id: 'contrast-flip', name: 'Contrast / Plot Twist', pattern: '1) Assume expectations (what viewers think is happening)\n2) Flip it (reveal the unexpected truth)\n3) Payoff (emotional or humorous release)', bestFor: 'Comedy, commentary, subversive takes' },
];

export const EDIT_PATTERNS = [
  { id: 'beat-cut', name: 'Cut on Beat', rule: 'Sync cuts/transitions to the music beat or rhythm. Creates momentum and satisfying flow.' },
  { id: 'jcut', name: 'J-Cut', rule: 'Audio (voiceover or music) enters before video cuts. Creates anticipation and smooth transitions.' },
  { id: 'lcut', name: 'L-Cut', rule: 'Video cuts before audio ends. Overlaps dialogue/music to hide choppy transitions.' },
  { id: 'jump-cut', name: 'Jump Cut', rule: 'Same angle, subject in slightly different position. Used to compress time, speed up pace, or comedic effect.' },
  { id: 'zoom-punch', name: 'Zoom / Punch In', rule: 'Quick zoom on subject during key moment. Adds emphasis and energy. Use sparingly (max 3-4 per video).' },
  { id: 'text-timing', name: 'Text Timing', rule: 'On-screen text should appear 0.5s before audio mentions it, stay for 2-3s minimum. Easy to read, not rushed.' },
  { id: 'first-3s', name: 'First 3 Seconds', rule: 'Fastest pacing in the video. Heavy cuts, quick transitions, high visual intensity. Hook viewers immediately.' },
  { id: 'color-grade', name: 'Color Grading', rule: 'Consistent color palette throughout (warm, cool, vibrant, muted). Creates mood and polish. Apply LUT or manual grade to all clips.' },
];

export const PUBLISH_STRATEGIES = [
  {
    platform: 'Instagram Reels',
    captionFormula: '[Hook emoji] [2-3 line story or value prop]\n\n[Relevant hashtags — 5-8]\n\n[CTA: "Save this" / "Tag someone" / "Double tap"]',
    timing: 'Post 9-11 PM IST (peak engagement), Tuesday-Friday for reach',
    hashtags: 'Mix 3 trending + 5 niche. Example: #ContentCreator #ReelsOfInstagram #VideoMarketingTips',
    cta: 'Ask for save, share, comment — engagement drives algorithm reach',
  },
  {
    platform: 'TikTok',
    captionFormula: '[Trending phrase or sound name]\n[Casual, conversational tone]\n[One CTA: "Comment if you agree" / "Follow for more"]',
    timing: 'Post 6-9 PM or 12-1 AM (two peak windows), daily posting for visibility',
    hashtags: '#FYP #ForYouPage + 3-5 niche tags. TikTok favors volume over precision.',
    cta: 'Comments > Shares on TikTok. Ask questions to drive engagement.',
  },
  {
    platform: 'YouTube Shorts',
    captionFormula: '[Keyword-rich title (50 chars)]\n[2-line description]\n[Playlist link if series]',
    timing: 'Post during lunch hours (1-3 PM IST) or evening (7-9 PM). Consistency matters more than time.',
    hashtags: '#Shorts + 2-3 topic tags. YouTube Shorts prioritize watch time over hashtags.',
    cta: 'Link to full video or channel subscription. Use YouTube Cards for CTAs.',
  },
];