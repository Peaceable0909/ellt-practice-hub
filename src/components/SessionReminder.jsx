import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Bell } from 'lucide-react'
import { useSchedule, sessionKey } from '../lib/useSchedule'

// "Have you done your task today?" toast, shown elsewhere in the app while the clock is within
// 30 minutes of the morning or evening session time. It stays out of the way when it has
// nothing to add: on Today and inside a session (Up next already says it), once that
// session is ticked off, and after the student dismisses it (until that slot comes round again).
const dismissKey = (todayKey, type) => `reminder-${todayKey}-${type}`

function storedDismissal(key) {
  try { return sessionStorage.getItem(key) === '1' } catch { return false }
}

export default function SessionReminder() {
  const { schedule, status, dayNum, completed, todayKey } = useSchedule()
  const { pathname } = useLocation()
  const [session, setSession] = useState(null)     // the slot whose window we are inside: { type, time }
  const [dismissed, setDismissed] = useState({})   // dismissed this page load (sessionStorage can be unavailable)

  // Depend on the times themselves, not the schedule object: it is replaced on every
  // markDone/savePlan, which would otherwise re-run the check and bring a dismissed toast back
  const hasSchedule = !!schedule
  const morningTime = schedule?.morning_time?.slice(0, 5) || '09:00'
  const eveningTime = schedule?.evening_time?.slice(0, 5) || '19:00'

  useEffect(() => {
    if (!hasSchedule) { setSession(null); return }
    const check = () => {
      const now = new Date()
      const nowMins = now.getHours() * 60 + now.getMinutes()
      const minsOf = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
      const mMins = minsOf(morningTime)
      const eMins = minsOf(eveningTime)

      // Show if within 30 minutes either side of the session time
      let next = null
      if (nowMins >= mMins - 30 && nowMins < mMins + 30) next = { type: 'morning', time: morningTime }
      else if (nowMins >= eMins - 30 && nowMins < eMins + 30) next = { type: 'evening', time: eveningTime }
      setSession(prev => (prev?.type === next?.type && prev?.time === next?.time ? prev : next))
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [hasSchedule, morningTime, eveningTime])

  if (!session || status !== 'active') return null
  if (pathname === '/today' || pathname.startsWith('/today/session')) return null

  const key = dismissKey(todayKey, session.type)
  if (dismissed[key] || storedDismissal(key)) return null
  if (completed[sessionKey(dayNum, session.type)]) return null

  const isMorning = session.type === 'morning'

  function dismiss() {
    setDismissed(d => ({ ...d, [key]: true }))
    try { sessionStorage.setItem(key, '1') } catch { /* storage blocked: it stays dismissed until reload */ }
  }

  return (
    <div role="status" style={{
      position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, width: 'calc(100% - 32px)', maxWidth: 480,
      background: isMorning ? 'var(--blueBg)' : 'var(--purpleBg)',
      border: `2px solid ${isMorning ? 'var(--blue)' : 'var(--purple)'}`,
      borderBottom: `4px solid ${isMorning ? 'var(--blueD)' : 'var(--purpleD)'}`,
      borderRadius: 16, padding: '10px 6px 10px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      animation: 'slideDown .4s cubic-bezier(.22,1,.36,1)',
    }}>
      <Bell size={20} color={isMorning ? 'var(--blue)' : 'var(--purple)'} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>
          {isMorning ? '☀️' : '🌙'} {isMorning ? 'Morning' : 'Evening'} session at {session.time}
        </div>
        <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>
          Have you done your task today?{' '}
          <Link to="/today" onClick={dismiss} style={{ color: isMorning ? 'var(--blueT)' : 'var(--purpleT)', fontWeight: 800 }}>Open Today</Link>
        </div>
      </div>
      <button onClick={dismiss} aria-label="Dismiss reminder" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--textM)', flexShrink: 0 }}>
        <X size={16} />
      </button>
      <style>{`@keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
    </div>
  )
}
