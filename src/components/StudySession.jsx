import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, CheckCircle, BookOpen, Headphones, PenLine, Mic, Brain, Star, Sun, Moon } from 'lucide-react'
import { LISTENING, LISTENING_IELTS, LISTENING_CAM17_T1, LISTENING_CAM17_T2,
         LISTENING_CAM17_T3, LISTENING_CAM17_T4, LISTENING_CAM17_EXTRA } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'
import { WRITING, WRITING_TASK1, WRITING_IELTS, WRITING_IELTS_2, WRITING_OFFICIAL_2023, WRITING_IELTS_3, WRITING_IELTS_4 } from '../data/writing'
import { SPEAKING, SPEAKING_IELTS } from '../data/speaking'
import TestTaker from './Practice/TestTaker'
import WritingHub from './Practice/WritingHub'
import SpeakingHub from './Practice/SpeakingHub'
import FullMockTest from './FullMockTest'

const ALL_LISTENING = [...LISTENING, ...LISTENING_IELTS, ...LISTENING_CAM17_T1,
  ...(LISTENING_CAM17_T2||[]), ...(LISTENING_CAM17_T3||[]), ...(LISTENING_CAM17_T4||[]),
  ...(LISTENING_CAM17_EXTRA||[])]
const ALL_READING  = [...READING, ...(READING_IELTS||[])]
const ALL_WRITING  = [...WRITING, ...(WRITING_TASK1||[]), ...WRITING_IELTS,
  ...(WRITING_IELTS_2||[]), ...(WRITING_OFFICIAL_2023||[])]
const ALL_SPEAKING = [...SPEAKING, ...(SPEAKING_IELTS||[])]

function resolveTest(skill, testId) {
  if (!testId) return null
  const pool = skill === 'listening' ? ALL_LISTENING
             : skill === 'reading'   ? ALL_READING
             : skill === 'writing'   ? ALL_WRITING
             : skill === 'speaking'  ? ALL_SPEAKING : []
  return pool.find(t => t.id === testId) || null
}

const SKILL_ICON = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic, review: Star, vocab: Brain, mock: Star }
const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--green)', speaking:'var(--purple)', review:'var(--coral)', vocab:'var(--teal)', mock:'var(--green)' }

