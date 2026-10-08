import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ClipboardList, PlayCircle, RotateCcw, Eye, Clock } from 'lucide-react'
import { PERIOD_CONFIG } from '../data/timetable'
import { useSchedule, getDaySlots, sessionKey, parseLocalDate, addDays, localDateKey } from '../lib/useSchedule'
import { TaskChip, DoneBadge, metaFor, fmtDuration, fmtDate, DAY_TYPE_LABELS, quietCard, sectionLabel } from './PlanBits'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']   // Monday first

const backLink = {
  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px 8px 8px', minHeight: 36,
  borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)',
  background: 'var(--bg2)', color: 'var(--textM)', fontWeight: 800, fontSize: 12,
  fontFamily: 'Nunito, sans-serif', textDecoration: 'none',
}

// ── FULL PLAN (/today/plan) ────────────────────────────────────
// Calendar of every day in the plan. Tap a day to see its sessions: past days
// (and today) can be reviewed or redone, future days are preview only.
export default function Plan({ results = [] }) {
  const { schedule, loading, error, reload, status, plan, dayNum, totalDays, cfg, completed, doneSessions, totalSessions } = useSchedule()
  const [params, setParams] = useSearchParams()

  if (loading) return <Page><Centered>Loading your plan...</Centered></Page>
  if (error && !schedule) return (
    <Page>
      <Centered>
        Could not load your plan.{' '}
        <button onClick={reload} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 900, fontSize: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', textDecoration: 'underline' }}>Try again</button>
      </Centered>
    </Page>
  )
  if (!schedule) return <Navigate to="/today/plan/edit" replace />

  const start = parseLocalDate(schedule.start_date)
  const lead = (start.getDay() + 6) % 7   // blank cells so day 1 sits under its real weekday
  const defaultDay = status === 'active' ? dayNum : status === 'finished' ? totalDays : 1
  const asked = parseInt(params.get('day'), 10)
  const selected = asked >= 1 && asked <= totalDays ? asked : defaultDay
  const selectedDay = plan.find(d => d.day === selected)
  const pct = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0

  const statusText = status === 'upcoming'
    ? `Starts ${fmtDate(start, { weekday: 'short', day: 'numeric', month: 'short' })}`
    : status === 'finished' ? 'Plan complete' : `Day ${dayNum} of ${totalDays}`

  return (
    <Page>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link to="/today" style={backLink}><ChevronLeft size={16} /> Today</Link>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>Full plan</h1>
      </div>

      {/* Summary */}
      <div style={{ ...quietCard, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>{cfg?.label} plan · {statusText}</div>
          <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>{schedule.morning_time?.slice(0, 5)} and {schedule.evening_time?.slice(0, 5)}</div>
        </div>
        <div className="xp-bar" style={{ height: 12 }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Sessions completed">
          <div className="xp-bar-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, marginTop: 7 }}>{doneSessions} of {totalSessions} sessions done</div>
      </div>

      {/* Calendar */}
      <div style={{ ...sectionLabel, marginBottom: 10 }}>Calendar</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6, marginBottom: 6 }}>
        {WEEKDAYS.map((w, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 900, color: 'var(--textD)', textTransform: 'uppercase' }}>{w}</div>
        ))}
        {Array.from({ length: lead }, (_, i) => <div key={`blank-${i}`} />)}
        {plan.map(d => {
          const slots = getDaySlots(d, schedule)
          const done = slots.map(s => !!completed[sessionKey(d.day, s.which)])
          return (
            <DayTile key={d.day} d={d} date={addDays(start, d.day - 1)} dayNum={dayNum} done={done}
              selected={d.day === selected} onSelect={() => setParams({ day: String(d.day) }, { replace: true })} />
          )
        })}
      </div>
      <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 600, marginBottom: 18 }}>
        Numbers are plan days, dots are sessions. Tap a day to see it.
      </div>

      {selectedDay && (
        <DayDetail d={selectedDay} schedule={schedule} start={start} dayNum={dayNum} completed={completed} results={results} />
      )}
    </Page>
  )
}

