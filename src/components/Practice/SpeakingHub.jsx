import { useState, useRef, useEffect } from 'react'
import { SPEAKING } from '../../data/speaking'
import { saveResult } from '../../lib/supabase'
import { Card, Chip, FeedbackBlock } from '../ui'
import { Mic, MicOff, ChevronLeft, Square, Clock, CheckCircle, BookOpen } from 'lucide-react'

// ─── MIC RECORDER ─────────────────────────────────────────────
function MicRecorder({ topic, onComplete }) {
  const [phase, setPhase]         = useState('prep')      // prep | recording | done
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [elapsed, setElapsed]     = useState(0)
  const [prepLeft, setPrepLeft]   = useState(120)         // 2 min prep
  const [wordCount, setWordCount] = useState(0)
  const [supported]               = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition))

  const recogRef    = useRef(null)
  const timerRef    = useRef(null)
  const prepRef     = useRef(null)
  const transcriptRef = useRef('')

  // Prep countdown
  useEffect(() => {
    if (phase !== 'prep') return
    prepRef.current = setInterval(() => {
      setPrepLeft(t => {
        if (t <= 1) { clearInterval(prepRef.current); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(prepRef.current)
  }, [phase])

  const startRecording = () => {
    clearInterval(prepRef.current)
    setPhase('recording')
    setElapsed(0)
    transcriptRef.current = ''
    setTranscript('')

    // Elapsed timer
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)

    if (supported) {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
      const r = new SpeechRec()
      r.continuous = true
      r.interimResults = true
      r.lang = 'en-US'
      r.onresult = (e) => {
        let interim = ''
        let newFinal = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            newFinal += e.results[i][0].transcript + ' '
          } else {
            interim += e.results[i][0].transcript
          }
        }
        if (newFinal) {
          transcriptRef.current += newFinal
          setTranscript(transcriptRef.current)
          setWordCount(transcriptRef.current.trim().split(/\s+/).filter(Boolean).length)
        }
        setInterimText(interim)
      }
      r.onerror = () => {}
      r.onend = () => {
        // Auto-restart if still in recording phase
        if (recogRef.current) {
          try { recogRef.current.start() } catch {}
        }
      }
      r.start()
      recogRef.current = r
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    recogRef.current?.stop()
    recogRef.current = null
    setInterimText('')
    setPhase('done')
    onComplete(transcriptRef.current || '[No speech detected]', elapsed)
  }

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  // ── PREP PHASE ────────────────────────────────────────────
  if (phase === 'prep') {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--textM)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Preparation Time</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: prepLeft <= 30 ? 'var(--coral)' : 'var(--amber)', fontFamily: 'monospace', lineHeight: 1 }}>
            {fmt(prepLeft)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginTop: 4 }}>Plan your presentation using the structure above</div>
        </div>

        {/* Prep bar */}
        <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 99, border: '2px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ height: '100%', background: prepLeft <= 30 ? 'var(--coral)' : 'var(--amber)', borderRadius: 99, width: `${(prepLeft/120)*100}%`, transition: 'width 1s linear, background .5s' }} />
        </div>

        <button onClick={startRecording} style={{
          width: '100%', padding: '18px', borderRadius: 16, border: 'none',
          borderBottom: '5px solid var(--greenD)', background: 'var(--green)',
          color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer',
          fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <Mic size={22} />
          {prepLeft > 0 ? 'Skip Prep — Start Speaking' : 'Start Speaking'}
        </button>
      </div>
    )
  }

  // ── RECORDING PHASE ───────────────────────────────────────
  if (phase === 'recording') {
    return (
      <div>
        {/* Pulsing mic */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
            {/* Outer rings */}
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'rgba(255,75,75,0.08)', animation: 'micPulse 1.5s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'rgba(255,75,75,0.12)', animation: 'micPulse 1.5s ease-out infinite .3s' }} />
            {/* Mic button */}
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--coral)', border: '5px solid #cc3333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={stopRecording}>
              <Mic size={44} color="#fff" />
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--coral)', marginBottom: 4 }}>Recording</div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: 'var(--text)' }}>{fmt(elapsed)}</div>
              <div style={{ fontSize: 10, color: 'var(--textD)', fontWeight: 700, textTransform: 'uppercase' }}>elapsed</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>{wordCount}</div>
              <div style={{ fontSize: 10, color: 'var(--textD)', fontWeight: 700, textTransform: 'uppercase' }}>words</div>
            </div>
          </div>
        </div>

        {/* Live transcript */}
        <div style={{ background: 'var(--bg3)', border: '2px solid var(--border)', borderRadius: 14, padding: 14, marginBottom: 16, minHeight: 80, maxHeight: 200, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--textD)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Live Transcript</div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontWeight: 600 }}>
            {transcript}
            {interimText && <span style={{ color: 'var(--textD)', fontStyle: 'italic' }}>{interimText}</span>}
            {!transcript && !interimText && <span style={{ color: 'var(--textD)', fontStyle: 'italic' }}>Start speaking — your words will appear here...</span>}
          </p>
        </div>

        {!supported && (
          <div style={{ background: 'var(--amberBg)', border: '2px solid var(--amberBdr)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--amber)', fontWeight: 700 }}>
            Voice recording is not supported in this browser. Type your response below instead.
          </div>
        )}

        <button onClick={stopRecording} style={{
          width: '100%', padding: '15px', borderRadius: 14, border: '2px solid var(--coral)',
          borderBottom: '4px solid #cc3333', background: 'var(--coralBg)',
          color: 'var(--coral)', fontWeight: 900, fontSize: 15, cursor: 'pointer',
          fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <Square size={18} fill="var(--coral)" />
          Stop Recording & Get Feedback
        </button>

        <style>{`
          @keyframes micPulse {
            0% { transform: scale(1); opacity: 0.7; }
            70% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  return null
}

// ─── GRADER ───────────────────────────────────────────────────
async function gradeSpeaking({ transcript, topic, structure, duration }) {
  const structureText = structure.map((s, i) => `${i+1}. ${s}`).join('\n')
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  const prompt = `You are an expert Oxford ELLT Stage 2 speaking examiner. Evaluate this student's spoken presentation.

TOPIC: "${topic.task}"

SOURCE PROMPT: "${topic.source}"

EXPECTED STRUCTURE:
${structureText}

STUDENT'S TRANSCRIBED SPEECH (${minutes}m ${seconds}s, ~${transcript.trim().split(/\s+/).filter(Boolean).length} words):
"""
${transcript}
"""

Evaluate the student using Oxford ELLT Stage 2 criteria. Compare their actual response to what was expected.

Respond in EXACTLY this format:

BAND: [B1/B2/C1/C2]

FLUENCY: [1-9] — [one line explanation]
COHERENCE: [1-9] — [one line explanation]  
VOCABULARY: [1-9] — [one line explanation]
GRAMMAR: [1-9] — [one line explanation]
CONTENT: [1-9] — [how well they covered the topic and structure]
TONE: [1-9] — [was the register appropriate and formal enough for ELLT Stage 2]

CONTENT COVERAGE:
- [Did they cover Point 1 from the structure? YES/PARTIALLY/NO — brief comment]
- [Did they cover Point 2? YES/PARTIALLY/NO — brief comment]
- [Did they cover Point 3? YES/PARTIALLY/NO — brief comment]
- [Did they cover Point 4? YES/PARTIALLY/NO — brief comment]

STRENGTHS:
- [Specific strength 1 with example from their speech]
- [Specific strength 2]

IMPROVE:
- [Most important improvement with specific example]
- [Second improvement]

SAMPLE PHRASE: "[Give one example sentence they could have used to sound more natural/academic]"
EXAMINER TIP: [One actionable tip for ELLT Stage 2 — 2 sentences max]`

  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
  })
  const data = await res.json()
  return data.content?.[0]?.text || 'Could not generate feedback.'
}

// ─── SPEAKING HUB ─────────────────────────────────────────────
export default function SpeakingHub({ results, addResult, userId }) {
  const [selected, setSelected] = useState(null)
  const [phase, setPhase]       = useState('intro')  // intro | speaking | feedback
  const [transcript, setTranscript] = useState('')
  const [duration, setDuration] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading]   = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [structureOpen, setStructureOpen] = useState(true)

  const handleSpeechDone = async (text, secs) => {
    setTranscript(text)
    setDuration(secs)
    setPhase('feedback')
    setLoading(true)

    try {
      const fb = await gradeSpeaking({ transcript: text, topic: selected, structure: selected.structure, duration: secs })
      setFeedback(fb)

      const bandMatch = fb.match(/BAND:\s*([A-Z0-9+]+)/)
      const band = bandMatch?.[1] || 'B2'
      const bandScore = band==='C2'?9:band==='C1'?7.5:band==='B2'?6:5
      const row = { skill:'speaking', test_id:selected.id, test_title:selected.title, band_score:bandScore }
      await saveResult(row)
      addResult(row)
    } catch (e) {
      setFeedback('Error connecting to AI. Please try again.')
    }
    setLoading(false)
  }

  if (selected) {
    return (
      <div className="anim-fadeUp">
        {/* Header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => { setSelected(null); setPhase('intro'); setTranscript(''); setFeedback('') }}
            style={{ width: 40, height: 40, borderRadius: 12, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--textM)', flexShrink: 0 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.title}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{selected.stage} · {selected.duration}</div>
          </div>
          {phase === 'feedback' && !loading && (
            <button onClick={() => { setPhase('intro'); setTranscript(''); setFeedback('') }}
              style={{ padding: '8px 14px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--textM)', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              Retry
            </button>
          )}
        </div>

        {/* Topic prompt */}
        <div style={{ background: 'var(--coralBg)', border: '2px solid var(--coralBdr)', borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Your Topic</div>
          <p style={{ fontSize: 13, color: 'var(--textM)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.6, fontWeight: 600 }}>"{selected.source}"</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.55 }}>{selected.task}</p>
        </div>

        {/* Structure guide — collapsible */}
        {phase !== 'feedback' && (
          <div style={{ background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', borderRadius: 14, marginBottom: 16, overflow: 'hidden' }}>
            <button onClick={() => setStructureOpen(o => !o)}
              style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Nunito, sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={15} color="var(--textM)" />
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Presentation Structure</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700 }}>{structureOpen ? '▲ Hide' : '▼ Show'}</span>
            </button>
            {structureOpen && (
              <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--border)' }}>
                {selected.structure.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--textM)', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 10, lineHeight: 1.5, fontWeight: 600 }}>
                    <span style={{ color: 'var(--coral)', fontWeight: 900, marginRight: 6 }}>{i + 1}.</span>{s}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recording interface */}
        {(phase === 'intro' || phase === 'speaking') && (
          <div style={{ background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 18, padding: 20 }}>
            <MicRecorder topic={selected} onComplete={handleSpeechDone} />
          </div>
        )}

        {/* Loading state */}
        {phase === 'feedback' && loading && (
          <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--coralBg)', border: '2px solid var(--coralBdr)', borderRadius: 18 }}>
            <div style={{ position: 'relative', width: 60, height: 60, margin: '0 auto 16px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid var(--coralBg)', borderTop: '4px solid var(--coral)', animation: 'spin 0.8s linear infinite' }} />
              <Mic size={22} color="var(--coral)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--coral)', marginBottom: 4 }}>Grading your presentation...</div>
            <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>Comparing your speech to the topic requirements</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Feedback */}
        {phase === 'feedback' && !loading && feedback && (
          <div className="anim-fadeUp">
            {/* Score cards */}
            <ScoreCards feedback={feedback} />

            {/* Transcript toggle */}
            {transcript && (
              <div style={{ background: 'var(--bg3)', border: '2px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                <button onClick={() => setShowTranscript(t => !t)}
                  style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Nunito, sans-serif' }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Your Transcript</span>
                  <span style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700 }}>{duration}s · {transcript.trim().split(/\s+/).filter(Boolean).length} words</span>
                </button>
                {showTranscript && (
                  <div style={{ padding: '0 16px 14px', fontSize: 13, lineHeight: 1.8, color: 'var(--textM)', borderTop: '1px solid var(--border)', fontStyle: 'italic', fontWeight: 600 }}>
                    {transcript}
                  </div>
                )}
              </div>
            )}

            <FeedbackBlock
              feedback={feedback.replace(/^BAND:.*\n/,'').replace(/FLUENCY:.*\n/,'').replace(/COHERENCE:.*\n/,'').replace(/VOCABULARY:.*\n/,'').replace(/GRAMMAR:.*\n/,'').replace(/CONTENT:.*\n/,'').replace(/TONE:.*\n/,'').trim()}
              accentColor="var(--coral)"
            />
          </div>
        )}
      </div>
    )
  }

  // ── TOPIC LIST ────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Speaking Topics</div>
        <p style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>Choose a topic, prepare for 2 minutes, then speak. AI grades your fluency, content coverage, vocabulary and tone.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {SPEAKING.map(s => {
          const prev = results.find(r => r.test_id === s.id)
          return (
            <div key={s.id} onClick={() => { setSelected(s); setPhase('intro') }} className="skill-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Chip text={s.stage} color="var(--coral)" />
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Chip text={s.duration} color="var(--textD)" />
                  {prev && <Chip text={`Band ${prev.band_score}`} color="var(--green)" />}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>{s.title}</div>
              <p style={{ fontSize: 12, color: 'var(--textM)', lineHeight: 1.55, marginBottom: 12, fontWeight: 600 }}>{s.task}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--coralBg)', borderRadius: 10, border: '1px solid var(--coralBdr)' }}>
                <Mic size={14} color="var(--coral)" />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--coral)' }}>Speak &amp; get AI grading</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SCORE CARDS ──────────────────────────────────────────────
function ScoreCards({ feedback }) {
  const metrics = [
    { key: 'FLUENCY',    color: 'var(--blue)',   bg: 'var(--blueBg)'   },
    { key: 'COHERENCE',  color: 'var(--green)',  bg: 'var(--greenBg)'  },
    { key: 'VOCABULARY', color: 'var(--purple)', bg: 'var(--purpleBg)' },
    { key: 'GRAMMAR',    color: 'var(--amber)',  bg: 'var(--amberBg)'  },
    { key: 'CONTENT',    color: 'var(--teal)',   bg: 'var(--greenBg)'  },
    { key: 'TONE',       color: 'var(--coral)',  bg: 'var(--coralBg)'  },
  ]

  const bandMatch = feedback.match(/BAND:\s*([A-Z0-9+]+)/)
  const band = bandMatch?.[1] || '—'

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Overall band */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--coralBg)', border: '2px solid var(--coralBdr)', borderRadius: 16, marginBottom: 14 }} className="anim-bounceIn">
        <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 4 }}>Overall Band</div>
        <div style={{ fontSize: 52, fontWeight: 900, color: 'var(--coral)', lineHeight: 1 }} className="score-num">{band}</div>
      </div>

      {/* Score grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {metrics.map(({ key, color, bg }) => {
          const match = feedback.match(new RegExp(`${key}:\\s*(\\d+)`))
          const score = match ? parseInt(match[1]) : null
          return (
            <div key={key} style={{ background: bg, border: `2px solid ${color}44`, borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color }} className="score-num">{score ?? '—'}</div>
              <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 99, margin: '5px 0', overflow: 'hidden' }}>
                {score && <div style={{ height: '100%', width: `${(score/9)*100}%`, background: color, borderRadius: 99 }} />}
              </div>
              <div style={{ fontSize: 9, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{key}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
