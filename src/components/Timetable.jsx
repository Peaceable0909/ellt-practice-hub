import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { buildPlan, PERIOD_CONFIG, SESSION_ICONS, SESSION_COLORS } from '../data/timetable'
import { Card, Chip, Btn } from './ui'

const TIMEZONES = [
  'Europe/London','Europe/Paris','Africa/Lagos','Africa/Accra','Africa/Nairobi',
  'America/New_York','America/Los_Angeles','Asia/Dubai','Asia/Karachi','Asia/Dhaka',
  'Australia/Sydney','Pacific/Auckland'
]

export default function Timetable({ userId, userEmail, profile, setPage }) {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('overview') // overview | setup | day
  const [selectedDay, setSelectedDay] = useState(null)

  // Setup form state
  const [period, setPeriod] = useState('1_month')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [morningTime, setMorningTime] = useState('09:00')
  const [eveningTime, setEveningTime] = useState('19:00')
  const [timezone, setTimezone] = useState('Europe/London')
  const [emailReminders, setEmailReminders] = useState(true)

  useEffect(() => {
    loadSchedule()
  }, [userId])

  async function loadSchedule() {
    setLoading(true)
    const { data } = await supabase
      .from('student_schedules')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (data) setSchedule(data)
    setLoading(false)
  }

  async function saveSchedule() {
    setSaving(true)
    const row = {
      user_id: userId,
      period,
      start_date: startDate,
      morning_time: morningTime,
      evening_time: eveningTime,
      timezone,
      email_reminders: emailReminders,
      updated_at: new Date().toISOString()
    }
    await supabase.from('student_schedules').upsert([row])
    setSchedule(row)
    setSaving(false)
    setView('overview')
  }

  async function deleteSchedule() {
    await supabase.from('student_schedules').delete().eq('user_id', userId)
    setSchedule(null)
    setView('setup')
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--textM)' }}>Loading your schedule…</div>
  }

  if (!schedule || view === 'setup') {
    return <SetupView
      period={period} setPeriod={setPeriod}
      startDate={startDate} setStartDate={setStartDate}
      morningTime={morningTime} setMorningTime={setMorningTime}
      eveningTime={eveningTime} setEveningTime={setEveningTime}
      timezone={timezone} setTimezone={setTimezone}
      emailReminders={emailReminders} setEmailReminders={setEmailReminders}
      saving={saving} onSave={saveSchedule}
      existing={!!schedule} onCancel={() => setView('overview')}
    />
  }

  const plan = buildPlan(schedule.period)
  const today = Math.floor((new Date() - new Date(schedule.start_date)) / (1000 * 60 * 60 * 24)) + 1
  const todayData = plan.find(d => d.day === today)
  const cfg = PERIOD_CONFIG[schedule.period]

  if (view === 'day' && selectedDay) {
    return <DayView day={selectedDay} onBack={() => setView('overview')} setPage={setPage} />
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            My Learning Plan — {cfg.label}
          </h2>
          <div style={{ fontSize: 13, color: 'var(--textM)' }}>
            Started: {new Date(schedule.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} ·
            {schedule.morning_time} morning · {schedule.evening_time} evening
            {schedule.email_reminders && ' · 📧 Email reminders on'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn small onClick={() => setView('setup')}>Edit Schedule</Btn>
          <Btn small onClick={deleteSchedule}>Reset Plan</Btn>
        </div>
      </div>

      {/* Today's session */}
      {todayData && today >= 1 && today <= plan.length && (
        <Card style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--tealBg), var(--blueBg))', borderColor: 'var(--tealBr)' }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 8 }}>
            TODAY — DAY {today} OF {plan.length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { session: todayData.morning, label: `☀️ Morning — ${schedule.morning_time}` },
              { session: todayData.evening, label: `🌙 Evening — ${schedule.evening_time}` }
            ].map(({ session, label }) => (
              <div key={label} style={{ background: 'var(--bg2)', borderRadius: 10, padding: 14, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--textM)', marginBottom: 6 }}>{label}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{SESSION_ICONS[session.type]}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: SESSION_COLORS[session.type] }}>{session.label}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--textM)', marginBottom: 8 }}>{session.duration} mins</div>
                {session.testId && (
                  <button onClick={() => { setPage('Practice') }}
                    style={{ fontSize: 11, padding: '5px 10px', borderRadius: 7, border: `1px solid ${SESSION_COLORS[session.type]}44`,
                      background: `${SESSION_COLORS[session.type]}12`, color: SESSION_COLORS[session.type],
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    Start Session →
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {today > plan.length && (
        <Card style={{ marginBottom: 20, background: 'var(--tealBg)', borderColor: 'var(--tealBr)', textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>Program Complete!</div>
          <div style={{ fontSize: 13, color: 'var(--textM)' }}>You've finished your {cfg.label} learning plan. Start a new one or take a full mock test!</div>
        </Card>
      )}

      {/* Full plan grid */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Full Schedule</div>
      {[1, 2, 3, 4].filter(w => plan.some(d => d.week === w)).map(week => {
        const weekDays = plan.filter(d => d.week === week)
        const weekTheme = weekDays[0]?.theme
        return (
          <div key={week} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Week {week} — {weekTheme}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {weekDays.map(d => {
                const isPast = d.day < today
                const isToday = d.day === today
                const isFuture = d.day > today
                return (
                  <Card key={d.day}
                    onClick={() => { setSelectedDay(d); setView('day') }}
                    style={{
                      cursor: 'pointer',
                      opacity: isFuture ? 0.65 : 1,
                      borderColor: isToday ? 'var(--tealBr)' : isPast ? '#22c55e33' : 'var(--border)',
                      background: isToday ? 'var(--tealBg)' : 'var(--bg2)',
                      padding: '12px 16px',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: isToday ? 'var(--teal)' : isPast ? '#22c55e22' : 'var(--bg3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700,
                        color: isToday ? '#000' : isPast ? '#22c55e' : 'var(--textD)' }}>
                        {isPast ? '✓' : d.day}
                      </div>
                      <div style={{ flex: 1, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {[d.morning, d.evening].map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14 }}>{SESSION_ICONS[s.type]}</span>
                            <span style={{ fontSize: 12, color: SESSION_COLORS[s.type], fontWeight: 500 }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                      {isToday && <Chip text="TODAY" color="var(--teal)"/>}
                      {isPast && <Chip text="Done" color="#22c55e"/>}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayView({ day, onBack, setPage }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--textM)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>← Back</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Day {day.day} — Week {day.week}: {day.theme}</h2>
      </div>
      {[
        { session: day.morning, time: 'Morning Session (2 hours)', icon: '☀️' },
        { session: day.evening, time: 'Evening Session (2 hours)', icon: '🌙' }
      ].map(({ session, time, icon }) => (
        <Card key={time} style={{ marginBottom: 16, borderColor: `${SESSION_COLORS[session.type]}33` }}>
          <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, marginBottom: 8 }}>{icon} {time}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{SESSION_ICONS[session.type]}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: SESSION_COLORS[session.type] }}>{session.label}</div>
              <div style={{ fontSize: 12, color: 'var(--textM)', marginTop: 2 }}>{session.duration} minutes</div>
            </div>
          </div>
          {session.desc && <p style={{ fontSize: 13, color: 'var(--textM)', lineHeight: 1.6, marginBottom: 10 }}>{session.desc}</p>}
          {session.testId && (
            <button onClick={() => setPage('Practice')} style={{
              padding: '9px 20px', borderRadius: 8, border: 'none',
              background: `linear-gradient(135deg, ${SESSION_COLORS[session.type]}, ${SESSION_COLORS[session.type]}cc)`,
              color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
            }}>
              Go to {session.skill?.charAt(0).toUpperCase() + session.skill?.slice(1)} Practice →
            </button>
          )}
        </Card>
      ))}
    </div>
  )
}

function SetupView({ period, setPeriod, startDate, setStartDate, morningTime, setMorningTime,
  eveningTime, setEveningTime, timezone, setTimezone, emailReminders, setEmailReminders,
  saving, onSave, existing, onCancel }) {
  const cfg = PERIOD_CONFIG[period]
  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {existing && <button onClick={onCancel} style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--textM)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>← Cancel</button>}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{existing ? 'Edit' : 'Create'} Your Learning Plan</h2>
      </div>

      {/* Period selection */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>How long do you have to prepare?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {Object.entries(PERIOD_CONFIG).map(([key, c]) => (
            <div key={key} onClick={() => setPeriod(key)}
              style={{ padding: 14, borderRadius: 10, border: `2px solid ${period === key ? 'var(--teal)' : 'var(--border)'}`,
                background: period === key ? 'var(--tealBg)' : 'var(--bg2)', cursor: 'pointer', transition: 'all .2s' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: period === key ? 'var(--teal)' : 'var(--text)', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--textM)', lineHeight: 1.5 }}>{c.morningHours}h morning + {c.eveningHours}h evening/day</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--textM)', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8 }}>
          💡 {cfg.description}
        </div>
      </div>

      {/* Start date */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>Start Date</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}/>
      </div>

      {/* Times */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {[
          { label: '☀️ Morning Session Time', val: morningTime, set: setMorningTime },
          { label: '🌙 Evening Session Time', val: eveningTime, set: setEveningTime }
        ].map(({ label, val, set }) => (
          <div key={label}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>{label}</label>
            <input type="time" value={val} onChange={e => set(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}/>
          </div>
        ))}
      </div>

      {/* Timezone */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--textM)', display: 'block', marginBottom: 6 }}>Your Timezone</label>
        <select value={timezone} onChange={e => setTimezone(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      {/* Email reminders */}
      <div style={{ marginBottom: 24, padding: 14, background: emailReminders ? 'var(--tealBg)' : 'var(--bg3)',
        border: `1px solid ${emailReminders ? 'var(--tealBr)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer' }}
        onClick={() => setEmailReminders(e => !e)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${emailReminders ? 'var(--teal)' : 'var(--border)'}`,
            background: emailReminders ? 'var(--teal)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 12, color: '#000' }}>
            {emailReminders ? '✓' : ''}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>📧 Email Reminders</div>
            <div style={{ fontSize: 11, color: 'var(--textM)', marginTop: 2 }}>
              Send email to your account at {morningTime} and {eveningTime} when it's time to study
            </div>
          </div>
        </div>
      </div>

      <button onClick={onSave} disabled={saving} style={{
        width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
        background: saving ? 'var(--border)' : 'linear-gradient(135deg, var(--teal), var(--blue))',
        color: saving ? 'var(--textM)' : '#000', fontWeight: 700, fontSize: 14,
        cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
      }}>
        {saving ? 'Saving…' : `Start My ${PERIOD_CONFIG[period].label} Plan →`}
      </button>
    </div>
  )
}
