import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Flame, PlayCircle, RotateCcw, Clock, CheckCircle, Trophy, Target, ClipboardList, ChevronRight, CalendarDays, AlertTriangle } from 'lucide-react'
import DailyChallenge from './DailyChallenge'
import { useSchedule, getDaySlots, sessionKey, parseLocalDate, addDays } from '../lib/useSchedule'
import { TaskChip, DoneBadge, metaFor, fmtDuration, fmtDate, quietCard, sectionLabel } from './PlanBits'

const sessionUrl = (day, which) => `/today/session/${day}/${which}`

function minutesOf(hhmm) {
  const [h, m] = String(hhmm || '00:00').split(':').map(Number)
  return h * 60 + (m || 0)
}

// Re-render every 30s so "available at" flips on its own
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function Today({ profile, userId, addResult }) {
  const { schedule, loading, error, reload, status, plan, dayNum, totalDays, cfg, completed, streak, doneSessions, totalSessions } = useSchedule()
  const now = useClock()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const name = profile?.full_name?.trim().split(' ')[0] || ''
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const header = (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <div style={{ ...sectionLabel, fontSize: 11, minWidth: 0 }}>{fmtDate(now, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <StreakPill streak={streak} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', lineHeight: 1.2 }}>{name ? `${greeting}, ${name}` : greeting}</h1>
    </div>
  )

  const dailyChallenge = (
    <div style={{ marginBottom: 16 }}>
      <DailyChallenge userId={userId} addResult={addResult} compact />
    </div>
  )

  // ── Loading / error / no plan ──────────────────────────────
  if (loading) return (
    <Page>
      {header}
      <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--textM)', fontSize: 14, fontWeight: 700 }}>Loading your plan...</div>
    </Page>
  )

  if (error && !schedule) return (
    <Page>
      {header}
      <div style={{ background: 'var(--coralBg)', border: '2px solid var(--coral)', borderBottom: '4px solid var(--coralBdr)', borderRadius: 18, padding: 18, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <AlertTriangle size={20} color="var(--coral)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>Could not load your plan</div>
          <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, marginTop: 2 }}>Check your connection and try again.</div>
        </div>
        <button onClick={reload} style={outlineBtn}>Try again</button>
      </div>
      {dailyChallenge}
    </Page>
  )

  if (status === 'none') return (
    <Page>
      {header}
      <div style={{ ...quietCard, padding: '28px 20px', textAlign: 'center', marginBottom: 16 }}>
        <Target size={40} color="var(--green)" style={{ margin: '0 auto 12px' }} />
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>Let's set up your study plan</div>
        <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.6, marginBottom: 18 }}>
          Choose how long you have and when you study. Your plan gives you a clear list of sessions every day.
        </div>
        <Link to="/today/plan/edit" className="duo-btn duo-btn-green" style={{ textDecoration: 'none', maxWidth: 280, margin: '0 auto' }}>Create my plan</Link>
      </div>
      {dailyChallenge}
    </Page>
  )

  const startDate = parseLocalDate(schedule.start_date)

  // ── Plan has not started yet ───────────────────────────────
  if (status === 'upcoming') {
    const daysUntil = 1 - dayNum
    return (
      <Page>
        {header}
        <div style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--amberBg)', border: '2px solid var(--amber)', borderBottom: '4px solid #cc7700', borderRadius: 18, marginBottom: 16 }}>
          <Clock size={36} color="var(--amber)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Starts on {fmtDate(startDate, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>
            {daysUntil === 1 ? 'That is tomorrow.' : `That is in ${daysUntil} days.`} Your {cfg?.label} plan begins then.
          </div>
        </div>
        {dailyChallenge}
        <PlanFooter mock={findMock(plan, 1, startDate, dayNum)} note={`${totalDays} days, ${totalSessions} sessions`} />
      </Page>
    )
  }

  // ── Plan is over ───────────────────────────────────────────
  if (status === 'finished') {
    const wellDone = totalSessions > 0 && doneSessions / totalSessions >= 0.7
    return (
      <Page>
        {header}
        <div style={{ textAlign: 'center', padding: '28px 20px', background: 'var(--greenBg)', border: '2px solid var(--green)', borderBottom: '4px solid var(--greenD)', borderRadius: 20, marginBottom: 16 }}>
          <Trophy size={40} color="var(--green)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: wellDone ? 'var(--green)' : 'var(--text)', marginBottom: 4 }}>{wellDone ? 'Plan complete!' : 'Your plan has ended'}</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.6, marginBottom: 18 }}>
            Your {cfg?.label} plan is over and you completed {doneSessions} of {totalSessions} sessions. Test yourself on a full mock, or see how your bands have moved.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <Link to="/mock" className="duo-btn duo-btn-green" style={{ textDecoration: 'none', maxWidth: 280 }}>Take a mock test</Link>
            <Link to="/progress" className="duo-btn duo-btn-outline" style={{ textDecoration: 'none', maxWidth: 280 }}>See my progress</Link>
            <Link to="/today/plan/edit?new=1" style={{ fontSize: 12, fontWeight: 800, color: 'var(--textM)', textDecoration: 'underline', marginTop: 4 }}>Start a new plan</Link>
          </div>
        </div>
        {dailyChallenge}
        <PlanFooter note={`Your plan ran for ${totalDays} days`} />
      </Page>
    )
  }

  // ── Active plan ────────────────────────────────────────────
  const day = plan.find(d => d.day === dayNum)
  const slots = getDaySlots(day, schedule).map(s => ({
    ...s,
    done: !!completed[sessionKey(dayNum, s.which)],
    available: nowMins >= minutesOf(s.time),
  }))
  const next = slots.find(s => !s.done)
  const others = slots.filter(s => s !== next)
  const pct = Math.min(100, Math.round((dayNum / totalDays) * 100))
  const tomorrow = plan.find(d => d.day === dayNum + 1)

  return (
    <Page>
      {header}

      {/* Day X of N */}
      <div style={{ ...quietCard, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>Day {dayNum} of {totalDays}</div>
          <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>{cfg?.label} plan</div>
        </div>
        <div className="xp-bar" style={{ height: 12 }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`Day ${dayNum} of ${totalDays}`}>
          <div className="xp-bar-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, marginTop: 7 }}>{doneSessions} of {totalSessions} sessions done</div>
      </div>

      {/* Up next, or all done */}
      {next ? (
        <UpNextCard slot={next} dayNum={dayNum} />
      ) : (
        <div style={{ background: 'var(--greenBg)', border: '2px solid var(--green)', borderBottom: '4px solid var(--greenD)', borderRadius: 20, padding: '20px 18px', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={26} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)' }}>Today's sessions are done</div>
            <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.5, marginTop: 2 }}>
              {tomorrow ? `Tomorrow, Day ${tomorrow.day}: ${tomorrow.morning.label}.` : 'That was the last day of your plan. Great finish.'}
              {' '}Want more? <Link to="/practice" style={{ color: 'var(--green)', fontWeight: 800 }}>Open Practice</Link>.
            </div>
          </div>
        </div>
      )}

      {/* Other sessions today */}
      {others.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...sectionLabel, marginBottom: 10 }}>{next ? 'Also today' : "Today's sessions"}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {others.map(s => <SessionCard key={s.which} slot={s} dayNum={dayNum} />)}
          </div>
        </div>
      )}

      {dailyChallenge}

      <PlanFooter mock={findMock(plan, dayNum, startDate, dayNum)} note={`${totalDays - dayNum} ${totalDays - dayNum === 1 ? 'day' : 'days'} left in your plan`} />
    </Page>
  )
}

