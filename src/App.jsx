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

  // Theme
  useEffect(() => {
    document.body.className = dark ? '' : 'light'
  }, [dark])

  // Auth state — runs once on mount
  useEffect(() => {
    // Get current session immediately
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })

    // Listen for changes (login, logout, token refresh)
    const { data: { subscription } } = onAuthChange((sess) => {
      setSession(sess)
      if (!sess) {
        setResults([])
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load results + profile when user logs in
  useEffect(() => {
    if (!session?.user?.id) return

    setLoadingResults(true)
    loadResults(session.user.id)
      .then(setResults)
      .finally(() => setLoadingResults(false))

    getProfile(session.user.id).then(p => {
      setProfile(p)
    })
  }, [session?.user?.id])

  const addResult = useCallback(row => {
    setResults(prev => [
      { ...row, completed_at: new Date().toISOString() },
      ...prev.filter(r => r.test_id !== row.test_id),
    ])
  }, [])

  // Show nothing while checking auth (avoids flash)
  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--textM)', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  // Not logged in — show auth screen
  if (!session) {
    return <Auth />
  }

  const sharedProps = { results, addResult, userId: session.user.id }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Nav
        page={page}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
        user={session.user}
        profile={profile}
      />
      {page === 'Home'          && <Home          setPage={setPage} results={results} profile={profile} />}
      {page === 'Practice'      && <Practice       {...sharedProps} />}
      {page === 'Mock Tests'    && <MockTests      {...sharedProps} />}
      {page === 'Progress'      && <Progress       {...sharedProps} loading={loadingResults} />}
      {page === 'Live Sessions' && <LiveSessions />}
    </div>
  )
}
