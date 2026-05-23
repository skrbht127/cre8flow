import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Block, BlockType } from '../lib/supabase'
import { BLOCK_META } from '../lib/supabase'
import BlockCard from '../components/BlockCard'
import WaitlistModal from '../components/WaitlistModal'

const PRO_STAGES: BlockType[] = ['shoot', 'edit', 'publish']
const ALL_STAGES: BlockType[] = ['hook', 'script', 'shoot', 'edit', 'publish']

const STAGE_LABELS: Record<BlockType, string> = {
  hook: 'Hook',
  script: 'Script',
  shoot: 'Shoot Plan',
  edit: 'Edit Notes',
  publish: 'Publish Strategy',
}

const STAGE_ICONS: Record<BlockType, string> = {
  hook: '🎣',
  script: '📝',
  shoot: '🎬',
  edit: '✂️',
  publish: '🚀',
}

export default function WorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [workflowName, setWorkflowName] = useState('')
  const [blocks, setBlocks] = useState<Record<BlockType, Block | null>>({
    hook: null, script: null, shoot: null, edit: null, publish: null,
  })
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [lockedStageClicked, setLockedStageClicked] = useState<BlockType>('shoot')

  const isPro = localStorage.getItem('cre8flow_pro') === 'true'

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const { data: wf } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single()
      if (wf) setWorkflowName(wf.name)

      const { data: blks } = await supabase
        .from('blocks')
        .select('*')
        .eq('workflow_id', id)
        .order('order_index')

      if (blks) {
        const map: Record<BlockType, Block | null> = {
          hook: null, script: null, shoot: null, edit: null, publish: null,
        }
        blks.forEach((b) => { map[b.type as BlockType] = b })
        setBlocks(map)
      }
    }
    load()
  }, [id])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), isPro }),
      })
      const data = await res.json()

      const stagesToSave = isPro ? ALL_STAGES : (['hook', 'script'] as BlockType[])

      for (let i = 0; i < stagesToSave.length; i++) {
        const stage = stagesToSave[i]
        const content = data[stage]
        if (!content) continue

        const existing = blocks[stage]
        if (existing) {
          await supabase.from('blocks').update({ notes: content, status: 'done' }).eq('id', existing.id)
        } else {
          await supabase.from('blocks').insert({
            workflow_id: id,
            type: stage,
            title: STAGE_LABELS[stage],
            notes: content,
            status: 'done',
            order_index: i,
          })
        }
      }

      const { data: blks } = await supabase
        .from('blocks')
        .select('*')
        .eq('workflow_id', id)
        .order('order_index')

      if (blks) {
        const map: Record<BlockType, Block | null> = {
          hook: null, script: null, shoot: null, edit: null, publish: null,
        }
        blks.forEach((b) => { map[b.type as BlockType] = b })
        setBlocks(map)
      }
    } catch (err) {
      console.error('Generate error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const doneCount = ALL_STAGES.filter((s) => blocks[s]?.status === 'done').length
  const progress = Math.round((doneCount / 5) * 100)

  const handleLockedClick = (stage: BlockType) => {
    setLockedStageClicked(stage)
    setShowWaitlist(true)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-8 max-w-3xl mx-auto">
      {showWaitlist && (
        <WaitlistModal
          stageName={STAGE_LABELS[lockedStageClicked]}
          onClose={() => setShowWaitlist(false)}
        />
      )}

      <button
        onClick={() => navigate('/')}
        className="text-[#6b7280] hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">{workflowName}</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7c3aed] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[#6b7280] text-xs">{progress}% complete</span>
        </div>

        {!isPro && (
          <div className="mt-3 flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-lg px-4 py-2.5">
            <span className="text-[#a78bfa] text-xs">🔒 Free plan: Hook + Script only.</span>
            <button
              onClick={() => { setLockedStageClicked('shoot'); setShowWaitlist(true) }}
              className="text-[#7c3aed] text-xs font-semibold hover:underline ml-auto"
            >
              Upgrade to Pro →
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="e.g. 5 habits that changed my morning routine"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !generating && handleGenerate()}
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7c3aed] placeholder-[#6b7280]"
        />
        <button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          {generating ? 'Generating...' : 'Generate All'}
        </button>
      </div>

      <div className="space-y-3">
        {ALL_STAGES.map((stage) => {
          const isLocked = !isPro && PRO_STAGES.includes(stage)
          const block = blocks[stage]
          const meta = BLOCK_META[stage]

          if (isLocked) {
            return (
              <div
                key={stage}
                className="border border-[#2a2a2a] rounded-xl p-5 flex items-center justify-between bg-[#1a1a1a]/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{STAGE_ICONS[stage]}</span>
                  <div>
                    <p className="text-[#6b7280] font-medium text-sm">{STAGE_LABELS[stage]}</p>
                    <p className="text-[#6b7280]/60 text-xs mt-0.5">Pro feature</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLockedClick(stage)}
                  className="flex items-center gap-1.5 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/30 text-[#a78bfa] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  🔒 Unlock
                </button>
              </div>
            )
          }

          return (
            <div key={stage}>
              {block ? (
                <BlockCard
                  block={block}
                  type={stage}
                  label={STAGE_LABELS[stage]}
                  icon={STAGE_ICONS[stage]}
                  meta={meta}
                  generating={generating}
                  workflowId={id!}
                  topic={topic}
                  isPro={isPro}
                  onUpdate={(updated) =>
                    setBlocks((prev) => ({ ...prev, [stage]: updated }))
                  }
                />
              ) : (
                <div className="border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-3 bg-[#1a1a1a]/30">
                  <span className="text-lg">{STAGE_ICONS[stage]}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{STAGE_LABELS[stage]}</p>
                    {generating ? (
                      <div className="mt-2 space-y-1.5">
                        <div className="h-2 bg-[#2a2a2a] rounded animate-pulse w-3/4" />
                        <div className="h-2 bg-[#2a2a2a] rounded animate-pulse w-1/2" />
                      </div>
                    ) : (
                      <p className="text-[#6b7280] text-xs mt-0.5">Enter a topic and hit Generate All</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}