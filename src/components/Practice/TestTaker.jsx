import { useState, useMemo, useEffect } from 'react'
import { saveResult } from '../../lib/supabase'
import { Card, Btn, Chip } from '../ui'
import Confetti from '../Confetti'
import DiagramRenderer from './DiagramRenderer'
import { ChevronLeft, CheckCircle, XCircle, BookOpen, Headphones } from 'lucide-react'

export default function TestTaker({ test, skill, prev, addResult, onBack, userId }) {
  // HIGH-13: Load draft from localStorage on mount
  const draftKey = `ellt-draft-${test.id}`
  const [answers, setAnswers] = useState(() => {
    try { const d = localStorage.getItem(draftKey); return d ? JSON.parse(d) : {} } catch { return {} }
  })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [passageOpen, setPassageOpen] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const isReading = skill === 'reading'

  // Compute score from answers at any time (not gated by submitted state)
  const calcScore = (ans) => test.qs.reduce((s, q, i) => {
    const a = ans[i]
    if (q.type === 'fill') return s + (typeof a === 'string' && a.toUpperCase().trim() === q.a.toUpperCase() ? 1 : 0)
    if (Array.isArray(q.a)) return s + (q.a.includes(a) ? 1 : 0)
    return s + (a === q.a ? 1 : 0)
  }, 0)

  const score = useMemo(() => submitted ? calcScore(answers) : 0, [submitted, answers, test.qs])

  const band = submitted ? (score / test.qs.length * 9).toFixed(1) : null
  const answered = Object.keys(answers).length
  const total = test.qs.length
  const pct = Math.round((answered / total) * 100)

  const [saveError, setSaveError] = useState(false)

  const submit = async () => {
    setSaving(true)
    setSaveError(false)
    // Compute actual score NOW (submitted is still false at this point — useMemo would return 0)
    const actualScore = calcScore(answers)
    const row = {
      skill, test_id: test.id, test_title: test.title,
      score: actualScore,
      total: test.qs.length,
      band_score: parseFloat((actualScore / test.qs.length * 9).toFixed(1)),
      answers: answers
    }
    try {
      const ok = await saveResult(row)
      if (!ok) throw new Error('Save returned false')
      addResult(row)
      try { localStorage.removeItem(draftKey) } catch {}
      setSubmitted(true)
      if (actualScore / test.qs.length >= 0.7) setShowConfetti(true)
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="anim-fadeUp">
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />
      {saveError && (
        <div style={{ marginBottom:14, padding:'12px 16px', background:'var(--coralBg)', border:'2px solid var(--coral)', borderRadius:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:700, color:'var(--coral)' }}>⚠️ Could not save your result. Check your connection.</span>
          <button onClick={submit} style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'var(--coral)', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Retry</button>
        </div>
      )}

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

      {/* Passage — desktop: sticky side column; mobile: collapsible */}
      {isReading && test.passage && (
        <>
          {/* Mobile collapsible */}
          <div className="reading-mobile-passage" style={{ background:'var(--bg3)', border:'2px solid var(--border)', borderRadius:16, marginBottom:14, overflow:'hidden' }}>
            <button onClick={() => setPassageOpen(o => !o)} style={{ width:'100%', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'Nunito, sans-serif' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <BookOpen size={16} color="var(--amber)" />
                <span style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>{test.title}</span>
              </div>
              <span style={{ fontSize:11, color:'var(--textM)', fontWeight:700 }}>{passageOpen ? '▲ Hide' : '▼ Read'}</span>
            </button>
            {passageOpen && (
              <div style={{ padding:'0 16px 16px', fontSize:14, lineHeight:1.85, color:'var(--textM)', whiteSpace:'pre-line', maxHeight:340, overflowY:'auto', borderTop:'1px solid var(--border)' }}>
                {test.passage}
              </div>
            )}
          </div>
          {/* Desktop inline hint */}
          <div className="reading-desktop-hint" style={{ fontSize:12, color:'var(--textM)', fontWeight:700, marginBottom:10, display:'none' }}>
            📖 Reading passage shown on the left · Questions on the right
          </div>
          <style>{`
            @media (min-width: 768px) {
              .reading-two-col { display: grid !important; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
              .reading-mobile-passage { display: none !important; }
              .reading-desktop-hint { display: block !important; }
            }
            .reading-two-col .reading-passage-col {
              position: sticky; top: 80px; max-height: calc(100vh - 100px);
              overflow-y: auto; background: var(--bg3); border: 2px solid var(--border);
              border-radius: 16px; padding: 16px;
              font-size: 14px; line-height: 1.85; color: var(--textM); white-space: pre-line;
            }
          `}</style>
        </>
      )}

      {/* Results banner */}
      {submitted && (
        <div className="anim-bounceIn" style={{ background: score/total>=0.7?'var(--greenBg)':'var(--coralBg)', border:`2px solid ${score/total>=0.7?'var(--green)':'var(--coral)'}`, borderRadius:16, padding:'16px 20px', marginBottom:16, textAlign:'center' }}>
          <div style={{ fontSize:32, fontWeight:900, color:score/total>=0.7?'var(--green)':'var(--coral)' }} className="score-num">{score}/{total}</div>
          <div style={{ fontSize:13, fontWeight:800, color:'var(--textM)', marginTop:2 }}>Band {band} · {score/total>=0.8?'Excellent!':score/total>=0.6?'Good work!':score/total>=0.4?'Keep practising!':'Try again!'}</div>
        </div>
      )}

      {/* Questions — two-column on desktop for reading */}
      <div className={isReading && test.passage ? 'reading-two-col' : ''}>
        {isReading && test.passage && (
          <div className="reading-passage-col">{test.passage}</div>
        )}
        <div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }} key={animKey}>
        {test.qs.map((q, qi) => {
          const userAns = answers[qi]
          const isFill = q.type === 'fill'
          const isCorrect = submitted && (isFill ? (typeof userAns==='string' && userAns.toUpperCase().trim()===q.a.toUpperCase()) : Array.isArray(q.a) ? q.a.includes(userAns) : userAns===q.a)
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
                        onChange={e => {
                        const next = {...answers, [qi]: e.target.value.toUpperCase()}
                        setAnswers(next)
                        try { localStorage.setItem(draftKey, JSON.stringify(next)) } catch {}
                      }}
                        style={{ maxWidth:280, textTransform:'uppercase', fontWeight:800, letterSpacing:1, fontSize:15 }}/>
                      {submitted && <div style={{ marginTop:8, fontSize:13, color:isCorrect?'var(--green)':'var(--coral)', fontWeight:800 }}>
                        {isCorrect ? '✓ Correct!' : `Correct answer: ${q.a}`}
                      </div>}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {q.opts.map((opt, oi) => {
                        const isSel = userAns===oi
                        const isAns = Array.isArray(q.a) ? q.a.includes(oi) : oi===q.a
                        let cls = 'q-option'
                        if (!submitted && isSel) cls += ' selected'
                        if (submitted && (Array.isArray(q.a) ? q.a.includes(oi) : isAns)) cls += ' correct'
                        if (submitted && isSel && !isAns) cls += ' incorrect'
                        return (
                          <div key={oi} className={cls} onClick={() => {
                            if (submitted) return
                            const next = {...answers, [qi]: oi}
                            setAnswers(next)
                            try { localStorage.setItem(draftKey, JSON.stringify(next)) } catch {}
                          }}>
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
          <button onClick={submit} disabled={saving} className="btn-ripple"
            style={{ padding:'12px 24px', borderRadius:12, border:'none', borderBottom:`4px solid ${saving?'var(--border)':'var(--greenD)'}`, background:saving?'var(--bg3)':'var(--green)', color:saving?'var(--textD)':'#fff', fontWeight:900, fontSize:14, cursor:saving?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px', transition:'all .15s', flexShrink:0 }}>
            {saving ? 'Saving...' : answered < total ? `Submit (${total - answered} unanswered)` : 'Submit Answers'}
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => { try { localStorage.removeItem(draftKey) } catch {} setAnswers({}); setSubmitted(false); setAnimKey(k=>k+1) }}
            style={{ padding:'12px 20px', borderRadius:12, border:'2px solid var(--border)', borderBottom:'4px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
            Try Again
          </button>
          <button onClick={onBack}
            style={{ padding:'12px 20px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            Next Test
          </button>
        </div>
      )}
      </div>{/* close inner questions div */}
      </div>{/* close two-col or plain div */}
    </div>
  )
}
