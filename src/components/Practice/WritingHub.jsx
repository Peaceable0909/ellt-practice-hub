import { useState } from 'react'
import { WRITING, WRITING_TASK1, WRITING_IELTS } from '../../data/writing'
import { saveResult } from '../../lib/supabase'
import { getAIFeedback, buildWritingPrompt } from '../../lib/ai'
import { Card, Btn, Chip, FeedbackBlock } from '../ui'

const ALL_WRITING = [...WRITING, ...WRITING_IELTS]

export default function WritingHub({ results, addResult, userId }) {
  const [selected, setSelected] = useState(null)
  const [essay, setEssay] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('task2') // task1 | task2

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length

  const getAI = async () => {
    if (!essay.trim() || essay.length < 50) return
    setLoadingAI(true); setFeedback('')
    try {
      const text = await getAIFeedback([{ role: 'user', content: buildWritingPrompt(selected.task, essay) }])
      setFeedback(text)
      const bandMatch = text.match(/BAND:\s*([A-Z0-9+]+)/)
      const band = bandMatch ? bandMatch[1] : 'B2'
      const bandScore = band==='C2'?9:band==='C1'?7.5:band==='B2'?6:5
      const row = { skill:'writing', test_id:selected.id, test_title:selected.title, band_score:bandScore, essay_text:essay }
      await saveResult(row, userId)
      addResult(row); setSaved(true)
    } catch (e) { setFeedback('Error connecting to AI. Please try again.') }
    setLoadingAI(false)
  }

  if (selected) {
    const isTask1 = !!selected.chartDescription
    return (
      <div>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
          <button onClick={() => { setSelected(null); setEssay(''); setFeedback(''); setShowModel(false); setSaved(false) }}
            style={{ border:'1px solid var(--border)', background:'transparent', color:'var(--textM)', borderRadius:8, padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit' }}>← Back</button>
          <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>{selected.title}</div>
          {selected.source && <Chip text={selected.source} color="var(--blue)"/>}
          <Chip text={`Band ${selected.band} model`} color="var(--purple)"/>
        </div>
        <Card style={{ background:'var(--purpleBg)', borderColor:'rgba(167,139,250,0.3)', marginBottom:14 }}>
          <div style={{ fontSize:11, color:'var(--purple)', fontWeight:600, letterSpacing:'0.5px', marginBottom:6 }}>
            {isTask1 ? 'WRITING TASK 1 — DESCRIBE THE CHART' : 'WRITING TASK 2 — ESSAY'}
          </div>
          <p style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:8 }}>{selected.prompt}</p>
          <p style={{ fontSize:13, color:'var(--textM)', lineHeight:1.6 }}>{selected.task}</p>
        </Card>
        {isTask1 && (
          <Card style={{ marginBottom:14, background:'var(--bg3)' }}>
            <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginBottom:6 }}>📊 Chart Summary</div>
            <p style={{ fontSize:12, color:'var(--textM)', lineHeight:1.6 }}>{selected.chartDescription}</p>
          </Card>
        )}
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Your Response</div>
            <span style={{ fontSize:11, fontWeight:600, color:wordCount>=selected.minWords?'var(--teal)':'var(--amber)' }}>{wordCount} / {selected.minWords}+ words</span>
          </div>
          <textarea value={essay} onChange={e=>setEssay(e.target.value)} placeholder={`Write your response here… (minimum ${selected.minWords} words)`} style={{ width:'100%', minHeight:220, boxSizing:'border-box' }}/>
          <div style={{ display:'flex', gap:10, marginTop:10, justifyContent:'space-between', flexWrap:'wrap' }}>
            <Btn onClick={() => setShowModel(m=>!m)}>{showModel?'Hide':'View'} Model Answer (Band {selected.band})</Btn>
            <Btn primary color="var(--purple)" onClick={getAI} disabled={loadingAI||wordCount<30}>{loadingAI?'Analysing…':'Get AI Feedback →'}</Btn>
          </div>
        </Card>
        {showModel && (
          <Card style={{ background:'var(--tealBg)', borderColor:'var(--tealBr)', marginBottom:14 }}>
            <div style={{ fontSize:11, color:'var(--teal)', fontWeight:600, letterSpacing:'0.5px', marginBottom:8 }}>MODEL ANSWER — BAND {selected.band}</div>
            <p style={{ fontSize:13, color:'var(--textM)', lineHeight:1.8, whiteSpace:'pre-line' }}>{selected.model}</p>
          </Card>
        )}
        <FeedbackBlock feedback={feedback} accentColor="var(--purple)"/>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:4 }}>{ALL_WRITING.length + (WRITING_TASK1?.length||0)} Writing Tasks</div>
        <p style={{ fontSize:12, color:'var(--textM)' }}>Official prompts with model answers and instant AI examiner feedback.</p>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[['task2','Task 2 — Essays'],['task1','Task 1 — Charts']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding:'6px 14px', borderRadius:8, border:tab===k?`1px solid var(--purple)44`:`1px solid var(--border)`,
            background:tab===k?'var(--purpleBg)':'var(--bg2)',
            color:tab===k?'var(--purple)':'var(--textM)',
            fontWeight:600, fontSize:12, cursor:'pointer', fontFamily:'inherit'
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
        {tab === 'task2' && ALL_WRITING.map(w => {
          const prev = results.find(r => r.test_id === w.id)
          return (
            <Card key={w.id} style={{ cursor:'pointer' }} onClick={() => setSelected(w)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <Chip text={w.source || 'Oxford ELLT Task 2'} color="var(--purple)"/>
                <Chip text={`Band ${w.band}`} color="var(--textD)"/>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', margin:'8px 0 4px' }}>{w.title}</div>
              <p style={{ fontSize:12, color:'var(--textM)', fontStyle:'italic', marginBottom:8, lineHeight:1.5 }}>"{w.prompt}"</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Chip text={`${w.minWords}+ words`} color="var(--textD)"/>
                {prev && <Chip text="✓ Submitted" color="var(--teal)"/>}
              </div>
            </Card>
          )
        })}
        {tab === 'task1' && (WRITING_TASK1||[]).map(w => {
          const prev = results.find(r => r.test_id === w.id)
          return (
            <Card key={w.id} style={{ cursor:'pointer' }} onClick={() => setSelected(w)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <Chip text={w.source} color="var(--blue)"/>
                <Chip text={`Band ${w.band}`} color="var(--textD)"/>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', margin:'8px 0 4px' }}>{w.title}</div>
              <p style={{ fontSize:12, color:'var(--textM)', lineHeight:1.5, marginBottom:8 }}>Describe the chart and compare main features.</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Chip text={`${w.minWords}+ words`} color="var(--textD)"/>
                {prev && <Chip text="✓ Submitted" color="var(--teal)"/>}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
