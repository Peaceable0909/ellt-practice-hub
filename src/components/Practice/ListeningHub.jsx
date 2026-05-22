import { useState } from 'react'
import { LISTENING } from '../../data/listening'
import { Card, Chip, Btn } from '../ui'
import TestTaker from './TestTaker'

export default function ListeningHub({ results, addResult, userId }) {
  const [test, setTest] = useState(null)

  if (test) {
    const prev = results.find(r => r.test_id === test.id)
    return (
      <TestTaker userId={userId}
        test={test}
        skill="listening"
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
          6 Listening Tests
        </div>
        <p style={{ fontSize: 12, color: 'var(--textM)' }}>
          Listen to the embedded audio, then answer all 8 questions directly here. Answers are marked instantly with full review.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {LISTENING.map(t => {
          const prev = results.find(r => r.test_id === t.id)
          return (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--textM)', marginBottom: 2 }}>
                    Listening Test {t.id.slice(1)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--textM)', marginTop: 1 }}>{t.topic}</div>
                </div>
                <Chip
                  text={t.diff}
                  color={t.diff === 'C1' ? 'var(--coral)' : 'var(--amber)'}
                />
              </div>

              <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                <Chip text={t.type} color="var(--blue)" />
                <Chip text="8 questions" color="var(--textD)" />
                {prev && <Chip text={`✓ Band ${prev.band_score}`} color="var(--teal)" />}
              </div>

              {/* Audio preview */}
              <audio controls src={t.audio} style={{ width: '100%', marginBottom: 10 }} />

              <Btn primary color="var(--blue)" onClick={() => setTest(t)}>
                {prev ? 'Retry Test →' : 'Start Test →'}
              </Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
