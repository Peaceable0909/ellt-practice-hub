import { useMemo, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Headphones, BookOpen, PenLine, Mic, TrendingUp,
         CheckCircle, XCircle, BarChart2, AlertTriangle } from 'lucide-react'
import { LISTENING, LISTENING_IELTS, LISTENING_CAM17_T1, LISTENING_CAM17_T2,
         LISTENING_CAM17_T3, LISTENING_CAM17_T4, LISTENING_CAM17_EXTRA } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'

const ALL_L = [...LISTENING, ...(LISTENING_IELTS||[]), ...(LISTENING_CAM17_T1||[]),
  ...(LISTENING_CAM17_T2||[]), ...(LISTENING_CAM17_T3||[]), ...(LISTENING_CAM17_T4||[]),
  ...(LISTENING_CAM17_EXTRA||[])]
const ALL_R = [...(READING||[]), ...(READING_IELTS||[])]
const TEST_POOL = [...ALL_L, ...ALL_R]

const SKILL_COLOR  = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)' }
const SKILL_ICON   = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }
const SKILL_LABEL  = { listening:'Listening', reading:'Reading', writing:'Writing', speaking:'Speaking' }

function avgBand(arr) {
  const r = arr.filter(x => x.band_score > 0)
  return r.length ? (r.reduce((s,x) => s + parseFloat(x.band_score), 0) / r.length).toFixed(1) : null
}

function pct(arr) {
  const r = arr.filter(x => x.total > 0)
  return r.length ? Math.round(r.reduce((s,x) => s + x.score/x.total, 0) / r.length * 100) : null
}

// Cross-reference answers against test data to get question-level pass/fail
function analyseAnswers(results) {
  const wrongByType = { mcq:0, fill:0 }
  const totalByType = { mcq:0, fill:0 }
  const wrongQuestions = []

  results.forEach(r => {
    if (!r.answers) return
    const test = TEST_POOL.find(t => t.id === r.test_id)
    if (!test?.qs) return
    let answers = {}
    try { answers = typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers } catch { return }

    test.qs.forEach((q, i) => {
      const given   = answers[i]
      const correct = q.a
      const type    = q.type === 'fill' ? 'fill' : 'mcq'
      if (given === undefined || given === null || given === '') return
      totalByType[type]++

      let isWrong = false
      if (Array.isArray(correct)) {
        isWrong = !correct.includes(given)
      } else if (type === 'fill') {
        isWrong = typeof given === 'string' && given.toUpperCase().trim() !== String(correct).toUpperCase()
      } else {
        isWrong = given !== correct
      }

      if (isWrong) {
        wrongByType[type]++
        if (wrongQuestions.length < 20) {
          wrongQuestions.push({
            q: q.q?.replace(/^Q\d+\.\s*/, '') || '',
            given, correct, opts: q.opts || null,
            testTitle: r.test_title || r.test_id,
            skill: r.skill, type,
          })
        }
      }
    })
  })

  const mcqAcc  = totalByType.mcq > 0  ? Math.round((1 - wrongByType.mcq/totalByType.mcq)*100) : null
  const fillAcc = totalByType.fill > 0 ? Math.round((1 - wrongByType.fill/totalByType.fill)*100) : null

  return { wrongByType, totalByType, wrongQuestions, mcqAcc, fillAcc }
}

// Build trend data from results (last 10)
function trendData(arr) {
  return [...arr].reverse().slice(0, 10).map((r, i) => ({
    n: i + 1,
    band: r.band_score > 0 ? parseFloat(r.band_score) : null,
    pct:  r.total > 0 ? Math.round(r.score / r.total * 100) : null,
    title: r.test_title || r.test_id,
    date: r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'recent',
  }))
}

// ── COMPONENTS ──────────────────────────────────────────────────────────────

