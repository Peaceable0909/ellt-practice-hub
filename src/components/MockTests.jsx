import { useState, useRef, useEffect } from 'react'
import { LISTENING } from '../data/listening'
import { READING } from '../data/reading'
import { WRITING } from '../data/writing'
import { SPEAKING } from '../data/speaking'
import { Card, Chip, Btn } from './ui'
import TestTaker from './Practice/TestTaker'

const SECTIONS = [
  { name: 'Listening', dur: 20 * 60, color: 'var(--blue)',   icon: '🎧', skill: 'listening' },
  { name: 'Reading',   dur: 30 * 60, color: 'var(--amber)',  icon: '📖', skill: 'reading'   },
  { name: 'Writing',   dur: 45 * 60, color: 'var(--purple)', icon: '✍️', skill: 'writing'   },
  { name: 'Speaking',  dur: 15 * 60, color: 'var(--coral)',  icon: '🎤', skill: 'speaking'  },
]

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function MockTests({ results, addResult }) {
  const [timedIdx, setTimedIdx] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [practiceTest, setPracticeTest] = useState(null)
  const timerRef = useRef(null)

  const startTimer = (i) => {
    setTimedIdx(i)
    setTimeLeft(SECTIONS[i].dur)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0 }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  // Drill into a specific test
  if (practiceTest) {
    return (
      <div className="app-container">
        <TestTaker
          test={practiceTest.test}
          skill={practiceTest.skill}
          prev={results.find(r => r.test_id === practiceTest.test.id)}
          addResult={addResult}
          onBack={() => setPracticeTest(null)}
        />
      </div>
    )
  }

  const sec = timedIdx !== null ? SECTIONS[timedIdx] : null

  return (
    <div className="app-container">
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Mock Tests</h2>
      <p style={{ color: 'var(--textM)', fontSize: 13, marginBottom: 22 }}>
        Full Oxford ELLT simulation with timed sections. All content is displayed inline — no PDFs.
      </p>

      {/* Active timer banner */}
      {sec && (
        <Card style={{ marginBottom: 18, borderColor: `${sec.color}44`, background: `${sec.color}08` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--textM)', marginBottom: 2 }}>Active Section</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: sec.color }}>{sec.icon} {sec.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'monospace', color: timeLeft < 300 ? 'var(--coral)' : 'var(--teal)' }}>
                {fmt(timeLeft)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--textM)' }}>{timeLeft === 0 ? 'Time Up!' : 'remaining'}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{ height: '100%', background: sec.color, borderRadius: 2, width: `${(timeLeft / sec.dur) * 100}%`, transition: 'width 1s linear' }} />
          </div>
        </Card>
      )}

      {/* Section cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
        {SECTIONS.map((s, i) => (
          <Card key={s.name} style={{ borderColor: timedIdx === i ? `${s.color}55` : 'var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--textM)', marginTop: 2 }}>
                  {s.skill === 'listening' ? '6 tests available'
                    : s.skill === 'reading' ? '5 tests available'
                    : s.skill === 'writing' ? '5 tasks available'
                    : '7 topics available'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{fmt(s.dur)}</div>
                <div style={{ fontSize: 10, color: 'var(--textD)' }}>duration</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
              <Chip text="Timed" color={s.color} />
              <Chip text="Oxford Format" color="var(--textD)" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => startTimer(i)}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${s.color}44`, background: `${s.color}12`, color: s.color, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Start Timer
              </button>
              <button
                onClick={() => {
                  const tests = s.skill === 'listening' ? LISTENING : s.skill === 'reading' ? READING : null
                  if (tests) setPracticeTest({ test: tests[0], skill: s.skill })
                }}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--textM)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {s.skill === 'writing' || s.skill === 'speaking' ? 'Go to Practice' : 'Practice Test 1'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Full mock CTA */}
      <Card style={{ background: 'linear-gradient(135deg, var(--tealBg), var(--blueBg))', borderColor: 'var(--tealBr)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              Full Mock Test — All 4 Sections
            </div>
            <div style={{ fontSize: 12, color: 'var(--textM)', marginBottom: 8 }}>
              110 min total · All skills · AI scoring · Full band report
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Chip text="Exam Conditions" color="var(--teal)" />
              <Chip text="Full Band Score" color="var(--amber)" />
              <Chip text="AI Feedback" color="var(--purple)" />
            </div>
          </div>
          <button
            onClick={() => startTimer(0)}
            style={{ padding: '11px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--teal), var(--blue))', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
          >
            Start Full Mock →
          </button>
        </div>
      </Card>

      {/* Recent results */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
        Recent Results
      </div>
      {results.length === 0 ? (
        <p style={{ color: 'var(--textM)', fontSize: 13 }}>
          No results yet. Complete a test above to see your band scores here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.slice(0, 10).map((r, i) => (
            <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: `${{ listening: 'var(--blue)', reading: 'var(--amber)', writing: 'var(--purple)', speaking: 'var(--coral)' }[r.skill]}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>
                {{ listening: '🎧', reading: '📖', writing: '✍️', speaking: '🎤' }[r.skill]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.test_title}</div>
                <div style={{ fontSize: 11, color: 'var(--textM)' }}>
                  {r.skill} · {new Date(r.completed_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
