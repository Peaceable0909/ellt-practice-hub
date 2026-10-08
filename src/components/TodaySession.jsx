import { Navigate, useNavigate, useParams } from 'react-router-dom'
import StudySession from './StudySession'
import { useSchedule, buildSession, getDaySlots, sessionKey } from '../lib/useSchedule'

const SLOTS = ['morning', 'noon', 'evening']

// Route element for /today/session/:dayNum/:slot. Runs one plan session with StudySession.
//
// The session is marked done in the shared schedule the moment its last task is finished
// (markDone updates the store synchronously), so by the time the student taps Back to
// Today, Today already shows it ticked and the next session as Up next.
export default function TodaySession({ results, addResult, userId }) {
  const { dayNum: dayParam, slot } = useParams()
  const navigate = useNavigate()
  const { schedule, loading, status, plan, dayNum, completed, markDone } = useSchedule()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--textM)', fontSize: 14, fontWeight: 700 }}>
      Loading your session...
    </div>
  )

  const day = Number(dayParam)
  if (!schedule || status === 'none') return <Navigate to="/today" replace />
  if (!Number.isInteger(day) || !SLOTS.includes(slot)) return <Navigate to="/today" replace />

  const dayData = plan.find(d => d.day === day)
  const session = buildSession(dayData, slot)
  // Unknown day/slot (e.g. no afternoon session on this plan), or a day that has not happened yet
  if (!session || day > dayNum) return <Navigate to="/today" replace />

  // What Today will show as Up next once this session counts as done: the first of today's
  // sessions that is not done yet (this one excluded, whether or not it is ticked already).
  const todaysSlots = status === 'active' ? getDaySlots(plan.find(d => d.day === dayNum), schedule) : []
  const nextSlot = todaysSlots.find(s => !completed[sessionKey(dayNum, s.which)] && !(dayNum === day && s.which === slot))
  const upNext = nextSlot ? { label: nextSlot.label, time: nextSlot.time, title: nextSlot.session.label } : null

  return (
    <StudySession
      key={session.key}
      session={session}
      results={results}
      addResult={addResult}
      userId={userId}
      upNext={upNext}
      onFinish={() => markDone(session.key)}
      onComplete={() => navigate('/today', { replace: true })}
      // A catch-up on an earlier day is not visible on Today: offer the plan on that day
      onViewPlan={day < dayNum ? () => navigate(`/today/plan?day=${day}`, { replace: true }) : undefined}
      onBack={() => navigate('/today')}
    />
  )
}
