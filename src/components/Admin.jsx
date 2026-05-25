import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Users, BarChart2, AlertTriangle, CheckCircle, TrendingUp,
         BookOpen, Headphones, PenLine, Mic, RefreshCw, Mail,
         Lock, Send, Calendar, ClipboardList, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const ADMIN_PASSWORD = 'ELLTPulse#2026'
const SKILL_COLOR = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--green)', speaking:'var(--purple)' }
const SKILL_ICON  = { listening:Headphones, reading:BookOpen, writing:PenLine, speaking:Mic }

export default function Admin({ user }) {
  const [unlocked, setUnlocked]   = useState(false)
  const [pw, setPw]               = useState('')
  const [pwError, setPwError]     = useState(false)
  const [tab, setTab]             = useState('overview')
  const [schedules, setSchedules] = useState([])
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [broadcast, setBroadcast] = useState({ subject:'', message:'', target:'all' })
  const [sending, setSending]     = useState(false)
  const [sendStatus, setSendStatus] = useState(null)

  useEffect(() => { if (unlocked) loadData() }, [unlocked])

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
    if (pw === ADMIN_PASSWORD) { setUnlocked(true); setPwError(false) }
    else { setPwError(true); setPw('') }
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
          <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600 }}>Enter the admin password</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input type="password" value={pw} autoFocus
            onChange={e => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={e => e.key === 'Enter' && tryUnlock()}
            placeholder="Admin password"
            style={{ padding:'14px 16px', borderRadius:12, fontSize:15, fontWeight:600, border:pwError?'2px solid var(--coral)':'2px solid var(--border)', borderBottom:pwError?'3px solid var(--coralBdr)':'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontFamily:'Nunito, sans-serif', outline:'none', width:'100%', boxSizing:'border-box' }}
          />
          {pwError && <div style={{ fontSize:12, color:'var(--coral)', fontWeight:700, textAlign:'center' }}>Incorrect password</div>}
          <button onClick={tryUnlock} style={{ padding:'14px', borderRadius:12, border:'none', borderBottom:'4px solid var(--blueD)', background:'var(--blue)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase' }}>
            Enter Admin Panel
          </button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80, gap:12 }}>
      <RefreshCw size={22} color="var(--green)" style={{ animation:'spin 1s linear infinite' }} />
      <span style={{ fontSize:14, fontWeight:700, color:'var(--textM)' }}>Loading...</span>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── Computed stats ─────────────────────────────────────────
  const now           = new Date()
  const sevenDaysAgo  = new Date(now - 7*86400000)
  const threeDaysAgo  = new Date(now - 3*86400000)
  const today         = new Date(); today.setHours(0,0,0,0)

  const activeIds     = new Set(results.filter(r => new Date(r.completed_at) > sevenDaysAgo).map(r => r.user_id))
  const todayResults  = results.filter(r => new Date(r.completed_at) >= today)

  const atRisk = schedules.filter(s => {
    const ur = results.filter(r => r.user_id === s.user_id)
    return !ur.length || new Date(ur[0].completed_at) < threeDaysAgo
  })

  const bandBySkill = {}
  for (const skill of ['listening','reading','writing','speaking']) {
    const sr = results.filter(r => r.skill === skill && r.band_score > 0)
    bandBySkill[skill] = sr.length ? (sr.reduce((s,r) => s + parseFloat(r.band_score), 0) / sr.length).toFixed(1) : '—'
  }

  // Activity last 7 days
  const activityData = Array.from({length:7}, (_,i) => {
    const d = new Date(now - (6-i)*86400000); d.setHours(0,0,0,0)
    const next = new Date(d.getTime() + 86400000)
    const count = results.filter(r => { const t = new Date(r.completed_at); return t >= d && t < next }).length
    return { day: d.toLocaleDateString('en-GB',{weekday:'short'}), tests: count }
  })

  // Top tests
  const testCounts = {}
  results.forEach(r => { testCounts[r.test_title||r.test_id] = (testCounts[r.test_title||r.test_id]||0) + 1 })
  const topTests = Object.entries(testCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,count])=>({name:name.length>22?name.slice(0,22)+'…':name,count}))

  // Skill distribution
  const skillDist = ['listening','reading','writing','speaking'].map(skill => ({
    skill: skill.charAt(0).toUpperCase()+skill.slice(1),
    tests: results.filter(r=>r.skill===skill).length,
    fill: SKILL_COLOR[skill]
  }))

  // Plans breakdown
  const planBreakdown = {}
  schedules.forEach(s => { planBreakdown[s.period] = (planBreakdown[s.period]||0)+1 })

  // Per-student stats
  const studentStats = schedules.map(s => {
    const ur = results.filter(r => r.user_id === s.user_id)
    const last = ur[0]
    const daysAgo = last ? Math.floor((now - new Date(last.completed_at)) / 86400000) : null
    const sessionsCompleted = Object.keys(s.completed_sessions||{}).length
    const periodDays = {'1_week':7,'2_weeks':14,'3_weeks':21,'1_month':30}[s.period]||30
    const startDate = new Date(s.start_date); startDate.setHours(0,0,0,0)
    const planDay = Math.floor((today - startDate) / 86400000) + 1
    const totalSessions = Math.min(planDay, periodDays) * 2
    const completionPct = totalSessions > 0 ? Math.round((sessionsCompleted/totalSessions)*100) : 0
    const banded = ur.filter(r=>r.band_score>0)
    const avgBand = banded.length ? (banded.reduce((s,r)=>s+parseFloat(r.band_score),0)/banded.length).toFixed(1) : '—'
    const daysLeft = Math.max(0, periodDays - planDay)
    return { ...s, ur, last, daysAgo, sessionsCompleted, completionPct, avgBand, planDay, periodDays, daysLeft }
  }).sort((a,b)=>(a.daysAgo??999)-(b.daysAgo??999))

  // Broadcast send
  async function sendBroadcast() {
    if (!broadcast.subject || !broadcast.message) return
    setSending(true); setSendStatus(null)
    const targets = broadcast.target === 'all' ? schedules
      : broadcast.target === 'atrisk' ? schedules.filter(s => atRisk.find(r=>r.user_id===s.user_id))
      : schedules.filter(s => s.user_email === broadcast.target)
    const emails = targets.map(s=>s.user_email).filter(Boolean)
    let sent = 0
    for (const email of emails) {
      const html = `<div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;padding:20px">
        <div style="background:#58CC02;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
          <div style="font-size:24px;font-weight:900;color:#fff">ELLTPulse</div>
        </div>
        <div style="background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:24px">
          <h2 style="color:#1A202C;margin-top:0">${broadcast.subject}</h2>
          <p style="color:#4A5568;line-height:1.8;white-space:pre-line">${broadcast.message}</p>
          <a href="https://ellt-practice-hub.vercel.app" style="display:inline-block;background:#58CC02;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:16px">Open ELLTPulse →</a>
        </div>
      </div>`
      const gasUrl = import.meta.env.VITE_APPS_SCRIPT_URL
      if (gasUrl) {
        try {
          await fetch(gasUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ secret:'elltpulse2026', to:email, subject:broadcast.subject, html }), redirect:'follow' })
          sent++
        } catch {}
      }
    }
    setSending(false)
    setSendStatus(sent > 0 ? `✅ Sent to ${sent} student${sent!==1?'s':''}` : '⚠️ Add VITE_APPS_SCRIPT_URL to Vercel env vars to send emails from admin')
  }

  const TABS = [
    { key:'overview',  label:'Overview',  icon:BarChart2     },
    { key:'analytics', label:'Analytics', icon:TrendingUp    },
    { key:'students',  label:`Students (${schedules.length})`, icon:Users },
    { key:'plans',     label:'Plans',     icon:Calendar      },
    { key:'atrisk',    label:`At Risk (${atRisk.length})`, icon:AlertTriangle },
    { key:'broadcast', label:'Broadcast', icon:Send          },
  ]

  return (
    <div className="app-container anim-fadeUp" style={{ paddingBottom:100 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:900, color:'var(--text)' }}>Admin Dashboard</div>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600 }}>{schedules.length} students · {results.length} tests submitted</div>
        </div>
        <button onClick={loadData} style={{ padding:'8px 12px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:11, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:5 }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
        {TABS.map(({ key, label, icon:Icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding:'8px 12px', borderRadius:10, flexShrink:0, border:`2px solid ${tab===key?'var(--blue)':'var(--border)'}`, borderBottom:`3px solid ${tab===key?'var(--blueD)':'var(--borderB)'}`, background:tab===key?'var(--blueBg)':'var(--bg2)', color:tab===key?'var(--blue)':'var(--textM)', fontWeight:800, fontSize:11, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:5 }}>
            <Icon size={12} />{label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16 }}>
            {[
              { label:'Total Students',  value:schedules.length,   color:'var(--blue)',   icon:Users        },
              { label:'Active 7 days',   value:activeIds.size,     color:'var(--green)',  icon:TrendingUp   },
              { label:'Tests Today',     value:todayResults.length,color:'var(--purple)', icon:CheckCircle  },
              { label:'At Risk',         value:atRisk.length,      color:'var(--coral)',  icon:AlertTriangle},
            ].map(({label,value,color,icon:Icon}) => (
              <div key={label} style={{ padding:'14px', background:'var(--bg2)', border:`2px solid ${color}33`, borderBottom:`3px solid ${color}66`, borderRadius:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontSize:26, fontWeight:900, color:'var(--text)' }}>{value}</div>
                    <div style={{ fontSize:10, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>{label}</div>
                  </div>
                  <Icon size={18} color={color} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Band Averages by Skill</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
              {['listening','reading','writing','speaking'].map(skill => {
                const Icon=SKILL_ICON[skill]; const color=SKILL_COLOR[skill]
                return (
                  <div key={skill} style={{ padding:'10px', background:'var(--bg3)', border:`2px solid ${color}33`, borderRadius:10, display:'flex', alignItems:'center', gap:8 }}>
                    <Icon size={16} color={color} />
                    <div>
                      <div style={{ fontSize:18, fontWeight:900, color:'var(--text)' }}>{bandBySkill[skill]}</div>
                      <div style={{ fontSize:9, fontWeight:700, color:'var(--textM)', textTransform:'uppercase' }}>{skill}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:14 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Recent Submissions</div>
            {results.slice(0,8).map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:i<7?'1px solid var(--border)':'none' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:SKILL_COLOR[r.skill]||'var(--textD)', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.test_title||r.test_id}</div>
                  <div style={{ fontSize:10, color:'var(--textM)', fontWeight:600 }}>{r.skill} · {new Date(r.completed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:900, color:SKILL_COLOR[r.skill], flexShrink:0 }}>
                  {r.band_score>0?`B${r.band_score}`:`${r.score}/${r.total}`}
                </div>
              </div>
            ))}
            {!results.length && <div style={{ textAlign:'center', padding:20, color:'var(--textM)', fontSize:13 }}>No submissions yet</div>}
          </div>
        </div>
      )}

      {/* ── ANALYTICS ─────────────────────────────────────────── */}
      {tab === 'analytics' && (
        <div>
          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Tests Submitted — Last 7 Days</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={activityData} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{fontSize:10,fill:'var(--textM)'}} />
                <YAxis tick={{fontSize:10,fill:'var(--textM)'}} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="tests" fill="var(--green)" radius={[4,4,0,0]} name="Tests" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Tests by Skill</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={skillDist} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="skill" tick={{fontSize:10,fill:'var(--textM)'}} />
                <YAxis tick={{fontSize:10,fill:'var(--textM)'}} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="tests" name="Tests" radius={[4,4,0,0]}>
                  {skillDist.map((s,i) => <rect key={i} fill={s.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>Most Attempted Tests</div>
            {topTests.map((t,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:i<topTests.length-1?'1px solid var(--border)':'none' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--blueBg)', border:'2px solid var(--blue)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'var(--blue)', flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1, fontSize:12, fontWeight:700, color:'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize:13, fontWeight:900, color:'var(--blue)' }}>{t.count}x</div>
              </div>
            ))}
            {!topTests.length && <div style={{ textAlign:'center', padding:20, color:'var(--textM)', fontSize:13 }}>No data yet</div>}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
            {Object.entries(planBreakdown).map(([period, count]) => (
              <div key={period} style={{ padding:'14px', background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:14, textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:900, color:'var(--text)' }}>{count}</div>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--textM)', textTransform:'uppercase' }}>{period.replace('_',' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STUDENTS ──────────────────────────────────────────── */}
      {tab === 'students' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {studentStats.map((s,i) => (
            <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:14, padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:900, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.user_email}</div>
                  <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>{s.period?.replace('_',' ')} · Day {Math.max(1,s.planDay)}/{s.periodDays} · {s.ur.length} tests</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0, marginLeft:10 }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--green)' }}>{s.avgBand!=='—'?`Band ${s.avgBand}`:'No tests'}</div>
                  <div style={{ fontSize:10, color:'var(--textM)' }}>{s.daysLeft}d left</div>
                </div>
              </div>
              <div style={{ height:6, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:`${Math.min(100,s.completionPct)}%`, background: s.completionPct>=75?'var(--green)':s.completionPct>=40?'var(--amber)':'var(--coral)', borderRadius:99 }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'var(--textM)' }}>{s.completionPct}% sessions · {s.sessionsCompleted} done</span>
                <span style={{ fontSize:10, fontWeight:700, color:s.daysAgo===null?'var(--coral)':s.daysAgo===0?'var(--green)':s.daysAgo<4?'var(--amber)':'var(--coral)' }}>
                  {s.daysAgo===null?'Never active':s.daysAgo===0?'✅ Today':`${s.daysAgo}d ago`}
                </span>
              </div>
              {/* Skill breakdown for this student */}
              {s.ur.length > 0 && (
                <div style={{ display:'flex', gap:6, marginTop:8 }}>
                  {['listening','reading','writing','speaking'].map(skill => {
                    const sr = s.ur.filter(r=>r.skill===skill&&r.band_score>0)
                    if (!sr.length) return null
                    const avg = (sr.reduce((acc,r)=>acc+parseFloat(r.band_score),0)/sr.length).toFixed(1)
                    return <div key={skill} style={{ padding:'3px 8px', borderRadius:99, background:`${SKILL_COLOR[skill]}22`, border:`1px solid ${SKILL_COLOR[skill]}44`, fontSize:10, fontWeight:700, color:SKILL_COLOR[skill] }}>{skill.slice(0,3).toUpperCase()} {avg}</div>
                  })}
                </div>
              )}
            </div>
          ))}
          {!studentStats.length && <div style={{ textAlign:'center', padding:40, color:'var(--textM)', fontSize:14 }}>No students yet</div>}
        </div>
      )}

      {/* ── PLANS ─────────────────────────────────────────────── */}
      {tab === 'plans' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {['1_month','3_weeks','2_weeks','1_week'].map(period => {
            const group = studentStats.filter(s=>s.period===period)
            if (!group.length) return null
            return (
              <div key={period}>
                <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:8, marginTop:4 }}>
                  {period.replace('_',' ')} Plan ({group.length} student{group.length!==1?'s':''})
                </div>
                {group.map((s,i) => (
                  <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:12, padding:12, marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <div style={{ fontSize:12, fontWeight:800, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{s.user_email}</div>
                      <div style={{ fontSize:12, fontWeight:900, color:'var(--blue)', flexShrink:0, marginLeft:8 }}>{s.completionPct}%</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                      {[
                        { label:'Day', value:`${Math.max(1,s.planDay)}/${s.periodDays}` },
                        { label:'Sessions', value:s.sessionsCompleted },
                        { label:'Days Left', value:s.daysLeft },
                      ].map(({label,value}) => (
                        <div key={label} style={{ background:'var(--bg3)', borderRadius:8, padding:'6px', textAlign:'center' }}>
                          <div style={{ fontSize:14, fontWeight:900, color:'var(--text)' }}>{value}</div>
                          <div style={{ fontSize:9, color:'var(--textM)', fontWeight:700, textTransform:'uppercase' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height:4, background:'var(--bg3)', borderRadius:99, overflow:'hidden', marginTop:8 }}>
                      <div style={{ height:'100%', width:`${Math.min(100,s.completionPct)}%`, background:'var(--blue)', borderRadius:99 }} />
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ── AT RISK ───────────────────────────────────────────── */}
      {tab === 'atrisk' && (
        <div>
          {!atRisk.length ? (
            <div style={{ textAlign:'center', padding:60, fontSize:16, fontWeight:900, color:'var(--green)' }}>✅ All students active!</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ padding:'12px 14px', background:'var(--coralBg)', border:'2px solid var(--coralBdr)', borderRadius:12, fontSize:13, color:'var(--text)', fontWeight:600 }}>
                ⚠️ {atRisk.length} student{atRisk.length!==1?'s':''} inactive 3+ days. Use Broadcast to reach them all at once.
              </div>
              {atRisk.map((s,i) => {
                const ur = results.filter(r=>r.user_id===s.user_id)
                const daysAgo = ur[0] ? Math.floor((now-new Date(ur[0].completed_at))/86400000) : null
                return (
                  <div key={i} style={{ background:'var(--bg2)', border:'2px solid var(--coralBdr)', borderBottom:'3px solid var(--coralBdr)', borderRadius:14, padding:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>{s.user_email}</div>
                        <div style={{ fontSize:11, color:'var(--coral)', fontWeight:700, marginTop:3 }}>{daysAgo===null?'Never submitted a test':`${daysAgo} days without practice`}</div>
                        <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:2 }}>{s.period?.replace('_',' ')} plan · {ur.length} tests done</div>
                      </div>
                      <a href={`mailto:${s.user_email}?subject=Keep going with ELLTPulse!&body=Hi, we noticed you haven't practised in a few days. Log back in: https://ellt-practice-hub.vercel.app`}
                        style={{ padding:'8px 12px', borderRadius:10, border:'none', borderBottom:'3px solid var(--coralBdr)', background:'var(--coral)', color:'#fff', fontWeight:800, fontSize:11, cursor:'pointer', fontFamily:'Nunito, sans-serif', textDecoration:'none', display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BROADCAST ─────────────────────────────────────────── */}
      {tab === 'broadcast' && (
        <div>
          <div style={{ background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:14, padding:16, marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:900, color:'var(--text)', marginBottom:4 }}>Send Email to Students</div>
            <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginBottom:16 }}>Send directly via your Google Apps Script email integration</div>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.4px', display:'block', marginBottom:5 }}>Send To</label>
                <select value={broadcast.target} onChange={e=>setBroadcast({...broadcast,target:e.target.value})}
                  style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'2px solid var(--border)', background:'var(--bg3)', color:'var(--text)', fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:700, cursor:'pointer', outline:'none' }}>
                  <option value="all">All Students ({schedules.length})</option>
                  <option value="atrisk">At-Risk Students ({atRisk.length})</option>
                  {schedules.map(s => <option key={s.user_id} value={s.user_email}>{s.user_email}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.4px', display:'block', marginBottom:5 }}>Subject</label>
                <input type="text" value={broadcast.subject} onChange={e=>setBroadcast({...broadcast,subject:e.target.value})}
                  placeholder="e.g. New content added to ELLTPulse!"
                  style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:600, outline:'none', boxSizing:'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.4px', display:'block', marginBottom:5 }}>Message</label>
                <textarea value={broadcast.message} onChange={e=>setBroadcast({...broadcast,message:e.target.value})}
                  rows={5} placeholder="Write your message here..."
                  style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--text)', fontFamily:'Nunito, sans-serif', fontSize:13, fontWeight:600, outline:'none', resize:'vertical', boxSizing:'border-box' }}
                />
              </div>

              <button onClick={sendBroadcast} disabled={sending||!broadcast.subject||!broadcast.message}
                style={{ padding:'13px', borderRadius:12, border:'none', borderBottom:`4px solid ${sending?'var(--border)':'var(--greenD)'}`, background:sending?'var(--bg3)':'var(--green)', color:sending?'var(--textD)':'#fff', fontWeight:900, fontSize:14, cursor:sending?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Send size={15} /> {sending ? 'Sending...' : `Send Email`}
              </button>

              {sendStatus && (
                <div style={{ padding:'12px 14px', background:sendStatus.startsWith('✅')?'var(--greenBg)':'var(--coralBg)', border:`2px solid ${sendStatus.startsWith('✅')?'var(--green)':'var(--coral)'}`, borderRadius:10, fontSize:13, fontWeight:700, color:'var(--text)', textAlign:'center' }}>
                  {sendStatus}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding:'12px 14px', background:'var(--bg2)', border:'2px solid var(--border)', borderRadius:12 }}>
            <div style={{ fontSize:11, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', marginBottom:8 }}>Quick Messages</div>
            {[
              { label:'🎉 New content added', subject:'New practice tests added to ELLTPulse!', message:'Hi there,\n\nWe\'ve just added new Cambridge IELTS practice tests to ELLTPulse — including full listening tests with real audio.\n\nLog in now to try them out and keep your preparation on track.\n\nGood luck!\nThe ELLTPulse Team' },
              { label:'🔥 Motivation boost', subject:'Don\'t break your streak!', message:'Hi there,\n\nWe noticed it\'s been a little while since your last practice session. Don\'t lose momentum now — even 30 minutes today makes a difference.\n\nYour study plan is waiting for you.\n\nYou\'ve got this!\nThe ELLTPulse Team' },
              { label:'📅 Exam reminder', subject:'Your exam is coming up — are you ready?', message:'Hi there,\n\nWith your exam approaching, now is the time to push hard. Make sure you\'re completing your daily sessions and taking at least one full mock test before exam day.\n\nLog in and keep going!\nThe ELLTPulse Team' },
            ].map(q => (
              <button key={q.label} onClick={() => setBroadcast({...broadcast, subject:q.subject, message:q.message})}
                style={{ width:'100%', padding:'10px 12px', marginBottom:6, borderRadius:8, border:'1px solid var(--border)', background:'var(--bg3)', color:'var(--text)', fontFamily:'Nunito, sans-serif', fontSize:12, fontWeight:700, cursor:'pointer', textAlign:'left' }}>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
