import { useState, useEffect, useRef, useCallback } from 'react'
import { saveResult } from '../lib/supabase'
import { LISTENING } from '../data/listening'
import { READING } from '../data/reading'
import { WRITING } from '../data/writing'
import { SPEAKING } from '../data/speaking'
import { Card, Chip } from './ui'

// Fixed mock test content
const MOCK = {
  listening: LISTENING[0],  // Concerts
  reading:   READING[1],    // Do Animals Have Friends?
  writing:   WRITING[0],    // Team Work
  speaking:  SPEAKING[0],   // Tourism
}

const SECTION_DURATIONS = { listening: 20*60, reading: 30*60, writing: 45*60, speaking: 10*60 }
const SECTION_ORDER = ['listening','reading','writing','speaking']

function fmt(s) {
  const m = Math.floor(s/60)
  const sec = s%60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
}

// ─── TIMER HOOK ──────────────────────────────────────────────────────────────
function useTimer(duration, running, onExpire) {
  const [left, setLeft] = useState(duration)
  const ref = useRef(null)
  useEffect(() => { setLeft(duration) }, [duration])
  useEffect(() => {
    if (!running) { clearInterval(ref.current); return }
    ref.current = setInterval(() => {
      setLeft(t => {
        if (t <= 1) { clearInterval(ref.current); onExpire?.(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running])
  return left
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, timeLeft, totalTime, color }) {
  const pct = Math.min(100, (timeLeft/totalTime)*100)
  const urgent = timeLeft < 120
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, letterSpacing:'0.5px', marginBottom:2 }}>
            FULL MOCK TEST
          </div>
          <div style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:'var(--textM)', marginTop:2 }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:30, fontWeight:700, fontFamily:'monospace',
            color: urgent ? 'var(--coral)' : color }}>
            {fmt(timeLeft)}
          </div>
          <div style={{ fontSize:10, color:'var(--textD)' }}>{urgent ? 'Almost done!' : 'remaining'}</div>
        </div>
      </div>
      <div style={{ height:4, background:'var(--border)', borderRadius:2 }}>
        <div style={{ height:'100%', width:`${pct}%`, background: urgent ? 'var(--coral)' : color,
          borderRadius:2, transition:'width 1s linear' }}/>
      </div>
    </div>
  )
}

// ─── INTRO PHASE ─────────────────────────────────────────────────────────────
function IntroPhase({ onStart }) {
  const sections = [
    { name:'Listening', time:'20 min', q:'8 questions', col:'var(--blue)',   icon:'🎧' },
    { name:'Reading',   time:'30 min', q:'16 questions',col:'var(--amber)',  icon:'📖' },
    { name:'Writing',   time:'45 min', q:'1 essay task', col:'var(--purple)',icon:'✍️' },
    { name:'Speaking',  time:'10 min', q:'1 topic',      col:'var(--coral)', icon:'🎤' },
  ]
  return (
    <div style={{ maxWidth:600, margin:'0 auto', padding:'48px 20px', textAlign:'center' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
      <h1 style={{ fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:6 }}>
        Oxford ELLT Full Mock Test
      </h1>
      <p style={{ color:'var(--textM)', fontSize:14, marginBottom:28, lineHeight:1.6 }}>
        You will complete all 4 sections back to back.<br/>
        Scores are revealed only at the very end.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:28, textAlign:'left' }}>
        {sections.map((s,i) => (
          <Card key={s.name} style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ fontSize:24 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{s.name}</div>
              <div style={{ fontSize:11, color:'var(--textM)' }}>{s.time} · {s.q}</div>
            </div>
            <div style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:s.col }}>
              {i+1}/4
            </div>
          </Card>
        ))}
      </div>
      <div style={{ padding:'12px 16px', background:'var(--amberBg)',
        border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, marginBottom:24,
        fontSize:13, color:'var(--amber)', textAlign:'left', lineHeight:1.6 }}>
        💡 <strong>Tips:</strong> Find a quiet place · Use headphones for listening ·
        You cannot go back to a previous section · Aim for full sentences in writing and speaking
      </div>
      <button onClick={onStart} style={{
        padding:'14px 40px', borderRadius:10, border:'none',
        background:'linear-gradient(135deg,var(--teal),var(--blue))',
        color:'#000', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'inherit',
        width:'100%',
      }}>
        Start Full Mock Test →
      </button>
    </div>
  )
}

