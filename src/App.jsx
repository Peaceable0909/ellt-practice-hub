import { useState, useEffect, useCallback } from 'react'
import { supabase, loadResults, onAuthChange, getProfile } from './lib/supabase'
import Auth from './components/Auth'
import Nav from './components/Nav'
import Plan from './components/Plan'
import Practice from './components/Practice'
import MockTests from './components/MockTests'
import Progress from './components/Progress'
import LiveSessions from './components/LiveSessions'
import SessionReminder from './components/SessionReminder'

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('ellt-theme') !== 'light')
  const [page, setPage] = useState('Plan')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const [schedule, setSchedule] = useState(null)

  useEffect(() => {
    document.body.className = dark ? 'dark' : ''
    localStorage.setItem('ellt-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: { subscription } } = onAuthChange((sess, event) => {
      if (event === 'PASSWORD_RECOVERY') { setIsPasswordRecovery(true); setSession(sess); setAuthReady(true); return }
      if (event === 'SIGNED_IN' && isPasswordRecovery) setIsPasswordRecovery(false)
      setSession(sess)
      if (!sess) { setResults([]); setProfile(null); setIsPasswordRecovery(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user?.id || isPasswordRecovery) return
    setLoadingResults(true)
    loadResults().then(setResults).finally(() => setLoadingResults(false))
    supabase.from('student_schedules').select('*').eq('user_id', session.user.id).single().then(({ data }) => { if (data) setSchedule(data) })
    getProfile(session.user.id).then(p => {
      setProfile(p?.full_name ? p : session.user.user_metadata?.full_name
        ? { full_name: session.user.user_metadata.full_name } : null)
    })
  }, [session?.user?.id, isPasswordRecovery])

  const addResult = useCallback(row => {
    setResults(prev => [
      { ...row, completed_at: new Date().toISOString() },
      ...prev.filter(r => !(r.test_id === row.test_id && r.skill === row.skill)),
    ])
  }, [])

  // Loading screen
  if (!authReady) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:'var(--green)', border:'4px solid var(--greenD)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:22, color:'#fff' }}>E</div>
      <div style={{ color:'var(--textM)', fontSize:14, fontWeight:700 }}>Loading your plan...</div>
      <div style={{ width:160, height:6, background:'var(--bg3)', borderRadius:99, overflow:'hidden', border:'2px solid var(--border)' }}>
        <div style={{ height:'100%', background:'var(--green)', borderRadius:99, animation:'ind 1.4s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes ind { 0%{transform:translateX(-100%);width:40%} 50%{width:60%} 100%{transform:translateX(250%);width:40%} }`}</style>
    </div>
  )

  if (isPasswordRecovery) return <Auth isPasswordRecovery={true} />
  if (!session) return <Auth />

  // BUG-02: Compute real streak from schedule completed_sessions
  function calcStreak(sched) {
    if (!sched) return 0
    const completed = sched.completed_sessions || {}
    const start = new Date(sched.start_date); start.setHours(0,0,0,0)
    const today = new Date(); today.setHours(0,0,0,0)
    const dayNum = Math.floor((today - start) / 86400000) + 1
    let streak = 0
    for (let d = dayNum; d >= 1; d--) {
      const hasDone = completed[`day_${d}_morning`] || completed[`day_${d}_evening`]
      if (hasDone) streak++
      else if (d < dayNum) break
    }
    return streak
  }

  const sharedProps = { results, addResult, userId: session.user.id, userEmail: session.user.email }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', color:'var(--text)' }}>
      <Nav page={page} setPage={setPage} dark={dark} setDark={setDark} user={session.user} profile={profile} results={results} streak={calcStreak(schedule)} />

      {loadingResults && (
        <div style={{ position:'fixed', top:70, right:16, zIndex:999, background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:12, padding:'8px 14px', fontSize:12, fontWeight:700, color:'var(--textM)', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', border:'2px solid var(--green)', borderTopColor:'transparent', animation:'spin .7s linear infinite' }} />
          Syncing...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      <SessionReminder schedule={schedule} />
      {page === 'Plan'     && <Plan {...sharedProps} />}
      {page === 'Practice' && <Practice {...sharedProps} />}
      {page === 'MockTest' && <MockTests {...sharedProps} />}
      {page === 'Progress' && <Progress {...sharedProps} loading={loadingResults} streak={calcStreak(schedule)} />}
      {page === 'Live'     && <LiveSessions />}
    </div>
  )
}
