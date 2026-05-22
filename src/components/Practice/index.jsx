import { useState } from 'react'
import ListeningHub from './ListeningHub'
import ReadingHub from './ReadingHub'
import WritingHub from './WritingHub'
import SpeakingHub from './SpeakingHub'

const TABS = [
  { key: 'Listening', icon: '🎧', color: 'var(--blue)' },
  { key: 'Reading',   icon: '📖', color: 'var(--amber)' },
  { key: 'Writing',   icon: '✍️', color: 'var(--purple)' },
  { key: 'Speaking',  icon: '🎤', color: 'var(--coral)' },
]

export default function Practice({ results, addResult, userId }) {
  const [tab, setTab] = useState('Listening')

  return (
    <div className="app-container">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Practice Hub
        </h2>
        <p style={{ color: 'var(--textM)', fontSize: 13 }}>
          Oxford ELLT practice materials — all questions and passages displayed directly here, no redirects.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 16px', borderRadius: 9,
              border: tab === t.key ? `1px solid ${t.color}44` : '1px solid var(--border)',
              background: tab === t.key ? `${t.color}12` : 'var(--bg2)',
              color: tab === t.key ? t.color : 'var(--textM)',
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          >
            {t.icon} {t.key}
          </button>
        ))}
      </div>

      {tab === 'Listening' && <ListeningHub results={results} addResult={addResult} userId={userId} />}
      {tab === 'Reading'   && <ReadingHub   results={results} addResult={addResult} userId={userId} />}
      {tab === 'Writing'   && <WritingHub   results={results} addResult={addResult} userId={userId} />}
      {tab === 'Speaking'  && <SpeakingHub  results={results} addResult={addResult} userId={userId} />}
    </div>
  )
}
