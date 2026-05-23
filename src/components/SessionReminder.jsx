import { useState, useEffect } from 'react'
import { X, Bell } from 'lucide-react'

export default function SessionReminder({ schedule }) {
  const [show, setShow] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!schedule) return

    const check = () => {
      const now = new Date()
      const nowMins = now.getHours() * 60 + now.getMinutes()

      const OFFSETS = {
        'Africa/Lagos':1,'Africa/Accra':0,'Africa/Nairobi':3,
        'Europe/London':1,'Europe/Paris':2,'America/New_York':-4,
        'America/Los_Angeles':-7,'Asia/Dubai':4,'Asia/Karachi':5,
      }
      const offset = (OFFSETS[schedule.timezone] || 0) * 60

      const [mh, mm] = (schedule.morning_time?.slice(0,5) || '09:00').split(':').map(Number)
      const [eh, em] = (schedule.evening_time?.slice(0,5) || '19:00').split(':').map(Number)
      const mMins = mh * 60 + mm
      const eMins = eh * 60 + em

      // Show if within 30 minutes before session
      if (nowMins >= mMins - 30 && nowMins < mMins + 30) {
        setSession({ type: 'morning', time: schedule.morning_time?.slice(0,5) })
        setShow(true)
      } else if (nowMins >= eMins - 30 && nowMins < eMins + 30) {
        setSession({ type: 'evening', time: schedule.evening_time?.slice(0,5) })
        setShow(true)
      }
    }

    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [schedule])

  if (!show || !session) return null

  const isMorning = session.type === 'morning'

  return (
    <div style={{
      position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, width: 'calc(100% - 32px)', maxWidth: 480,
      background: isMorning ? 'var(--blueBg)' : 'var(--purpleBg)',
      border: `2px solid ${isMorning ? 'var(--blue)' : 'var(--purple)'}`,
      borderBottom: `4px solid ${isMorning ? 'var(--blueD)' : 'var(--purpleD)'}`,
      borderRadius: 16, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      animation: 'slideDown .4s cubic-bezier(.22,1,.36,1)',
    }}>
      <Bell size={20} color={isMorning ? 'var(--blue)' : 'var(--purple)'} style={{ flexShrink:0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>
          {isMorning ? '☀️' : '🌙'} {session.type === 'morning' ? 'Morning' : 'Evening'} session at {session.time}
        </div>
        <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>
          Have you done your task today?
        </div>
      </div>
      <button onClick={() => setShow(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--textD)', padding:4, flexShrink:0 }}>
        <X size={16} />
      </button>
      <style>{`@keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
    </div>
  )
}
