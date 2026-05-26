import { useState, useRef } from 'react'
import { WRITING, WRITING_TASK1, WRITING_IELTS, WRITING_IELTS_2, WRITING_OFFICIAL_2023, WRITING_IELTS_3, WRITING_IELTS_4 } from '../../data/writing'
import { saveResult } from '../../lib/supabase'
import { Card, Btn, Chip, FeedbackBlock } from '../ui'
import { Camera, Upload, X, Image, PenLine, ChevronLeft, Eye, EyeOff, FileText } from 'lucide-react'
import DiagramRenderer from './DiagramRenderer'

const ALL_WRITING = [...WRITING, ...WRITING_IELTS, ...(WRITING_IELTS_2||[]), ...(WRITING_OFFICIAL_2023||[])]

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── HANDWRITING UPLOADER ─────────────────────────────────────
function HandwritingUploader({ task, taskTitle, userId, addResult, testId, onFeedback }) {
  const [images, setImages] = useState([])      // { url, file, base64, mimeType }
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [transcript, setTranscript] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)

  const addFiles = async (files) => {
    const newImgs = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const base64 = await fileToBase64(file)
      newImgs.push({ url: URL.createObjectURL(file), file, base64, mimeType: file.type })
    }
    setImages(prev => [...prev, ...newImgs].slice(0, 6)) // max 6 images
  }

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i))

  const analyse = async () => {
    if (!images.length) return
    setLoading(true)
    setFeedback('')
    setTranscript('')

    try {
      const prompt = `You are an expert IELTS and Oxford ELLT examiner specialising in handwritten essay assessment.

A student has uploaded ${images.length} handwritten image(s) in response to this writing task:

TASK: "${task}"

Please do the following:
1. Carefully read and transcribe ALL the handwritten text from every image
2. Evaluate the response as an examiner would

Respond in EXACTLY this format:

TRANSCRIPTION:
[Full word-for-word transcription of the handwritten text. Include all text from all images in order.]

BAND: [B1/B2/C1/C2]
SCORE: [50-100]

HANDWRITING: [One sentence about legibility and presentation — mention if it's clear, neat, easy to read]

STRENGTHS:
- [Content/argument strength]
- [Language strength]
- [Structure strength]

AREAS TO IMPROVE:
- [Most important improvement]
- [Second improvement]
- [Third improvement]

GRAMMAR TIP: [One specific grammar correction from the actual text]
VOCABULARY TIP: [One specific vocabulary suggestion]
EXAMINER NOTE: [One practical exam strategy tip — 2 sentences max]`

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images.map(img => ({ data: img.base64, mimeType: img.mimeType })),
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || 'Could not analyse the image. Please try again.'
      setFeedback(text)

      // Extract transcript
      const transcriptMatch = text.match(/TRANSCRIPTION:\n([\s\S]*?)(?=\n\nBAND:|$)/)
      if (transcriptMatch) setTranscript(transcriptMatch[1].trim())

      // Save result — BUG-07 fix: fuzzy band parsing
      const bandMatch = text.match(/BAND:\s*([A-Z0-9+\/\s]+)/)
      const bandRaw = (bandMatch?.[1] || '').toUpperCase()
      const bandScore = bandRaw.includes('C2') ? 9
                      : bandRaw.includes('C1') ? 7.5
                      : bandRaw.includes('B2') ? 6
                      : bandRaw.includes('B1') ? 5
                      : 6 // safe fallback
      const row = { skill:'writing', test_id:testId, test_title:taskTitle, band_score:bandScore }
      await saveResult(row)
      addResult(row)
      setSaved(true)
    } catch (e) {
      setFeedback('Error analysing image. Check your internet connection and try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      {/* Upload area */}
      {images.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          style={{ border: '3px dashed var(--border)', borderRadius: 18, padding: '36px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg3)', transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Upload size={36} color="var(--textD)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Upload your handwriting</div>
          <div style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginBottom: 16 }}>Tap to choose images or use your camera — up to 6 pages</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
              style={{ padding: '10px 18px', borderRadius: 12, border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--text)', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Image size={16} /> Browse Files
            </button>
            <button onClick={e => { e.stopPropagation(); cameraRef.current?.click() }}
              style={{ padding: '10px 18px', borderRadius: 12, border: 'none', borderBottom: '4px solid var(--greenD)', background: 'var(--green)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={16} /> Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Image thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 14 }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', aspectRatio: '3/4', background: 'var(--bg3)' }}>
                <img src={img.url} alt={`Page ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <X size={12} />
                </button>
                <div style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 7px', borderRadius: 99 }}>
                  P{i+1}
                </div>
              </div>
            ))}

            {/* Add more */}
            {images.length < 6 && (
              <div onClick={() => fileRef.current?.click()}
                style={{ borderRadius: 12, border: '3px dashed var(--border)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--textD)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <Upload size={20} />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Add page</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => fileRef.current?.click()}
                style={{ padding: '8px 14px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--textM)', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Image size={14} /> Add Images
              </button>
              <button onClick={() => cameraRef.current?.click()}
                style={{ padding: '8px 14px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--textM)', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Camera size={14} /> Camera
              </button>
            </div>
            <button onClick={analyse} disabled={loading}
              style={{ padding: '12px 22px', borderRadius: 12, border: 'none', borderBottom: `4px solid ${loading ? 'var(--border)' : 'var(--purpleD)'}`, background: loading ? 'var(--bg3)' : 'var(--purple)', color: loading ? 'var(--textD)' : '#fff', fontWeight: 900, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                  Analysing handwriting...
                </>
              ) : (
                <><FileText size={16} /> Analyse with AI</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '24px', background: 'var(--purpleBg)', border: '2px solid var(--purpleBdr)', borderRadius: 16, marginTop: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple)', marginBottom: 6 }}>Reading your handwriting...</div>
          <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 600 }}>Gemini is transcribing and grading your response. This takes 10–20 seconds.</div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99, marginTop: 14, overflow: 'hidden', border: '2px solid var(--border)' }}>
            <div style={{ height: '100%', background: 'var(--purple)', borderRadius: 99, animation: 'indeterminate 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div style={{ marginTop: 14, background: 'var(--blueBg)', border: '2px solid var(--blueBdr)', borderRadius: 14, overflow: 'hidden' }}>
          <button onClick={() => setShowTranscript(t => !t)}
            style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Nunito, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="var(--blue)" />
              <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Transcription</span>
            </div>
            {showTranscript ? <EyeOff size={14} color="var(--textM)" /> : <Eye size={14} color="var(--textM)" />}
          </button>
          {showTranscript && (
            <div style={{ padding: '0 16px 16px', fontSize: 13, lineHeight: 1.8, color: 'var(--textM)', fontStyle: 'italic', borderTop: '1px solid var(--blueBdr)', paddingTop: 12 }}>
              {transcript}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && !loading && (
        <FeedbackBlock
          feedback={feedback.replace(/TRANSCRIPTION:[\s\S]*?(?=BAND:)/, '').trim()}
          accentColor="var(--purple)"
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes indeterminate { 0%{transform:translateX(-100%);width:40%} 50%{width:60%} 100%{transform:translateX(250%);width:40%} }
      `}</style>
    </div>
  )
}

// ─── MAIN WRITING HUB ─────────────────────────────────────────
export default function WritingHub({ results, addResult, userId }) {
  const [selected, setSelected] = useState(null)
  const [inputMode, setInputMode] = useState('type')   // 'type' | 'handwriting'
  const [essay, setEssay] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [tab, setTab] = useState('task2')

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length

  const getAI = async () => {
    if (!essay.trim() || wordCount < 30) return
    setLoadingAI(true); setFeedback('')
    try {
      const prompt = `You are an expert Oxford ELLT examiner. Analyse this student essay and provide structured feedback in exactly this format:

BAND: [B1/B2/C1/C2]
SCORE: [50-100]

STRENGTHS:
- [Point 1]
- [Point 2]
- [Point 3]

AREAS TO IMPROVE:
- [Point 1]
- [Point 2]
- [Point 3]

GRAMMAR TIP: [One specific grammar improvement]
VOCABULARY TIP: [One specific vocabulary improvement]
EXAMINER NOTE: [One overall exam strategy tip — 2 sentences max]

Writing prompt: "${selected.task}"

Student essay:
"""
${essay}
"""`
      const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }) })
      const data = await res.json()
      const text = data.content?.[0]?.text || 'Could not generate feedback.'
      setFeedback(text)
      const bandMatch = text.match(/BAND:\s*([A-Z0-9+]+)/)
      const band = bandMatch?.[1] || 'B2'
      const bandScore = band==='C2'?9:band==='C1'?7.5:band==='B2'?6:5
      const row = { skill:'writing', test_id:selected.id, test_title:selected.title, band_score:bandScore, essay_text:essay }
      await saveResult(row)
      addResult(row)
    } catch (e) { setFeedback('Error connecting to AI. Please try again.') }
    setLoadingAI(false)
  }

  if (selected) {
    return (
      <div className="anim-fadeUp">
        {/* Header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => { setSelected(null); setEssay(''); setFeedback(''); setShowModel(false) }}
            style={{ width: 40, height: 40, borderRadius: 12, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--textM)', flexShrink: 0 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.title}</div>
            <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{selected.source || 'Oxford ELLT'} · {selected.minWords}+ words</div>
          </div>
        </div>

        {/* Task prompt */}
        <div style={{ background: 'var(--purpleBg)', border: '2px solid var(--purpleBdr)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 6 }}>Writing Task</div>
          <DiagramRenderer taskId={selected.id} />
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{selected.prompt}</p>
          <p style={{ fontSize: 13, color: 'var(--textM)', lineHeight: 1.6, fontWeight: 600 }}>{selected.task}</p>
          {selected.chartDescription && !['wt1','wi2','wo1'].includes(selected.id) && (
            <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Chart Data</div>
              <p style={{ fontSize: 12, color: 'var(--textM)', lineHeight: 1.5 }}>{selected.chartDescription}</p>
            </div>
          )}
        </div>

        {/* Input mode selector */}
        <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 14, padding: 4, marginBottom: 16, gap: 4 }}>
          {[
            { key: 'type',        icon: PenLine,  label: 'Type Response'        },
            { key: 'handwriting', icon: Camera,   label: 'Upload Handwriting'   },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setInputMode(key)} style={{
              flex: 1, padding: '10px 12px', borderRadius: 11, border: 'none',
              background: inputMode === key ? 'var(--bg2)' : 'transparent',
              color: inputMode === key ? 'var(--text)' : 'var(--textM)',
              fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: inputMode === key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all .2s', minHeight: 44,
            }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* TYPE mode */}
        {inputMode === 'type' && (
          <div>
            <div style={{ background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Your Response</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: wordCount >= selected.minWords ? 'var(--green)' : 'var(--amber)' }}>
                  {wordCount} / {selected.minWords}+ words
                </span>
              </div>
              <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder={`Write your response here… (aim for ${selected.minWords}+ words)`} style={{ minHeight: 220 }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button onClick={() => setShowModel(m => !m)}
                  style={{ padding: '9px 16px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg3)', color: 'var(--textM)', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 6, minHeight: 44 }}>
                  <Eye size={14} />
                  {showModel ? 'Hide' : 'View'} Model Answer
                </button>
                <button onClick={getAI} disabled={loadingAI || wordCount < 30}
                  style={{ padding: '11px 20px', borderRadius: 12, border: 'none', borderBottom: `4px solid ${loadingAI||wordCount<30 ? 'var(--border)' : 'var(--purpleD)'}`, background: loadingAI||wordCount<30 ? 'var(--bg3)' : 'var(--purple)', color: loadingAI||wordCount<30 ? 'var(--textD)' : '#fff', fontWeight: 900, fontSize: 14, cursor: loadingAI||wordCount<30 ? 'not-allowed' : 'pointer', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', minHeight: 44 }}>
                  {loadingAI ? 'Analysing...' : 'Get AI Feedback'}
                </button>
              </div>
            </div>
            {showModel && (
              <div style={{ background: 'var(--greenBg)', border: '2px solid var(--greenBdr)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Model Answer — Band {selected.band}</div>
                <p style={{ fontSize: 13, color: 'var(--textM)', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: 600 }}>{selected.model}</p>
              </div>
            )}
            {feedback && <FeedbackBlock feedback={feedback} accentColor="var(--purple)" />}
          </div>
        )}

        {/* HANDWRITING mode */}
        {inputMode === 'handwriting' && (
          <div>
            <div style={{ background: 'var(--amberBg)', border: '2px solid var(--amberBdr)', borderRadius: 14, padding: '12px 16px', marginBottom: 14, fontSize: 13, color: 'var(--amber)', fontWeight: 700, lineHeight: 1.5 }}>
              Write your essay on paper first, then photograph each page. Good lighting and a flat surface give the best results.
            </div>
            <div style={{ background: 'var(--bg2)', border: '2px solid var(--border)', borderBottom: '4px solid var(--borderB)', borderRadius: 16, padding: 16 }}>
              <HandwritingUploader
                task={selected.task}
                taskTitle={selected.title}
                userId={userId}
                addResult={addResult}
                testId={selected.id}
                onFeedback={() => {}}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button onClick={() => setShowModel(m => !m)}
                style={{ padding: '9px 16px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg3)', color: 'var(--textM)', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', gap: 6, minHeight: 44 }}>
                <Eye size={14} />
                {showModel ? 'Hide' : 'View'} Model Answer
              </button>
            </div>
            {showModel && (
              <div style={{ marginTop: 10, background: 'var(--greenBg)', border: '2px solid var(--greenBdr)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Model Answer — Band {selected.band}</div>
                <p style={{ fontSize: 13, color: 'var(--textM)', lineHeight: 1.8, whiteSpace: 'pre-line', fontWeight: 600 }}>{selected.model}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── TASK LIST ──────────────────────────────────────────────
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Writing Tasks</div>
        <p style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600 }}>Type your response OR upload a photo of your handwritten essay — Gemini reads and grades it.</p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {[['task2','Task 2 — Essays'],['task1','Task 1 — Charts']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '9px 16px', borderRadius: 12,
            border: tab===k ? `2px solid var(--purple)` : '2px solid var(--border)',
            borderBottom: tab===k ? '4px solid var(--purpleD)' : '4px solid var(--borderB)',
            background: tab===k ? 'var(--purpleBg)' : 'var(--bg2)',
            color: tab===k ? 'var(--purple)' : 'var(--textM)',
            fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.4px', flexShrink: 0, minHeight: 44,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {(tab === 'task2' ? ALL_WRITING : (WRITING_TASK1||[])).map(w => {
          const prev = results.find(r => r.test_id === w.id)
          return (
            <div key={w.id} onClick={() => setSelected(w)} className="skill-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Chip text={w.source || 'Oxford ELLT'} color="var(--purple)" />
                {prev && <Chip text="Done" color="var(--green)" />}
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>{w.title}</div>
              <p style={{ fontSize: 12, color: 'var(--textM)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5, fontWeight: 600 }}>"{w.prompt}"</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Chip text={`${w.minWords}+ words`} color="var(--textD)" />
                <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 99, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <PenLine size={10} color="var(--textD)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--textD)' }}>Type</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 99, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <Camera size={10} color="var(--textD)" />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--textD)' }}>Photo</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
