import { useState, useEffect, useCallback } from 'react'
import { supabase, loadResults, onAuthChange, getProfile } from './lib/supabase'
import Auth from './components/Auth'
import Nav from './components/Nav'
import Home from './components/Home'
import Practice from './components/Practice'
import MockTests from './components/MockTests'
import Progress from './components/Progress'
import LiveSessions from './components/LiveSessions'
import Timetable from './components/Timetable'

export default function App() {
  const [dark, setDark] = useState(() => {
    // Persist theme preference in localStorage
    return localStorage.getItem('ellt-theme') !== 'light'
  })
  const [page, setPage] = useState('Home')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle') // idle | saving | saved | error

  // Persist theme
  useEffect(() => {
    document.body.className = dark ? 'dark' : ''
    localStorage.setItem('ellt-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Auth — runs once on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })

    const { data: { subscription } } = onAuthChange((sess, event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
        setSession(sess)
        setAuthReady(true)
        return
      }
      if (event === 'SIGNED_IN' && isPasswordRecovery) setIsPasswordRecovery(false)
      setSession(sess)
      if (!sess) {
        setResults([])
        setProfile(null)
        setIsPasswordRecovery(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load data when user logs in
  useEffect(() => {
    if (!session?.user?.id || isPasswordRecovery) return

    setLoadingResults(true)
    loadResults(session.user.id)
      .then(data => {
        setResults(data)
        setLoadingResults(false)
      })
      .catch(() => setLoadingResults(false))

    getProfile(session.user.id).then(p => {
      if (!p?.full_name && session.user.user_metadata?.full_name) {
        setProfile({ full_name: session.user.user_metadata.full_name })
      } else {
        setProfile(p)
      }
    })
  }, [session?.user?.id, isPasswordRecovery])

  // addResult — updates local state immediately (optimistic UI)
  // The actual save happens in each component via saveResult()
  const addResult = useCallback(row => {
    setResults(prev => [
      { ...row, completed_at: new Date().toISOString() },
      ...prev.filter(r => !(r.test_id === row.test_id && r.skill === row.skill)),
    ])
  }, [])

  // Loading splash
  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--green)', border: '4px solid var(--greenD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, color: '#fff' }}>E</div>
        <div style={{ color: 'var(--textM)', fontSize: 14, fontWeight: 700 }}>Loading your progress...</div>
        <div style={{ width: 160, height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden', border: '2px solid var(--border)' }}>
          <div style={{ height: '100%', background: 'var(--green)', borderRadius: 99, animation: 'indeterminate 1.4s ease-in-out infinite' }} />
        </div>
        <style>{`@keyframes indeterminate { 0%{transform:translateX(-100%);width:40%} 50%{width:60%} 100%{transform:translateX(250%);width:40%} }`}</style>
      </div>
    )
  }

  if (isPasswordRecovery) return <Auth isPasswordRecovery={true} />
  if (!session) return <Auth />

  const sharedProps = { results, addResult, userId: session.user.id }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Nav
        page={page} setPage={setPage}
        dark={dark} setDark={setDark}
        user={session.user} profile={profile}
        results={results}
      />

      {/* Sync status toast */}
      {loadingResults && (
        <div style={{ position: 'fixed', top: 70, right: 16, zIndex: 999, background: 'var(--bg2)', border: '2px solid var(--border)', borderRadius: 12, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: 'var(--textM)', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--green)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          Syncing your progress...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {page === 'Home'          && <Home setPage={setPage} results={results} profile={profile} />}
      {page === 'Practice'      && <Practice {...sharedProps} />}
      {page === 'Mock Tests'    && <MockTests {...sharedProps} />}
      {page === 'Progress'      && <Progress {...sharedProps} loading={loadingResults} />}
      {page === 'My Plan'       && (
        <div className="app-container">
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>My Learning Plan</h2>
          <p style={{ color: 'var(--textM)', fontSize: 13, fontWeight: 600, marginBottom: 22 }}>Choose your study period and get a daily schedule with email reminders.</p>
          <Timetable userId={session.user.id} userEmail={session.user.email} profile={profile} setPage={setPage} />
        </div>
      )}
      {page === 'Live Sessions' && <LiveSessions />}
    </div>
  )
}
