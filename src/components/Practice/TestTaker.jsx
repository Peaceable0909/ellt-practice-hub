import { useState, useMemo, useEffect } from 'react'
import { saveResult } from '../../lib/supabase'
import { Card, Btn, Chip } from '../ui'
import Confetti from '../Confetti'
import { ChevronLeft, CheckCircle, XCircle, BookOpen, Headphones } from 'lucide-react'

export default function TestTaker({ test, skill, prev, addResult, onBack, userId }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [passageOpen, setPassageOpen] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const isReading = skill === 'reading'

  const score = useMemo(() => {
    if (!submitted) return 0
    return test.qs.reduce((s, q, i) => {
      const ans = answers[i]
      if (q.type === 'fill') return s + (typeof ans === 'string' && ans.toUpperCase().trim() === q.a.toUpperCase() ? 1 : 0)
      return s + (ans === q.a ? 1 : 0)
    }, 0)
  }, [submitted, answers, test.qs])

  const band = submitted ? (score / test.qs.length * 9).toFixed(1) : null
  const answered = Object.keys(answers).length
  const total = test.qs.length
  const pct = Math.round((answered / total) * 100)

  const submit = async () => {
    setSaving(true)
    const row = { skill, test_id: test.id, test_title: test.title, score, total: test.qs.length, band_score: parseFloat((score / test.qs.length * 9).toFixed(1)), answers: JSON.stringify(answers) }
    await saveResult(row, userId)
    addResult(row)
    setSubmitted(true)
    setSaving(false)
    if (score / total >= 0.7) setShowConfetti(true)
  }

  return (
    <div className="anim-fadeUp">
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ width:40, height:40, borderRadius:12, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--textM)', flexShrink:0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:16, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{test.title}</div>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>{total} questions · {skill}</div>
        </div>
        {!submitted && (
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:800, color:'var(--textM)' }}>{answered}/{total}</span>
            <div style={{ width:80, height:8, background:'var(--bg3)', borderRadius:99, border:'2px solid var(--border)', overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:'var(--green)', borderRadius:99, transition:'width .4s cubic-bezier(.22,1,.36,1)' }} />
            </div>
          </div>
        )}
        {submitted && (
          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            <Chip text={`${score}/${total}`} color="var(--green)" />
            <Chip text={`Band ${band}`} color="var(--amber)" />
          </div>
        )}
      </div>

      {/* Listening audio */}
      {!isReading && (
        <div style={{ background:'var(--blueBg)', border:'2px solid var(--blueBdr)', borderRadius:16, padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <Headphones size={18} color="var(--blue)" />
            <span style={{ fontSize:13, fontWeight:800, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'0.4px' }}>Listen First</span>
          </div>
          <div style={{ fontSize:12, color:'var(--blue)', fontWeight:600, marginBottom:10, lineHeight:1.5 }}>{test.intro}</div>
          {test.audio && <audio controls src={test.audio} />}
        </div>
      )}

      {/* Passage */}
      {isReading && test.passage && (
        <div style={{ background:'var(--bg3)', border:'2px solid var(--border)', borderRadius:16, marginBottom:14, overflow:'hidden' }}>
          <button onClick={() => setPassageOpen(o => !o)} style={{ width:'100%', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'Nunito, sans-serif' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <BookOpen size={16} color="var(--amber)" />
              <span style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>{test.title}</span>
            </div>
            <span style={{ fontSize:11, color:'var(--textM)', fontWeight:700 }}>{passageOpen ? '▲ Hide' : '▼ Read'}</span>
          </button>
          {passageOpen && (
            <div style={{ padding:'0 16px 16px', fontSize:14, lineHeight:1.85, color:'var(--textM)', whiteSpace:'pre-line', maxHeight:320, overflowY:'auto', borderTop:'1px solid var(--border)' }}>
              {test.passage}
            </div>
          )}
        </div>
      )}

      {/* Results banner */}
      {submitted && (
        <div className="anim-bounceIn" style={{ background: score/total>=0.7?'var(--greenBg)':'var(--coralBg)', border:`2px solid ${score/total>=0.7?'var(--green)':'var(--coral)'}`, borderRadius:16, padding:'16px 20px', marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:32, fontWeight:900, color:score/total>=0.7?'var(--green)':'var(--coral)' }} className="score-num">{score}/{total}</div>
          <div style={{ fontSize:13, fontWeight:800, color:'var(--textM)', marginTop:2 }}>Band {band} · {score/total>=0.8?'Excellent!':score/total>=0.6?'Good work!':score/total>=0.4?'Keep practising!':'Try again!'}</div>
        </div>
      )}

      {/* Questions */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }} key={animKey}>
        {test.qs.map((q, qi) => {
          const userAns = answers[qi]
          const isFill = q.type === 'fill'
          const isCorrect = submitted && (isFill ? (typeof userAns==='string' && userAns.toUpperCase().trim()===q.a.toUpperCase()) : userAns===q.a)
          const isWrong = submitted && !isCorrect

          return (
            <div key={qi} className={`skill-card anim-fadeUp ${submitted && isCorrect ? 'anim-pop' : submitted && isWrong ? 'anim-shake' : ''}`}
              style={{ borderColor: submitted ? (isCorrect?'var(--green)':'var(--coral)') : 'var(--border)', borderLeftColor: submitted ? (isCorrect?'var(--green)':'var(--coral)') : 'var(--border)', borderLeftWidth: 4, animationDelay: `${qi*0.04}s` }}>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background: submitted?(isCorrect?'var(--greenBg)':'var(--coralBg)'):'var(--blueBg)', border:`2px solid ${submitted?(isCorrect?'var(--green)':'var(--coral)'):'var(--blue)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:submitted?(isCorrect?'var(--green)':'var(--coral)'):'var(--blue)' }}>
                  {submitted ? (isCorrect ? <CheckCircle size={14}/> : <XCircle size={14}/>) : qi+1}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:700, marginBottom:10, color:'var(--text)', lineHeight:1.55 }}>{q.q}</p>
                  {isFill ? (
                    <div>
                      <input type="text" placeholder="Type your answer..." disabled={submitted}
                        value={typeof answers[qi]==='string'?answers[qi]:''}
                        onChange={e => setAnswers(a => ({...a,[qi]:e.target.value.toUpperCase()}))}
                        style={{ maxWidth:280, textTransform:'uppercase', fontWeight:800, letterSpacing:1, fontSize:15 }}/>
                      {submitted && <div style={{ marginTop:8, fontSize:13, color:isCorrect?'var(--green)':'var(--coral)', fontWeight:800 }}>
                        {isCorrect ? '✓ Correct!' : `Correct answer: ${q.a}`}
                      </div>}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {q.opts.map((opt, oi) => {
                        const isSel = userAns===oi
                        const isAns = oi===q.a
                        let cls = 'q-option'
                        if (!submitted && isSel) cls += ' selected'
                        if (submitted && isAns) cls += ' correct'
                        if (submitted && isSel && !isAns) cls += ' incorrect'
                        return (
                          <div key={oi} className={cls} onClick={() => !submitted && setAnswers(a => ({...a,[qi]:oi}))}>
                            <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${!submitted&&isSel?'var(--blue)':submitted&&isAns?'var(--green)':submitted&&isSel&&!isAns?'var(--coral)':'var(--border)'}`, flexShrink:0, position:'relative', background:!submitted&&isSel?'var(--blue)':'transparent' }}>
                              {!submitted&&isSel && <div style={{ position:'absolute', inset:3, borderRadius:'50%', background:'#fff' }}/>}
                              {submitted&&isAns && <CheckCircle size={14} color="var(--green)" style={{ position:'absolute', top:-1, left:-1 }}/>}
                              {submitted&&isSel&&!isAns && <XCircle size={14} color="var(--coral)" style={{ position:'absolute', top:-1, left:-1 }}/>}
                            </div>
                            <span style={{ fontSize:14, fontWeight:700, flex:1 }}>{opt}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      {!submitted ? (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, gap:10, flexWrap:'wrap' }}>
          <button onClick={onBack} style={{ padding:'10px 16px', borderRadius:12, border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Cancel</button>
          <button onClick={submit} disabled={saving||answered<total} className="btn-ripple"
            style={{ padding:'12px 24px', borderRadius:12, border:'none', borderBottom:`4px solid ${saving||answered<total?'var(--border)':'var(--greenD)'}`, background:saving||answered<total?'var(--bg3)':'var(--green)', color:saving||answered<total?'var(--textD)':'#fff', fontWeight:900, fontSize:14, cursor:saving||answered<total?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px', transition:'all .15s', flexShrink:0 }}>
            {saving ? 'Saving...' : answered<total ? `${total-answered} left` : 'Submit Answers'}
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => { setAnswers({}); setSubmitted(false); setAnimKey(k=>k+1) }}
            style={{ padding:'12px 20px', borderRadius:12, border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
            Try Again
          </button>
          <button onClick={onBack}
            style={{ padding:'12px 20px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            Next Test
          </button>
        </div>
      )}
    </div>
  )
}
