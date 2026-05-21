import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars. Copy .env.example to .env and fill in your keys.')
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
)

// Session ID — persists for the browser tab lifecycle
export const SESSION_ID = Math.random().toString(36).slice(2, 12)

/** Save a completed test result */
export async function saveResult(data) {
  const { error } = await supabase
    .from('ellt_test_results')
    .insert([{ session_id: SESSION_ID, ...data }])
  if (error) console.error('Supabase insert error:', error)
}

/** Load all results for this session */
export async function loadResults() {
  const { data, error } = await supabase
    .from('ellt_test_results')
    .select('*')
    .eq('session_id', SESSION_ID)
    .order('completed_at', { ascending: false })
    .limit(100)
  if (error) { console.error('Supabase select error:', error); return [] }
  return data || []
}
