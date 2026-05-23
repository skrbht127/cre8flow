import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Workflow } from '../lib/supabase'
import { Plus, Sparkles, Trash2 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const workflowsRef = useRef<HTMLInputElement>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setWorkflows(data || [])
    setLoading(false)
  }

  const createWorkflow = async () => {
    if (!newName.trim()) return
    
    const { data, error } = await supabase
      .from('workflows')
      .insert({ name: newName })
      .select()
    
    if (!error && data?.[0]) {
      const workflowId = data[0].id
      
      // Create default blocks
      const defaultBlocks = [
        { type: 'hook', title: 'Hook', order_index: 0 },
        { type: 'script', title: 'Script', order_index: 1 },
        { type: 'shoot', title: 'Shoot Plan', order_index: 2 },
        { type: 'edit', title: 'Edit Notes', order_index: 3 },
        { type: 'publish', title: 'Publish Strategy', order_index: 4 },
      ]

      await supabase.from('blocks').insert(
        defaultBlocks.map((b) => ({
          workflow_id: workflowId,
          ...b,
          notes: '',
          status: 'not_started',
        }))
      )

      setNewName('')
      fetchWorkflows()
      navigate(`/workflow/${workflowId}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-accent" />
            Cre8Flow
          </h1>
          <p className="text-muted text-lg">
            Your content pipeline, from idea to publish — powered by AI
          </p>
        </div>

        {/* Create New Workflow */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">New Workflow</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Video idea or topic..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createWorkflow()}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-border rounded text-white placeholder-muted focus:outline-none focus:border-accent"
            />
            <button
              onClick={createWorkflow}
              className="px-6 py-3 bg-accent hover:bg-accent-light rounded font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Create
            </button>
          </div>
        </div>

        {/* Workflows List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Workflows</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-[#2a2a2a] animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center mt-12">
              <p className="text-muted mb-4">No workflows yet. Create your first one.</p>
              <button
                onClick={() => workflowsRef?.current?.focus?.()}
                className="px-4 py-2 bg-accent hover:bg-accent-light rounded"
              >
                New Workflow
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="flex items-center justify-between p-4 bg-surface border border-border rounded hover:border-accent transition"
                >
                  <button
                    onClick={() => navigate(`/workflow/${wf.id}`)}
                    className="text-left"
                  >
                    <h3 className="font-semibold text-lg">{wf.name}</h3>
                    <p className="text-sm text-muted">
                      {new Date(wf.created_at).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete this workflow?')) {
                        // Delete blocks first (cascade)
                        await supabase.from('blocks').delete().eq('workflow_id', wf.id)
                        // Delete workflow
                        await supabase.from('workflows').delete().eq('id', wf.id)
                        // Update local state
                        setWorkflows((prev) => prev.filter((w) => w.id !== wf.id))
                      }
                    }}
                    className="p-2 text-muted hover:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}