export default function StudySession({ session, results, addResult, userId, onComplete, onBack }) {
  const tasks = session.tasks || [{ skill: session.type, testId: session.testId, label: session.label }]
  const [taskIdx, setTaskIdx] = useState(0)
  const [tasksDone, setTasksDone] = useState([])
  const [sessionDone, setSessionDone]     = useState(false)
  const [sessionResults, setSessionResults] = useState([])
  const [showGrade, setShowGrade]           = useState(false)

  const currentTask = tasks[taskIdx]
  function trackResult(r) {
    if (r) { setSessionResults(prev => [...prev, r]); addResult(r) }
  }

  const allDone = tasksDone.length >= tasks.length


  const progress = `${tasksDone.length}/${tasks.length}`

  function finishSession() {
    setSessionDone(true)
    setShowGrade(true)
  }

  function completeTask() {
    const newDone = tasksDone.includes(taskIdx) ? tasksDone : [...tasksDone, taskIdx]
    setTasksDone(newDone)
    if (taskIdx < tasks.length - 1) {
      setTaskIdx(taskIdx + 1)  // more tasks — advance
    } else {
      finishSession()           // last task — finish session directly
    }
  }

  if (sessionDone && showGrade) {
    return <SessionGrade session={session} results={sessionResults} tasks={tasks} onContinue={onComplete} />
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Header */}
      <div style={{ background:'var(--bg2)', borderBottom:'2px solid var(--border)', padding:'0 16px', display:'flex', alignItems:'center', height:56, gap:12, position:'sticky', top:0, zIndex:50 }}>
        <button aria-label="Go back" onClick={onBack} style={{ width:36, height:36, borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--textM)', flexShrink:0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{session.label}</div>
          <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>
            Day {session.dayNum} · 
          </div>
        </div>

      </div>

      {/* Task progress bar */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'10px 16px', display:'flex', gap:8, overflowX:'auto' }}>
        {tasks.map((task, i) => {
          const Icon = SKILL_ICON[task.skill] || BookOpen
          const done = tasksDone.includes(i)
          const active = i === taskIdx
          const color = SKILL_COLOR[task.skill] || 'var(--blue)'
          return (
            <button key={i} onClick={() => setTaskIdx(i)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'6px 12px',
              borderRadius:10, border:`2px solid ${active ? color : done ? 'var(--border)' : 'var(--border)'}`,
              borderBottom:`3px solid ${active ? color : done ? 'var(--borderB)' : 'var(--borderB)'}`,
              background: done ? 'var(--greenBg)' : active ? `color-mix(in srgb, ${color} 12%, var(--bg2))` : 'var(--bg3)',
              cursor:'pointer', flexShrink:0, fontFamily:'Nunito, sans-serif',
            }}>
              {done ? <CheckCircle size={13} color="var(--green)" /> : <Icon size={13} color={active ? color : 'var(--textM)'} />}
              <span style={{ fontSize:11, fontWeight:800, color: done ? 'var(--green)' : active ? color : 'var(--textM)', textTransform:'uppercase', letterSpacing:'0.3px' }}>
                {task.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Current task content */}
      <div className="app-container" style={{ paddingBottom:80 }}>
        <TaskRenderer
          key={taskIdx}
          task={currentTask}
          taskIdx={taskIdx}
          results={results}
          addResult={addResult}
          userId={userId}
          onTaskComplete={completeTask}
          onBack={onBack}
          trackResult={trackResult}
        />
      </div>
    </div>
  )
}

function TaskRenderer({ task, taskIdx, results, addResult, trackResult, userId, onTaskComplete, onBack }) {
  trackResult = trackResult || addResult  // fallback
  const { skill, testId, label, desc } = task
  const test = resolveTest(skill, testId)
  const [taskCompleted, setTaskCompleted] = useState(false)

  function handleComplete(r) {
    if (r) addResult(r)
    setTaskCompleted(true)
    // Call directly — more reliable than useEffect-based timer
    setTimeout(() => onTaskComplete(), 900)
  }

  if (taskCompleted) {
    return (
      <div className="anim-bounceIn" style={{ textAlign:'center', padding:'40px 20px' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--greenBg)', border:'3px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <CheckCircle size={32} color="var(--green)" />
        </div>
        <div style={{ fontSize:20, fontWeight:900, color:'var(--text)', marginBottom:6 }}>Task Complete</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600 }}>Great work on {label}</div>
      </div>
    )
  }

  // Listening / Reading
  if ((skill === 'listening' || skill === 'reading') && test) {
    return (
      <TestTaker
        test={test} skill={skill}
        prev={results.find(r => r.test_id === test.id)}
        addResult={(r) => handleComplete(r)}
        userId={userId} onBack={onBack}
        onComplete={() => {}}
      />
    )
  }

  // Writing
  if (skill === 'writing') {
    return (
      <div>
        <WritingHub results={results} addResult={(r) => handleComplete(r)} userId={userId} preselectedId={testId} />
        <div style={{ marginTop:14, padding:'12px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:12, fontSize:12, color:'var(--textM)', fontWeight:600 }}>
          📝 Complete any writing task above, then tap Next Task when you're done.
        </div>
      </div>
    )
  }

  // Speaking
  if (skill === 'speaking') {
    return (
      <div>
        <SpeakingHub results={results} addResult={(r) => handleComplete(r)} userId={userId} preselectedId={testId} />
        <div style={{ marginTop:14, padding:'12px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:12, fontSize:12, color:'var(--textM)', fontWeight:600 }}>
          🎤 Complete a speaking topic above, then tap Next Task when you're done.
        </div>
      </div>
    )
  }

  // Mock
  if (skill === 'mock') {
    return <FullMockTest userId={userId} addResult={(r) => addResult(r)} onExit={() => handleComplete(null)} />
  }

  // Review / Vocab / fallback
  const tips = {
    review: ['Go back over vocabulary from this week. Write each word in a sentence.','Re-read your written responses and compare with the model answers.','Listen again to one test you already did — focus on what you missed.','Review True/False/Not Given answers — understand WHY each is correct.'],
    vocab:  ['Write down 20 words you encountered this week. Learn their synonyms.','Study word families: achieve → achievement → achievable → unachievable.','Read one academic article and underline words you don\'t know.','Make flashcards for 10 new academic collocations.'],
  }
  const taskTips = tips[skill] || tips.review
  return (
    <div className="anim-fadeUp">
      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.7, marginBottom:20 }}>
        {desc || 'Complete the activities below, then mark this task as done.'}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {taskTips.map((tip, i) => (
          <div key={i} style={{ padding:'14px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderLeft:'4px solid var(--green)', borderRadius:12, fontSize:13, color:'var(--text)', fontWeight:600, lineHeight:1.6 }}>
            <span style={{ color:'var(--green)', fontWeight:900, marginRight:8 }}>{i+1}.</span>{tip}
          </div>
        ))}
      </div>
      <button onClick={onTaskComplete} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
        Task Complete ✓
      </button>
    </div>
  )
}


// ─── All tests pool for grade review ─────────────────────────────────────────
const ALL_L = [...LISTENING, ...(LISTENING_IELTS||[]), ...(LISTENING_CAM17_T1||[]),
  ...(LISTENING_CAM17_T2||[]), ...(LISTENING_CAM17_T3||[]), ...(LISTENING_CAM17_T4||[]),
  ...(LISTENING_CAM17_EXTRA||[])]
const ALL_R = [...(READING||[]), ...(READING_IELTS||[])]
const ALL_W = [...(WRITING||[]), ...(WRITING_TASK1||[]), ...(WRITING_IELTS||[]),
  ...(WRITING_IELTS_2||[]), ...(WRITING_OFFICIAL_2023||[]), ...(WRITING_IELTS_3||[]), ...(WRITING_IELTS_4||[])]
const ALL_S = [...(SPEAKING||[]), ...(SPEAKING_IELTS||[])]
const ALL_TESTS = [...ALL_L, ...ALL_R, ...ALL_W, ...ALL_S]

function resolveTestForGrade(skill, testId) {
  return ALL_TESTS.find(t => t.id === testId) || null
}

function getWrongAnswers(result) {
  const test = resolveTestForGrade(result.skill, result.test_id)
  if (!test || !test.qs || !result.answers) return []
  let answers = {}
  try { answers = typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers } catch { return [] }
  const wrong = []
  test.qs.forEach((q, i) => {
    if (!q.opts) return // skip fill-in for now
    const given = answers[i]
    const correct = q.a
    if (Array.isArray(correct)) {
      if (!correct.includes(given)) wrong.push({ q: q.q, given, correct, opts: q.opts })
    } else {
      if (given !== correct) wrong.push({ q: q.q, given, correct, opts: q.opts })
    }
  })
  return wrong
}

// ─── Session Grade Screen ─────────────────────────────────────────────────────
function SessionGrade({ session, results, tasks, onContinue }) {
  const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)' }
  const SKILL_ICON  = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

  // Grade each result
  const graded = results.map(r => {
    let score, label, color
    if (r.band_score > 0) {
      score = r.band_score
      label = `Band ${r.band_score}`
      color = r.band_score >= 7 ? 'var(--green)' : r.band_score >= 5.5 ? 'var(--amber)' : 'var(--coral)'
    } else if (r.total > 0) {
      const pct = Math.round((r.score / r.total) * 100)
      score = pct
      label = `${r.score}/${r.total} — ${pct}%`
      color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--coral)'
    } else {
      label = 'Done'; color = 'var(--green)'; score = 100
    }
    return { ...r, label, color, score }
  })

  // Overall grade
  const scores = graded.filter(r => r.score > 0)
  const avgPct = scores.length
    ? Math.round(scores.reduce((s, r) => s + (r.band_score > 0 ? (r.band_score / 9) * 100 : r.score), 0) / scores.length)
    : 0

  const grade = avgPct >= 85 ? { letter:'A', label:'Excellent', color:'var(--green)' }
              : avgPct >= 70 ? { letter:'B', label:'Good work', color:'var(--blue)' }
              : avgPct >= 55 ? { letter:'C', label:'Keep going', color:'var(--amber)' }
              :                { letter:'D', label:'Needs practice', color:'var(--coral)' }

  const messages = {
    A: ["Outstanding session — you're right on track!", "Excellent work today. Keep this momentum going."],
    B: ["Solid session — you're making real progress.", "Good consistent work. Every session builds your skills."],
    C: ["You showed up and that's what counts. Review any weak areas tonight.", "Stay consistent — improvement takes time. You're doing it."],
    D: ["Don't be discouraged — difficult questions mean you're pushing yourself.", "Review the answers carefully and try again tomorrow. You'll improve."],
  }
  const msg = messages[grade.letter][Math.floor(Math.random() * 2)]

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'0 0 100px' }}>
      {/* Header */}
      <div style={{ background:'var(--bg2)', borderBottom:'1.5px solid var(--border)', padding:'0 16px', height:56, display:'flex', alignItems:'center' }}>
        <div style={{ fontSize:15, fontWeight:900, color:'var(--text)' }}>Session Complete</div>
      </div>

      <div className="app-container anim-fadeUp">
        {/* Grade hero */}
        <div style={{ textAlign:'center', padding:'32px 0 24px' }}>
          <div style={{ width:90, height:90, borderRadius:'50%', background:`color-mix(in srgb, ${grade.color} 15%, var(--bg2))`, border:`3px solid ${grade.color}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:`0 0 0 8px color-mix(in srgb, ${grade.color} 8%, transparent)` }}>
            <span style={{ fontSize:38, fontWeight:900, color:grade.color }}>{grade.letter}</span>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:'var(--text)', marginBottom:4 }}>{grade.label}</div>
          <div style={{ fontSize:14, color:'var(--textM)', fontWeight:600, maxWidth:280, margin:'0 auto', lineHeight:1.6 }}>{msg}</div>
        </div>

        {/* Task results */}
        {graded.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Your Results</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {graded.map((r, i) => {
                const Icon = SKILL_ICON[r.skill] || BookOpen
                const col  = SKILL_COLOR[r.skill] || 'var(--textM)'
                return (
                  <div key={i} style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, boxShadow:'var(--shadow)' }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:`color-mix(in srgb, ${col} 12%, var(--bg3))`, border:`1.5px solid color-mix(in srgb, ${col} 30%, var(--border))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={18} color={col} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title || r.test_id}</div>
                      <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2, textTransform:'capitalize' }}>{r.skill}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:16, fontWeight:900, color:r.color }}>{r.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Day summary */}
        <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:'14px 16px', marginBottom:24, display:'flex', justifyContent:'space-between', boxShadow:'var(--shadow)' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'var(--text)' }}>Day {session.dayNum}</div>
            <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>Plan Day</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'var(--green)' }}>{graded.length}</div>
            <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>Tasks Done</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:900, color:grade.color }}>{avgPct > 0 ? `${avgPct}%` : '--'}</div>
            <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>Avg Score</div>
          </div>
        </div>

        {/* Questions to work on */}
        {(() => {
          const allWrong = results.flatMap(r => {
            const wrong = getWrongAnswers(r)
            const col = SKILL_COLOR[r.skill] || 'var(--textM)'
            return wrong.map(w => ({ ...w, skill: r.skill, testTitle: r.test_title, col }))
          })
          if (!allWrong.length) return (
            <div style={{ background:'var(--greenBg)', border:'1.5px solid var(--green)', borderRadius:14, padding:'14px 16px', marginBottom:20, textAlign:'center' }}>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--green)' }}>No mistakes — clean session!</div>
              <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginTop:3 }}>Every question answered correctly.</div>
            </div>
          )
          return (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Questions to Review ({allWrong.length})</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {allWrong.slice(0, 8).map((w, i) => (
                  <div key={i} style={{ background:'var(--bg2)', border:'1.5px solid var(--coralBdr)', borderRadius:12, padding:'12px 14px', boxShadow:'var(--shadow)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:w.col, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:5 }}>{w.skill} — {w.testTitle}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:8, lineHeight:1.5 }}>{w.q.replace(/^Q\d+\.\s*/, '')}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      {w.given !== undefined && w.given !== null && w.opts?.[w.given] !== undefined && (
                        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'var(--coralBg)', borderRadius:8 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--coral)', flexShrink:0 }} />
                          <span style={{ fontSize:12, color:'var(--coral)', fontWeight:700 }}>Your answer: </span>
                          <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>{w.opts[w.given]}</span>
                        </div>
                      )}
                      {w.opts?.[w.correct] !== undefined && (
                        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'var(--greenBg)', borderRadius:8 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', flexShrink:0 }} />
                          <span style={{ fontSize:12, color:'var(--green)', fontWeight:700 }}>Correct: </span>
                          <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>{Array.isArray(w.correct) ? w.correct.map(c => w.opts[c]).join(' or ') : w.opts[w.correct]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {allWrong.length > 8 && (
                  <div style={{ textAlign:'center', fontSize:12, color:'var(--textM)', fontWeight:700, padding:'8px' }}>
                    +{allWrong.length - 8} more — check Progress for full history
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Continue button */}
        <button onClick={onContinue} style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:16, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
          Back to My Plan
        </button>
      </div>
    </div>
  )
}
