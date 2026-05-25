import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Users, BarChart2, AlertTriangle, CheckCircle, Clock,
         TrendingUp, BookOpen, Headphones, PenLine, Mic,
         RefreshCw, Mail } from 'lucide-react'

const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--green)', speaking:'var(--purple)' }
const SKILL_ICON  = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

export default function Admin({ user }) {
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [schedRes, resultsRes] = await Promise.all([
      supabase.from('student_schedules').select('*'),
      supabase.from('ellt_test_results').select('*').order('completed_at', { ascending: false }),
    ])
    const schedules = schedRes.data || []
    const results   = resultsRes.data || []
    setData({ schedules, results })
    setLoading(false)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60 }}>
      <RefreshCw size={24} color="var(--green)" style={{ animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )

  const { schedules, results } = data

  // ── Analytics ─────────────────────────────────────────────
  const totalStudents  = schedules.length
  const now = new Date()
  const threeDaysAgo   = new Date(now - 3*86400000)
  const sevenDaysAgo   = new Date(now - 7*86400000)

  // Active = did something in last 7 days
  const activeUserIds  = new Set(results.filter(r => new Date(r.completed_at) > sevenDaysAgo).map(r => r.user_id))
  const activeStudents = activeUserIds.size

  // At-risk = have a schedule but no results in 3+ days
  const atRisk = schedules.filter(s => {
    const userResults = results.filter(r => r.user_id === s.user_id)
    if (!userResults.length) return true
    const last = new Date(userResults[0].completed_at)
    return last < threeDaysAgo
  })

  // Tests done today
  const today = new Date(); today.setHours(0,0,0,0)
  const todayResults = results.filter(r => new Date(r.completed_at) >= today)

  // Band averages
  const bandBySkill = {}
  for (const skill of ['listening','reading','writing','speaking']) {
    const skillResults = results.filter(r => r.skill === skill && r.band_score > 0)
    bandBySkill[skill] = skillResults.length
      ? (skillResults.reduce((s,r) => s + parseFloat(r.band_score), 0) / skillResults.length).toFixed(1)
      : '—'
  }

  // Per-student stats
  const studentStats = schedules.map(s => {
    const userResults = results.filter(r => r.user_id === s.user_id)
    const lastResult  = userResults[0]
    const daysAgo     = lastResult ? Math.floor((now - new Date(lastResult.completed_at)) / 86400000) : null
    const sessionsCompleted = Object.keys(s.completed_sessions || {}).length
    const periodDays  = { '1_week':7,'2_weeks':14,'3_weeks':21,'1_month':30 }[s.period] || 30
    const startDate   = new Date(s.start_date); startDate.setHours(0,0,0,0)
    const planDay     = Math.floor((today - startDate) / 86400000) + 1
    const totalSessions = Math.min(planDay, periodDays) * 2
    const completionPct = totalSessions > 0 ? Math.round((sessionsCompleted / totalSessions) * 100) : 0
    const avgBand = userResults.filter(r => r.band_score > 0).length
      ? (userResults.filter(r=>r.band_score>0).reduce((s,r)=>s+parseFloat(r.band_score),0) / userResults.filter(r=>r.band_score>0).length).toFixed(1)
      : '—'
    return { ...s, userResults, lastResult, daysAgo, sessionsCompleted, completionPct, avgBand, planDay, periodDays }
  }).sort((a,b) => (a.daysAgo||999) - (b.daysAgo||999))

  const TABS = [
    { key:'overview', label:'Overview', icon:BarChart2 },
    { key:'students', label:'Students', icon:Users },
    { key:'atrisk',   label:`At Risk (${atRisk.length})`, icon:AlertTriangle },
  ]

  return (
    <div className="app-container anim-fadeUp">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, color:'var(--text)', marginBottom:2 }}>Admin Dashboard</h1>
          <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600 }}>ELLTPulse · {user?.email}</div>
        </div>
        <button onClick={loadData} style={{ padding:'8px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding:'9px 16px', borderRadius:10, flexShrink:0,
            border:`2px solid ${tab===key?'var(--blue)':'var(--border)'}`,
            borderBottom:`3px solid ${tab===key?'var(--blueD)':'var(--borderB)'}`,
            background:tab===key?'var(--blueBg)':'var(--bg2)',
            color:tab===key?'var(--blue)':'var(--textM)',
            fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif',
            display:'flex', alignItems:'center', gap:6,
          }}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ───────────────────────────── */}
      {tab === 'overview' && (
        <div>
          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
            {[
              { label:'Total Students', value:totalStudents, icon:Users, color:'var(--blue)' },
              { label:'Active (7 days)', value:activeStudents, icon:TrendingUp, color:'var(--green)' },
              { label:'Tests Today', value:todayResults.length, icon:CheckCircle, color:'var(--purple)' },
              { label:'At Risk', value:atRisk.length, icon:AlertTriangle, color:'var(--coral)' },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} style={{ padding:'16px', background:'var(--bg2)', border:`2px solid ${color}33`, borderBottom:`3px solid ${color}66`, borderRadius:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:28, fontWeight:900, color:'var(--text)' }}>{value}</div>
                    <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</div>
                  </div>
                  <Icon size={22} color={color} />
                </div>
              </div>
            ))}
          </div>

          {/* Band averages by skill */}
          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:16, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:14 }}>Platform Band Averages</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {['listening','reading','writing','speaking'].map(skill => {
                const Icon = SKILL_ICON[skill]
                const color = SKILL_COLOR[skill]
                return (
                  <div key={skill} style={{ padding:'12px', background:'var(--bg3)', border:`2px solid ${color}33`, borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
                    <Icon size={18} color={color} />
                    <div>
                      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)' }}>{bandBySkill[skill]}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase' }}>{skill}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:16, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:14 }}>Recent Test Submissions</div>
            {results.slice(0, 10).map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:i<9?'1px solid var(--border)':'none' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:SKILL_COLOR[r.skill]||'var(--textD)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title || r.test_id}</div>
                  <div style={{ fontSize:10, color:'var(--textM)', fontWeight:600 }}>{r.skill} · {new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:900, color:SKILL_COLOR[r.skill]||'var(--text)', flexShrink:0 }}>
                  {r.band_score > 0 ? `Band ${r.band_score}` : `${r.score}/${r.total}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STUDENTS TAB ───────────────────────────── */}
      {tab === 'students' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {studentStats.map((s, i) => (
            <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:14, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:'var(--text)' }}>{s.user_email}</div>
                  <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>
                    {s.period?.replace('_',' ')} plan · Day {Math.max(1,s.planDay)} of {s.periodDays} · Started {new Date(s.start_date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:900, color:'var(--green)' }}>{s.avgBand !== '—' ? `Band ${s.avgBand}` : 'No tests'}</div>
                  <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700 }}>avg band</div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10 }}>
                {[
                  { label:'Tests done', value:s.userResults.length },
                  { label:'Sessions done', value:s.sessionsCompleted },
                  { label:'Completion', value:`${s.completionPct}%` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding:'8px', background:'var(--bg3)', borderRadius:8, textAlign:'center' }}>
                    <div style={{ fontSize:16, fontWeight:900, color:'var(--text)' }}>{value}</div>
                    <div style={{ fontSize:9, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ height:6, background:'var(--bg3)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${s.completionPct}%`, background:'var(--green)', borderRadius:99 }}/>
              </div>

              <div style={{ fontSize:11, color: s.daysAgo === null ? 'var(--coral)' : s.daysAgo < 2 ? 'var(--green)' : s.daysAgo < 4 ? 'var(--amber)' : 'var(--coral)', fontWeight:700, marginTop:8 }}>
                {s.daysAgo === null ? '⚠️ No activity yet' : s.daysAgo === 0 ? '✅ Active today' : `Last active ${s.daysAgo} day${s.daysAgo!==1?'s':''} ago`}
              </div>
            </div>
          ))}
          {!studentStats.length && (
            <div style={{ textAlign:'center', padding:40, color:'var(--textM)', fontSize:14, fontWeight:700 }}>No students yet</div>
          )}
        </div>
      )}

      {/* ── AT RISK TAB ────────────────────────────── */}
      {tab === 'atrisk' && (
        <div>
          <div style={{ padding:'12px 16px', background:'var(--coralBg)', border:'2px solid var(--coral)', borderRadius:12, marginBottom:16, fontSize:13, color:'var(--text)', fontWeight:600 }}>
            ⚠️ These students have been inactive for 3+ days or have never submitted a test. Consider reaching out.
          </div>
          {atRisk.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'var(--green)', fontSize:15, fontWeight:900 }}>✅ All students are active!</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {atRisk.map((s, i) => {
                const userResults = results.filter(r => r.user_id === s.user_id)
                const lastResult = userResults[0]
                const daysAgo = lastResult ? Math.floor((now - new Date(lastResult.completed_at)) / 86400000) : null
                return (
                  <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--coralBdr)', borderBottom:'3px solid var(--coralBdr)', borderRadius:14, padding:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>{s.user_email}</div>
                        <div style={{ fontSize:11, color:'var(--coral)', fontWeight:700, marginTop:4 }}>
                          {daysAgo === null ? '⚠️ Never submitted a test' : `⚠️ Last active ${daysAgo} days ago`}
                        </div>
                        <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>
                          {s.period?.replace('_',' ')} plan · {userResults.length} tests done
                        </div>
                      </div>
                      <a href={`mailto:${s.user_email}?subject=Keep going with ELLTPulse!&body=Hi, just checking in — we noticed you haven't practised in a few days. Log back in and continue your plan: https://ellt-practice-hub.vercel.app`}
                        style={{ padding:'8px 14px', borderRadius:10, border:'none', borderBottom:'3px solid var(--coralBdr)', background:'var(--coral)', color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>
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
