import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, CheckCircle, XCircle, BookOpen, Headphones, PenLine, Mic, Brain, Star, Sun, Moon } from 'lucide-react'
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

const SKILL_ICON  = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic, review: Star, vocab: Brain, mock: Star }
const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--green)', speaking:'var(--purple)', review:'var(--coral)', vocab:'var(--teal)', mock:'var(--green)' }

// ─── Vocabulary bank (32 B2/C1 academic words) ───────────────────────────────
const VOCAB_BANK = [
  { w:'ambiguous',   def:'open to more than one possible meaning',                          alts:['completely clear and easy to understand','impossible to change or reverse','relating only to one academic subject'] },
  { w:'facilitate',  def:'make an action or process easier or smoother',                    alts:['prevent an unwanted outcome from occurring','examine something in great detail','require a specific condition to be met'] },
  { w:'predominant', def:'present as the strongest or most noticeable element',             alts:['existing only in small or limited amounts','happening regularly at fixed intervals','connected to two or more different things'] },
  { w:'subsequent',  def:'coming after or following something in time or order',            alts:['happening at exactly the same time as something else','existing before something else took place','unrelated to what came before'] },
  { w:'accumulate',  def:'gather or build up gradually over time',                          alts:['distribute something equally among a group','reduce to a smaller or simpler form','present data in a structured way'] },
  { w:'adequate',    def:'satisfactory or acceptable; good enough for a purpose',           alts:['extremely impressive or outstanding in quality','unable to meet the required standard','having two completely opposite qualities'] },
  { w:'arbitrary',   def:'based on chance or personal whim rather than reason or system',   alts:['carefully planned according to a logical system','strongly influenced by the opinions of others','relating to official rules and regulations'] },
  { w:'coherent',    def:'logical and consistent; easy to follow and understand',           alts:['made up of many unrelated parts','containing information that cannot be verified','showing a strong emotional response'] },
  { w:'compensate',  def:'give something to reduce or balance the effect of something negative', alts:['increase the severity of a problem','describe something in careful detail','divide something into equal parts'] },
  { w:'constitute',  def:'be a part of a whole; make up or form something',                 alts:['argue strongly against a particular view','reduce something to its most basic form','indicate a future possibility'] },
  { w:'derive',      def:'obtain or develop something from a specified source',              alts:['refuse to accept the truth of something','combine two separate elements together','remove something permanently from a situation'] },
  { w:'distinct',    def:'clearly different and separate from something else',               alts:['closely connected and difficult to separate','typical of a particular time or place','gradually changing from one form to another'] },
  { w:'inevitable',  def:'certain to happen; impossible to avoid or prevent',                alts:['very unlikely to occur under normal conditions','dependent on a number of uncertain factors','able to be changed or reversed with effort'] },
  { w:'inherent',    def:'existing permanently as a natural or essential part of something', alts:['added to something at a later stage','relating to external influences on a system','varying significantly depending on context'] },
  { w:'marginalise', def:'treat someone or something as unimportant or peripheral',          alts:['give extra resources to a particular group','include something as a central feature','describe the positive qualities of something'] },
  { w:'objective',   def:'not influenced by personal feelings; based on facts alone',        alts:['strongly guided by personal opinion and emotion','relating to a single specific goal','difficult to measure or define clearly'] },
  { w:'paradox',     def:'a situation or statement that seems contradictory but may be true',alts:['a simple and straightforward explanation','a pattern that repeats at regular intervals','a system with a single clear answer'] },
  { w:'reinforce',   def:'strengthen or support something to make it more effective',        alts:['gradually weaken something over time','divide something into smaller components','present an opposing viewpoint'] },
  { w:'scrutiny',    def:'close and detailed examination or investigation',                  alts:['a brief or superficial overview','the process of making a decision quickly','formal approval from an authority'] },
  { w:'undermine',   def:'gradually weaken or damage something, especially confidence',      alts:['provide strong support for a position','bring two opposing sides into agreement','make something widely available to others'] },
  { w:'viable',      def:'capable of working successfully; practical and achievable',        alts:['too complicated to implement in practice','requiring significant financial investment','limited to a specific context only'] },
  { w:'advocate',    def:'publicly support or recommend a cause or idea',                    alts:['express strong opposition to a proposal','remain neutral when asked for an opinion','study something without forming a view'] },
  { w:'elaborate',   def:'develop or explain something in further detail',                   alts:['reduce a complex idea to its simplest form','contradict what has previously been stated','combine several arguments into one'] },
  { w:'generate',    def:'cause or produce something; bring something into existence',       alts:['prevent something from developing further','measure the size or scale of something','transfer something from one place to another'] },
  { w:'integrate',   def:'combine or incorporate something into a larger whole',             alts:['remove an element from a larger system','focus exclusively on one aspect of something','repeat an action at regular intervals'] },
  { w:'persist',     def:'continue firmly in spite of difficulty or opposition',             alts:['give up an activity when it becomes difficult','change direction in response to new information','pause temporarily before continuing later'] },
  { w:'sustain',     def:'keep or maintain something at a certain level over time',          alts:['bring something to a sudden stop','introduce a completely new approach','reduce the impact of a negative event'] },
  { w:'simulate',    def:'imitate or reproduce the conditions or appearance of something',   alts:['analyse the original version of something','improve the quality of an existing system','predict future events with certainty'] },
  { w:'radical',     def:'relating to a fundamental change; thorough and far-reaching',      alts:['small and gradual, having little overall effect','acceptable to most people in society','focused on one specific aspect only'] },
  { w:'variable',    def:'not consistent; liable to change or vary over time',               alts:['fixed and unable to be altered or changed','clearly defined and easy to measure','used in the same way in all contexts'] },
  { w:'preliminary', def:'coming before or preparing for the main action or event',          alts:['happening at the very end of a process','the most important stage of something','occurring unexpectedly and without preparation'] },
  { w:'concede',     def:'admit that something is true, especially when reluctant to do so', alts:['reject a statement as completely false','present new evidence to support a claim','avoid giving a direct answer to a question'] },
]

