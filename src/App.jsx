import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase, loadResults, onAuthChange, getProfile } from './lib/supabase'
import Auth from './components/Auth'
import Nav from './components/Nav'
import Today from './components/Today'
import TodaySession from './components/TodaySession'
import Plan, { PlanEdit } from './components/Plan'
import Practice from './components/Practice'
import MockTests from './components/MockTests'
import Progress from './components/Progress'
import Admin from './components/Admin'
import SessionReminder from './components/SessionReminder'
import { useScheduleStore, ScheduleProvider } from './lib/useSchedule'

// Redirect that keeps ?query and #hash so Supabase auth callbacks
// (#access_token=..., ?code=...) survive the hop to the landing route.
function RedirectTo({ to }) {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: to, search, hash }} replace />
}

// New URL = new screen: start at the top instead of keeping the old scroll offset.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('ellt-theme') !== 'light')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const isAdmin = session?.user?.email === 'myinterviewhub@gmail.com'
  // The study plan (student_schedules) is loaded once here and shared with
  // Today, Plan and the session runner through <ScheduleProvider>.
  const scheduleStore = useScheduleStore(session?.user?.id, session?.user?.email, !isPasswordRecovery)

  useEffect(() => {
    document.body.className = dark ? 'dark' : ''
    localStorage.setItem('ellt-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Legacy deep link: https://host/#admin  ->  /admin
  useEffect(() => {
    if (location.hash === '#admin') navigate('/admin', { replace: true })
  }, [])

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

  const sharedProps = { results, addResult, userId: session.user.id, userEmail: session.user.email }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', color:'var(--text)' }}>
      <Nav dark={dark} setDark={setDark} user={session.user} profile={profile} results={results} streak={scheduleStore.streak} isAdmin={isAdmin} />

      {loadingResults && (
        <div style={{ position:'fixed', top:70, right:16, zIndex:999, background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:12, padding:'8px 14px', fontSize:12, fontWeight:700, color:'var(--textM)', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', border:'2px solid var(--green)', borderTopColor:'transparent', animation:'spin .7s linear infinite' }} />
          Syncing...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      <SessionReminder schedule={scheduleStore.schedule} />
      <ScrollToTop />
      <ScheduleProvider value={scheduleStore}>
        <Routes>
          <Route path="/" element={<RedirectTo to="/today" />} />
          <Route path="/today" element={<Today {...sharedProps} profile={profile} />} />
          <Route path="/today/plan" element={<Plan results={results} />} />
          <Route path="/today/plan/edit" element={<PlanEdit />} />
          <Route path="/today/session/:dayNum/:slot" element={<TodaySession {...sharedProps} />} />
          <Route path="/practice/:skill?" element={<Practice {...sharedProps} />} />
          <Route path="/mock" element={<MockTests {...sharedProps} />} />
          <Route path="/progress" element={<Progress {...sharedProps} loading={loadingResults} streak={scheduleStore.streak} />} />
          {/* Plan used to be a top-level tab; keep old links and bookmarks working */}
          <Route path="/plan" element={<RedirectTo to="/today/plan" />} />
          <Route path="/admin" element={isAdmin ? <Admin user={session.user} /> : <RedirectTo to="/today" />} />
          <Route path="*" element={<RedirectTo to="/today" />} />
        </Routes>
      </ScheduleProvider>
    </div>
  )
}