function StatChip({ label, value, color, icon: Icon }) {
  return (
    <div style={{ flex:1, minWidth:0, padding:'14px', background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, boxShadow:'var(--shadow)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:24, fontWeight:900, color: color || 'var(--text)' }}>{value ?? '—'}</div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
        </div>
        {Icon && <Icon size={18} color={color || 'var(--textM)'} />}
      </div>
    </div>
  )
}

function WrongAnswerCard({ w, i }) {
  const col = SKILL_COLOR[w.skill] || 'var(--textM)'
  return (
    <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:12, padding:'12px 14px', boxShadow:'var(--shadow)' }}>
      <div style={{ fontSize:10, fontWeight:700, color:col, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:5 }}>
        {w.testTitle}
      </div>
      <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', lineHeight:1.5, marginBottom:8 }}>{w.q || `Question ${i+1}`}</div>
      {w.opts ? (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {w.given !== undefined && w.given !== null && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'var(--coralBg)', borderRadius:8 }}>
              <XCircle size={12} color="var(--coral)" />
              <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>
                You chose: <strong>{w.opts[w.given] ?? `Option ${w.given}`}</strong>
              </span>
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'var(--greenBg)', borderRadius:8 }}>
            <CheckCircle size={12} color="var(--green)" />
            <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>
              Correct: <strong>{Array.isArray(w.correct) ? w.correct.map(c => w.opts[c]).join(' or ') : w.opts[w.correct]}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {w.given !== undefined && (
            <div style={{ padding:'6px 10px', background:'var(--coralBg)', borderRadius:8, fontSize:12, color:'var(--coral)', fontWeight:700 }}>
              You wrote: {String(w.given)}
            </div>
          )}
          <div style={{ padding:'6px 10px', background:'var(--greenBg)', borderRadius:8, fontSize:12, color:'var(--green)', fontWeight:700 }}>
            Correct: {String(w.correct)}
          </div>
        </div>
      )}
    </div>
  )
}

