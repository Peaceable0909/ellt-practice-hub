import { useState } from 'react'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import { LISTENING } from '../data/listening'
import { READING, READING_IELTS } from '../data/reading'
import { WRITING, WRITING_TASK1, WRITING_IELTS } from '../data/writing'
import { SPEAKING } from '../data/speaking'
import TestTaker from './Practice/TestTaker'
import WritingHub from './Practice/WritingHub'
import SpeakingHub from './Practice/SpeakingHub'
import FullMockTest from './FullMockTest'

const ALL_READING  = [...READING, ...READING_IELTS]
const ALL_WRITING  = [...WRITING, ...WRITING_IELTS, ...(WRITING_TASK1||[])]

// Map session testId → the actual test object
function resolveTest(session) {
  if (!session.testId) return null
  const id = session.testId
  return [...LISTENING, ...ALL_READING, ...ALL_WRITING, ...SPEAKING].find(t => t.id === id) || null
}

export default function StudySession({ session, results, addResult, userId, onComplete, onBack }) {
  const [done, setDone] = useState(false)
  const test = resolveTest(session)

  const handleDone = () => {
    setDone(true)
    setTimeout(() => onComplete(), 1200)
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
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--textM)', flexShrink:0 }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {session.label}
          </div>
          <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>
            Day {session.dayNum} · {session.which === 'morning' ? '☀️ Morning' : '🌙 Evening'} Session · {session.duration} mins
          </div>
        </div>
        <button onClick={handleDone} style={{ padding:'8px 14px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
          <CheckCircle size={14} /> Mark Done
        </button>
      </div>

      {/* Session content */}
      <div className="app-container">
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
            addResult={addResult}
            userId={userId}
            onBack={onBack}
            onComplete={handleDone}
          />
        )}

        {/* Listening/Reading without specific test — show hub */}
        {(session.type === 'listening' || session.type === 'reading') && !test && (
          <FallbackSession session={session} onDone={handleDone} />
        )}

        {/* Writing */}
        {session.type === 'writing' && (
          <div>
            <WritingHub results={results} addResult={addResult} userId={userId} preselectedId={session.testId} />
            <div style={{ marginTop:20, padding:'14px 16px', background:'var(--greenBg)', border:'2px solid var(--green)', borderRadius:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>Finished writing? Mark this session as done.</span>
              <button onClick={handleDone} style={{ padding:'9px 18px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Done ✓</button>
            </div>
          </div>
        )}

        {/* Speaking */}
        {session.type === 'speaking' && (
          <div>
            <SpeakingHub results={results} addResult={addResult} userId={userId} preselectedId={session.testId} />
            <div style={{ marginTop:20, padding:'14px 16px', background:'var(--greenBg)', border:'2px solid var(--green)', borderRadius:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>Finished speaking? Mark this session as done.</span>
              <button onClick={handleDone} style={{ padding:'9px 18px', borderRadius:10, border:'none', borderBottom:'3px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>Done ✓</button>
            </div>
          </div>
        )}

        {/* Mock test */}
        {session.type === 'mock' && (
          <FullMockTest userId={userId} addResult={addResult} onExit={handleDone} />
        )}
      </div>
    </div>
  )
}

// Review / intro session content
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
      'You have 18 minutes for each listening section — use the prep time to read questions first.',
      'Reading: scan for keywords before reading the full passage.',
      'Writing Task 2: always plan for 5 minutes before writing.',
      'Speaking Stage 2: structure your presentation — intro, 3 points, conclusion.',
    ]
  }
  const allTips = tips[session.type] || tips.review

  return (
    <div className="anim-fadeUp">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:20, fontWeight:900, color:'var(--text)', marginBottom:4 }}>{session.label}</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.6 }}>
          {session.desc || 'Use this session to review what you\'ve learned and prepare for the next steps.'}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {allTips.map((tip, i) => (
          <div key={i} style={{ padding:'14px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderLeft:`4px solid var(--green)`, borderRadius:12, fontSize:13, color:'var(--text)', fontWeight:600, lineHeight:1.6 }}>
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

// Fallback when testId isn't mapped
function FallbackSession({ session, onDone }) {
  return (
    <div className="anim-fadeUp">
      <div style={{ padding:24, background:'var(--blueBg)', border:'2px solid var(--blueBdr)', borderRadius:16, marginBottom:20, textAlign:'center' }}>
        <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:8 }}>{session.label}</div>
        <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, lineHeight:1.6, marginBottom:16 }}>
          {session.desc || `Complete this ${session.type} session using the materials below.`}
        </div>
        <div style={{ fontSize:12, color:'var(--blue)', fontWeight:700 }}>
          Browse the available tests, complete one, then mark this session as done using the button above.
        </div>
      </div>
      <button onClick={onDone} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
        Mark Session Done ✓
      </button>
    </div>
  )
}
