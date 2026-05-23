import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Block, BlockType } from '../lib/supabase'
import { ChevronDown, Check, Clock, AlertCircle, Copy, RefreshCw } from 'lucide-react'

interface BlockCardProps {
  block: Block
  type: BlockType
  label: string
  icon: string
  meta: { color: string; label: string }
  generating: boolean
  workflowId: string
  topic: string
  isPro: boolean
  onUpdate: (updated: Block) => void
}

export default function BlockCard({
  block,
  type,
  label,
  icon,
  meta,
  topic,
  isPro,
  onUpdate,
}: BlockCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const statusIcon = {
    not_started: <AlertCircle className="w-4 h-4 text-[#6b7280]" />,
    in_progress: <Clock className="w-4 h-4 text-yellow-400" />,
    done: <Check className="w-4 h-4 text-green-400" />,
  }

  const handleNotesChange = async (notes: string) => {
    const updated = { ...block, notes }
    onUpdate(updated)
    setSaving(true)
    await supabase.from('blocks').update({ notes }).eq('id', block.id)
    setSaving(false)
  }

  const handleStatusChange = async (status: Block['status']) => {
    const updated = { ...block, status }
    onUpdate(updated)
    await supabase.from('blocks').update({ status }).eq('id', block.id)
  }

  const preview = block.notes
    ? block.notes.substring(0, 80) + (block.notes.length > 80 ? '...' : '')
    : 'No content yet'

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-[#252525] transition text-left"
      >
        <div className={`w-1 h-8 rounded-full flex-shrink-0 ${meta.color}`} />

        <span className="text-base flex-shrink-0">{icon}</span>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm">{label}</h3>
          <p className="text-xs text-[#6b7280] truncate mt-0.5">{preview}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {saving && <span className="text-[10px] text-[#6b7280]">saving...</span>}
          <span className="text-[10px] text-[#6b7280] capitalize hidden sm:block">
            {block.status.replace('_', ' ')}
          </span>
          {statusIcon[block.status]}
          <ChevronDown
            className={`w-4 h-4 text-[#6b7280] transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#2a2a2a] p-4 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <div />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(block.notes || '')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="text-xs bg-[#2a2a2a] hover:bg-[#333] text-[#9ca3af] hover:text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={async () => {
                  setSaving(true)
                  try {
                    const res = await fetch('/api/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ topic, isPro, stages: [type] }),
                    })
                    const data = await res.json()
                    const newContent = data[type]
                    if (newContent) {
                      await handleNotesChange(newContent)
                    }
                  } catch (e) {
                    console.error('Regenerate error:', e)
                  }
                  setSaving(false)
                }}
                disabled={saving}
                className="text-xs bg-[#2a2a2a] hover:bg-[#333] text-[#7c3aed] hover:text-[#a78bfa] rounded-lg px-3 py-1.5 flex items-center gap-1.5"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {saving ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
          <textarea
            value={block.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add or edit notes..."
            className="w-full p-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#7c3aed] resize-none leading-relaxed"
            rows={6}
          />

          <select
            value={block.status}
            onChange={(e) => handleStatusChange(e.target.value as Block['status'])}
            className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm focus:outline-none focus:border-[#7c3aed]"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      )}
    </div>
  )
}