// ─── TRANSITION PHASE ────────────────────────────────────────────────────────
function TransitionPhase({ completed, next, nextIcon, onContinue }) {
  const [count, setCount] = useState(5)
  useEffect(() => {
    const t = setInterval(() => setCount(c => {
      if (c <= 1) { clearInterval(t); onContinue(); return 0 }
      return c - 1
    }), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ maxWidth:500, margin:'0 auto', padding:'80px 20px', textAlign:'center' }}>
      <div style={{ width:64, height:64, borderRadius:'50%',
        background:'linear-gradient(135deg,var(--teal),var(--blue))',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28, margin:'0 auto 20px' }}>✓</div>
      <div style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:8 }}>
        {completed} complete
      </div>
      <div style={{ fontSize:14, color:'var(--textM)', marginBottom:28 }}>
        Up next: <strong style={{ color:'var(--text)' }}>{nextIcon} {next}</strong>
      </div>
      <div style={{ fontSize:42, fontWeight:700, color:'var(--teal)',
        fontFamily:'monospace', marginBottom:8 }}>{count}</div>
      <div style={{ fontSize:12, color:'var(--textD)' }}>Starting automatically…</div>
      <button onClick={onContinue} style={{
        marginTop:20, padding:'10px 24px', borderRadius:8,
        border:'1px solid var(--border)', background:'var(--bg2)',
        color:'var(--textM)', fontSize:12, cursor:'pointer', fontFamily:'inherit',
      }}>
        Continue now
      </button>
    </div>
  )
}

