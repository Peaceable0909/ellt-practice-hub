import { Card, Chip } from './ui'

const SKILLS = [
  { key:'listening', label:'Listening', icon:'🎧', color:'var(--blue)',   borderColor:'var(--blueD)',   bg:'var(--blueBg)',  desc:'6 tests' },
  { key:'reading',   label:'Reading',   icon:'📖', color:'var(--amber)',  borderColor:'#cc7700',        bg:'var(--amberBg)', desc:'8 tests' },
  { key:'writing',   label:'Writing',   icon:'✍️', color:'var(--purple)', borderColor:'var(--purpleD)', bg:'var(--purpleBg)',desc:'7 tasks' },
  { key:'speaking',  label:'Speaking',  icon:'🎤', color:'var(--coral)',  borderColor:'#cc3333',        bg:'var(--coralBg)', desc:'7 topics' },
]

export default function Home({ setPage, results, profile }) {
  const name = profile?.full_name?.split(' ')[0] || 'there'
  const totalTests = results.length
  const xp = results.reduce((s, r) => s + (r.score || 0) * 10, 0)
  const streak = 1

  // Skill scores
  const bySkill = {}
  results.forEach(r => { if (!bySkill[r.skill]) bySkill[r.skill] = []; bySkill[r.skill].push(r) })
  const skillBand = s => {
    const arr = bySkill[s] || []
    if (!arr.length) return null
    return (arr.reduce((t, r) => t + (r.band_score || 0), 0) / arr.length).toFixed(1)
  }
  const skillPct = s => {
    const band = skillBand(s)
    if (!band) return 0
    const testsInSkill = (bySkill[s] || []).length
    const totalInSkill = { listening: 6, reading: 8, writing: 7, speaking: 7 }[s] || 7
    return Math.min(100, Math.round((testsInSkill / totalInSkill) * 100))
  }

  return (
    <div className="app-container">
      {/* Welcome banner */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
          {totalTests === 0 ? `Let's start learning, ${name}! 🌟` : `Keep it up, ${name}! 🔥`}
        </div>
        <div style={{ fontSize: 15, color: 'var(--textM)', fontWeight: 600 }}>
          {totalTests === 0 ? 'Choose a skill below to begin your first lesson.' : `You've completed ${totalTests} tests. ${streak} day streak — amazing!`}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { icon: '🔥', val: `${streak}`, label: 'Day streak', col: 'var(--streak)', bg: 'var(--amberBg)' },
          { icon: '⚡', val: xp, label: 'Total XP', col: 'var(--xp)', bg: 'var(--purpleBg)' },
          { icon: '📋', val: totalTests, label: 'Tests done', col: 'var(--green)', bg: 'var(--greenBg)' },
          { icon: '🎯', val: totalTests ? (results.reduce((s,r)=>s+(r.band_score||0),0)/totalTests).toFixed(1) : '—', label: 'Avg band', col: 'var(--blue)', bg: 'var(--blueBg)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `2px solid ${s.col}44`, borderBottom: `4px solid ${s.col}88`, borderRadius: 16, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.col }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skill path */}
      <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--textM)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>
        Practice by Skill
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        {SKILLS.map(s => {
          const band = skillBand(s.key)
          const pct = skillPct(s.key)
          const count = (bySkill[s.key] || []).length
          return (
            <div key={s.key} onClick={() => setPage('Practice')}
              style={{ background: 'var(--bg2)', border: `2px solid ${s.color}44`, borderBottom: `4px solid ${s.borderColor}66`, borderRadius: 20, padding: 20, cursor: 'pointer', transition: 'transform .15s', }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: s.bg, border: `2px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {s.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{band || '—'}</div>
                  <div style={{ fontSize: 10, color: 'var(--textD)', fontWeight: 700, textTransform: 'uppercase' }}>band</div>
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600, marginBottom: 10 }}>{s.desc} · {count} completed</div>
              {/* XP bar */}
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${pct}%`, background: s.color }}/>
              </div>
              <div style={{ fontSize: 10, color: 'var(--textM)', fontWeight: 700, marginTop: 5, textAlign: 'right' }}>{pct}%</div>
            </div>
          )
        })}
      </div>

      {/* Mock test CTA */}
      <div style={{ background: 'linear-gradient(135deg, var(--greenBg), var(--blueBg))', border: '2px solid var(--green)', borderBottom: '4px solid var(--greenD)', borderRadius: 20, padding: 22, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>📋 Full Mock Test</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>All 4 sections · Voice recording for Speaking · AI band score</div>
        </div>
        <button onClick={() => setPage('Mock Tests')} className="duo-btn duo-btn-green">
          Start Mock Test →
        </button>
      </div>

      {/* My Plan CTA */}
      <div style={{ background: 'var(--purpleBg)', border: '2px solid var(--purple)', borderBottom: '4px solid var(--purpleD)', borderRadius: 20, padding: 22, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>📅 My Learning Plan</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>Choose 1 week to 1 month · Daily schedule · Email reminders</div>
        </div>
        <button onClick={() => setPage('My Plan')} className="duo-btn" style={{ background: 'var(--purple)', color: '#fff', borderBottom: '4px solid var(--purpleD)' }}>
          Set My Plan →
        </button>
      </div>

      {/* Recent activity */}
      {results.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--textM)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.slice(0, 5).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {{ listening:'🎧', reading:'📖', writing:'✍️', speaking:'🎤' }[r.skill]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{r.test_title}</div>
                  <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {new Date(r.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                {r.score != null && <span style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>{r.score}/{r.total}</span>}
                <div style={{ background: r.band_score >= 7 ? 'var(--greenBg)' : r.band_score >= 5.5 ? 'var(--amberBg)' : 'var(--coralBg)', border: `2px solid ${r.band_score >= 7 ? 'var(--green)' : r.band_score >= 5.5 ? 'var(--amber)' : 'var(--coral)'}`, borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 900, color: r.band_score >= 7 ? 'var(--green)' : r.band_score >= 5.5 ? 'var(--amber)' : 'var(--coral)' }}>
                  {r.band_score}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalTests === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg3)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🦉</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>Ready to begin?</div>
          <div style={{ fontSize: 14, color: 'var(--textM)', fontWeight: 600, marginBottom: 20 }}>Start your first practice test above and watch your band score grow!</div>
          <button onClick={() => setPage('Practice')} className="duo-btn duo-btn-green">Start Practising →</button>
        </div>
      )}
    </div>
  )
}