// ── Pieces ─────────────────────────────────────────────────────

function Page({ children }) {
  return <div className="app-container fade-up" style={{ maxWidth: 640 }}>{children}</div>
}

function StreakPill({ streak }) {
  const on = streak > 0
  return (
    <div title={`${streak} day streak`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 99, background: on ? 'var(--amberBg)' : 'var(--bg3)', border: `2px solid ${on ? 'var(--amber)' : 'var(--border)'}`, borderBottom: `3px solid ${on ? '#cc7700' : 'var(--borderB)'}` }}>
      <Flame size={18} color={on ? 'var(--streak)' : 'var(--textD)'} fill={on ? 'var(--streak)' : 'none'} />
      <span style={{ fontSize: 15, fontWeight: 900, color: on ? 'var(--streak)' : 'var(--textM)', lineHeight: 1 }}>{streak}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--textM)', lineHeight: 1 }}>day streak</span>
    </div>
  )
}

function UpNextCard({ slot, dayNum }) {
  const { session, available } = slot
  const tasks = session.tasks || []
  const meta = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ~${fmtDuration(session.duration)}`

  if (!available) {
    const { Icon, color } = metaFor(session.type)
    return (
      <div style={{ ...quietCard, padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--textM)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Up next · {slot.label}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: 'var(--amber)', background: 'var(--amberBg)', borderRadius: 99, padding: '2px 8px' }}>
            <Clock size={11} /> Available at {slot.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb, ${color} 12%, var(--bg3))`, border: `2px solid color-mix(in srgb, ${color} 30%, var(--border))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color={color} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', lineHeight: 1.25 }}>{session.label}</div>
            <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700, marginTop: 2 }}>{meta}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {tasks.map((t, i) => <TaskChip key={i} task={t} />)}
        </div>
        <Link to={sessionUrl(dayNum, slot.which)} className="duo-btn duo-btn-outline" style={{ textDecoration: 'none' }}>
          <PlayCircle size={16} /> Start early
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, var(--green) 0%, #46A302 100%)', border: '3px solid var(--greenD)', borderBottom: '6px solid var(--greenD)', borderRadius: 20, padding: 18, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 6 }}>
          Up next · {slot.label} · {slot.time}
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 4, textShadow: '0 1px 0 rgba(0,0,0,0.12)' }}>{session.label}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: 800, marginBottom: 12 }}>{meta}</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
          {tasks.map((t, i) => <TaskChip key={i} task={t} onGreen />)}
        </div>
        <Link to={sessionUrl(dayNum, slot.which)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 18px', borderRadius: 14, background: '#fff', color: 'var(--greenD)', borderBottom: '4px solid rgba(0,0,0,0.22)', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.7px', textDecoration: 'none' }}>
          <PlayCircle size={18} /> Start session
        </Link>
      </div>
    </div>
  )
}

function SessionCard({ slot, dayNum }) {
  const { session, done, available } = slot
  const { Icon, color } = metaFor(session.type)
  const tasks = session.tasks || []
  return (
    <div style={{ ...quietCard, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderColor: done ? 'var(--green)' : 'var(--border)', borderBottomColor: done ? 'var(--greenD)' : 'var(--borderB)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? 'var(--greenBg)' : `color-mix(in srgb, ${color} 12%, var(--bg3))`, border: `2px solid ${done ? 'var(--green)' : `color-mix(in srgb, ${color} 30%, var(--border))`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {done ? <CheckCircle size={22} color="var(--green)" /> : <Icon size={22} color={color} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--textD)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{slot.label} · {slot.time}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: done ? 'var(--textM)' : 'var(--text)', lineHeight: 1.3 }}>{session.label}</div>
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11, color: 'var(--textM)', fontWeight: 700 }}>
          {done ? <DoneBadge /> : available
            ? <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · ~{fmtDuration(session.duration)}</span>
            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--amber)' }}><Clock size={11} /> Available at {slot.time}</span>}
        </div>
      </div>
      <Link to={sessionUrl(dayNum, slot.which)} style={done ? outlineBtn : { ...outlineBtn, color: 'var(--green)', borderColor: 'var(--green)', borderBottomColor: 'var(--greenD)' }}>
        {done ? <><RotateCcw size={12} /> Redo</> : 'Start'}
      </Link>
    </div>
  )
}

