import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    global: {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

export type BlockType =
  | 'hook'
  | 'script'
  | 'shoot'
  | 'edit'
  | 'publish'

export type BlockStatus =
  | 'not_started'
  | 'in_progress'
  | 'done'

export interface Block {
  id: string
  workflow_id: string
  type: BlockType
  title: string
  notes: string
  status: BlockStatus
  order_index: number
  created_at: string
}

export interface Workflow {
  id: string
  name: string
  created_at: string
}

export const BLOCK_META = {
  hook: { color: 'bg-amber-500', label: 'Hook' },
  script: { color: 'bg-blue-500', label: 'Script' },
  shoot: { color: 'bg-green-500', label: 'Shoot' },
  edit: { color: 'bg-orange-500', label: 'Edit' },
  publish: { color: 'bg-pink-500', label: 'Publish' },
}