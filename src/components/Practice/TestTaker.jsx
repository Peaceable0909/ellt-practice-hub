import { useState, useMemo } from 'react'
import { saveResult } from '../../lib/supabase'
import { Card, Btn, Chip } from '../ui'

export default function TestTaker({ test, skill, prev, addResult, onBack }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [passageOpen, setPassageOpen] = useState(true)
  const isReading = skill === 'reading'

  const score = useMemo(() => {
    if (!submitted) return 0
    return test.qs.reduce((s, q, i) => {
      const ans = answers[i]
      if (q.type === 'fill') {
        return s + (typeof ans === 'string' && ans.toUpperCase().trim() === q.a.toUpperCase() ? 1 : 0)
      }
      return s + (ans === q.a ? 1 : 0)
    }, 0)
  }, [submitted, answers, test.qs])

  const band = submitted ? (score / test.qs.length * 9).toFixed(1) : null
  const answered = Object.keys(answers).length
  const total = test.qs.length

  const submit = async () => {
    setSaving(true)
    const row = {
      skill,
      test_id: test.id,
      test_title: test.title,
      score,
      total: test.qs.length,
      band_score: parseFloat((score / test.qs.length * 9).toFixed(1)),
      answers: JSON.stringify(answers),
    }
    await saveResult(row)
    addResult(row)
    setSubmitted(true)
    setSaving(false)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={onBack} style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--textM)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{test.title}</div>
          <div style={{ fontSize: 11, color: 'var(--textM)' }}>{test.qs.length} questions · {skill}</div>
        </div>
        {!submitted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--textM)' }}>{answered}/{total} answered</span>
            <div style={{ width: 120, height: 4, background: 'var(--border)', borderRadius: 2 }}>
              <div style={{ width: `${(answered / total) * 100}%`, height: '100%', background: 'var(--teal)', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}
        {submitted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip text={`${score}/${total} correct`} color="var(--teal)" />
            <Chip text={`Band ${band}`} color="var(--amber)" />
          </div>
        )}
      </div>

      {/* Audio + instructions for listening */}
      {!isReading && (
        <Card style={{ marginBottom: 14, background: 'var(--blueBg)', borderColor: 'rgba(59,130,246,0.25)' }}>
          <div style={{ fontSize: 12, color: 'var(--blue)', marginBottom: 8 }}>
            <strong>Instructions:</strong> {test.intro}
          </div>
          {test.audio && <audio controls src={test.audio} style={{ width: '100%' }} />}
        </Card>
      )}

      {/* Passage for reading */}
      {isReading && test.passage && (
        <Card style={{ marginBottom: 14, background: 'var(--bg3)' }}>
          <button
            onClick={() => setPassageOpen(o => !o)}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, color: 'var(--text)', fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}
          >
            📖 Reading Passage — {test.title}
            <span style={{ color: 'var(--textM)', fontSize: 11 }}>{passageOpen ? '▲ Collapse' : '▼ Expand'}</span>
          </button>
          {passageOpen && (
            <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.85, color: 'var(--textM)', whiteSpace: 'pre-line', maxHeight: 340, overflowY: 'auto', paddingRight: 6 }}>
              {test.passage}
            </div>
          )}
        </Card>
      )}

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {test.qs.map((q, qi) => {
          const userAns = answers[qi]
          const isFill = q.type === 'fill'
          const isCorrect = submitted && (isFill
            ? (typeof userAns === 'string' && userAns.toUpperCase().trim() === q.a.toUpperCase())
            : userAns === q.a)
          const isWrong = submitted && !isCorrect

          return (
            <Card key={qi} style={{
              borderColor: submitted ? (isCorrect ? '#22c55e33' : '#ef444433') : 'var(--border)',
              borderLeftWidth: 3,
              borderLeftColor: submitted ? (isCorrect ? '#22c55e' : '#ef4444') : 'var(--border)',
            }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: submitted ? (isCorrect ? '#22c55e22' : '#ef444422') : 'var(--tealBg)',
                  border: `1px solid ${submitted ? (isCorrect ? '#22c55e' : '#ef4444') : 'var(--tealBr)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: submitted ? (isCorrect ? '#22c55e' : '#ef4444') : 'var(--teal)',
                }}>
                  {qi + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: 'var(--text)', lineHeight: 1.55 }}>{q.q}</p>
                  {isFill ? (
                    <div>
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        disabled={submitted}
                        value={typeof answers[qi] === 'string' ? answers[qi] : ''}
                        onChange={e => setAnswers(a => ({ ...a, [qi]: e.target.value.toUpperCase() }))}
                        style={{ maxWidth: 280, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}
                      />
                      {submitted && (
                        <div style={{ marginTop: 8, fontSize: 12, color: isCorrect ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                          {isCorrect ? '✓ Correct!' : `✗ Answer: ${q.a}`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {q.opts.map((opt, oi) => {
                        const isSel = userAns === oi
                        const isAns = oi === q.a
                        let borderCol = 'var(--border)'
                        let bg = 'transparent'
                        let textCol = 'var(--textM)'
                        if (!submitted && isSel) { borderCol = 'var(--teal)'; bg = 'var(--tealBg)'; textCol = 'var(--teal)' }
                        if (submitted && isAns) { borderCol = '#22c55e'; bg = '#22c55e14'; textCol = '#22c55e' }
                        if (submitted && isSel && !isAns) { borderCol = '#ef4444'; bg = '#ef444414'; textCol = '#ef4444' }
                        return (
                          <div
                            key={oi}
                            onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${borderCol}`, background: bg, cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s' }}
                          >
                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${borderCol}`, flexShrink: 0, position: 'relative' }}>
                              {!submitted && isSel && <div style={{ position: 'absolute', top: 2, left: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />}
                              {submitted && isAns && <div style={{ position: 'absolute', top: 2, left: 2, width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />}
                              {submitted && isSel && !isAns && <div style={{ position: 'absolute', top: 2, left: 2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />}
                            </div>
                            <span style={{ fontSize: 12, color: textCol, fontWeight: isSel || (submitted && isAns) ? 600 : 400 }}>{opt}</span>
                            {submitted && isAns && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22c55e', fontWeight: 700 }}>✓</span>}
                            {submitted && isSel && !isAns && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>✗</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Submit / retry */}
      {!submitted ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 10 }}>
          <Btn onClick={onBack}>Cancel</Btn>
          <Btn primary onClick={submit} disabled={saving || answered < total}>
            {saving ? 'Saving…' : answered < total ? `Answer ${total - answered} more` : 'Submit Answers →'}
          </Btn>
        </div>
      ) : (
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn onClick={() => { setAnswers({}); setSubmitted(false) }}>Retry Test</Btn>
          <Btn onClick={onBack}>Back to List</Btn>
        </div>
      )}
    </div>
  )
}