function findMock(plan, fromDay, startDate, dayNum) {
  const m = plan.find(d => d.dayType === 'mock' && d.day >= Math.max(1, fromDay))
  if (!m) return null
  return { day: m.day, date: addDays(startDate, m.day - 1), inDays: m.day - dayNum }
}

function PlanFooter({ mock, note }) {
  let left = null
  if (mock) {
    const when = mock.inDays === 0 ? 'today' : mock.inDays === 1 ? 'tomorrow' : mock.inDays > 1 ? `in ${mock.inDays} days` : ''
    left = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <ClipboardList size={18} color="var(--green)" style={{ flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Mock test on Day {mock.day}</div>
          <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700 }}>{fmtDate(mock.date)}{when ? ` · ${when}` : ''}</div>
        </div>
      </div>
    )
  } else if (note) {
    left = <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>{note}</div>
  }
  return (
    <div style={{ ...quietCard, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: left ? 'space-between' : 'flex-end', gap: 12, flexWrap: 'wrap' }}>
      {left}
      <Link to="/today/plan" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 900, color: 'var(--blue)', textDecoration: 'none', padding: '6px 0', minHeight: 32 }}>
        <CalendarDays size={15} /> See full plan <ChevronRight size={14} />
      </Link>
    </div>
  )
}

const outlineBtn = {
  flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
  padding: '9px 14px', borderRadius: 12, minHeight: 40,
  border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)',
  background: 'var(--bg2)', color: 'var(--textM)',
  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer',
  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.4px',
}
