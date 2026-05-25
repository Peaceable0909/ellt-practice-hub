import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Users, BarChart2, AlertTriangle, CheckCircle,
         TrendingUp, BookOpen, Headphones, PenLine, Mic,
         RefreshCw, Mail, Lock } from 'lucide-react'

const ADMIN_PASSWORD = 'ELLTPulse#2026'
const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--green)', speaking:'var(--purple)' }
const SKILL_ICON  = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

export default function Admin({ user }) {
  // ── ALL hooks at top — no hooks after conditional returns ──
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem('ellt-admin-auth') === 'true')
  const [pw, setPw]             = useState('')
  const [pwError, setPwError]   = useState(false)
  const [tab, setTab]           = useState('overview')
  const [schedules, setSchedules] = useState([])
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (unlocked) loadData()
  }, [unlocked])

  async function loadData() {
    setLoading(true)
    const [sRes, rRes] = await Promise.all([
      supabase.from('student_schedules').select('*'),
      supabase.from('ellt_test_results').select('*').order('completed_at', { ascending: false }),
    ])
    setSchedules(sRes.data || [])
    setResults(rRes.data || [])
    setLoading(false)
  }

  function tryUnlock() {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem('ellt-admin-auth', 'true')
      setUnlocked(true)
      setPwError(false)
    } else {
      setPwError(true)
      setPw('')
    }
  }

  // ── Password gate ──────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="app-container" style={{ maxWidth:400, paddingTop:60 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--purpleBg)', border:'2px solid var(--purple)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <Lock size={28} color="var(--purple)" />
          </div>
          <div style={{ fontSize:22, fontWeight:900, color:'var(--text)', marginBottom:6 }}>Admin Access</div>
          <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600 }}>Enter the admin password to continue</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input
            type="password" value={pw} autoFocus
            onChange={e => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={e => e.key === 'Enter' && tryUnlock()}
            placeholder="Admin password"
            style={{ padding:'14px 16px', borderRadius:12, fontSize:15, fontWeight:600, border: pwError ? '2px solid var(--coral)' : '2px solid var(--border)', borderBottom: pwError ? '3px solid var(--coralBdr)' : '3px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontFamily:'Nunito, sans-serif', outline:'none', width:'100%', boxSizing:'border-box' }}
          />
          {pwError && <div style={{ fontSize:12, color:'var(--coral)', fontWeight:700, textAlign:'center' }}>Incorrect password — try again</div>}
          <button onClick={tryUnlock} style={{ padding:'14px', borderRadius:12, border:'none', borderBottom:'4px solid var(--blueD)', background:'var(--blue)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            Enter Admin Panel
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80, gap:12 }}>
      <RefreshCw size={22} color="var(--green)" style={{ animation:'spin 1s linear infinite' }} />
      <span style={{ fontSize:14, fontWeight:700, color:'var(--textM)' }}>Loading student data...</span>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── Analytics ─────────────────────────────────────────────
  const now = new Date()
  const sevenDaysAgo  = new Date(now - 7*86400000)
  const threeDaysAgo  = new Date(now - 3*86400000)
  const today = new Date(); today.setHours(0,0,0,0)

  const activeUserIds  = new Set(results.filter(r => new Date(r.completed_at) > sevenDaysAgo).map(r => r.user_id))
  const todayResults   = results.filter(r => new Date(r.completed_at) >= today)

  const atRisk = schedules.filter(s => {
    const userResults = results.filter(r => r.user_id === s.user_id)
    if (!userResults.length) return true
    return new Date(userResults[0].completed_at) < threeDaysAgo
  })

  const bandBySkill = {}
  for (const skill of ['listening','reading','writing','speaking']) {
    const sr = results.filter(r => r.skill === skill && r.band_score > 0)
    bandBySkill[skill] = sr.length ? (sr.reduce((s,r) => s + parseFloat(r.band_score), 0) / sr.length).toFixed(1) : '—'
  }

  const studentStats = schedules.map(s => {
    const ur = results.filter(r => r.user_id === s.user_id)
    const last = ur[0]
    const daysAgo = last ? Math.floor((now.getTime() - new Date(last.completed_at).getTime()) / 86400000) : null
    const sessionsCompleted = Object.keys(s.completed_sessions || {}).length
    const periodDays = { '1_week':7,'2_weeks':14,'3_weeks':21,'1_month':30 }[s.period] || 30
    const startDate = new Date(s.start_date); startDate.setHours(0,0,0,0)
    const planDay = Math.floor((today.getTime() - startDate.getTime()) / 86400000) + 1
    const totalSessions = Math.min(planDay, periodDays) * 2
    const completionPct = totalSessions > 0 ? Math.round((sessionsCompleted / totalSessions) * 100) : 0
    const banded = ur.filter(r => r.band_score > 0)
    const avgBand = banded.length ? (banded.reduce((s,r) => s + parseFloat(r.band_score), 0) / banded.length).toFixed(1) : '—'
    return { ...s, ur, last, daysAgo, sessionsCompleted, completionPct, avgBand, planDay, periodDays }
  }).sort((a,b) => (a.daysAgo??999) - (b.daysAgo??999))

  const TABS = [
    { key:'overview', label:'Overview',          icon:BarChart2    },
    { key:'students', label:`Students (${schedules.length})`, icon:Users },
    { key:'atrisk',   label:`At Risk (${atRisk.length})`,     icon:AlertTriangle },
  ]

  return (
    <div className="app-container anim-fadeUp">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:900, color:'var(--text)', marginBottom:2 }}>Admin Dashboard</h1>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>{schedules.length} students · {results.length} tests submitted</div>
        </div>
        <button onClick={loadData} style={{ padding:'8px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto' }}>
        {TABS.map(({ key, label, icon:Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding:'9px 16px', borderRadius:10, flexShrink:0, border:`2px solid ${tab===key?'var(--blue)':'var(--border)'}`, borderBottom:`3px solid ${tab===key?'var(--blueD)':'var(--borderB)'}`, background:tab===key?'var(--blueBg)':'var(--bg2)', color:tab===key?'var(--blue)':'var(--textM)', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:6 }}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
            {[
              { label:'Total Students',  value:schedules.length,    icon:Users,         color:'var(--blue)'   },
              { label:'Active (7 days)', value:activeUserIds.size,  icon:TrendingUp,    color:'var(--green)'  },
              { label:'Tests Today',     value:todayResults.length, icon:CheckCircle,   color:'var(--purple)' },
              { label:'At Risk',         value:atRisk.length,       icon:AlertTriangle, color:'var(--coral)'  },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} style={{ padding:'16px', background:'var(--bg2)', border:`2px solid ${color}33`, borderBottom:`3px solid ${color}66`, borderRadius:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:28, fontWeight:900, color:'var(--text)' }}>{value}</div>
                    <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</div>
                  </div>
                  <Icon size={20} color={color} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:16, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Platform Band Averages</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {['listening','reading','writing','speaking'].map(skill => {
                const Icon = SKILL_ICON[skill]; const color = SKILL_COLOR[skill]
                return (
                  <div key={skill} style={{ padding:'12px', background:'var(--bg3)', border:`2px solid ${color}33`, borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
                    <Icon size={16} color={color} />
                    <div>
                      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)' }}>{bandBySkill[skill]}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase' }}>{skill}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:16, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Recent Submissions</div>
            {results.slice(0,10).map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:i<9?'1px solid var(--border)':'none' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:SKILL_COLOR[r.skill]||'var(--textD)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title||r.test_id}</div>
                  <div style={{ fontSize:10, color:'var(--textM)', fontWeight:600 }}>{r.skill} · {new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:900, color:SKILL_COLOR[r.skill]||'var(--text)', flexShrink:0 }}>
                  {r.band_score > 0 ? `Band ${r.band_score}` : `${r.score}/${r.total}`}
                </div>
              </div>
            ))}
            {!results.length && <div style={{ textAlign:'center', padding:20, color:'var(--textM)', fontSize:13 }}>No submissions yet</div>}
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {tab === 'students' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {studentStats.map((s,i) => (
            <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:14, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.user_email}</div>
                  <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>{s.period?.replace('_',' ')} · Day {Math.max(1,s.planDay)}/{s.periodDays} · {s.ur.length} tests</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:12 }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--green)' }}>{s.avgBand !== '—' ? `Band ${s.avgBand}` : 'No tests'}</div>
                </div>
              </div>
              <div style={{ height:6, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                <div style={{ height:'100%', width:`${Math.min(100,s.completionPct)}%`, background:'var(--green)', borderRadius:99 }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'var(--textM)' }}>{s.completionPct}% sessions done</span>
                <span style={{ fontSize:11, fontWeight:700, color:s.daysAgo===null?'var(--coral)':s.daysAgo===0?'var(--green)':s.daysAgo<4?'var(--amber)':'var(--coral)' }}>
                  {s.daysAgo===null?'⚠️ Never active':s.daysAgo===0?'✅ Active today':`Last active ${s.daysAgo}d ago`}
                </span>
              </div>
            </div>
          ))}
          {!studentStats.length && <div style={{ textAlign:'center', padding:40, color:'var(--textM)', fontSize:14 }}>No students yet</div>}
        </div>
      )}

      {/* AT RISK */}
      {tab === 'atrisk' && (
        <div>
          {!atRisk.length ? (
            <div style={{ textAlign:'center', padding:60, color:'var(--green)', fontSize:16, fontWeight:900 }}>✅ All students are active!</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {atRisk.map((s,i) => {
                const ur = results.filter(r => r.user_id === s.user_id)
                const daysAgo = ur[0] ? Math.floor((now.getTime() - new Date(ur[0].completed_at).getTime()) / 86400000) : null
                return (
                  <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--coralBdr)', borderBottom:'3px solid var(--coralBdr)', borderRadius:14, padding:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>{s.user_email}</div>
                        <div style={{ fontSize:11, color:'var(--coral)', fontWeight:700, marginTop:4 }}>
                          {daysAgo===null?'⚠️ Never submitted a test':`⚠️ ${daysAgo} days inactive`}
                        </div>
                        <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>{s.period?.replace('_',' ')} plan · {ur.length} tests done</div>
                      </div>
                      <a href={`mailto:${s.user_email}?subject=Keep going with ELLTPulse!&body=Hi, we noticed you haven't practised recently. Log back in and continue: https://ellt-practice-hub.vercel.app`}
                        style={{ padding:'8px 14px', borderRadius:10, border:'none', borderBottom:'3px solid var(--coralBdr)', background:'var(--coral)', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', textDecoration:'none', display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                        <Mail size={13} /> Email
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
