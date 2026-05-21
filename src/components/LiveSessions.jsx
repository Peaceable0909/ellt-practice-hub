import { Card, Chip } from './ui'

const SESSIONS = [
  { title: 'IELTS Speaking Practice',        host: 'Dr. Emma Clarke',       time: 'Today, 4:00 PM',   type: 'Speaking',  pct: 67, col: 'var(--coral)'  },
  { title: 'Academic Writing Workshop',       host: 'Prof. James Adeyemi',   time: 'Tomorrow, 2:00 PM', type: 'Writing',   pct: 70, col: 'var(--purple)' },
  { title: 'Listening Strategies Masterclass',host: 'Ms. Priya Nair',        time: 'Thu, 6:00 PM',     type: 'Listening', pct: 73, col: 'var(--blue)'   },
  { title: 'Oxford ELLT Full Mock',           host: 'ELLTPulse Team',        time: 'Sat, 10:00 AM',    type: 'Mock',      pct: 45, col: 'var(--teal)'   },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_EVENTS = {
  Mon: { label: 'Speaking',  col: 'var(--coral)'  },
  Tue: { label: 'Writing',   col: 'var(--purple)' },
  Thu: { label: 'Listening', col: 'var(--blue)'   },
  Sat: { label: 'Mock Test', col: 'var(--teal)'   },
}

export default function LiveSessions() {
  return (
    <div className="app-container">
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Live Sessions</h2>
      <p style={{ color: 'var(--textM)', fontSize: 13, marginBottom: 22 }}>
        Join live group sessions with expert tutors for speaking practice, writing feedback, and full mock exams.
      </p>

      {/* Session cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        {SESSIONS.map((s, i) => (
          <Card key={i} style={{ borderColor: `${s.col}33` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Chip text={s.type} color={s.col} />
              <span style={{
                fontSize: 11,
                color: s.time.startsWith('Today') ? 'var(--teal)' : 'var(--textM)',
                fontWeight: s.time.startsWith('Today') ? 600 : 400,
              }}>
                {s.time}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--textM)', marginBottom: 12 }}>Hosted by {s.host}</div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${s.pct}%`, background: s.pct > 75 ? 'var(--coral)' : s.col, borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--textM)' }}>{s.pct}% full</span>
              <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${s.col}44`, background: `${s.col}12`, color: s.col, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                {s.time.startsWith('Today') ? 'Join Now →' : 'Reserve Spot'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly calendar */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
          Session Schedule — This Week
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {DAYS.map(day => {
            const ev = DAY_EVENTS[day]
            return (
              <div key={day} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--textM)', marginBottom: 6 }}>{day}</div>
                <div style={{
                  minHeight: 56, background: 'var(--bg3)', borderRadius: 8,
                  border: '1px solid var(--border)', padding: '6px 4px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 3,
                }}>
                  {ev ? (
                    <span style={{ fontSize: 10, color: ev.col, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{ev.label}</span>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--textD)' }}>—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Tutor profiles */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Our Expert Tutors</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { name: 'Dr. Emma Clarke',      spec: 'IELTS Speaking & Pronunciation', exp: '12 years',  col: 'var(--coral)'  },
            { name: 'Prof. James Adeyemi',  spec: 'Academic Writing & Task Achievement', exp: '9 years', col: 'var(--purple)' },
            { name: 'Ms. Priya Nair',       spec: 'Listening Strategies & Note-taking', exp: '7 years',  col: 'var(--blue)'   },
          ].map(t => (
            <Card key={t.name} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: `${t.col}22`, border: `1px solid ${t.col}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: t.col,
              }}>
                {t.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--textM)', marginTop: 2 }}>{t.spec}</div>
                <div style={{ fontSize: 10, color: 'var(--textD)', marginTop: 1 }}>{t.exp} experience</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
