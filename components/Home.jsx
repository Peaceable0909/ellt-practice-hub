import { Card, Chip } from './ui'

const FEATURES = [
  { key: 'Listening', icon: '🎧', color: 'var(--blue)',   desc: '6 full-length audio tests with 8 questions each — played and answered inline' },
  { key: 'Reading',   icon: '📖', color: 'var(--amber)',  desc: '5 academic passages with 16 questions each — full text displayed here' },
  { key: 'Writing',   icon: '✍️', color: 'var(--purple)', desc: 'Official prompts with model answers and instant AI examiner feedback' },
  { key: 'Speaking',  icon: '🎤', color: 'var(--coral)',  desc: 'Stage 2 presentation guides with structure frameworks and AI scoring' },
]

export default function Home({ setPage, results, profile }) {
  const totalTests = results.length
  const avgBand = totalTests
    ? (results.reduce((s, r) => s + (r.band_score || 0), 0) / totalTests).toFixed(1)
    : '—'

  return (
    <div className="app-container">
      {/* Hero */}
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 100,
          border: '1px solid var(--tealBr)', background: 'var(--tealBg)', marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, letterSpacing: '0.5px' }}>
            OXFORD ELLT SIMULATION HUB
          </span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text)', margin: '0 0 14px', lineHeight: 1.15, letterSpacing: '-0.8px' }}>
          Welcome back${profile?.full_name ? ', '+profile.full_name : ''}!<br />
          <span style={{ color: 'var(--teal)' }}>All content right here.</span>
        </h1>

        <p style={{ fontSize: 15, color: 'var(--textM)', lineHeight: 1.7, margin: '0 0 24px' }}>
          16 official practice tests across Listening, Reading, Writing, and Speaking — displayed fully inline, no redirects to PDFs.
          Get instant AI feedback, track your band scores, and join live sessions with expert tutors.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage('Practice')}
            style={{
              padding: '12px 24px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, var(--teal), var(--blue))',
              color: '#000', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Start Practicing →
          </button>
          <button
            onClick={() => setPage('Mock Tests')}
            style={{
              padding: '12px 24px', borderRadius: 10,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--textM)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Take Mock Test
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 40 }}>
        {FEATURES.map(f => (
          <Card key={f.key} style={{ cursor: 'pointer' }} onClick={() => setPage('Practice')}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: f.color, marginBottom: 5 }}>{f.key}</div>
            <div style={{ fontSize: 12, color: 'var(--textM)', lineHeight: 1.55 }}>{f.desc}</div>
            <div style={{ marginTop: 12, fontSize: 11, color: f.color, fontWeight: 600 }}>Practice Now →</div>
          </Card>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { v: totalTests || '0', l: 'Tests Completed',     col: 'var(--teal)'   },
          { v: avgBand,           l: 'Current Band Score',  col: 'var(--amber)'  },
          { v: '16',              l: 'Official Tests',       col: 'var(--blue)'   },
          { v: 'AI',              l: 'Feedback Engine',      col: 'var(--purple)' },
        ].map(s => (
          <Card key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.col, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Why us */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { icon: '📚', title: '16 Official Tests',   sub: 'Real Oxford ELLT resources',     col: 'var(--teal)'   },
          { icon: '🤖', title: 'AI Feedback',         sub: 'Band-level examiner scoring',    col: 'var(--purple)' },
          { icon: '📡', title: 'Live Sessions',        sub: 'Expert tutors, group practice',  col: 'var(--coral)'  },
        ].map(c => (
          <Card key={c.title} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: `${c.col}18`, border: `1px solid ${c.col}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{c.title}</div>
              <div style={{ fontSize: 12, color: 'var(--textM)', marginTop: 2 }}>{c.sub}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