function seededV(n) { const x = Math.sin(n + 42) * 10000; return x - Math.floor(x) }

function pickVocabWords() {
  const today = new Date().toISOString().slice(0, 10)
  const seed = today.split('-').reduce((a, b) => a * 100 + parseInt(b), 0)
  const pool = [...VOCAB_BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(seededV(seed + i) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 10).map((item, qi) => {
    const opts = [item.def, ...item.alts]
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(seededV(seed + qi * 10 + i) * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]]
    }
    return { word: item.w, opts, answer: opts.indexOf(item.def) }
  })
}

export default function StudySession({ session, results, addResult, userId, onComplete, onBack }) {
  const tasks = session.tasks || [{ skill: session.type, testId: session.testId, label: session.label }]
  const [taskIdx, setTaskIdx] = useState(0)
  const [tasksDone, setTasksDone] = useState([])
  const [sessionDone, setSessionDone] = useState(false)
  const [showGrade, setShowGrade]     = useState(false)

  const currentTask = tasks[taskIdx]
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
    return <SessionGrade session={session} allResults={results} tasks={tasks} onContinue={onComplete} />
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

  if (skill === 'vocab')  return <VocabExercise  task={task} addResult={addResult} userId={userId} onTaskComplete={onTaskComplete} />
  if (skill === 'review') return <ReviewSession  task={task} results={results}    onTaskComplete={onTaskComplete} />

  // Generic fallback for any unrecognised skill type
  return (
    <div className="anim-fadeUp">
      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.7, marginBottom:20 }}>
        {desc || 'Complete the activity, then mark this task as done.'}
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
      if (given !== correct) wrong.push({ q: q.q, given, correct, opts: q.opts, explain: q.explain })
    }
  })
  return wrong
}

