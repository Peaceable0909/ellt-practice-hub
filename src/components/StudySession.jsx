import { useState } from 'react'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { LISTENING, LISTENING_IELTS, LISTENING_CAM17_T1, LISTENING_CAM17_T2,
         LISTENING_CAM17_T3, LISTENING_CAM17_T4 } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'
import { WRITING, WRITING_TASK1, WRITING_IELTS, WRITING_IELTS_2, WRITING_OFFICIAL_2023 } from '../data/writing'
import { SPEAKING, SPEAKING_IELTS } from '../data/speaking'
import TestTaker from './Practice/TestTaker'
import WritingHub from './Practice/WritingHub'
import SpeakingHub from './Practice/SpeakingHub'
import FullMockTest from './FullMockTest'

// ─── ALL TESTS POOL ────────────────────────────────────────────
const ALL_LISTENING = [
  ...LISTENING,
  ...LISTENING_IELTS,
  ...LISTENING_CAM17_T1,
  ...(LISTENING_CAM17_T2||[]),
  ...(LISTENING_CAM17_T3||[]),
  ...(LISTENING_CAM17_T4||[]),
]
const ALL_READING  = [...READING, ...READING_IELTS]
const ALL_WRITING  = [
  ...WRITING,
  ...(WRITING_TASK1||[]),
  ...WRITING_IELTS,
  ...(WRITING_IELTS_2||[]),
  ...(WRITING_OFFICIAL_2023||[]),
]
const ALL_SPEAKING = [...SPEAKING, ...(SPEAKING_IELTS||[])]

function resolveTest(session) {
  if (!session?.testId) return null
  const all = [...ALL_LISTENING, ...ALL_READING, ...ALL_WRITING, ...ALL_SPEAKING]
  return all.find(t => t.id === session.testId) || null
}