function DayTile({ d, date, dayNum, done, selected, onSelect }) {
  const isToday = d.day === dayNum
  const isFuture = d.day > dayNum
  const allDone = done.every(Boolean)
  const accent = selected ? 'var(--blue)' : isToday ? 'var(--green)' : 'var(--border)'
  const accentB = selected ? 'var(--blueD)' : isToday ? 'var(--greenD)' : 'var(--borderB)'
  return (
    <button onClick={onSelect} aria-pressed={selected}
      aria-label={`Day ${d.day}, ${fmtDate(date)}, ${done.filter(Boolean).length} of ${done.length} sessions done${isToday ? ', today' : ''}`}
      style={{
        position: 'relative', minWidth: 0, minHeight: 52, padding: '8px 2px 7px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        borderRadius: 10, border: `2px solid ${accent}`, borderBottom: `3px solid ${accentB}`,
        background: selected ? 'var(--blueBg)' : isToday ? 'var(--greenBg)' : 'var(--bg2)',
        opacity: isFuture && !selected ? 0.6 : 1, fontFamily: 'Nunito, sans-serif',
      }}>
      <span style={{ fontSize: 13, fontWeight: 900, lineHeight: 1, color: allDone ? 'var(--green)' : isToday ? 'var(--green)' : 'var(--text)' }}>{d.day}</span>
      <span style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {done.map((v, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: v ? 'var(--green)' : 'var(--border)' }} />)}
      </span>
      {d.dayType === 'mock' && <ClipboardList size={10} color="var(--green)" style={{ position: 'absolute', top: 3, right: 3 }} aria-hidden="true" />}
    </button>
  )
}

function ResultBadge({ r }) {
  const band = Number(r.band_score)
  const pctScore = r.total > 0 ? Math.round((r.score / r.total) * 100) : null
  if (!(band > 0) && pctScore == null) return null
  const col = band > 0
    ? (band >= 7 ? 'var(--green)' : band >= 5.5 ? 'var(--amber)' : 'var(--coral)')
    : (pctScore >= 70 ? 'var(--green)' : pctScore >= 50 ? 'var(--amber)' : 'var(--coral)')
  return (
    <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 900, color: col, border: `1.5px solid ${col}`, borderRadius: 8, padding: '2px 7px' }}>
      {band > 0 ? `Band ${band}` : `${r.score}/${r.total}`}
    </span>
  )
}

