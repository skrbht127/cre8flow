import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Block, Workflow } from '../lib/supabase'
import BlockCard from '../components/BlockCard'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function WorkflowPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [generating, setGenerating] = useState(false)
  const [idea, setIdea] = useState('')

  useEffect(() => {
    if (!id) return
    fetchWorkflow()
    fetchBlocks()
  }, [id])

  const fetchWorkflow = async () => {
    const { data } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .single()
    if (data) setWorkflow(data)
  }

  const fetchBlocks = async () => {
    const { data } = await supabase
      .from('blocks')
      .select('*')
      .eq('workflow_id', id)
      .order('order_index', { ascending: true })
    if (data) setBlocks(data)
  }

  const generateContent = async () => {
    if (!idea.trim()) return
    setGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: idea }),
      })

      const data = await res.json()

      // Update all blocks with generated content
      for (const blockType of ['hook', 'script', 'shoot', 'edit', 'publish']) {
        const content = data[blockType] || ''
        await supabase
          .from('blocks')
          .update({ notes: content, status: 'in_progress' })
          .eq('workflow_id', id)
          .eq('type', blockType)
      }

      fetchBlocks()
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setGenerating(false)
    }
  }

  const updateBlock = async (blockId: string, updates: Partial<Block>) => {
    await supabase.from('blocks').update(updates).eq('id', blockId)
    fetchBlocks()
  }

  const completionPercent =
    blocks.length > 0
      ? Math.round(
          (blocks.filter((b) => b.status === 'done').length / blocks.length) * 100
        )
      : 0

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-surface rounded transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{workflow?.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-sm text-muted">{completionPercent}%</span>
            </div>
          </div>
        </div>

        {/* AI Input */}
        <div className="mb-8 p-6 bg-surface border border-border rounded-lg">
          <h2 className="font-semibold mb-3">Your Video Idea</h2>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your video idea or topic..."
            className="w-full p-4 bg-[#1a1a1a] border border-border rounded text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
            rows={3}
          />
          <button
            onClick={generateContent}
            disabled={generating || !idea.trim()}
            className="mt-4 w-full px-6 py-3 bg-accent hover:bg-accent-light disabled:opacity-50 rounded font-semibold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-5 h-5" />
            {generating ? 'Generating...' : 'Generate All 5 Stages'}
          </button>
        </div>

        {/* Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}