import { useState } from 'react'
import { BLOCK_META } from '../lib/supabase'
import type { Block } from '../lib/supabase'
import { ChevronDown, Check, Clock, AlertCircle } from 'lucide-react'

interface BlockCardProps {
  block: Block
  onUpdate: (updates: Partial<Block>) => void
}

export default function BlockCard({ block, onUpdate }: BlockCardProps) {
  const [expanded, setExpanded] = useState(false)
  const meta = BLOCK_META[block.type]

  const statusIcon = {
    not_started: <AlertCircle className="w-4 h-4" />,
    in_progress: <Clock className="w-4 h-4" />,
    done: <Check className="w-4 h-4" />,
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-[#252525] transition"
      >
        <div className={`w-1 h-8 rounded ${meta.color}`} />

        <div className="flex-1 text-left">
          <h3 className="font-semibold">{meta.label}</h3>

          <p className="text-sm text-muted">
            {block.notes
              ? block.notes.substring(0, 60) + '...'
              : 'No content yet'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{block.status}</span>

          {statusIcon[block.status]}

          <ChevronDown
            className={`w-5 h-5 transition ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          <textarea
            value={block.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Add or edit notes..."
            className="w-full p-3 bg-[#1a1a1a] border border-border rounded text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
            rows={5}
          />

          <select
            value={block.status}
            onChange={(e) =>
              onUpdate({
                status: e.target.value as
                  | 'not_started'
                  | 'in_progress'
                  | 'done',
              })
            }
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-border rounded text-white focus:outline-none focus:border-accent"
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