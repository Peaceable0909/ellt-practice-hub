import { useState } from 'react'
import { READING } from '../../data/reading'
import { Card, Chip, Btn } from '../ui'
import TestTaker from './TestTaker'

export default function ReadingHub({ results, addResult }) {
  const [test, setTest] = useState(null)

  if (test) {
    const prev = results.find(r => r.test_id === test.id)
    return (
      <TestTaker
        test={test}
        skill="reading"
        prev={prev}
        addResult={addResult}
        onBack={() => setTest(null)}
      />
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          5 Reading Tests
        </div>
        <p style={{ fontSize: 12, color: 'var(--textM)' }}>
          Full reading passages displayed inline followed by 16 questions — MCQ, True/False/NG, and fill-in-the-blank. No PDFs needed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {READING.map(t => {
          const prev = results.find(r => r.test_id === t.id)
          const wordCount = t.passage.split(/\s+/).length
          return (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--textM)', marginBottom: 2 }}>
                    Reading Test {t.id.slice(1)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--textM)', marginTop: 1 }}>{t.topic}</div>
                </div>
                <Chip
                  text={t.diff}
                  color={t.diff === 'C1' ? 'var(--coral)' : 'var(--amber)'}
                />
              </div>

              <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                <Chip text="16 questions" color="var(--amber)" />
                <Chip text={`~${wordCount} words`} color="var(--textD)" />
                {prev && <Chip text={`✓ Band ${prev.band_score}`} color="var(--teal)" />}
              </div>

              {/* Passage preview */}
              <div style={{
                fontSize: 11, color: 'var(--textM)', lineHeight: 1.6,
                background: 'var(--bg3)', borderRadius: 8, padding: '8px 10px',
                marginBottom: 12,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {t.passage.slice(0, 180)}…
              </div>

              <Btn primary color="var(--amber)" onClick={() => setTest(t)}>
                {prev ? 'Retry Test →' : 'Start Test →'}
              </Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
