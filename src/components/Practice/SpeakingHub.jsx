import { useState } from 'react'
import { SPEAKING } from '../../data/speaking'
import { saveResult } from '../../lib/supabase'
import { getAIFeedback, buildSpeakingPrompt } from '../../lib/ai'
import { Card, Btn, Chip, FeedbackBlock } from '../ui'

export default function SpeakingHub({ results, addResult, userId }) {
  const [selected, setSelected] = useState(null)
  const [response, setResponse] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  const getAI = async () => {
    if (!response.trim() || response.length < 30) return
    setLoadingAI(true)
    setFeedback('')
    try {
      const text = await getAIFeedback([{
        role: 'user',
        content: buildSpeakingPrompt(selected.task, response),
      }])
      setFeedback(text)
      const bandMatch = text.match(/BAND:\s*([A-Z0-9+]+)/)
      const band = bandMatch ? bandMatch[1] : 'B2'
      const bandScore = band === 'C2' ? 9 : band === 'C1' ? 7.5 : band === 'B2' ? 6 : 5
      const row = { skill: 'speaking', test_id: selected.id, test_title: selected.title, band_score: bandScore }
      await saveResult(row, userId)
      addResult(row)
    } catch (e) {
      setFeedback('Error connecting to AI. Please check your API key in Vercel settings.')
    }
    setLoadingAI(false)
  }

  if (selected) {
    return (
      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => { setSelected(null); setResponse(''); setFeedback('') }}
            style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--textM)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            ← Back
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{selected.title}</div>
          <Chip text={selected.stage} color="var(--coral)" />
          <Chip text={selected.duration} color="var(--textD)" />
        </div>

        <Card style={{ background: 'var(--coralBg)', borderColor: 'rgba(248,113,113,0.3)', marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 600, marginBottom: 8, letterSpacing: '0.5px' }}>SPEAKING PROMPT</div>
          <p style={{ fontSize: 13, color: 'var(--textM)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.6 }}>"{selected.source}"</p>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>{selected.task}</p>
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>🏗 Suggested Structure</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {selected.structure.map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--textM)', padding: '7px 10px', background: 'var(--bg3)', borderRadius: 7, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--coral)', fontWeight: 600, marginRight: 6 }}>{i + 1}.</span>{s}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Practice — Write Your Response</div>
          <div style={{ fontSize: 12, color: 'var(--textM)', marginBottom: 10 }}>
            Write as if you are speaking aloud. Aim for {selected.duration}.
          </div>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Write your spoken response here…"
            style={{ minHeight: 150 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <Btn primary color="var(--coral)" onClick={getAI} disabled={loadingAI || response.length < 30}>
              {loadingAI ? 'Evaluating…' : 'Get AI Feedback →'}
            </Btn>
          </div>
        </Card>

        <FeedbackBlock feedback={feedback} accentColor="var(--coral)" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>7 Speaking Topics</div>
        <p style={{ fontSize: 12, color: 'var(--textM)' }}>
          Stage 2 presentation topics with full structure guides. Write your response and get AI examiner scoring.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {SPEAKING.map(s => {
          const prev = results.find(r => r.test_id === s.id)
          return (
            <Card key={s.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(s)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Chip text={s.stage} color="var(--coral)" />
                <Chip text={s.duration} color="var(--textD)" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{s.title}</div>
              <p style={{ fontSize: 12, color: 'var(--textM)', lineHeight: 1.5, marginBottom: 10 }}>{s.task}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip text={`${s.structure.length} steps`} color="var(--textD)" />
                {prev && <Chip text="✓ Practised" color="var(--teal)" />}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
