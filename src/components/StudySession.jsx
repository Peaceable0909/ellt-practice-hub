import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, CheckCircle, BookOpen, Headphones, PenLine, Mic, Brain, Star, Sun, Moon } from 'lucide-react'
import { LISTENING, LISTENING_IELTS, LISTENING_CAM17_T1, LISTENING_CAM17_T2,
         LISTENING_CAM17_T3, LISTENING_CAM17_T4, LISTENING_CAM17_EXTRA } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'
import { WRITING, WRITING_TASK1, WRITING_IELTS, WRITING_IELTS_2, WRITING_OFFICIAL_2023 } from '../data/writing'
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
  const [sessionDone, setSessionDone] = useState(false)

  const currentTask = tasks[taskIdx]
  const allDone = tasksDone.length >= tasks.length


  const progress = `${tasksDone.length}/${tasks.length}`

  function finishSession() {
    setSessionDone(true)
    setTimeout(() => onComplete(), 1800)
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

  if (sessionDone) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20 }}>
        <div className="anim-bounceIn" style={{ width:80, height:80, borderRadius:'50%', background:'var(--greenBg)', border:'4px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <CheckCircle size={40} color="var(--green)" />
        </div>
        <div style={{ fontSize:22, fontWeight:900, color:'var(--text)', textAlign:'center' }}>Session Complete</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, marginTop:4 }}>All tasks finished — great work</div>
      </div>
    )
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
          task={currentTask}
          taskIdx={taskIdx}
          results={results}
          addResult={addResult}
          userId={userId}
          onTaskComplete={completeTask}
          onBack={onBack}
        />
      </div>
    </div>
  )
}

function TaskRenderer({ task, taskIdx, results, addResult, userId, onTaskComplete, onBack }) {
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