function DayDetail({ d, schedule, start, dayNum, completed, results }) {
  const isToday = d.day === dayNum
  const isFuture = d.day > dayNum
  const slots = getDaySlots(d, schedule)
  const date = addDays(start, d.day - 1)
  const typeLabel = DAY_TYPE_LABELS[d.dayType]
  const chip = (text, col) => (
    <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4px', color: col, border: `1.5px solid ${col}`, borderRadius: 99, padding: '2px 8px' }}>{text}</span>
  )

  return (
    <div style={{ ...quietCard, padding: '16px 16px 6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>Day {d.day}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {typeLabel && chip(typeLabel, d.dayType === 'mock' ? 'var(--green)' : 'var(--blue)')}
          {isToday ? chip('Today', 'var(--green)') : isFuture ? chip('Preview only', 'var(--textM)') : chip('Review', 'var(--textM)')}
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700, marginBottom: 6 }}>{fmtDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</div>

      {slots.map(slot => {
        const s = slot.session
        const tasks = s.tasks || []
        const isDone = !!completed[sessionKey(d.day, slot.which)]
        const { Icon, color } = metaFor(s.type)
        return (
          <div key={slot.which} style={{ padding: '14px 0', borderTop: '2px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--textD)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{slot.label} · {slot.time}</span>
              {isDone && <DoneBadge />}
              {!isDone && !isFuture && !isToday && (
                <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Not done</span>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', lineHeight: 1.3 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, margin: '2px 0 8px' }}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · ~{fmtDuration(s.duration)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tasks.map((t, i) => {
                const r = !isFuture && t.testId ? results.find(x => x.test_id === t.testId) : null
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <TaskChip task={t} />
                    {r && <ResultBadge r={r} />}
                  </div>
                )
              })}
            </div>
            {!isFuture && (
              <Link to={`/today/session/${d.day}/${slot.which}`}
                style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40, padding: '9px 16px', borderRadius: 12, textDecoration: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.4px',
                  ...(isDone
                    ? { border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--textM)' }
                    : { border: 'none', borderBottom: '4px solid var(--greenD)', background: 'var(--green)', color: '#fff' }) }}>
                {isDone ? <><RotateCcw size={13} /> Redo</> : <><PlayCircle size={15} /> {isToday ? 'Start' : 'Catch up'}</>}
              </Link>
            )}
          </div>
        )
      })}

      {isFuture && (
        <div style={{ borderTop: '2px solid var(--border)', padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>
          <Eye size={14} style={{ flexShrink: 0 }} /> This day opens on {fmtDate(date, { weekday: 'long', day: 'numeric', month: 'short' })}.
        </div>
      )}
    </div>
  )
}

function Page({ children }) {
  return <div className="app-container anim-fadeUp" style={{ maxWidth: 640 }}>{children}</div>
}

function Centered({ children }) {
  return <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--textM)', fontSize: 14, fontWeight: 700 }}>{children}</div>
}

// ── SETUP / EDIT (/today/plan/edit) ────────────────────────────
// /today/plan/edit        edit the current plan (completed sessions are kept)
// /today/plan/edit?new=1  start a brand new plan (completed sessions reset)
const TIMEZONES = ['Europe/London','Europe/Paris','Africa/Lagos','Africa/Accra','Africa/Nairobi','America/New_York','America/Los_Angeles','Asia/Dubai','Asia/Karachi','Asia/Dhaka','Australia/Sydney']

export function PlanEdit() {
  const { schedule, loading, savePlan } = useSchedule()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [saving, setSaving] = useState(false)

  if (loading) return <Page><Centered>Loading your plan...</Centered></Page>

  const existing = !!schedule && params.get('new') !== '1'
  const initial = existing
    ? {
        period: schedule.period,
        startDate: String(schedule.start_date).slice(0, 10),
        morningTime: (schedule.morning_time || '09:00').slice(0, 5),
        eveningTime: (schedule.evening_time || '19:00').slice(0, 5),
        timezone: schedule.timezone || 'Europe/London',
        emailReminders: schedule.email_reminders ?? true,
      }
    : { period: '1_month', startDate: localDateKey(), morningTime: '09:00', eveningTime: '19:00', timezone: 'Europe/London', emailReminders: true }

  async function handleSave(values) {
    setSaving(true)
    const res = await savePlan(values, !existing)
    setSaving(false)
    if (!res.ok) {
      alert('Could not save your plan. Please check your connection and try again.')
      return
    }
    navigate('/today')
  }

  return <SetupView key={existing ? 'edit' : 'new'} initial={initial} existing={existing} hasPlan={!!schedule} saving={saving} onSave={handleSave} />
}

