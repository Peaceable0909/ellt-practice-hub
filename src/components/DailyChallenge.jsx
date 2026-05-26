import { useState, useMemo } from 'react'
import { CheckCircle, XCircle, Zap, Trophy, Star } from 'lucide-react'
import { LISTENING, LISTENING_IELTS } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'
import Confetti from './Confetti'

// ─── Seeded random — same questions for everyone on the same day ──────────────
function seeded(n) {
  let x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

function pickQuestions(dateStr) {
  const seed = dateStr.split('-').reduce((a, b) => a * 100 + parseInt(b), 0)

  // Build a pool of MCQ + fill-in questions from listening and reading data
  const pool = []

  const sources = [
    ...LISTENING.slice(0,6),
    ...LISTENING_IELTS.slice(0,6),
    ...READING.slice(0,5),
    ...(READING_IELTS||[]).slice(0,3),
  ]

  sources.forEach(test => {
    if (!test.qs) return
    test.qs.forEach((q, qi) => {
      // Only MCQ for daily challenge (clean, immediate feedback)
      if (!q.opts || Array.isArray(q.a)) return
      pool.push({
        id: `${test.id}_${qi}`,
        question: q.q.replace(/^Q\d+\.\s*/, ''), // strip "Q1. " prefix
        opts: q.opts,
        answer: q.a,
        skill: test.source?.includes('Cambridge') ? 'Cambridge' : test.source?.includes('IELTS') ? 'IELTS' : 'Oxford ELLT',
        testTitle: test.title,
      })
    })
  })

  // Pick 5 using the seed
  if (pool.length < 5) return pool.slice(0, 5)
  const picked = []
  const used = new Set()
  for (let i = 0; picked.length < 5 && i < 100; i++) {
    const idx = Math.floor(seeded(seed + i) * pool.length)
    if (!used.has(idx)) { used.add(idx); picked.push(pool[idx]) }
  }
  return picked
}

const today = new Date().toISOString().slice(0, 10)
const STORAGE_KEY = `ellt-daily-${today}`

export default function DailyChallenge({ userId, addResult }) {
  const questions = useMemo(() => pickQuestions(today), [])
  const completed  = !!localStorage.getItem(STORAGE_KEY)

  const [started,  setStarted]  = useState(false)
  const [qi,       setQi]       = useState(0)
  const [chosen,   setChosen]   = useState(null)
  const [answers,  setAnswers]  = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!questions.length) return null

  const score   = answers.filter((a, i) => a === questions[i]?.answer).length
  const isLast  = qi === questions.length - 1
  const current = questions[qi]
  const isDone  = answers.length === questions.length

  function choose(opt) {
    if (chosen !== null) return
    setChosen(opt)
  }

  function next() {
    const newAnswers = [...answers, chosen]
    setAnswers(newAnswers)
    setChosen(null)
    if (isLast) {
      const finalScore = newAnswers.filter((a,i) => a === questions[i]?.answer).length
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score: finalScore, total: questions.length, date: today }))
      if (finalScore >= 3) setShowConfetti(true)
      if (addResult) {
        addResult({ skill:'listening', test_id:'daily_challenge', test_title:`Daily Challenge ${today}`, score:finalScore, total:questions.length, band_score:parseFloat((finalScore/questions.length*9).toFixed(1)), answers:JSON.stringify(newAnswers) })
      }
    } else {
      setQi(qi + 1)
    }
  }

  // ── Compact card (not started / completed) ─────────────────
  if (!started || completed) {
    const saved = completed ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') : null
    return (
      <>
        <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div onClick={() => !completed && setStarted(true)}
          style={{ background: completed ? 'var(--bg2)' : 'var(--amber)', border: completed ? '1.5px solid var(--amberBdr)' : 'none', borderBottom: completed ? '1.5px solid var(--amberBdr)' : '3px solid #CC7700', borderRadius:16, padding:'16px 18px', marginBottom:16, cursor: completed ? 'default' : 'pointer', boxShadow:'var(--shadow)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:700, color: completed ? 'var(--amber)' : 'rgba(255,255,255,0.85)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:3, display:'flex', alignItems:'center', gap:5 }}>
                <Zap size={10} color={completed ? 'var(--amber)' : 'rgba(255,255,255,0.85)'} fill={completed ? 'var(--amber)' : 'rgba(255,255,255,0.85)'} />
                Daily Challenge — {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'})}
              </div>
              <div style={{ fontSize:16, fontWeight:900, color: completed ? 'var(--text)' : '#fff' }}>
                {completed ? `${saved?.score}/${saved?.total} correct — well done!` : '5 questions · approx. 5 minutes'}
              </div>
              {!completed && <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:600, marginTop:3 }}>Resets at midnight — same for all students today</div>}
              {completed && (
                <div style={{ marginTop:8 }}>
                  <div style={{ height:5, background:'var(--bg3)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(saved.score/saved.total)*100}%`, background:'var(--amber)', borderRadius:99 }} />
                  </div>
                  <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700, marginTop:5 }}>New challenge available tomorrow</div>
                </div>
              )}
            </div>
            {!completed && (
              <div style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:12 }}>
                <Zap size={20} color="#fff" fill="#fff" />
              </div>
            )}
            {completed && <CheckCircle size={24} color="var(--amber)" style={{flexShrink:0, marginLeft:12}} />}
          </div>
        </div>
      </>
    )
  }

  // ── Results screen ─────────────────────────────────────────
  if (isDone) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <>
        <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
        <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', borderRadius:18, padding:20, marginBottom:16 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:36, marginBottom:8 }}></div>
            <div style={{ fontSize:22, fontWeight:900, color:'var(--text)', marginBottom:4 }}>
              {score===5?'Perfect score!':score>=3?'Great work!':'Keep going!'}
            </div>
            <div style={{ fontSize:15, color:'var(--textM)', fontWeight:700 }}>{score}/{questions.length} correct · {pct}%</div>
          </div>

          {/* Score bar */}
          <div style={{ height:10, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginBottom:16 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:pct===100?'var(--green)':pct>=60?'var(--amber)':'var(--coral)', borderRadius:99, transition:'width 1s ease' }} />
          </div>

          {/* Review answers */}
          <div style={{ fontSize:11, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Review</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer
              return (
                <div key={i} style={{ padding:'10px 12px', background:'var(--bg3)', border:`2px solid ${correct?'var(--green)':'var(--coral)'}`, borderRadius:12 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                    {correct ? <CheckCircle size={14} color="var(--green)" style={{flexShrink:0,marginTop:1}} /> : <XCircle size={14} color="var(--coral)" style={{flexShrink:0,marginTop:1}} />}
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', marginBottom:3 }}>{q.question}</div>
                      <div style={{ fontSize:11, color:correct?'var(--green)':'var(--coral)', fontWeight:700 }}>
                        {correct ? `✓ ${q.opts[q.answer]}` : `✗ You chose: ${q.opts[answers[i]]} · Correct: ${q.opts[q.answer]}`}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop:16, padding:'10px 14px', background:'var(--amberBg,#FFF0CD)', border:'2px solid var(--amber,#FF9600)', borderRadius:10, fontSize:12, color:'var(--text)', fontWeight:600 }}>
            ⚡ Come back tomorrow for a new 5-question challenge!
          </div>
        </div>
      </>
    )
  }

  // ── Active question ────────────────────────────────────────
  return (
    <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', borderRadius:18, padding:20, marginBottom:16 }}>

      {/* Progress */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ display:'flex', gap:5 }}>
          {questions.map((_,i) => (
            <div key={i} style={{ width:28, height:6, borderRadius:99, background:i<qi?'var(--green)':i===qi?'var(--amber)':'var(--bg3)', transition:'background .3s' }} />
          ))}
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--textM)' }}>Q{qi+1} of {questions.length}</div>
      </div>

      {/* Skill tag */}
      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
        ⚡ Daily Challenge · {current.skill}
      </div>

      {/* Question */}
      <div style={{ fontSize:15, fontWeight:800, color:'var(--text)', lineHeight:1.5, marginBottom:16 }}>
        {current.question}
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {current.opts.map((opt, oi) => {
          const isChosen  = chosen === oi
          const isCorrect = oi === current.answer
          let bg = 'var(--bg3)', border = 'var(--border)', color = 'var(--text)'
          if (chosen !== null) {
            if (isCorrect)       { bg='var(--greenBg)'; border='var(--green)'; color='var(--green)' }
            else if (isChosen)   { bg='var(--coralBg)'; border='var(--coral)'; color='var(--coral)' }
          } else if (isChosen)   { bg='var(--blueBg)'; border='var(--blue)'; color='var(--blue)' }

          return (
            <button key={oi} onClick={() => choose(oi)} disabled={chosen !== null}
              style={{ padding:'13px 16px', borderRadius:12, border:`2px solid ${border}`, borderBottom:`3px solid ${chosen!==null&&isCorrect?'var(--greenD)':border}`, background:bg, color, fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, cursor:chosen!==null?'default':'pointer', textAlign:'left', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:'50%', background:`${border}22`, border:`1px solid ${border}`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, flexShrink:0 }}>
                {String.fromCharCode(65+oi)}
              </span>
              {opt}
              {chosen !== null && isCorrect && <CheckCircle size={15} color="var(--green)" style={{marginLeft:'auto'}} />}
              {chosen !== null && isChosen && !isCorrect && <XCircle size={15} color="var(--coral)" style={{marginLeft:'auto'}} />}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {chosen !== null && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ padding:'10px 14px', background:chosen===current.answer?'var(--greenBg)':'var(--coralBg)', border:`2px solid ${chosen===current.answer?'var(--green)':'var(--coral)'}`, borderRadius:10, fontSize:13, fontWeight:700, color:'var(--text)' }}>
            {chosen===current.answer ? 'Correct!' : `Correct answer: ${current.opts[current.answer]}`}
          </div>
          <button onClick={next} style={{ padding:'12px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {isLast ? 'See Results →' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}
