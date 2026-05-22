import { useState, useEffect, useCallback } from 'react'
import { supabase, loadResults, onAuthChange, getProfile } from './lib/supabase'
import Auth from './components/Auth'
import Nav from './components/Nav'
import Home from './components/Home'
import Practice from './components/Practice'
import MockTests from './components/MockTests'
import Progress from './components/Progress'
import LiveSessions from './components/LiveSessions'

export default function App() {
  const [dark, setDark] = useState(true)
  const [page, setPage] = useState('Home')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  // Theme
  useEffect(() => {
    document.body.className = dark ? '' : 'light'
  }, [dark])

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })

    const { data: { subscription } } = onAuthChange((sess, event) => {
      // Detect password recovery flow
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
        setSession(sess)
        setAuthReady(true)
        return
      }
      // On any other sign-in, clear recovery mode
      if (event === 'SIGNED_IN' && isPasswordRecovery) {
        setIsPasswordRecovery(false)
      }
      setSession(sess)
      if (!sess) {
        setResults([])
        setProfile(null)
        setIsPasswordRecovery(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load results + profile when user logs in
  useEffect(() => {
    if (!session?.user?.id || isPasswordRecovery) return

    setLoadingResults(true)
    loadResults(session.user.id)
      .then(setResults)
      .finally(() => setLoadingResults(false))

    getProfile(session.user.id).then(p => {
      // For Google users, name comes from user_metadata
      if (!p?.full_name && session.user.user_metadata?.full_name) {
        setProfile({ full_name: session.user.user_metadata.full_name })
      } else {
        setProfile(p)
      }
    })
  }, [session?.user?.id, isPasswordRecovery])

  const addResult = useCallback(row => {
    setResults(prev => [
      { ...row, completed_at: new Date().toISOString() },
      ...prev.filter(r => r.test_id !== row.test_id),
    ])
  }, [])

  // Loading splash
  if (!authReady) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--teal), var(--blue))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 18, color: '#000',
        }}>E</div>
        <div style={{ color: 'var(--textM)', fontSize: 13 }}>Loading…</div>
      </div>
    )
  }

  // Password recovery — show auth with reset form
  if (isPasswordRecovery) {
    return <Auth isPasswordRecovery={true}/>
  }

  // Not logged in
  if (!session) {
    return <Auth/>
  }

  const sharedProps = { results, addResult, userId: session.user.id }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Nav
        page={page} setPage={setPage}
        dark={dark} setDark={setDark}
        user={session.user} profile={profile}
      />
      {page === 'Home'          && <Home          setPage={setPage} results={results} profile={profile}/>}
      {page === 'Practice'      && <Practice       {...sharedProps}/>}
      {page === 'Mock Tests'    && <MockTests      {...sharedProps}/>}
      {page === 'Progress'      && <Progress       {...sharedProps} loading={loadingResults}/>}
      {page === 'Live Sessions' && <LiveSessions/>}
    </div>
  )
}
