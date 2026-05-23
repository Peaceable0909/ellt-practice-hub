import { useState } from 'react'
import { Card, Chip } from './ui'
import FullMockTest from './FullMockTest'

function fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
}

export default function MockTests({ results, addResult, userId }) {
  const [running, setRunning] = useState(false)

  if (running) {
    return <FullMockTest userId={userId} addResult={addResult} onExit={() => setRunning(false)}/>
  }

  // Find completed mock tests (grouped by mock_test_id)
  const mockGroups = {}
  results.filter(r => r.is_mock && r.mock_test_id).forEach(r => {
    if (!mockGroups[r.mock_test_id]) mockGroups[r.mock_test_id] = []
    mockGroups[r.mock_test_id].push(r)
  })
  const completedMocks = Object.values(mockGroups)
    .filter(g => g.length >= 4)
    .map(g => {
      const avg = (g.reduce((s,r) => s+(r.band_score||0),0)/g.length).toFixed(1)
      const date = g.sort((a,b) => new Date(b.completed_at)-new Date(a.completed_at))[0].completed_at
      return { group:g, avg, date }
    })
    .sort((a,b) => new Date(b.date)-new Date(a.date))

  return (
    <div className="app-container">
      <h2 style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:4 }}>Mock Tests</h2>
      <p style={{ color:'var(--textM)', fontSize:13, marginBottom:24 }}>
        Full Oxford ELLT simulation — all 4 sections back to back, scores revealed at the end only.
      </p>

      {/* Main CTA */}
      <div style={{ background:'linear-gradient(135deg,var(--tealBg),var(--blueBg))',
        border:'1px solid var(--tealBr)', borderRadius:14, padding:24, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:6 }}>
              Oxford ELLT Full Mock Test
            </div>
            <div style={{ fontSize:13, color:'var(--textM)', marginBottom:10 }}>
              🎧 Listening · 📖 Reading · ✍️ Writing · 🎤 Speaking
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              <Chip text="Sequential sections" color="var(--teal)"/>
              <Chip text="~105 min total" color="var(--amber)"/>
              <Chip text="AI scored" color="var(--purple)"/>
              <Chip text="Voice recording" color="var(--coral)"/>
            </div>
          </div>
          <button onClick={() => setRunning(true)} style={{
            padding:'14px 32px', borderRadius:10, border:'none',
            background:'linear-gradient(135deg,var(--teal),var(--blue))',
            color:'#000', fontWeight:700, fontSize:15, cursor:'pointer',
            fontFamily:'inherit', whiteSpace:'nowrap' }}>
            Start Full Mock →
          </button>
        </div>
      </div>

      {/* What to expect */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12, marginBottom:28 }}>
        {[
          { icon:'🎧', name:'Listening', time:'20 min', note:'Audio plays once — answer 8 questions', col:'var(--blue)' },
          { icon:'📖', name:'Reading',   time:'30 min', note:'Full passage + 16 comprehension questions', col:'var(--amber)' },
          { icon:'✍️', name:'Writing',   time:'45 min', note:'Essay task — AI scores your response', col:'var(--purple)' },
          { icon:'🎤', name:'Speaking',  time:'10 min', note:'Speak aloud — voice is captured & AI scored', col:'var(--coral)' },
        ].map(s => (
          <Card key={s.name} style={{ borderColor:`${s.col}33` }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{s.name}</div>
            <div style={{ fontSize:11, color:s.col, fontWeight:600, marginBottom:4 }}>{s.time}</div>
            <div style={{ fontSize:11, color:'var(--textM)', lineHeight:1.5 }}>{s.note}</div>
          </Card>
        ))}
      </div>

      {/* Past mock tests */}
      <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:12 }}>
        Your Mock Test History
      </div>
      {completedMocks.length === 0 ? (
        <Card style={{ textAlign:'center', padding:'32px 20px' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
          <div style={{ fontSize:14, color:'var(--textM)' }}>
            No mock tests completed yet.<br/>Start your first one above!
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {completedMocks.map((m,i) => (
            <Card key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--tealBg)',
                border:'1px solid var(--tealBr)', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:16, flexShrink:0 }}>📋</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>
                  Full Mock Test
                </div>
                <div style={{ fontSize:11, color:'var(--textM)', marginTop:2 }}>
                  {new Date(m.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} ·
                  {m.group.map(r => ` ${r.skill}`).join(',')}
                </div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {m.group.map(r => (
                  <Chip key={r.skill}
                    text={`${r.skill[0].toUpperCase()+r.skill.slice(1)} ${r.band_score}`}
                    color={{listening:'var(--blue)',reading:'var(--amber)',writing:'var(--purple)',speaking:'var(--coral)'}[r.skill]}/>
                ))}
              </div>
              <Chip text={`Overall ${m.avg}`} color={parseFloat(m.avg)>=7?'var(--teal)':parseFloat(m.avg)>=5.5?'var(--amber)':'var(--coral)'}/>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
