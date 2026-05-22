import { Headphones, BookOpen, PenLine, Mic, Flame, Zap, ClipboardList,
         Target, TrendingUp, ChevronRight, Trophy, Calendar } from 'lucide-react'

const SKILLS = [
  { key:'listening', label:'Listening', Icon:Headphones, color:'var(--blue)',   borderColor:'var(--blueD)',  bg:'var(--blueBg)',   tests:6  },
  { key:'reading',   label:'Reading',   Icon:BookOpen,   color:'var(--amber)',  borderColor:'#cc7700',       bg:'var(--amberBg)',  tests:8  },
  { key:'writing',   label:'Writing',   Icon:PenLine,    color:'var(--purple)', borderColor:'var(--purpleD)',bg:'var(--purpleBg)', tests:7  },
  { key:'speaking',  label:'Speaking',  Icon:Mic,        color:'var(--coral)',  borderColor:'#cc3333',       bg:'var(--coralBg)',  tests:7  },
]

export default function Home({ setPage, results, profile }) {
  const name = profile?.full_name?.split(' ')[0] || 'there'
  const totalTests = results.length
  const xp = results.reduce((s, r) => s + (r.score || 0) * 10, 0)
  const streak = 1

  const bySkill = {}
  results.forEach(r => { if (!bySkill[r.skill]) bySkill[r.skill] = []; bySkill[r.skill].push(r) })
  const skillBand = s => {
    const arr = bySkill[s] || []
    if (!arr.length) return null
    return (arr.reduce((t, r) => t + (r.band_score || 0), 0) / arr.length).toFixed(1)
  }
  const skillPct = s => {
    const count = (bySkill[s] || []).length
    const total = { listening:6, reading:8, writing:7, speaking:7 }[s] || 7
    return Math.min(100, Math.round((count / total) * 100))
  }

  const overall = totalTests
    ? (results.reduce((s, r) => s + (r.band_score || 0), 0) / totalTests).toFixed(1)
    : null
  const accuracy = results.filter(r => r.score != null).length
    ? Math.round(results.filter(r => r.score != null).reduce((s, r) => s + r.score / r.total, 0) / results.filter(r => r.score != null).length * 100)
    : 0

  return (
    <div className="app-container fade-up">

      {/* Welcome */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
          {totalTests === 0 ? `Let's start, ${name}!` : `Keep going, ${name}!`}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--textM)', fontWeight: 600 }}>
          {totalTests === 0 ? 'Choose a skill below to begin.' : `${totalTests} tests completed — ${streak} day streak!`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 22 }}>
        {[
          { Icon: Flame,       val: streak,   label: 'Streak',    col: 'var(--streak)', bg: 'var(--amberBg)' },
          { Icon: Zap,         val: xp,       label: 'XP',        col: 'var(--xp)',     bg: 'var(--purpleBg)' },
          { Icon: ClipboardList,val: totalTests,label:'Tests',     col: 'var(--green)',  bg: 'var(--greenBg)' },
          { Icon: Trophy,      val: overall || '—', label:'Band', col: 'var(--blue)',   bg: 'var(--blueBg)' },
        ].map(({ Icon, val, label, col, bg }) => (
          <div key={label} style={{ background: bg, border: `2px solid ${col}44`, borderBottom: `4px solid ${col}88`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
            <Icon size={20} color={col} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: col, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 10, color: 'var(--textM)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--textM)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
        Practice by Skill
      </div>
      <div className="grid-2" style={{ marginBottom: 22 }}>
        {SKILLS.map(({ key, label, Icon, color, borderColor, bg, tests }) => {
          const band = skillBand(key)
          const pct = skillPct(key)
          const count = (bySkill[key] || []).length
          return (
            <div key={key} onClick={() => setPage('Practice')}
              style={{ background: 'var(--bg2)', border: `2px solid ${color}44`, borderBottom: `4px solid ${borderColor}66`, borderRadius: 16, padding: 16, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color }}>{band || '—'}</div>
                  <div style={{ fontSize: 9, color: 'var(--textD)', fontWeight: 700, textTransform: 'uppercase' }}>band</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 600, marginBottom: 8 }}>{count}/{tests} completed</div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 22 }}>
        <div onClick={() => setPage('Mock Tests')} style={{ background: 'var(--greenBg)', border: '2px solid var(--green)', borderBottom: '4px solid var(--greenD)', borderRadius: 16, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <ClipboardList size={18} color="var(--green)" />
              <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>Full Mock Test</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>All 4 skills · Voice recording · AI scored</div>
          </div>
          <ChevronRight size={20} color="var(--green)" />
        </div>

        <div onClick={() => setPage('My Plan')} style={{ background: 'var(--purpleBg)', border: '2px solid var(--purple)', borderBottom: '4px solid var(--purpleD)', borderRadius: 16, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Calendar size={18} color="var(--purple)" />
              <span style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>My Learning Plan</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>1 week to 1 month · Daily schedule · Email reminders</div>
          </div>
          <ChevronRight size={20} color="var(--purple)" />
        </div>
      </div>

      {/* Recent activity */}
      {results.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--textM)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
            Recent Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.slice(0, 5).map((r, i) => {
              const IconMap = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic }
              const ColMap  = { listening: 'var(--blue)', reading: 'var(--amber)', writing: 'var(--purple)', speaking: 'var(--coral)' }
              const ItemIcon = IconMap[r.skill] || BookOpen
              const col = ColMap[r.skill] || 'var(--blue)'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', borderRadius: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${col}18`, border: `2px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ItemIcon size={18} color={col} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.test_title}</div>
                    <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 600 }}>
                      {new Date(r.completed_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                    </div>
                  </div>
                  {r.score != null && <span style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700, flexShrink: 0 }}>{r.score}/{r.total}</span>}
                  <div style={{ background: r.band_score>=7?'var(--greenBg)':r.band_score>=5.5?'var(--amberBg)':'var(--coralBg)', border: `2px solid ${r.band_score>=7?'var(--green)':r.band_score>=5.5?'var(--amber)':'var(--coral)'}`, borderRadius: 8, padding: '4px 8px', fontSize: 13, fontWeight: 900, color: r.band_score>=7?'var(--green)':r.band_score>=5.5?'var(--amber)':'var(--coral)', flexShrink: 0 }}>
                    {r.band_score}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {totalTests === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--bg3)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 20 }}>
          <Target size={40} color="var(--green)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>Ready to begin?</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginBottom: 20 }}>Start your first practice test and watch your band score grow.</div>
          <button onClick={() => setPage('Practice')} className="duo-btn duo-btn-green" style={{ maxWidth: 260, margin: '0 auto' }}>Start Practising</button>
        </div>
      )}
    </div>
  )
}