function SetupView({ initial, existing, hasPlan, saving, onSave }) {
  const [period, setPeriod]       = useState(initial.period)
  const [startDate, setStartDate] = useState(initial.startDate)
  const [morningTime, setMorning] = useState(initial.morningTime)
  const [eveningTime, setEvening] = useState(initial.eveningTime)
  const [timezone, setTimezone]   = useState(initial.timezone)
  const [emailReminders, setEmail]= useState(initial.emailReminders)
  const cfg = PERIOD_CONFIG[period] || PERIOD_CONFIG['1_month']
  const tzOptions = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES]

  return (
    <div className="app-container anim-fadeUp" style={{ maxWidth:520 }}>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:24 }}>
        {hasPlan && <Link to="/today" style={backLink}>← Cancel</Link>}
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:'var(--text)' }}>{existing?'Edit':'Start'} Your Learning Plan</h2>
          <p style={{ fontSize:13, color:'var(--textM)', fontWeight:600, marginTop:2 }}>Your plan will guide every session — let's set it up.</p>
        </div>
      </div>

      {hasPlan && !existing && (
        <div style={{ marginBottom:20, padding:'10px 14px', background:'var(--amberBg)', border:'2px solid var(--amber)', borderRadius:12, fontSize:12, color:'var(--text)', fontWeight:700, lineHeight:1.5, display:'flex', gap:8, alignItems:'flex-start' }}>
          <Clock size={14} color="var(--amber)" style={{ flexShrink:0, marginTop:2 }} />
          Starting a new plan clears the sessions you have ticked off in your current one. Your test results and progress are kept.
        </div>
      )}

      {/* Period */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>How long do you have?</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
          {Object.entries(PERIOD_CONFIG).map(([key,c]) => (
            <div key={key} onClick={() => setPeriod(key)} style={{ padding:14, borderRadius:14, border:`2px solid ${period===key?'var(--green)':'var(--border)'}`, borderBottom:`4px solid ${period===key?'var(--greenD)':'var(--borderB)'}`, background:period===key?'var(--greenBg)':'var(--bg2)', cursor:'pointer', transition:'all .2s' }}>
              <div style={{ fontSize:16, fontWeight:900, color:period===key?'var(--green)':'var(--text)', marginBottom:3 }}>{c.label}</div>
              <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700 }}>{c.sessionsPerDay >= 3 ? `${c.morningHours}h + ${c.noonHours}h + ${c.eveningHours}h per day` : `${c.morningHours}h morning + ${c.eveningHours}h evening per day`}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:8, padding:'10px 14px', background:'var(--bg3)', borderRadius:10, fontSize:12, color:'var(--textM)', fontWeight:600, lineHeight:1.5 }}>
          {cfg.description}
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>Start Date</label>
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} min={existing ? undefined : localDateKey()} />
      </div>

      {/* Times */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
        {[['☀️ Morning Time', morningTime, setMorning],['🌙 Evening Time', eveningTime, setEvening]].map(([label,val,set]) => (
          <div key={label}>
            <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>{label}</label>
            <input type="time" value={val} onChange={e=>set(e.target.value)} />
          </div>
        ))}
      </div>

      {/* Timezone */}
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>Timezone</label>
        <select value={timezone} onChange={e=>setTimezone(e.target.value)}>
          {tzOptions.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      {/* Email reminders */}
      <div onClick={() => setEmail(e=>!e)} style={{ marginBottom:22, padding:14, background:emailReminders?'var(--greenBg)':'var(--bg3)', border:`2px solid ${emailReminders?'var(--green)':'var(--border)'}`, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${emailReminders?'var(--green)':'var(--border)'}`, background:emailReminders?'var(--green)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, color:'#fff', fontWeight:900 }}>
          {emailReminders ? '✓' : ''}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>Email Reminders</div>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:1 }}>Get a daily email at {morningTime} with your sessions and a study tip</div>
        </div>
      </div>

      <button onClick={() => onSave({ period, startDate, morningTime, eveningTime, timezone, emailReminders })} disabled={saving || !startDate} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:`4px solid ${saving?'var(--border)':'var(--greenD)'}`, background:saving?'var(--bg3)':'var(--green)', color:saving?'var(--textM)':'#fff', fontWeight:900, fontSize:15, cursor:(saving || !startDate)?'not-allowed':'pointer', opacity:startDate?1:0.6, fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
        {saving ? 'Saving...' : existing ? `Save Changes →` : `Start My ${cfg.label} Plan →`}
      </button>
    </div>
  )
}