// ─── LISTENING SECTION ───────────────────────────────────────────────────────
function ListeningSection({ test, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [running, setRunning] = useState(true)
  const total = test.qs.length
  const answered = Object.keys(answers).length
  const timeLeft = useTimer(SECTION_DURATIONS.listening, running, () => submit(answers))

  const submit = (ans) => {
    setRunning(false)
    onComplete(ans)
  }

  return (
    <div className="app-container">
      <SectionHeader title="Listening" subtitle={test.title}
        timeLeft={timeLeft} totalTime={SECTION_DURATIONS.listening} color="var(--blue)"/>
      <Card style={{ marginBottom:14, background:'var(--blueBg)', borderColor:'rgba(59,130,246,0.25)' }}>
        <div style={{ fontSize:12, color:'var(--blue)', fontWeight:600, marginBottom:8 }}>
          🎧 INSTRUCTIONS — {test.type}
        </div>
        <div style={{ fontSize:12, color:'var(--blue)', marginBottom:10 }}>{test.intro}</div>
        <audio controls src={test.audio} style={{ width:'100%' }}/>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {test.qs.map((q,qi) => {
          const sel = answers[qi]
          return (
            <Card key={qi}>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--tealBg)',
                  border:'1px solid var(--tealBr)', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:10, fontWeight:700, color:'var(--teal)', flexShrink:0 }}>
                  {qi+1}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:'var(--text)', marginBottom:8, lineHeight:1.5 }}>{q.q}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {q.opts.map((opt,oi) => (
                      <div key={oi} onClick={() => setAnswers(a=>({...a,[qi]:oi}))}
                        style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                          borderRadius:8, border:`1.5px solid ${sel===oi?'var(--teal)':'var(--border)'}`,
                          background:sel===oi?'var(--tealBg)':'transparent', cursor:'pointer', transition:'all .15s' }}>
                        <div style={{ width:14, height:14, borderRadius:'50%',
                          border:`2px solid ${sel===oi?'var(--teal)':'var(--border)'}`, flexShrink:0, position:'relative' }}>
                          {sel===oi && <div style={{ position:'absolute', top:2, left:2, width:6, height:6,
                            borderRadius:'50%', background:'var(--teal)' }}/>}
                        </div>
                        <span style={{ fontSize:12, color:sel===oi?'var(--teal)':'var(--textM)', fontWeight:sel===oi?600:400 }}>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20 }}>
        <span style={{ fontSize:12, color:'var(--textM)' }}>{answered}/{total} answered</span>
        <button onClick={() => submit(answers)}
          style={{ padding:'10px 28px', borderRadius:8, border:'none',
            background: answered===total ? 'linear-gradient(135deg,var(--teal),var(--blue))' : 'var(--border)',
            color: answered===total ? '#000' : 'var(--textM)',
            fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          {answered < total ? `Answer ${total-answered} more` : 'Submit Listening →'}
        </button>
      </div>
    </div>
  )
}

// ─── READING SECTION ─────────────────────────────────────────────────────────
function ReadingSection({ test, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [passageOpen, setPassageOpen] = useState(true)
  const [running, setRunning] = useState(true)
  const total = test.qs.length
  const answered = Object.keys(answers).length
  const timeLeft = useTimer(SECTION_DURATIONS.reading, running, () => submit(answers))

  const submit = (ans) => { setRunning(false); onComplete(ans) }

  return (
    <div className="app-container">
      <SectionHeader title="Reading" subtitle={test.title}
        timeLeft={timeLeft} totalTime={SECTION_DURATIONS.reading} color="var(--amber)"/>
      <Card style={{ marginBottom:12, background:'var(--bg3)' }}>
        <button onClick={() => setPassageOpen(o=>!o)} style={{
          width:'100%', background:'none', border:'none', cursor:'pointer',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:0, color:'var(--text)', fontWeight:600, fontSize:13, fontFamily:'inherit' }}>
          📖 Reading Passage — {test.title}
          <span style={{ color:'var(--textM)', fontSize:11 }}>{passageOpen?'▲ Collapse':'▼ Expand'}</span>
        </button>
        {passageOpen && (
          <div style={{ marginTop:10, fontSize:13, lineHeight:1.85, color:'var(--textM)',
            whiteSpace:'pre-line', maxHeight:320, overflowY:'auto', paddingRight:6 }}>
            {test.passage}
          </div>
        )}
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {test.qs.map((q,qi) => {
          const isFill = q.type === 'fill'
          const sel = answers[qi]
          return (
            <Card key={qi}>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--amberBg)',
                  border:'1px solid rgba(245,158,11,0.3)', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:10, fontWeight:700, color:'var(--amber)', flexShrink:0 }}>
                  {qi+1}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:'var(--text)', marginBottom:8, lineHeight:1.5 }}>{q.q}</p>
                  {isFill ? (
                    <input type="text" placeholder="Type your answer..."
                      value={typeof sel==='string'?sel:''}
                      onChange={e => setAnswers(a=>({...a,[qi]:e.target.value.toUpperCase()}))}
                      style={{ maxWidth:260, textTransform:'uppercase', fontWeight:600, letterSpacing:1 }}/>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {q.opts.map((opt,oi) => (
                        <div key={oi} onClick={() => setAnswers(a=>({...a,[qi]:oi}))}
                          style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                            borderRadius:8, border:`1.5px solid ${sel===oi?'var(--amber)':'var(--border)'}`,
                            background:sel===oi?'var(--amberBg)':'transparent', cursor:'pointer', transition:'all .15s' }}>
                          <div style={{ width:14, height:14, borderRadius:'50%',
                            border:`2px solid ${sel===oi?'var(--amber)':'var(--border)'}`, flexShrink:0, position:'relative' }}>
                            {sel===oi && <div style={{ position:'absolute', top:2, left:2, width:6, height:6,
                              borderRadius:'50%', background:'var(--amber)' }}/>}
                          </div>
                          <span style={{ fontSize:12, color:sel===oi?'var(--amber)':'var(--textM)', fontWeight:sel===oi?600:400 }}>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20 }}>
        <span style={{ fontSize:12, color:'var(--textM)' }}>{answered}/{total} answered</span>
        <button onClick={() => submit(answers)}
          style={{ padding:'10px 28px', borderRadius:8, border:'none',
            background: answered===total ? 'linear-gradient(135deg,var(--amber),#f59e0b)' : 'var(--border)',
            color: answered===total ? '#000' : 'var(--textM)',
            fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          {answered < total ? `Answer ${total-answered} more` : 'Submit Reading →'}
        </button>
      </div>
    </div>
  )
}

// ─── WRITING SECTION ─────────────────────────────────────────────────────────
function WritingSection({ task, onComplete }) {
  const [essay, setEssay] = useState('')
  const [running, setRunning] = useState(true)
  const words = essay.trim().split(/\s+/).filter(Boolean).length
  const timeLeft = useTimer(SECTION_DURATIONS.writing, running, () => submit())

  const submit = () => { setRunning(false); onComplete(essay) }

  return (
    <div className="app-container">
      <SectionHeader title="Writing" subtitle="Essay Task"
        timeLeft={timeLeft} totalTime={SECTION_DURATIONS.writing} color="var(--purple)"/>
      <Card style={{ marginBottom:12, background:'var(--purpleBg)', borderColor:'rgba(167,139,250,0.3)' }}>
        <div style={{ fontSize:11, color:'var(--purple)', fontWeight:600, letterSpacing:'0.5px', marginBottom:6 }}>
          WRITING TASK
        </div>
        <p style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:6 }}>{task.prompt}</p>
        <p style={{ fontSize:13, color:'var(--textM)', lineHeight:1.6 }}>{task.task}</p>
      </Card>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Your Response</div>
          <span style={{ fontSize:11, fontWeight:600, color: words>=task.minWords ? 'var(--teal)' : 'var(--amber)' }}>
            {words} / {task.minWords}+ words
          </span>
        </div>
        <textarea value={essay} onChange={e=>setEssay(e.target.value)}
          placeholder={`Write your essay here… aim for at least ${task.minWords} words`}
          style={{ width:'100%', minHeight:240, boxSizing:'border-box', lineHeight:1.7 }}/>
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
          <button onClick={submit}
            style={{ padding:'10px 28px', borderRadius:8, border:'none',
              background: words>=50 ? 'linear-gradient(135deg,var(--purple),#7c3aed)' : 'var(--border)',
              color: words>=50 ? '#fff' : 'var(--textM)',
              fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Submit Writing →
          </button>
        </div>
      </Card>
    </div>
  )
}

// ─── SPEAKING SECTION ────────────────────────────────────────────────────────
function SpeakingSection({ topic, onComplete }) {
  const [status, setStatus] = useState('ready') // ready | recording | done
  const [wordCount, setWordCount] = useState(0)
  const [running, setRunning] = useState(false)
  const transcriptRef = useRef('')
  const recogRef = useRef(null)
  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(null)
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const timeLeft = useTimer(SECTION_DURATIONS.speaking, running, () => stopRecording())

  const startRecording = () => {
    transcriptRef.current = ''
    setWordCount(0)
    setElapsed(0)
    setStatus('recording')
    setRunning(true)

    elapsedRef.current = setInterval(() => setElapsed(e => e+1), 1000)

    if (supported) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
      const r = new SpeechRec()
      r.continuous = true
      r.interimResults = true
      r.lang = 'en-US'
      r.onresult = (e) => {
        let newFinal = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + ' '
        }
        if (newFinal) {
          transcriptRef.current += newFinal
          setWordCount(transcriptRef.current.trim().split(/\s+/).filter(Boolean).length)
        }
      }
      r.onerror = (e) => {
        if (e.error !== 'no-speech') console.warn('Speech error:', e.error)
      }
      r.start()
      recogRef.current = r
    }
  }

  const stopRecording = () => {
    setRunning(false)
    setStatus('done')
    clearInterval(elapsedRef.current)
    recogRef.current?.stop()
  }

  const handleSubmit = () => {
    onComplete(transcriptRef.current || '[No speech captured — student spoke aloud]')
  }

  return (
    <div className="app-container">
      <SectionHeader title="Speaking" subtitle="Stage 2 — Presentation"
        timeLeft={timeLeft} totalTime={SECTION_DURATIONS.speaking} color="var(--coral)"/>

      {/* Topic card */}
      <Card style={{ marginBottom:14, background:'var(--coralBg)', borderColor:'rgba(248,113,113,0.3)' }}>
        <div style={{ fontSize:11, color:'var(--coral)', fontWeight:600, marginBottom:6, letterSpacing:'0.5px' }}>
          YOUR SPEAKING TOPIC
        </div>
        <p style={{ fontSize:13, color:'var(--textM)', fontStyle:'italic', marginBottom:8, lineHeight:1.6 }}>
          "{topic.source}"
        </p>
        <p style={{ fontSize:14, fontWeight:600, color:'var(--text)', lineHeight:1.6 }}>{topic.task}</p>
      </Card>

      {/* Structure guide */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--text)', marginBottom:8 }}>
          🏗 Preparation Notes (use these 2 minutes to plan)
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {topic.structure.map((s,i) => (
            <div key={i} style={{ fontSize:12, color:'var(--textM)', padding:'6px 10px',
              background:'var(--bg3)', borderRadius:7, lineHeight:1.5 }}>
              <span style={{ color:'var(--coral)', fontWeight:600, marginRight:6 }}>{i+1}.</span>{s}
            </div>
          ))}
        </div>
      </Card>

      {/* Recorder */}
      <Card style={{ borderColor: status==='recording' ? 'rgba(248,113,113,0.4)' : 'var(--border)' }}>
        {status === 'ready' && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:13, color:'var(--textM)', marginBottom:6, lineHeight:1.6 }}>
              {supported
                ? 'Your speech will be recorded automatically. Speak clearly and naturally.'
                : 'Your browser does not support voice recording — type your response below instead.'}
            </div>
            <div style={{ fontSize:12, color:'var(--textD)', marginBottom:20 }}>
              Aim for 3–5 minutes. Begin: "I will now begin my presentation…"
            </div>
            {supported ? (
              <button onClick={startRecording} style={{
                padding:'12px 32px', borderRadius:10, border:'none',
                background:'linear-gradient(135deg,var(--coral),#dc2626)',
                color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
                🔴 Start Recording
              </button>
            ) : (
              <>
                <textarea
                  onChange={e => { transcriptRef.current = e.target.value; setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length) }}
                  placeholder="Type your spoken response here…"
                  style={{ width:'100%', minHeight:160, boxSizing:'border-box', marginBottom:12 }}/>
                <button onClick={() => { setStatus('done'); onComplete(transcriptRef.current) }} style={{
                  padding:'10px 28px', borderRadius:8, border:'none',
                  background:'linear-gradient(135deg,var(--coral),#dc2626)',
                  color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                  Submit Speaking →
                </button>
              </>
            )}
          </div>
        )}

        {status === 'recording' && (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            {/* Pulsing recording indicator */}
            <div style={{ position:'relative', width:64, height:64, margin:'0 auto 16px' }}>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%',
                background:'rgba(248,113,113,0.2)', animation:'pulse 1.5s ease-out infinite' }}/>
              <div style={{ position:'absolute', inset:8, borderRadius:'50%',
                background:'rgba(248,113,113,0.4)', animation:'pulse 1.5s ease-out infinite .3s' }}/>
              <div style={{ position:'absolute', inset:16, borderRadius:'50%',
                background:'var(--coral)', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:14 }}>🎙️</div>
            </div>
            <style>{`@keyframes pulse { 0% { transform:scale(1); opacity:.7 } 70% { transform:scale(1.4); opacity:0 } 100% { transform:scale(1.4); opacity:0 } }`}</style>

            <div style={{ fontSize:16, fontWeight:700, color:'var(--coral)', marginBottom:4 }}>
              Recording…
            </div>
            <div style={{ fontSize:13, color:'var(--textM)', marginBottom:8 }}>
              Speak clearly about your topic
            </div>
            <div style={{ display:'flex', gap:20, justifyContent:'center', marginBottom:20 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:700, fontFamily:'monospace', color:'var(--text)' }}>
                  {fmt(elapsed)}
                </div>
                <div style={{ fontSize:10, color:'var(--textD)' }}>elapsed</div>
              </div>
              <div style={{ width:'1px', background:'var(--border)' }}/>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:700, color:'var(--teal)' }}>{wordCount}</div>
                <div style={{ fontSize:10, color:'var(--textD)' }}>words captured</div>
              </div>
            </div>
            <button onClick={stopRecording} style={{
              padding:'10px 28px', borderRadius:8,
              border:'1px solid rgba(248,113,113,0.4)',
              background:'var(--coralBg)', color:'var(--coral)',
              fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              ⏹ Stop Recording
            </button>
          </div>
        )}

        {status === 'done' && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:32, marginBottom:10 }}>✅</div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
              Recording complete
            </div>
            <div style={{ fontSize:13, color:'var(--textM)', marginBottom:20 }}>
              {wordCount > 0
                ? `${wordCount} words captured · ${fmt(elapsed)} recorded`
                : 'Your response has been captured.'}
            </div>
            <button onClick={handleSubmit} style={{
              padding:'11px 32px', borderRadius:8, border:'none',
              background:'linear-gradient(135deg,var(--teal),var(--blue))',
              color:'#000', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Submit & See Results →
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── SCORING PHASE ───────────────────────────────────────────────────────────
function ScoringPhase({ listeningAnswers, readingAnswers, writingText, speakingTranscript, onDone }) {
  const [status, setStatus] = useState('Scoring Listening & Reading…')

  useEffect(() => {
    async function score() {
      // 1. Auto-score listening
      const lTest = MOCK.listening
      const lScore = lTest.qs.reduce((s,q,i) => {
        const ans = listeningAnswers[i]
        return s + (ans === q.a ? 1 : 0)
      }, 0)
      const lBand = parseFloat((lScore/lTest.qs.length*9).toFixed(1))

      // 2. Auto-score reading
      const rTest = MOCK.reading
      const rScore = rTest.qs.reduce((s,q,i) => {
        const ans = readingAnswers[i]
        if (q.type === 'fill') return s + (typeof ans === 'string' && ans.toUpperCase().trim() === q.a.toUpperCase() ? 1 : 0)
        return s + (ans === q.a ? 1 : 0)
      }, 0)
      const rBand = parseFloat((rScore/rTest.qs.length*9).toFixed(1))

      setStatus('Getting AI feedback on your Writing…')

      // 3. AI score writing
      let wBand = 6.0
      try {
        const wRes = await fetch('/api/feedback', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ messages:[{ role:'user', content:
            `You are an Oxford ELLT examiner. Score this essay for the prompt: "${MOCK.writing.task}"\n\nEssay:\n${writingText}\n\nReply with ONLY a JSON object: {"band":"B2","score":65,"comment":"one sentence"}`
          }]})
        })
        const wData = await wRes.json()
        const wText = wData.content?.[0]?.text || ''
        const wJson = JSON.parse(wText.replace(/```json|```/g,'').trim())
        const bandMap = {'C2':9,'C1':7.5,'B2+':7,'B2':6,'B1+':5.5,'B1':5}
        wBand = bandMap[wJson.band] || 6.0
      } catch(e) { wBand = writingText.length > 200 ? 6.5 : 5.5 }

      setStatus('Getting AI feedback on your Speaking…')

      // 4. AI score speaking
      let sBand = 6.0
      try {
        const sRes = await fetch('/api/feedback', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ messages:[{ role:'user', content:
            `You are an Oxford ELLT speaking examiner. Score this transcribed spoken response for the topic: "${MOCK.speaking.task}"\n\nTranscript:\n${speakingTranscript}\n\nReply with ONLY a JSON object: {"band":"B2","score":65,"comment":"one sentence"}`
          }]})
        })
        const sData = await sRes.json()
        const sText = sData.content?.[0]?.text || ''
        const sJson = JSON.parse(sText.replace(/```json|```/g,'').trim())
        const bandMap = {'C2':9,'C1':7.5,'B2+':7,'B2':6,'B1+':5.5,'B1':5}
        sBand = bandMap[sJson.band] || 6.0
      } catch(e) { sBand = speakingTranscript.split(/\s+/).filter(Boolean).length > 100 ? 6.5 : 5.5 }

      const overall = parseFloat(((lBand+rBand+wBand+sBand)/4).toFixed(1))
      onDone({ lScore, lBand, rScore, rBand, wBand, sBand, overall })
    }
    score()
  }, [])

  return (
    <div style={{ maxWidth:400, margin:'80px auto', textAlign:'center', padding:'0 20px' }}>
      <div style={{ fontSize:40, marginBottom:16 }}>⏳</div>
      <div style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:8 }}>
        Calculating your results…
      </div>
      <div style={{ fontSize:13, color:'var(--textM)', marginBottom:20 }}>{status}</div>
      <div style={{ height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:'100%', background:'linear-gradient(90deg,var(--teal),var(--blue))',
          animation:'slide 2s linear infinite', borderRadius:2 }}/>
      </div>
      <style>{`@keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    </div>
  )
}

// ─── RESULTS PHASE ───────────────────────────────────────────────────────────
function ResultsPhase({ scores, onRetake, onHome }) {
  const { lScore, lBand, rScore, rBand, wBand, sBand, overall } = scores

  function bandLabel(b) {
    if (b >= 8) return 'Excellent'
    if (b >= 7) return 'Good'
    if (b >= 6) return 'Competent'
    if (b >= 5) return 'Modest'
    return 'Developing'
  }
  function bandColor(b) {
    if (b >= 7) return 'var(--teal)'
    if (b >= 6) return 'var(--amber)'
    return 'var(--coral)'
  }

  const sections = [
    { name:'Listening', band:lBand, detail:`${lScore}/${MOCK.listening.qs.length} correct`, icon:'🎧', col:'var(--blue)' },
    { name:'Reading',   band:rBand, detail:`${rScore}/${MOCK.reading.qs.length} correct`,   icon:'📖', col:'var(--amber)' },
    { name:'Writing',   band:wBand, detail:'AI scored',                                     icon:'✍️', col:'var(--purple)' },
    { name:'Speaking',  band:sBand, detail:'AI scored',                                     icon:'🎤', col:'var(--coral)' },
  ]

  return (
    <div style={{ maxWidth:620, margin:'0 auto', padding:'40px 20px' }}>
      {/* Overall score hero */}
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, letterSpacing:'0.5px', marginBottom:8 }}>
          FULL MOCK TEST COMPLETE
        </div>
        <div style={{ fontSize:72, fontWeight:700, color:'var(--teal)',
          fontFamily:'monospace', lineHeight:1 }}>
          {overall}
        </div>
        <div style={{ fontSize:16, color:'var(--textM)', marginTop:4 }}>
          Overall Band Score
        </div>
        <div style={{ fontSize:14, fontWeight:600, color: bandColor(overall), marginTop:4 }}>
          {bandLabel(overall)}
        </div>
      </div>

      {/* Section scores */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:24 }}>
        {sections.map(s => (
          <Card key={s.name} style={{ textAlign:'center', borderColor:`${s.col}33` }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:13, color:'var(--textM)', marginBottom:4 }}>{s.name}</div>
            <div style={{ fontSize:32, fontWeight:700, color:s.col }}>{s.band}</div>
            <div style={{ fontSize:11, color:'var(--textD)', marginTop:4 }}>{s.detail}</div>
            <div style={{ height:4, background:'var(--border)', borderRadius:2, marginTop:8 }}>
              <div style={{ height:'100%', width:`${Math.min(100,(s.band/9)*100)}%`,
                background:s.col, borderRadius:2 }}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Feedback summary */}
      <Card style={{ marginBottom:20, background:'var(--tealBg)', borderColor:'var(--tealBr)' }}>
        <div style={{ fontSize:12, color:'var(--teal)', fontWeight:600, marginBottom:10 }}>
          WHAT YOUR SCORE MEANS
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
          {[
            { skill:'Listening', tips: lBand < 7 ? 'Practise identifying key information in longer audio tracks.' : 'Strong listening — maintain by practising with varied accents.' },
            { skill:'Reading',   tips: rBand < 7 ? 'Focus on inference questions and vocabulary in context.' : 'Good reading comprehension — try C1 level texts next.' },
            { skill:'Writing',   tips: wBand < 7 ? 'Work on developing arguments with specific examples.' : 'Well-structured writing — refine academic vocabulary.' },
            { skill:'Speaking',  tips: sBand < 7 ? 'Practise speaking for longer without pausing. Use linking words.' : 'Good fluency — focus on precision and range of vocabulary.' },
          ].map(t => (
            <div key={t.skill} style={{ fontSize:12, color:'var(--textM)', lineHeight:1.5,
              padding:'8px 10px', background:'var(--bg3)', borderRadius:8 }}>
              <strong style={{ color:'var(--text)' }}>{t.skill}:</strong> {t.tips}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
        <button onClick={onHome} style={{
          padding:'10px 24px', borderRadius:8, border:'1px solid var(--border)',
          background:'transparent', color:'var(--textM)', fontWeight:600,
          fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          ← Back to Dashboard
        </button>
        <button onClick={onRetake} style={{
          padding:'10px 24px', borderRadius:8, border:'none',
          background:'linear-gradient(135deg,var(--teal),var(--blue))',
          color:'#000', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          Retake Mock Test
        </button>
      </div>
    </div>
  )
}

// ─── MAIN ORCHESTRATOR ───────────────────────────────────────────────────────
export default function FullMockTest({ userId, addResult, onExit }) {
  const [phase, setPhase] = useState('intro')
  const [transition, setTransition] = useState(null) // {completed, next, nextIcon, nextPhase}
  const [listeningAnswers, setListeningAnswers] = useState({})
  const [readingAnswers, setReadingAnswers] = useState({})
  const [writingText, setWritingText] = useState('')
  const [speakingTranscript, setSpeakingTranscript] = useState('')
  const [scores, setScores] = useState(null)
  const mockId = useRef(crypto.randomUUID())

  const goTo = (phase) => setPhase(phase)

  const afterListening = (ans) => {
    setListeningAnswers(ans)
    setTransition({ completed:'Listening ✓', next:'Reading', nextIcon:'📖', nextPhase:'reading' })
    setPhase('transition')
  }

  const afterReading = (ans) => {
    setReadingAnswers(ans)
    setTransition({ completed:'Reading ✓', next:'Writing', nextIcon:'✍️', nextPhase:'writing' })
    setPhase('transition')
  }

  const afterWriting = (text) => {
    setWritingText(text)
    setTransition({ completed:'Writing ✓', next:'Speaking', nextIcon:'🎤', nextPhase:'speaking' })
    setPhase('transition')
  }

  const afterSpeaking = (transcript) => {
    setSpeakingTranscript(transcript)
    setPhase('scoring')
  }

  const afterScoring = async (finalScores) => {
    setScores(finalScores)

    // Save all 4 sections to Supabase
    const mid = mockId.current
    const saves = [
      { skill:'listening', test_id:MOCK.listening.id, test_title:MOCK.listening.title,
        score:finalScores.lScore, total:MOCK.listening.qs.length, band_score:finalScores.lBand,
        answers:JSON.stringify(listeningAnswers), is_mock:true, mock_test_id:mid },
      { skill:'reading', test_id:MOCK.reading.id, test_title:MOCK.reading.title,
        score:finalScores.rScore, total:MOCK.reading.qs.length, band_score:finalScores.rBand,
        answers:JSON.stringify(readingAnswers), is_mock:true, mock_test_id:mid },
      { skill:'writing', test_id:MOCK.writing.id, test_title:MOCK.writing.title,
        band_score:finalScores.wBand, essay_text:writingText, is_mock:true, mock_test_id:mid },
      { skill:'speaking', test_id:MOCK.speaking.id, test_title:MOCK.speaking.title,
        band_score:finalScores.sBand, is_mock:true, mock_test_id:mid },
    ]

    for (const s of saves) {
      await saveResult(s, userId)
      addResult(s)
    }

    setPhase('results')
  }

  return (
    <div>
      {phase === 'intro'      && <IntroPhase onStart={() => goTo('listening')}/>}
      {phase === 'transition' && transition && (
        <TransitionPhase {...transition}
          onContinue={() => { const next = transition.nextPhase; setTransition(null); goTo(next) }}/>
      )}
      {phase === 'listening'  && <ListeningSection test={MOCK.listening} onComplete={afterListening}/>}
      {phase === 'reading'    && <ReadingSection   test={MOCK.reading}   onComplete={afterReading}/>}
      {phase === 'writing'    && <WritingSection   task={MOCK.writing}   onComplete={afterWriting}/>}
      {phase === 'speaking'   && <SpeakingSection  topic={MOCK.speaking} onComplete={afterSpeaking}/>}
      {phase === 'scoring'    && (
        <ScoringPhase
          listeningAnswers={listeningAnswers}
          readingAnswers={readingAnswers}
          writingText={writingText}
          speakingTranscript={speakingTranscript}
          onDone={afterScoring}/>
      )}
      {phase === 'results' && scores && (
        <ResultsPhase
          scores={scores}
          onRetake={() => { mockId.current = crypto.randomUUID(); setPhase('intro') }}
          onHome={onExit}/>
      )}
    </div>
  )
}
