import { useState } from 'react'
import ListeningHub from './ListeningHub'
import ReadingHub from './ReadingHub'
import WritingHub from './WritingHub'
import SpeakingHub from './SpeakingHub'

const TABS = [
  { key:'Listening', icon:'🎧', color:'var(--blue)', bg:'var(--blueBg)' },
  { key:'Reading',   icon:'📖', color:'var(--amber)', bg:'var(--amberBg)' },
  { key:'Writing',   icon:'✍️', color:'var(--purple)', bg:'var(--purpleBg)' },
  { key:'Speaking',  icon:'🎤', color:'var(--coral)', bg:'var(--coralBg)' },
]

export default function Practice({ results, addResult, userId }) {
  const [tab, setTab] = useState('Listening')
  const active = TABS.find(t => t.key === tab)
  return (
    <div className="app-container">
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Practice Hub</h2>
        <p style={{ color: 'var(--textM)', fontSize: 14, fontWeight: 600 }}>Real Oxford ELLT + IELTS tests — all content displayed directly here, no PDFs.</p>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 18px', borderRadius: 14, cursor: 'pointer',
            border: tab === t.key ? `2px solid ${t.color}` : '2px solid var(--border)',
            borderBottom: tab === t.key ? `4px solid ${t.color}` : '4px solid var(--borderB)',
            background: tab === t.key ? t.bg : 'var(--bg2)',
            color: tab === t.key ? t.color : 'var(--textM)',
            fontWeight: 800, fontSize: 13, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', gap: 7, transition: 'all .2s',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
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
