import { Navigate, useNavigate, useParams } from 'react-router-dom'
import StudySession from './StudySession'
import { useSchedule, buildSession } from '../lib/useSchedule'

const SLOTS = ['morning', 'noon', 'evening']

// Route element for /today/session/:dayNum/:slot. Runs one plan session with
// StudySession; finishing (after the grade screen) or leaving returns to /today.
export default function TodaySession({ results, addResult, userId }) {
  const { dayNum: dayParam, slot } = useParams()
  const navigate = useNavigate()
  const { schedule, loading, status, plan, dayNum, markDone } = useSchedule()

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

  return (
    <StudySession
      key={session.key}
      session={session}
      results={results}
      addResult={addResult}
      userId={userId}
      onComplete={() => {
        markDone(session.key)
        navigate('/today', { replace: true })
      }}
      onBack={() => navigate('/today')}
    />
  )
}