function FeedbackCard({ r }) {
  const col = SKILL_COLOR[r.skill] || 'var(--purple)'
  if (!r.feedback) return null
  const lines = r.feedback.split('\n').filter(l => l.trim().length > 15).slice(0, 6)
  return (
    <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:12, padding:'14px', boxShadow:'var(--shadow)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:'var(--text)' }}>{r.test_title || r.test_id}</div>
          <div style={{ fontSize:11, color:'var(--textM)', marginTop:2 }}>
            {r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : 'Recent'}
          </div>
        </div>
        {r.band_score > 0 && (
          <div style={{ fontSize:18, fontWeight:900, color:r.band_score>=7?'var(--green)':r.band_score>=5.5?'var(--amber)':'var(--coral)' }}>
            Band {r.band_score}
          </div>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize:12, color:'var(--text)', lineHeight:1.6, paddingLeft:10, borderLeft:`2px solid color-mix(in srgb, ${col} 30%, var(--border))`, fontWeight:l.includes(':') ? 700 : 600 }}>
            {l.trim()}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SKILL TABS ───────────────────────────────────────────────────────────────

function ListeningReadingTab({ results, skill }) {
  const col       = SKILL_COLOR[skill]
  const avg       = avgBand(results) || pct(results)
  const pass      = pct(results)
  const trend     = useMemo(() => trendData(results), [results])
  const analysis  = useMemo(() => analyseAnswers(results), [results])

  if (!results.length) return (
    <div style={{ textAlign:'center', padding:40, color:'var(--textM)', fontSize:14, fontWeight:700 }}>
      No {SKILL_LABEL[skill]} tests completed yet
    </div>
  )

  const mcqWrong  = analysis.totalByType.mcq  > 0 ? Math.round(analysis.wrongByType.mcq/analysis.totalByType.mcq*100) : 0
  const fillWrong = analysis.totalByType.fill > 0 ? Math.round(analysis.wrongByType.fill/analysis.totalByType.fill*100) : 0

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        <StatChip label="Tests Done" value={results.length} color={col} icon={BarChart2} />
        <StatChip label="Avg Score" value={pass!=null?`${pass}%`:null} color={pass>=70?'var(--green)':pass>=50?'var(--amber)':'var(--coral)'} icon={TrendingUp} />
        <StatChip label="Questions" value={analysis.totalByType.mcq+analysis.totalByType.fill} color={col} />
      </div>

      {/* Question type accuracy */}
      {(analysis.totalByType.mcq > 0 || analysis.totalByType.fill > 0) && (
        <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:16, boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Accuracy by Question Type</div>
          {analysis.totalByType.mcq > 0 && (
            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>Multiple Choice ({analysis.totalByType.mcq} questions)</span>
                <span style={{ fontSize:12, fontWeight:900, color:mcqWrong<=30?'var(--green)':mcqWrong<=50?'var(--amber)':'var(--coral)' }}>{100-mcqWrong}% correct</span>
              </div>
              <div style={{ height:8, background:'var(--bg3)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${100-mcqWrong}%`, background:mcqWrong<=30?'var(--green)':mcqWrong<=50?'var(--amber)':'var(--coral)', borderRadius:99 }} />
              </div>
            </div>
          )}
          {analysis.totalByType.fill > 0 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>Fill in the Blank ({analysis.totalByType.fill} questions)</span>
                <span style={{ fontSize:12, fontWeight:900, color:fillWrong<=30?'var(--green)':fillWrong<=50?'var(--amber)':'var(--coral)' }}>{100-fillWrong}% correct</span>
              </div>
              <div style={{ height:8, background:'var(--bg3)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${100-fillWrong}%`, background:fillWrong<=30?'var(--green)':fillWrong<=50?'var(--amber)':'var(--coral)', borderRadius:99 }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Score trend */}
      {trend.length > 1 && (
        <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:16, boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Score Trend (last {trend.length} tests)</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trend} margin={{top:5,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{fontSize:9,fill:'var(--textM)'}} />
              <YAxis tick={{fontSize:9,fill:'var(--textM)'}} domain={[0,100]} tickFormatter={v=>`${v}%`} />
              <Tooltip formatter={v=>`${v}%`} labelFormatter={(_,p)=>p?.[0]?.payload?.title||''} />
              <Line type="monotone" dataKey="pct" stroke={col} strokeWidth={2.5} dot={{fill:col,r:3}} name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Wrong questions */}
      {analysis.wrongQuestions.length > 0 && (
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>
            Questions You Got Wrong ({analysis.wrongQuestions.length})
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {analysis.wrongQuestions.map((w, i) => <WrongAnswerCard key={i} w={w} i={i} />)}
          </div>
        </div>
      )}

      {/* Test history */}
      <div>
        <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Test History</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {results.slice(0, 10).map((r, i) => {
            const scorePct = r.total > 0 ? Math.round(r.score/r.total*100) : null
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:12, boxShadow:'var(--shadow)' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title || r.test_id}</div>
                  <div style={{ fontSize:11, color:'var(--textM)', marginTop:2 }}>{r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Recent'}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:900, color:scorePct>=70?'var(--green)':scorePct>=50?'var(--amber)':'var(--coral)' }}>
                    {scorePct!=null ? `${scorePct}%` : '—'}
                  </div>
                  {r.score!=null&&r.total>0 && <div style={{ fontSize:10, color:'var(--textM)', fontWeight:600 }}>{r.score}/{r.total}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function WritingSpeakingTab({ results, skill }) {
  const col   = SKILL_COLOR[skill]
  const band  = avgBand(results)
  const trend = useMemo(() => trendData(results), [results])

  if (!results.length) return (
    <div style={{ textAlign:'center', padding:40, color:'var(--textM)', fontSize:14, fontWeight:700 }}>
      No {SKILL_LABEL[skill]} tests completed yet
    </div>
  )

  const withFeedback = results.filter(r => r.feedback)
  const bands = results.filter(r => r.band_score > 0).map(r => parseFloat(r.band_score))
  const best  = bands.length ? Math.max(...bands).toFixed(1) : null
  const worst = bands.length ? Math.min(...bands).toFixed(1) : null

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        <StatChip label="Tests Done" value={results.length} color={col} icon={BarChart2} />
        <StatChip label="Avg Band"   value={band ? `Band ${band}` : null} color={parseFloat(band)>=7?'var(--green)':parseFloat(band)>=5.5?'var(--amber)':'var(--coral)'} icon={TrendingUp} />
        <StatChip label="Best Band"  value={best ? `Band ${best}` : null} color="var(--green)" icon={CheckCircle} />
      </div>

      {/* Band score trend */}
      {trend.length > 1 && (
        <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:16, boxShadow:'var(--shadow)' }}>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Band Score Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trend} margin={{top:5,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{fontSize:9,fill:'var(--textM)'}} />
              <YAxis tick={{fontSize:9,fill:'var(--textM)'}} domain={[3,9]} ticks={[3,4,5,6,7,8,9]} />
              <Tooltip formatter={v=>`Band ${v}`} labelFormatter={(_,p)=>p?.[0]?.payload?.title||''} />
              <Line type="monotone" dataKey="band" stroke={col} strokeWidth={2.5} dot={{fill:col,r:3}} name="Band" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            {['B1 (5)','B2 (6)','C1 (7.5)','C2 (9)'].map(l => (
              <span key={l} style={{ fontSize:9, color:'var(--textD)', fontWeight:600 }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Feedback analysis */}
      {withFeedback.length > 0 && (
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>
            AI Feedback History ({withFeedback.length} sessions)
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {withFeedback.slice(0, 5).map((r, i) => <FeedbackCard key={i} r={r} />)}
          </div>
        </div>
      )}

      {/* History without feedback */}
      {results.filter(r => !r.feedback).length > 0 && (
        <div>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Other Submissions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {results.filter(r => !r.feedback).slice(0,5).map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:12, boxShadow:'var(--shadow)' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title || r.test_id}</div>
                  <div style={{ fontSize:11, color:'var(--textM)', marginTop:2 }}>{r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Recent'}</div>
                </div>
                {r.band_score > 0 && (
                  <div style={{ fontSize:16, fontWeight:900, color:r.band_score>=7?'var(--green)':r.band_score>=5.5?'var(--amber)':'var(--coral)' }}>Band {r.band_score}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OverviewTab({ results, streak }) {
  const skills = ['listening','reading','writing','speaking']
  const now = new Date()

  const activityData = useMemo(() => Array.from({length:7}, (_,i) => {
    const d = new Date(now - (6-i)*86400000); d.setHours(0,0,0,0)
    const next = new Date(d.getTime()+86400000)
    const count = results.filter(r => { const t=new Date(r.completed_at||now); return t>=d&&t<next }).length
    return { day: d.toLocaleDateString('en-GB',{weekday:'short'}), tests:count }
  }), [results])

  const overall = results.filter(r=>r.band_score>0).length
    ? (results.filter(r=>r.band_score>0).reduce((s,r)=>s+parseFloat(r.band_score),0)/results.filter(r=>r.band_score>0).length).toFixed(1)
    : null

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Top stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        <StatChip label="Tests Done"   value={results.length}              color="var(--blue)"   icon={BarChart2}   />
        <StatChip label="Avg Band"     value={overall?`Band ${overall}`:null} color="var(--green)"  icon={TrendingUp}  />
        <StatChip label="Day Streak"   value={streak}                      color="var(--amber)"  icon={AlertTriangle} />
      </div>

      {/* Skill summary */}
      <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:16, boxShadow:'var(--shadow)' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Performance by Skill</div>
        {skills.map(skill => {
          const sr   = results.filter(r=>r.skill===skill)
          const col  = SKILL_COLOR[skill]
          const Icon = SKILL_ICON[skill]
          const band = avgBand(sr)
          const pc   = pct(sr)
          const display = band ? `Band ${band}` : pc!=null ? `${pc}%` : null
          const pctNum = band ? (parseFloat(band)/9)*100 : pc
          return (
            <div key={skill} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <Icon size={14} color={col} />
                  <span style={{ fontSize:13, fontWeight:800, color:'var(--text)' }}>{SKILL_LABEL[skill]}</span>
                  <span style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>({sr.length} tests)</span>
                </div>
                <span style={{ fontSize:14, fontWeight:900, color:pctNum>=78?'var(--green)':pctNum>=55?'var(--amber)':'var(--coral)' }}>{display || '—'}</span>
              </div>
              <div style={{ height:7, background:'var(--bg3)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.min(100, pctNum||0)}%`, background:pctNum>=78?'var(--green)':pctNum>=55?'var(--amber)':'var(--coral)', borderRadius:99, transition:'width 1s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* 7-day activity */}
      <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:16, boxShadow:'var(--shadow)' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Activity — Last 7 Days</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={activityData} margin={{top:5,right:10,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{fontSize:10,fill:'var(--textM)'}} />
            <YAxis tick={{fontSize:10,fill:'var(--textM)'}} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="tests" fill="var(--green)" radius={[5,5,0,0]} name="Tests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function Progress({ results = [], loading, streak = 0 }) {
  const [tab, setTab] = useState('overview')

  const bySkill = useMemo(() => ({
    listening: results.filter(r => r.skill === 'listening'),
    reading:   results.filter(r => r.skill === 'reading'),
    writing:   results.filter(r => r.skill === 'writing'),
    speaking:  results.filter(r => r.skill === 'speaking'),
  }), [results])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80 }}>
      <div style={{ fontSize:14, fontWeight:700, color:'var(--textM)' }}>Loading your progress...</div>
    </div>
  )

  const TABS = [
    { key:'overview',   label:'Overview'   },
    { key:'listening',  label:'Listening'  },
    { key:'reading',    label:'Reading'    },
    { key:'writing',    label:'Writing'    },
    { key:'speaking',   label:'Speaking'   },
  ]

  const tabColor = tab === 'overview' ? 'var(--blue)' : SKILL_COLOR[tab] || 'var(--blue)'

  return (
    <div className="app-container anim-fadeUp" style={{ paddingBottom:100 }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:900, color:'var(--text)' }}>My Progress</div>
        <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginTop:2 }}>
          {results.length} tests completed across all skills
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:18, overflowX:'auto', paddingBottom:4 }}>
        {TABS.map(({ key, label }) => {
          const active = tab === key
          const col = key === 'overview' ? 'var(--blue)' : SKILL_COLOR[key]
          const count = key !== 'overview' ? bySkill[key].length : null
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              padding:'9px 14px', borderRadius:10, flexShrink:0, fontFamily:'Nunito, sans-serif',
              border: active ? `2px solid ${col}` : '2px solid var(--border)',
              borderBottom: active ? `3px solid ${col}` : '3px solid var(--borderB)',
              background: active ? `color-mix(in srgb, ${col} 10%, var(--bg2))` : 'var(--bg2)',
              color: active ? col : 'var(--textM)',
              fontWeight: active ? 900 : 700, fontSize:12, cursor:'pointer',
              boxShadow: active ? `0 0 0 2px color-mix(in srgb, ${col} 15%, transparent)` : 'var(--shadow)',
            }}>
              {label}{count !== null ? ` (${count})` : ''}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {tab === 'overview' && <OverviewTab results={results} streak={streak} />}
      {tab === 'listening' && <ListeningReadingTab results={bySkill.listening} skill="listening" />}
      {tab === 'reading'   && <ListeningReadingTab results={bySkill.reading}   skill="reading"   />}
      {tab === 'writing'   && <WritingSpeakingTab  results={bySkill.writing}   skill="writing"   />}
      {tab === 'speaking'  && <WritingSpeakingTab  results={bySkill.speaking}  skill="speaking"  />}
    </div>
  )
}