// ─── Vocabulary Exercise ──────────────────────────────────────────────────────
function VocabExercise({ task, addResult, userId, onTaskComplete }) {
  const questions = useMemo(() => pickVocabWords(), [])
  const [qi,      setQi]      = useState(0)
  const [chosen,  setChosen]  = useState(null)
  const [answers, setAnswers] = useState([])
  const [saved,   setSaved]   = useState(false)
  const col = SKILL_COLOR['vocab'] || 'var(--blue)'

  const current = questions[qi]
  const isDone  = answers.length === questions.length

  function choose(opt) { if (chosen !== null) return; setChosen(opt) }

  function next() {
    const newAnswers = [...answers, chosen]
    setAnswers(newAnswers)
    setChosen(null)
    if (qi < questions.length - 1) setQi(qi + 1)
  }

  useEffect(() => {
    if (isDone && !saved) {
      const score = answers.filter((a, i) => a === questions[i].answer).length
      if (addResult) addResult({ skill:'vocab', test_id:'vocab_daily', test_title:'Vocabulary Exercise', score, total:questions.length, band_score:parseFloat((score/questions.length*9).toFixed(1)) })
      setSaved(true)
    }
  }, [isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isDone) {
    const score = answers.filter((a, i) => a === questions[i].answer).length
    const pct   = Math.round((score / questions.length) * 100)
    return (
      <div className="anim-fadeUp" style={{ paddingBottom:40 }}>
        <div style={{ textAlign:'center', padding:'28px 0 20px' }}>
          <div style={{ fontSize:46, marginBottom:8 }}>{score===10?'🏆':score>=7?'⭐':'📚'}</div>
          <div style={{ fontSize:22, fontWeight:900, color:'var(--text)', marginBottom:4 }}>
            {score===10?'Perfect!':score>=7?'Great work!':'Keep building!'}
          </div>
          <div style={{ fontSize:15, color:'var(--textM)', fontWeight:700 }}>{score}/{questions.length} words correct</div>
        </div>
        <div style={{ height:10, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginBottom:20 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:pct>=80?'var(--green)':pct>=60?'var(--amber)':'var(--coral)', borderRadius:99 }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
          {questions.map((q, i) => {
            const correct = answers[i] === q.answer
            return (
              <div key={i} style={{ padding:'10px 14px', background:'var(--bg2)', border:`2px solid ${correct?'var(--green)':'var(--coral)'}`, borderRadius:12 }}>
                <div style={{ fontSize:13, fontWeight:900, color:'var(--text)', marginBottom:3 }}>{q.word}</div>
                {!correct && <div style={{ fontSize:11, color:'var(--coral)', fontWeight:700 }}>✗ {q.opts[answers[i]]}</div>}
                <div style={{ fontSize:11, color:correct?'var(--green)':'var(--textM)', fontWeight:700 }}>✓ {q.opts[q.answer]}</div>
              </div>
            )
          })}
        </div>
        <button onClick={onTaskComplete} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
          Next Task →
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{ display:'flex', gap:5, marginBottom:16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex:1, height:6, borderRadius:99, background:i<qi?'var(--green)':i===qi?col:'var(--bg3)' }} />
        ))}
      </div>
      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
        Word {qi+1} of {questions.length} · Vocabulary Exercise
      </div>
      <div style={{ fontSize:20, fontWeight:900, color:col, marginBottom:6 }}>
        "{current.word}"
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:18 }}>
        What does this word mean?
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {current.opts.map((opt, oi) => {
          const isChosen  = chosen === oi
          const isCorrect = oi === current.answer
          let bg = 'var(--bg3)', border = 'var(--border)', color = 'var(--text)'
          if (chosen !== null) {
            if (isCorrect)     { bg='var(--greenBg)'; border='var(--green)'; color='var(--green)' }
            else if (isChosen) { bg='var(--coralBg)'; border='var(--coral)'; color='var(--coral)' }
          }
          return (
            <button key={oi} onClick={() => choose(oi)} disabled={chosen !== null}
              style={{ padding:'12px 16px', borderRadius:12, border:`2px solid ${border}`, borderBottom:`3px solid ${chosen!==null&&isCorrect?'var(--greenD)':border}`, background:bg, color, fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, cursor:chosen!==null?'default':'pointer', textAlign:'left', transition:'all .15s', display:'flex', alignItems:'flex-start', gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:'50%', background:`${border}22`, border:`1px solid ${border}`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, flexShrink:0, marginTop:1 }}>
                {String.fromCharCode(65+oi)}
              </span>
              <span style={{ flex:1, lineHeight:1.5 }}>{opt}</span>
              {chosen!==null && isCorrect  && <CheckCircle size={15} color="var(--green)" style={{ flexShrink:0, marginTop:2 }} />}
              {chosen!==null && isChosen && !isCorrect && <XCircle size={15} color="var(--coral)" style={{ flexShrink:0, marginTop:2 }} />}
            </button>
          )
        })}
      </div>
      {chosen !== null && (
        <button onClick={next} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          {qi < questions.length-1 ? 'Next Word →' : 'See Results →'}
        </button>
      )}
    </div>
  )
}