export default function StudySession({ session, results, addResult, userId, onComplete, onBack }) {
  const [done, setDone] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false) // BUG-05 fix: track real completion
  const test = resolveTest(session)

  const handleTestComplete = () => {
    setHasCompleted(true) // student actually did the test
  }

  const handleDone = () => {
    setDone(true)
    setTimeout(() => onComplete(), 1800)
  }

  // ── COMPLETION SCREEN ──────────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, padding:20 }}>
        <div className="anim-bounceIn" style={{ width:80, height:80, borderRadius:'50%', background:'var(--greenBg)', border:'4px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <CheckCircle size={40} color="var(--green)" />
        </div>
        <div style={{ fontSize:22, fontWeight:900, color:'var(--text)', textAlign:'center' }}>Session Complete!</div>
        <div style={{ fontSize:14, color:'var(--textM)', fontWeight:600, textAlign:'center' }}>Returning to your plan...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Session header bar */}
      <div style={{ background:'var(--bg2)', borderBottom:'2px solid var(--border)', padding:'0 16px', display:'flex', alignItems:'center', height:56, gap:12, position:'sticky', top:0, zIndex:50 }}>
        <button aria-label="Go back" onClick={onBack} style={{ width:36, height:36, borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--textM)', flexShrink:0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {session.label}
          </div>
          <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>
            Day {session.dayNum} · {session.which === 'morning' ? '☀️ Morning' : '🌙 Evening'} Session
          </div>
        </div>
        {/* BUG-05 fix: only show Mark Done after student has actually done something */}
        {hasCompleted && (
          <button onClick={handleDone} style={{ padding:'8px 14px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
            <CheckCircle size={14} /> Mark Done
          </button>
        )}
      </div>

      {/* Session content */}
      <div className="app-container" style={{ paddingBottom:80 }}>

        {/* Intro / Review sessions */}
        {(session.type === 'intro' || session.type === 'review') && (
          <ReviewSession session={session} onDone={handleDone} />
        )}

        {/* Listening or Reading with specific test */}
        {(session.type === 'listening' || session.type === 'reading') && test && (
          <TestTaker
            test={test}
            skill={session.type}
            prev={results.find(r => r.test_id === test.id)}
            addResult={(r) => { addResult(r); handleTestComplete() }}
            userId={userId}
            onBack={onBack}
            onComplete={handleTestComplete}
          />
        )}

        {/* Listening/Reading without specific test — show hub */}
        {(session.type === 'listening' || session.type === 'reading') && !test && (
          <FallbackSession session={session} onDone={handleDone} />
        )}

        {/* Writing */}
        {session.type === 'writing' && (
          <div>
            <WritingHub
              results={results}
              addResult={(r) => { addResult(r); handleTestComplete() }}
              userId={userId}
              preselectedId={session.testId}
            />
            {hasCompleted && (
              <div style={{ marginTop:20, padding:'14px 16px', background:'var(--greenBg)', border:'2px solid var(--green)', borderRadius:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>Great work! Mark this session as done.</span>
                <button onClick={handleDone} style={{ padding:'9px 18px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Done ✓</button>
              </div>
            )}
          </div>
        )}

        {/* Speaking */}
        {session.type === 'speaking' && (
          <div>
            <SpeakingHub
              results={results}
              addResult={(r) => { addResult(r); handleTestComplete() }}
              userId={userId}
              preselectedId={session.testId}
            />
            {hasCompleted && (
              <div style={{ marginTop:20, padding:'14px 16px', background:'var(--greenBg)', border:'2px solid var(--green)', borderRadius:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>Great work! Mark this session as done.</span>
                <button onClick={handleDone} style={{ padding:'9px 18px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Done ✓</button>
              </div>
            )}
          </div>
        )}

        {/* Mock test */}
        {session.type === 'mock' && (
          <FullMockTest userId={userId} addResult={(r) => { addResult(r); handleTestComplete() }} onExit={handleDone} />
        )}
      </div>
    </div>
  )
}

function ReviewSession({ session, onDone }) {
  const tips = {
    review: [
      'Go back over vocabulary from this week. Write each word in a sentence.',
      'Re-read your written responses. Compare them to the model answers.',
      'Listen to one audio you\'ve already done — focus on what you missed.',
      'Review True/False/Not Given answers — understand WHY each answer is correct.',
      'Practise your weakest question type for 30 minutes.',
    ],
    intro: [
      'The Oxford ELLT has 4 sections: Listening, Reading, Writing, and Speaking.',
      'Listening: read the questions BEFORE the audio starts to know what to listen for.',
      'Reading: scan for keywords before reading the full passage.',
      'Writing Task 2: always plan for 5 minutes before writing.',
      'Speaking Stage 2: structure your talk — intro, 3 points, conclusion.',
    ]
  }
  const allTips = tips[session.type] || tips.review

  return (
    <div className="anim-fadeUp">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:20, fontWeight:900, color:'var(--text)', marginBottom:4 }}>{session.label}</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.6 }}>
          {session.desc || 'Use this session to review what you\'ve learned and consolidate before moving on.'}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {allTips.map((tip, i) => (
          <div key={i} style={{ padding:'14px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderLeft:'4px solid var(--green)', borderRadius:12, fontSize:13, color:'var(--text)', fontWeight:600, lineHeight:1.6 }}>
            <span style={{ color:'var(--green)', fontWeight:900, marginRight:8 }}>{i+1}.</span>{tip}
          </div>
        ))}
      </div>
      <button onClick={onDone} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
        Review Complete ✓
      </button>
    </div>
  )
}

function FallbackSession({ session, onDone }) {
  return (
    <div className="anim-fadeUp">
      <div style={{ padding:24, background:'var(--blueBg)', border:'2px solid var(--blueBdr)', borderRadius:16, marginBottom:20, textAlign:'center' }}>
        <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:8 }}>{session.label}</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.6, marginBottom:16 }}>
          {session.desc || `Complete this ${session.type} session using the Practice tab, then come back here to mark it done.`}
        </div>
        <div style={{ fontSize:12, color:'var(--blue)', fontWeight:700 }}>
          Go to Practice → complete a test → return here to mark done.
        </div>
      </div>
      <button onClick={onDone} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
        Mark Session Done ✓
      </button>
    </div>
  )
}
