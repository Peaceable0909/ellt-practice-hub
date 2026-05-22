import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  SUPABASE_URL     || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession:     true,
      autoRefreshToken:   true,
      detectSessionInUrl: true,
    }
  }
)

// ─── AUTH ─────────────────────────────────────────────────────

export async function signUp(email, password, fullName) {
  return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

export async function sendPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  })
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword })
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session, event)
  })
}

// ─── DATA ─────────────────────────────────────────────────────

/**
 * Save a test result.
 * user_id is set automatically by a DB trigger (auth.uid()).
 * We still accept userId as a fallback label — but the DB decides the real value.
 */
export async function saveResult(data) {
  // The DB trigger sets user_id = auth.uid() automatically.
  // We just need the user to be authenticated (session active).
  const { error } = await supabase
    .from('ellt_test_results')
    .insert([data])

  if (error) {
    console.error('[ELLTPulse] saveResult failed:', error.message, error.details)
  }
  return !error
}

/**
 * Load all results for the currently logged-in user.
 * Uses RLS — only returns rows where user_id = auth.uid().
 */
export async function loadResults() {
  const { data, error } = await supabase
    .from('ellt_test_results')
    .select('*')
    .order('completed_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('[ELLTPulse] loadResults failed:', error.message)
    return []
  }
  return data || []
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()
  return data
}