// ─── Review Session ───────────────────────────────────────────────────────────
function ReviewSession({ task, results, onTaskComplete }) {
  const RCOL  = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)' }
  const RICON = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

  const recent = (results || [])
    .filter(r => r.test_id !== 'daily_challenge' && r.test_id !== 'vocab_daily' && ['listening','reading','writing','speaking'].includes(r.skill))
    .slice(0, 3)

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:6 }}>{task.label || 'Review Session'}</div>
      <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.7, marginBottom:20 }}>
        Go through your recent results. For each wrong answer, think about why — then try to recall the correct answer before looking.
      </div>

      {recent.length === 0 ? (
        <div style={{ padding:'20px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:6 }}>No results yet</div>
          <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600 }}>Complete some practice tests first, then review sessions will show your mistakes here.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
          {recent.map((r, ri) => {
            const wrong = getWrongAnswers(r)
            const Icon  = RICON[r.skill] || BookOpen
            const col   = RCOL[r.skill] || 'var(--blue)'
            return (
              <div key={ri} style={{ background:'var(--bg2)', border:`2px solid ${col}33`, borderRadius:14, overflow:'hidden' }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${col}18`, border:`2px solid ${col}33`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={16} color={col} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title}</div>
                    <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>
                      {r.total>0 ? `${r.score}/${r.total}` : r.band_score>0 ? `Band ${r.band_score}` : 'Completed'} · {r.completed_at ? new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : 'Recent'}
                    </div>
                  </div>
                </div>
                {wrong.length > 0 ? (
                  <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{wrong.length} question{wrong.length>1?'s':''} to review</div>
                    {wrong.slice(0, 4).map((w, wi) => (
                      <div key={wi} style={{ padding:'10px 12px', background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:10 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', marginBottom:6, lineHeight:1.5 }}>{w.q.replace(/^Q\d+\.\s*/,'')}</div>
                        {w.given !== undefined && w.opts?.[w.given] !== undefined && (
                          <div style={{ fontSize:11, color:'var(--coral)', fontWeight:700, marginBottom:2 }}>✗ You answered: {w.opts[w.given]}</div>
                        )}
                        <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, marginBottom: w.explain ? 4 : 0 }}>
                          ✓ Correct: {Array.isArray(w.correct) ? w.correct.map(c => w.opts[c]).join(' / ') : w.opts[w.correct]}
                        </div>
                        {w.explain && <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, lineHeight:1.5 }}>{w.explain}</div>}
                      </div>
                    ))}
                    {wrong.length > 4 && <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700, textAlign:'center' }}>+{wrong.length-4} more — check Progress for full history</div>}
                  </div>
                ) : (
                  <div style={{ padding:'12px 16px', fontSize:13, color:'var(--green)', fontWeight:700 }}>✓ All answers correct in this test!</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <button onClick={onTaskComplete} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
        Done Reviewing ✓
      </button>
    </div>
  )
}

// ─── Session Grade Screen ─────────────────────────────────────────────────────
function SessionGrade({ session, allResults, tasks, onContinue }) {
  const [tab, setTab] = useState('review') // 'review' | 'scoreboard'

  const taskTestIds = tasks.map(t => t.testId).filter(Boolean)
  const taskSkills  = [...new Set(tasks.map(t => t.skill))]
  const todayLocal  = new Date().toLocaleDateString('en-CA')

  const results = (allResults || []).filter(r => {
    const isToday = !r.completed_at || new Date(r.completed_at).toLocaleDateString('en-CA') === todayLocal
    const matchesId = taskTestIds.includes(r.test_id)
    const matchesSkill = taskSkills.includes(r.skill)
    return isToday && (matchesId || matchesSkill)
  })
  // Dedupe by test_id — keep latest
  const seen = new Set()
  const dedupedResults = results.filter(r => {
    if (seen.has(r.test_id)) return false
    seen.add(r.test_id)
    return true
  })

  const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)' }
  const SKILL_ICON  = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

  // Grade each result
  const graded = dedupedResults.map(r => {
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

  // ── Plan scoreboard: all plan results grouped by skill ─────────────────────
  const planSkills = ['listening','reading','writing','speaking']
  const planResults = (allResults || []).filter(r => planSkills.includes(r.skill))
  const scoreboardBySkill = planSkills.map(skill => {
    const rs = planResults.filter(r => r.skill === skill)
    if (!rs.length) return { skill, avg: null, count: 0, trend: null }
    const bands = rs.filter(r => r.band_score > 0).map(r => r.band_score)
    const avg = bands.length ? +(bands.reduce((a,b) => a+b,0)/bands.length).toFixed(1) : null
    const recent = bands.slice(-3)
    const older  = bands.slice(-6,-3)
    const trend = recent.length && older.length
      ? (recent.reduce((a,b)=>a+b,0)/recent.length) - (older.reduce((a,b)=>a+b,0)/older.length)
      : null
    return { skill, avg, count: rs.length, trend }
  })
  const worstSkill = scoreboardBySkill.filter(s => s.avg !== null).sort((a,b) => a.avg - b.avg)[0]

  // ── Wrong answers ───────────────────────────────────────────────────────────
  const allWrong = dedupedResults.flatMap(r => {
    const wrong = getWrongAnswers(r)
    const col = SKILL_COLOR[r.skill] || 'var(--textM)'
    return wrong.map(w => ({ ...w, skill: r.skill, testTitle: r.test_title, col }))
  })
  const feedbackResults = dedupedResults.filter(r => (r.skill === 'writing' || r.skill === 'speaking') && r.feedback)

  const ScoreBar = ({ pct, color }) => (
    <div style={{ height:6, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginTop:4 }}>
      <div style={{ width:`${Math.min(100,pct||0)}%`, height:'100%', background:color, borderRadius:99, transition:'width .6s ease' }}/>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'0 0 100px' }}>
      {/* Header */}
      <div style={{ background:'var(--bg2)', borderBottom:'1.5px solid var(--border)', padding:'0 16px', height:56, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ flex:1, fontSize:15, fontWeight:900, color:'var(--text)' }}>Session Complete</div>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--textM)' }}>Day {session.dayNum}</div>
      </div>

      <div className="app-container anim-fadeUp">

        {/* ── HERO ── */}
        <div style={{ textAlign:'center', padding:'28px 0 20px' }}>
          <div style={{ width:96, height:96, borderRadius:'50%', background:`color-mix(in srgb, ${grade.color} 15%, var(--bg2))`, border:`3px solid ${grade.color}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:`0 0 0 10px color-mix(in srgb, ${grade.color} 8%, transparent)` }}>
            <span style={{ fontSize:40, fontWeight:900, color:grade.color }}>{grade.letter}</span>
          </div>
          <div style={{ fontSize:26, fontWeight:900, color:'var(--text)', marginBottom:4 }}>{grade.label}</div>
          <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, maxWidth:300, margin:'0 auto', lineHeight:1.65 }}>{msg}</div>
        </div>

        {/* ── SESSION STATS ROW ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
          {[
            { label:'Session', value:`Day ${session.dayNum}`, color:'var(--blue)' },
            { label:'Tasks Done', value:graded.length, color:'var(--green)' },
            { label:'Avg Score', value:avgPct > 0 ? `${avgPct}%` : '—', color:grade.color },
            { label:'Mistakes', value:allWrong.length, color: allWrong.length === 0 ? 'var(--green)' : 'var(--coral)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:12, padding:'12px 8px', textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:900, color }}>{value}</div>
              <div style={{ fontSize:9, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── PER-SKILL BREAKDOWN ── */}
        {graded.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>This Session — Skill Breakdown</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {graded.map((r, i) => {
                const Icon = SKILL_ICON[r.skill] || BookOpen
                const col  = SKILL_COLOR[r.skill] || 'var(--textM)'
                const bandPct = r.band_score > 0 ? Math.round((r.band_score/9)*100) : r.score || 0
                const wrongCount = allWrong.filter(w => w.testTitle === r.test_title).length
                const status = bandPct >= 78 ? '✓ Strong' : bandPct >= 55 ? '~ Developing' : '✗ Needs work'
                const statusCol = bandPct >= 78 ? 'var(--green)' : bandPct >= 55 ? 'var(--amber)' : 'var(--coral)'
                return (
                  <div key={i} style={{ background:'var(--bg2)', border:`1.5px solid var(--border)`, borderLeft:`4px solid ${col}`, borderRadius:14, padding:'14px 16px', boxShadow:'var(--shadow)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`color-mix(in srgb, ${col} 12%, var(--bg3))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={18} color={col} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title || r.test_id}</div>
                        <div style={{ fontSize:10, color:'var(--textM)', fontWeight:600, marginTop:1, textTransform:'capitalize' }}>{r.skill}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:18, fontWeight:900, color:r.color }}>{r.label}</div>
                        <div style={{ fontSize:10, fontWeight:800, color:statusCol, marginTop:1 }}>{status}</div>
                      </div>
                    </div>
                    <ScoreBar pct={bandPct} color={col} />
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                      <span style={{ fontSize:10, color:'var(--textM)', fontWeight:600 }}>{bandPct}% correct</span>
                      {wrongCount > 0 && <span style={{ fontSize:10, color:'var(--coral)', fontWeight:700 }}>{wrongCount} mistake{wrongCount>1?'s':''} to review</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── PLAN SCOREBOARD ── */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>My Plan — Running Scoreboard</div>
          <div style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow)' }}>
            {scoreboardBySkill.map((s, i) => {
              const Icon = SKILL_ICON[s.skill] || BookOpen
              const col  = SKILL_COLOR[s.skill] || 'var(--textM)'
              const bandPct = s.avg ? Math.round((s.avg/9)*100) : null
              const trendIcon = s.trend === null ? '—' : s.trend > 0.3 ? '↑' : s.trend < -0.3 ? '↓' : '→'
              const trendCol  = s.trend === null ? 'var(--textM)' : s.trend > 0.3 ? 'var(--green)' : s.trend < -0.3 ? 'var(--coral)' : 'var(--amber)'
              return (
                <div key={s.skill} style={{ padding:'13px 16px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: s.avg ? 8 : 0 }}>
                    <Icon size={15} color={col} />
                    <span style={{ fontSize:12, fontWeight:800, color:'var(--text)', textTransform:'capitalize', flex:1 }}>{s.skill}</span>
                    {s.avg !== null ? (
                      <>
                        <span style={{ fontSize:13, fontWeight:900, color: bandPct >= 70 ? 'var(--green)' : bandPct >= 50 ? 'var(--amber)' : 'var(--coral)' }}>Band {s.avg}</span>
                        <span style={{ fontSize:13, fontWeight:900, color:trendCol, marginLeft:6 }}>{trendIcon}</span>
                        <span style={{ fontSize:10, color:'var(--textM)', fontWeight:600, marginLeft:4 }}>{s.count} test{s.count>1?'s':''}</span>
                      </>
                    ) : (
                      <span style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>No data yet</span>
                    )}
                  </div>
                  {s.avg && <ScoreBar pct={bandPct} color={col} />}
                </div>
              )
            })}
          </div>
          {worstSkill && (
            <div style={{ marginTop:10, background:'var(--amberBg)', border:'1.5px solid var(--amber)', borderRadius:12, padding:'12px 14px', display:'flex', gap:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:16 }}>⚠️</span>
              <div>
                <div style={{ fontSize:12, fontWeight:900, color:'var(--amber)', marginBottom:2 }}>Focus area: {worstSkill.skill.charAt(0).toUpperCase()+worstSkill.skill.slice(1)}</div>
                <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, lineHeight:1.5 }}>Your {worstSkill.skill} average is Band {worstSkill.avg} — your lowest skill. Prioritise this in tomorrow's session.</div>
              </div>
            </div>
          )}
        </div>

        {/* ── TABS: QUESTIONS TO REVIEW / AI FEEDBACK ── */}
        {(allWrong.length > 0 || feedbackResults.length > 0) && (
          <div style={{ marginBottom:20 }}>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              {allWrong.length > 0 && (
                <button onClick={() => setTab('review')} style={{ padding:'7px 14px', borderRadius:10, border:`2px solid ${tab==='review'?'var(--coral)':'var(--border)'}`, borderBottom:`3px solid ${tab==='review'?'var(--coralBdr)':'var(--borderB)'}`, background: tab==='review'?'var(--coralBg)':'var(--bg2)', color: tab==='review'?'var(--coral)':'var(--textM)', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
                  ✗ Mistakes ({allWrong.length})
                </button>
              )}
              {feedbackResults.length > 0 && (
                <button onClick={() => setTab('feedback')} style={{ padding:'7px 14px', borderRadius:10, border:`2px solid ${tab==='feedback'?'var(--purple)':'var(--border)'}`, borderBottom:`3px solid ${tab==='feedback'?'var(--purpleBdr)':'var(--borderB)'}`, background: tab==='feedback'?'var(--purpleBg)':'var(--bg2)', color: tab==='feedback'?'var(--purple)':'var(--textM)', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
                  AI Feedback ({feedbackResults.length})
                </button>
              )}
            </div>

            {tab === 'review' && allWrong.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {allWrong.map((w, i) => (
                  <div key={i} style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderLeft:'4px solid var(--coral)', borderRadius:12, padding:'14px', boxShadow:'var(--shadow)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:w.col, textTransform:'uppercase', letterSpacing:'0.4px' }}>{w.skill} — {w.testTitle}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)' }}>Q{i+1} of {allWrong.length}</div>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:10, lineHeight:1.55 }}>{w.q.replace(/^Q\d+\.\s*/, '')}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                      {w.given !== undefined && w.given !== null && w.opts?.[w.given] !== undefined && (
                        <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'7px 10px', background:'var(--coralBg)', borderRadius:8, border:'1px solid var(--coralBdr)' }}>
                          <span style={{ fontSize:11, color:'var(--coral)', fontWeight:800, flexShrink:0 }}>✗ You said:</span>
                          <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>{w.opts[w.given]}</span>
                        </div>
                      )}
                      {w.opts?.[w.correct] !== undefined && (
                        <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'7px 10px', background:'var(--greenBg)', borderRadius:8, border:'1px solid var(--greenBdr)' }}>
                          <span style={{ fontSize:11, color:'var(--green)', fontWeight:800, flexShrink:0 }}>✓ Correct:</span>
                          <span style={{ fontSize:12, color:'var(--text)', fontWeight:600 }}>{Array.isArray(w.correct) ? w.correct.map(c => w.opts[c]).join(' or ') : w.opts[w.correct]}</span>
                        </div>
                      )}
                      {w.explain && (
                        <div style={{ padding:'8px 10px', background:'var(--blueBg)', borderRadius:8, border:'1px solid var(--blueBdr)', marginTop:2 }}>
                          <div style={{ fontSize:10, fontWeight:800, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>Why?</div>
                          <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, lineHeight:1.6 }}>{w.explain}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'feedback' && feedbackResults.map((r, i) => {
              const col = SKILL_COLOR[r.skill] || 'var(--purple)'
              const fb  = r.feedback || ''
              const sections = fb.split('\n').filter(l => l.trim().length > 5)
              return (
                <div key={i} style={{ background:'var(--bg2)', border:`1.5px solid color-mix(in srgb, ${col} 40%, var(--border))`, borderLeft:`4px solid ${col}`, borderRadius:12, padding:'16px', marginBottom:10, boxShadow:'var(--shadow)' }}>
                  <div style={{ fontSize:11, fontWeight:800, color:col, textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:10 }}>{r.skill} AI Feedback — {r.test_title || r.test_id}</div>
                  {sections.map((line, li) => {
                    const isHeader = /^[A-Z\s]+:/.test(line.trim())
                    return isHeader
                      ? <div key={li} style={{ fontSize:11, fontWeight:900, color:col, textTransform:'uppercase', letterSpacing:'0.3px', marginTop:10, marginBottom:3 }}>{line.trim()}</div>
                      : <div key={li} style={{ fontSize:13, color:'var(--text)', fontWeight:600, lineHeight:1.7, paddingLeft:10, borderLeft:`2px solid color-mix(in srgb, ${col} 25%, var(--border))`, marginBottom:4 }}>{line.trim()}</div>
                  })}
                </div>
              )
            })}
          </div>
        )}

        {allWrong.length === 0 && feedbackResults.length === 0 && (
          <div style={{ background:'var(--greenBg)', border:'1.5px solid var(--green)', borderRadius:14, padding:'16px', marginBottom:20, textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>🎉</div>
            <div style={{ fontSize:15, fontWeight:900, color:'var(--green)' }}>Perfect session — no mistakes!</div>
            <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginTop:3 }}>All answers correct. Outstanding work.</div>
          </div>
        )}

        {/* Continue */}
        <button onClick={onContinue} style={{ width:'100%', padding:'15px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:16, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
          Back to My Plan
        </button>
      </div>
    </div>
  )
}
