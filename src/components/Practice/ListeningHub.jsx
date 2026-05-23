import { useState } from 'react'
import { LISTENING, LISTENING_IELTS, LISTENING_CAM17_T1 } from '../../data/listening'
import { Card, Chip, Btn } from '../ui'
import TestTaker from './TestTaker'
import { Headphones } from 'lucide-react'

const ALL_LISTENING = [...LISTENING, ...LISTENING_IELTS, ...LISTENING_CAM17_T1]

export default function ListeningHub({ results, addResult, userId }) {
  const [test, setTest] = useState(null)
  const [filter, setFilter] = useState('all')

  if (test) {
    return <TestTaker test={test} skill="listening" prev={results.find(r=>r.test_id===test.id)} addResult={addResult} onBack={() => setTest(null)} userId={userId}/>
  }

  const filtered = ALL_LISTENING.filter(t =>
    filter === 'all' ? true : filter === 'ielts' ? t.source : !t.source
  )

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          {ALL_LISTENING.length} Listening Tests
        </div>
        <p style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>
          Oxford ELLT and IELTS Academic tests with real audio recordings.
        </p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 14 }}>
        {[['all','All Tests'],['oxford','Oxford ELLT'],['ielts','IELTS Academic']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: '8px 14px', borderRadius: 10, flexShrink: 0,
            border: filter===k ? `2px solid var(--blue)` : `2px solid var(--border)`,
            borderBottom: filter===k ? `4px solid var(--blueD)` : `4px solid var(--borderB)`,
            background: filter===k ? 'var(--blueBg)' : 'var(--bg2)',
            color: filter===k ? 'var(--blue)' : 'var(--textM)',
            fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.4px', minHeight: 40,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map(t => {
          const prev = results.find(r => r.test_id === t.id)
          const hasAudio = !!t.audio
          return (
            <div key={t.id} className="skill-card" style={{ cursor: 'pointer' }} onClick={() => setTest(t)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--textM)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>
                    {t.source || 'Oxford ELLT'}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t.title}</div>
                </div>
                <Chip text={t.diff} color={t.diff==='C1'?'var(--coral)':'var(--blue)'}/>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                <Chip text={`${t.qs.length} questions`} color="var(--blue)"/>
                {hasAudio && <Chip text="Audio" color="var(--green)"/>}
                {t.source && <Chip text="IELTS" color="var(--purple)"/>}
                {prev && <Chip text={`✓ Band ${prev.band_score}`} color="var(--teal)"/>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--textM)', lineHeight: 1.6, background: 'var(--bg3)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
                {t.intro?.slice(0, 120)}…
              </div>
              {hasAudio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--blueBg)', borderRadius: 8 }}>
                  <Headphones size={13} color="var(--blue)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)' }}>Real audio recording included</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
