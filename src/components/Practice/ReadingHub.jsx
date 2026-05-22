import { useState } from 'react'
import { READING, READING_IELTS } from '../../data/reading'
import { Card, Chip, Btn } from '../ui'
import TestTaker from './TestTaker'

const ALL_READING = [...READING, ...READING_IELTS]

export default function ReadingHub({ results, addResult, userId }) {
  const [test, setTest] = useState(null)
  const [filter, setFilter] = useState('all') // all | oxford | ielts

  if (test) {
    return <TestTaker test={test} skill="reading" prev={results.find(r=>r.test_id===test.id)} addResult={addResult} onBack={() => setTest(null)} userId={userId}/>
  }

  const filtered = ALL_READING.filter(t =>
    filter === 'all' ? true : filter === 'ielts' ? t.source : !t.source
  )

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          {ALL_READING.length} Reading Tests
        </div>
        <p style={{ fontSize: 12, color: 'var(--textM)' }}>
          Full passages with 14–16 questions each — MCQ, True/False/NG, fill-in, section matching, and classification.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['all','All Tests'],['oxford','Oxford ELLT'],['ielts','IELTS Academic']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: '6px 14px', borderRadius: 8, border: filter===k ? `1px solid var(--amber)44` : `1px solid var(--border)`,
            background: filter===k ? 'var(--amberBg)' : 'var(--bg2)',
            color: filter===k ? 'var(--amber)' : 'var(--textM)',
            fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {filtered.map(t => {
          const prev = results.find(r => r.test_id === t.id)
          return (
            <Card key={t.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--textM)', marginBottom: 2 }}>
                    {t.source || 'Oxford ELLT'}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--textM)', marginTop: 1 }}>{t.topic}</div>
                </div>
                <Chip text={t.diff} color={t.diff==='C1'?'var(--coral)':'var(--amber)'}/>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                <Chip text={`${t.qs.length} questions`} color="var(--amber)"/>
                {t.source && <Chip text="IELTS Format" color="var(--blue)"/>}
                {prev && <Chip text={`✓ Band ${prev.band_score}`} color="var(--teal)"/>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--textM)', lineHeight: 1.6, background: 'var(--bg3)', borderRadius: 8, padding: '7px 10px', marginBottom: 12 }}>
                {t.passage.slice(0, 140)}…
              </div>
              <Btn primary color="var(--amber)" onClick={() => setTest(t)}>
                {prev ? 'Retry →' : 'Start →'}
              </Btn>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
