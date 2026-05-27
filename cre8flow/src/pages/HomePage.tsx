import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Workflow } from '../lib/supabase'
import WaitlistModal from '../components/WaitlistModal'
import { Plus, Sparkles, Trash2 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const isPro = localStorage.getItem('cre8flow_pro') === 'true'

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

    // Free tier: max 2 workflows
    if (!isPro) {
      const { count } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
      if ((count ?? 0) >= 2) {
        setShowUpgradeModal(true)
        return
      }
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert({ name: newName })
      .select()

    if (!error && data?.[0]) {
      const workflowId = data[0].id
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
      {showUpgradeModal && (
        <WaitlistModal
          stageName="Unlimited Workflows"
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-accent" />
              Cre8Flow
            </h1>
            <p className="text-muted text-lg">
              Your content pipeline, from idea to publish — powered by AI
            </p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm text-muted border border-border rounded hover:text-white hover:border-accent transition"
          >
            Sign Out
          </button>
        </div>

        {/* Free tier notice */}
        {!isPro && (
          <div className="mb-6 flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-lg px-4 py-2.5">
            <span className="text-[#a78bfa] text-xs">
              🔒 Free plan: 2 full workflows. {workflows.length}/2 used.
            </span>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="text-[#7c3aed] text-xs font-semibold hover:underline ml-auto"
            >
              Upgrade to Pro →
            </button>
          </div>
        )}

        {/* Create New Workflow */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">New Workflow</h2>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Video idea or topic..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createWorkflow()}
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
                <div key={i} className="h-20 bg-[#2a2a2a] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center mt-16 py-12 border border-dashed border-border rounded-xl">
              <p className="text-3xl mb-3">🎬</p>
              <h3 className="text-lg font-semibold mb-1">No workflows yet</h3>
              <p className="text-muted text-sm mb-6">Start building your creative flow</p>
              <button
                onClick={() => inputRef.current?.focus()}
                className="px-6 py-2.5 bg-accent hover:bg-accent-light rounded font-semibold text-sm transition"
              >
                + Create your first workflow
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
                    className="text-left flex-1 min-w-0"
                  >
                    <h3 className="font-semibold text-lg">{wf.name}</h3>
                    <p className="text-sm text-muted">
                      {new Date(wf.created_at).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete this workflow?')) {
                        await supabase.from('blocks').delete().eq('workflow_id', wf.id)
                        await supabase.from('workflows').delete().eq('id', wf.id)
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