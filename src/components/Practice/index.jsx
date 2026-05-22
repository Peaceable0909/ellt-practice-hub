import { useState } from 'react'
import { Headphones, BookOpen, PenLine, Mic } from 'lucide-react'
import ListeningHub from './ListeningHub'
import ReadingHub from './ReadingHub'
import WritingHub from './WritingHub'
import SpeakingHub from './SpeakingHub'

const TABS = [
  { key:'Listening', Icon:Headphones, color:'var(--blue)',   bg:'var(--blueBg)'   },
  { key:'Reading',   Icon:BookOpen,   color:'var(--amber)',  bg:'var(--amberBg)'  },
  { key:'Writing',   Icon:PenLine,    color:'var(--purple)', bg:'var(--purpleBg)' },
  { key:'Speaking',  Icon:Mic,        color:'var(--coral)',  bg:'var(--coralBg)'  },
]

export default function Practice({ results, addResult, userId }) {
  const [tab, setTab] = useState('Listening')
  return (
    <div className="app-container">
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Practice Hub</h2>
        <p style={{ color: 'var(--textM)', fontSize: 13, fontWeight: 600 }}>Real Oxford ELLT + IELTS tests — all content inline, no PDFs.</p>
      </div>

      {/* Scrollable tab bar for mobile */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {TABS.map(({ key, Icon, color, bg }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '10px 16px', borderRadius: 14,
            border: tab===key ? `2px solid ${color}` : '2px solid var(--border)',
            borderBottom: tab===key ? `4px solid ${color}` : '4px solid var(--borderB)',
            background: tab===key ? bg : 'var(--bg2)',
            color: tab===key ? color : 'var(--textM)',
            fontWeight: 800, fontSize: 13, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
            textTransform: 'uppercase', letterSpacing: '0.4px',
            cursor: 'pointer', minHeight: 44, flexShrink: 0,
          }}>
            <Icon size={15} />
            {key}
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
