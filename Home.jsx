import { Card, Chip } from './ui'

const SKILL_COLORS = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)' }
const SKILL_ICONS  = { listening:'🎧', reading:'📖', writing:'✍️', speaking:'🎤' }

export default function Home({ setPage, results, profile }) {
  const totalTests = results.length
  const overallBand = totalTests
    ? (results.reduce((s,r) => s+(r.band_score||0),0)/totalTests).toFixed(1) : '—'

  // Skill breakdowns
  const bySkill = {}
  results.forEach(r => {
    if (!bySkill[r.skill]) bySkill[r.skill] = []
    bySkill[r.skill].push(r)
  })
  const skillBand = skill => {
    const arr = bySkill[skill]||[]
    if (!arr.length) return null
    return (arr.reduce((s,r)=>s+(r.band_score||0),0)/arr.length).toFixed(1)
  }

  // Completed mock tests
  const mockGroups = {}
  results.filter(r=>r.is_mock&&r.mock_test_id).forEach(r => {
    if (!mockGroups[r.mock_test_id]) mockGroups[r.mock_test_id] = []
    mockGroups[r.mock_test_id].push(r)
  })
  const mockCount = Object.values(mockGroups).filter(g=>g.length>=2).length

  // Recent 5 results
  const recent = [...results].sort((a,b)=>new Date(b.completed_at)-new Date(a.completed_at)).slice(0,5)

  const name = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="app-container">
      {/* Welcome */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
          Welcome back, {name} 👋
        </h1>
        <p style={{ color:'var(--textM)', fontSize:14 }}>
          Here's your progress. Keep practising to improve your band score.
        </p>
      </div>

      {/* Top stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:24 }}>
        {[
          { v:overallBand, l:'Overall Band', col:'var(--teal)'   },
          { v:totalTests,  l:'Tests Done',   col:'var(--amber)'  },
          { v:mockCount,   l:'Mock Tests',   col:'var(--purple)' },
          { v:`${totalTests?Math.round(results.filter(r=>r.score!=null).reduce((s,r)=>s+(r.score/r.total||0),0)/Math.max(1,results.filter(r=>r.score!=null).length)*100):0}%`, l:'Accuracy', col:'var(--blue)' },
        ].map(s => (
          <Card key={s.l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:700, color:s.col, marginBottom:4 }}>{s.v}</div>
            <div style={{ fontSize:11, color:'var(--textM)' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Skill scores */}
      <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:12 }}>Skill Progress</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, marginBottom:24 }}>
        {['listening','reading','writing','speaking'].map(skill => {
          const band = skillBand(skill)
          const pct = band ? Math.min(100,(parseFloat(band)/9)*100) : 0
          const col = SKILL_COLORS[skill]
          const count = (bySkill[skill]||[]).length
          return (
            <Card key={skill} style={{ cursor:'pointer' }} onClick={() => setPage('Practice')}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>{SKILL_ICONS[skill]}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', textTransform:'capitalize' }}>{skill}</span>
                </div>
                <span style={{ fontSize:18, fontWeight:700, color:col }}>{band||'—'}</span>
              </div>
              <div style={{ height:5, background:'var(--border)', borderRadius:3, marginBottom:5 }}>
                <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:3, transition:'width .4s' }}/>
              </div>
              <div style={{ fontSize:11, color:'var(--textM)' }}>
                {count > 0 ? `${count} test${count>1?'s':''} taken` : 'Not started — click to practise'}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Mock test CTA */}
      <Card style={{ marginBottom:24, background:'linear-gradient(135deg,var(--tealBg),var(--blueBg))', borderColor:'var(--tealBr)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
              Take a Full Mock Test
            </div>
            <div style={{ fontSize:13, color:'var(--textM)' }}>
              All 4 sections back to back · Voice recording for Speaking · AI scored
            </div>
          </div>
          <button onClick={() => setPage('Mock Tests')} style={{
            padding:'10px 22px', borderRadius:8, border:'none',
            background:'linear-gradient(135deg,var(--teal),var(--blue))',
            color:'#000', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Start Mock Test →
          </button>
        </div>
      </Card>

      {/* Practice by skill */}
      <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:12 }}>Practice by Skill</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, marginBottom:24 }}>
        {[
          { k:'listening', label:'Listening', desc:'6 audio tests',  col:'var(--blue)'   },
          { k:'reading',   label:'Reading',   desc:'5 full passages',col:'var(--amber)'  },
          { k:'writing',   label:'Writing',   desc:'5 essay tasks',  col:'var(--purple)' },
          { k:'speaking',  label:'Speaking',  desc:'7 topics + AI',  col:'var(--coral)'  },
        ].map(s => (
          <Card key={s.k} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}
            onClick={() => setPage('Practice')}>
            <div style={{ fontSize:24 }}>{SKILL_ICONS[s.k]}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{s.label}</div>
              <div style={{ fontSize:11, color:'var(--textM)' }}>{s.desc}</div>
            </div>
            <div style={{ marginLeft:'auto', fontSize:11, color:s.col, fontWeight:600 }}>→</div>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:12 }}>
            Recent Activity
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {recent.map((r,i) => (
              <Card key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px' }}>
                <div style={{ width:34, height:34, borderRadius:8, flexShrink:0,
                  background:`${SKILL_COLORS[r.skill]}18`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                  {SKILL_ICONS[r.skill]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>
                    {r.test_title} {r.is_mock && <span style={{ fontSize:10, color:'var(--textD)' }}>(Mock)</span>}
                  </div>
                  <div style={{ fontSize:11, color:'var(--textM)' }}>
                    {new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                  </div>
                </div>
                {r.score != null && <span style={{ fontSize:12, color:'var(--textM)' }}>{r.score}/{r.total}</span>}
                <Chip text={`Band ${r.band_score}`}
                  color={r.band_score>=7?'var(--teal)':r.band_score>=5.5?'var(--amber)':'var(--coral)'}/>
              </Card>
            ))}
          </div>
        </>
      )}

      {totalTests === 0 && (
        <Card style={{ textAlign:'center', padding:'32px 20px', background:'var(--tealBg)', borderColor:'var(--tealBr)' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🎯</div>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text)', marginBottom:6 }}>
            Ready to start?
          </div>
          <div style={{ fontSize:13, color:'var(--textM)', marginBottom:16 }}>
            Take your first practice test or jump straight into a full mock exam.
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setPage('Practice')} style={{
              padding:'9px 20px', borderRadius:8, border:'none',
              background:'linear-gradient(135deg,var(--teal),var(--blue))',
              color:'#000', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Start Practising →
            </button>
            <button onClick={() => setPage('Mock Tests')} style={{
              padding:'9px 20px', borderRadius:8, border:'1px solid var(--border)',
              background:'transparent', color:'var(--textM)', fontWeight:600,
              fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Take Mock Test
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
