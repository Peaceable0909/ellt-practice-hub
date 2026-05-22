import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession: true,          // keep session in localStorage
      autoRefreshToken: true,        // auto-refresh before expiry
      detectSessionInUrl: true,      // handle OAuth redirects
    }
  }
)

// ─── AUTH ────────────────────────────────────────────────────

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  return { data, error }
}

export async function sendPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  })
  return { data, error }
}

export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session, event)
  })
}

// ─── DATA ────────────────────────────────────────────────────

/** Save a test result — always gets userId from session if not passed */
export async function saveResult(data, passedUserId) {
  // Get userId — use passed value OR fetch from current session
  let userId = passedUserId
  if (!userId) {
    const { data: { session } } = await supabase.auth.getSession()
    userId = session?.user?.id
  }

  if (!userId) {
    console.warn('[ELLTPulse] saveResult: no userId — result not saved')
    return
  }

  const { error } = await supabase
    .from('ellt_test_results')
    .insert([{ ...data, user_id: userId }])

  if (error) {
    console.error('[ELLTPulse] saveResult error:', error.message)
  }
}

/** Load all results for a user — with retry on empty */
export async function loadResults(userId, retries = 2) {
  if (!userId) return []

  for (let attempt = 0; attempt <= retries; attempt++) {
    const { data, error } = await supabase
      .from('ellt_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('[ELLTPulse] loadResults error:', error.message)
      if (attempt < retries) await new Promise(r => setTimeout(r, 800))
      continue
    }

    return data || []
  }

  return []
}

export async function getProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()
  return data
}
