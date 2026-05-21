import { useMemo } from 'react'
import {
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, Chip } from './ui'

const SKILL_COLORS = {
  listening: 'var(--blue)',
  reading:   'var(--amber)',
  writing:   'var(--purple)',
  speaking:  'var(--coral)',
}
const SKILL_ICONS = { listening: '🎧', reading: '📖', writing: '✍️', speaking: '🎤' }

function avgBand(results, skill) {
  const arr = results.filter(r => r.skill === skill)
  if (!arr.length) return null
  return (arr.reduce((s, r) => s + (r.band_score || 0), 0) / arr.length).toFixed(1)
}

export default function Progress({ results, loading }) {
  const overall = results.length
    ? (results.reduce((s, r) => s + (r.band_score || 0), 0) / results.length).toFixed(1)
    : '—'

  const accuracy = results.length
    ? Math.round(results.filter(r => r.score != null).reduce((s, r) => s + (r.score / r.total || 0), 0) / results.filter(r => r.score != null).length * 100)
    : 0

  // Build chart data grouped by date
  const chartData = useMemo(() => {
    const byDate = {}
    results.forEach(r => {
      const d = (r.completed_at || '').slice(5, 10) || 'Today'
      if (!byDate[d]) byDate[d] = { date: d }
      const k = r.skill.charAt(0).toUpperCase() + r.skill.slice(1)
      byDate[d][k] = parseFloat((r.band_score || 0).toFixed(1))
    })
    return Object.values(byDate).sort((a, b) => a.date > b.date ? 1 : -1).slice(-12)
  }, [results])

  const radarData = ['listening', 'reading', 'writing', 'speaking'].map(s => ({
    skill: s.charAt(0).toUpperCase() + s.slice(1),
    score: parseFloat(avgBand(results, s) || 4),
  }))

  const tooltipStyle = {
    contentStyle: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 },
    labelStyle: { color: 'var(--text)' },
  }

  return (
    <div className="app-container">
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Your Progress</h2>
      <p style={{ color: 'var(--textM)', fontSize: 13, marginBottom: 22 }}>
        Track band scores across all four skills and identify the areas to focus on.
      </p>

      {loading && <p style={{ color: 'var(--textM)', fontSize: 13, marginBottom: 16 }}>Loading results…</p>}

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { v: overall,              l: 'Overall Band',    col: 'var(--teal)'   },
          { v: results.length,       l: 'Tests Done',      col: 'var(--amber)'  },
          { v: `${accuracy}%`,       l: 'Avg Accuracy',    col: 'var(--blue)'   },
          { v: '1d 🔥',              l: 'Study Streak',    col: 'var(--coral)'  },
        ].map(s => (
          <Card key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.col, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Skill breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 22 }}>
        {['listening', 'reading', 'writing', 'speaking'].map(skill => {
          const band = avgBand(results, skill)
          const pct = band ? Math.min(100, (parseFloat(band) / 9) * 100) : 0
          const count = results.filter(r => r.skill === skill).length
          return (
            <Card key={skill}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{SKILL_ICONS[skill]}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{skill}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: SKILL_COLORS[skill] }}>{band || '—'}</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: SKILL_COLORS[skill], borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--textM)' }}>
                {count} test{count !== 1 ? 's' : ''} · {band ? `Band ${band}` : 'No data yet'}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 14, marginBottom: 22 }}>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Band Score History</div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--textM)', fontSize: 10 }} />
                <YAxis domain={[0, 9]} tick={{ fill: 'var(--textM)', fontSize: 10 }} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {['Listening', 'Reading', 'Writing', 'Speaking'].map((s, i) => (
                  <Line
                    key={s} type="monotone" dataKey={s}
                    stroke={['var(--blue)', 'var(--amber)', 'var(--purple)', 'var(--coral)'][i]}
                    strokeWidth={2} dot={false} connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Skill Radar</div>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--textM)', fontSize: 10 }} />
                <Radar dataKey="score" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip {...tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Test history table */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>All Test Results</div>
      {results.length === 0 ? (
        <p style={{ color: 'var(--textM)', fontSize: 13 }}>
          No results yet. Complete a practice test to start tracking your progress.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r, i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: `${SKILL_COLORS[r.skill]}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>
                {SKILL_ICONS[r.skill]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.test_title}</div>
                <div style={{ fontSize: 11, color: 'var(--textM)' }}>
                  {r.skill} · {new Date(r.completed_at || Date.now()).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>
              {r.score != null && (
                <span style={{ fontSize: 12, color: 'var(--textM)' }}>{r.score}/{r.total}</span>
              )}
              <Chip
                text={`Band ${r.band_score}`}
                color={r.band_score >= 7 ? 'var(--teal)' : r.band_score >= 5.5 ? 'var(--amber)' : 'var(--coral)'}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
