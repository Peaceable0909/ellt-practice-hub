import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { buildPlan, PERIOD_CONFIG, SESSION_ICONS, SESSION_COLORS } from '../data/timetable'
import { Headphones, BookOpen, PenLine, Mic, ClipboardList,
         ChevronRight, CheckCircle, Lock, Flame, Zap,
         Trophy, Calendar, PlayCircle, RotateCcw, Clock } from 'lucide-react'
import StudySession from './StudySession'

const PERIOD_DAYS = { '1_week':7, '2_weeks':14, '3_weeks':21, '1_month':30 }

const SKILL_ICONS = { listening: Headphones, reading: BookOpen, writing: PenLine, speaking: Mic, mock: ClipboardList, review: CheckCircle, intro: Trophy }
const SKILL_COLORS_MAP = { listening:'var(--blue)', reading:'var(--amber)', writing:'var(--purple)', speaking:'var(--coral)', mock:'var(--green)', review:'var(--teal)', intro:'var(--green)' }

export default function Plan({ userId, userEmail, results, addResult }) {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSession, setActiveSession] = useState(null)  // the session currently open
  const [view, setView] = useState('plan')                   // plan | setup
  const [completed, setCompleted] = useState({})             // { "day_1_morning": timestamp }

  // Setup form
  const [period, setPeriod]       = useState('1_month')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10))
  const [morningTime, setMorning] = useState('09:00')
  const [eveningTime, setEvening] = useState('19:00')
  const [timezone, setTimezone]   = useState('Europe/London')
  const [emailReminders, setEmail]= useState(true)
  const [saving, setSaving]       = useState(false)

  useEffect(() => { loadSchedule() }, [userId])

  async function loadSchedule() {
    setLoading(true)
    const { data } = await supabase
      .from('student_schedules').select('*').eq('user_id', userId).single()
    if (data) {
      setSchedule(data)
      setCompleted(data.completed_sessions || {})
    }
    setLoading(false)
  }

  async function markDone(key) {
    const updated = { ...completed, [key]: new Date().toISOString() }
    setCompleted(updated)
    await supabase.from('student_schedules')
      .update({ completed_sessions: updated })
      .eq('user_id', userId)
  }

  async function saveSchedule(isNewPlan) {
    setSaving(true)
    // BUG-06 fix: only reset completed_sessions when starting a BRAND NEW plan
    const keepCompleted = !isNewPlan && schedule ? (schedule.completed_sessions || {}) : {}
    const row = { user_id: userId, user_email: userEmail, period, start_date: startDate, morning_time: morningTime, evening_time: eveningTime, timezone, email_reminders: emailReminders, completed_sessions: keepCompleted, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('student_schedules').upsert([row]).select().single()
    if (error) {
      setSaving(false)
      alert('Could not save your plan. Please check your connection and try again.')
      return
    }
    if (data) { setSchedule(data); setCompleted(keepCompleted) }
    setSaving(false)
    setView('plan')
  }

  // ── ACTIVE SESSION ─────────────────────────────────────────
  if (activeSession) {
    return (
      <StudySession
        session={activeSession}
        results={results}
        addResult={addResult}
        userId={userId}
        onComplete={() => {
          markDone(activeSession.key)
          setActiveSession(null)
        }}
        onBack={() => setActiveSession(null)}
      />
    )
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'60px 20px', color:'var(--textM)', fontSize:14, fontWeight:700 }}>
      Loading your plan...
    </div>
  )

  // ── NO PLAN → SETUP ────────────────────────────────────────
  if (!schedule || view === 'setup') {
    return <SetupView period={period} setPeriod={setPeriod} startDate={startDate} setStartDate={setStartDate}
      morningTime={morningTime} setMorning={setMorning} eveningTime={eveningTime} setEvening={setEvening}
      timezone={timezone} setTimezone={setTimezone} emailReminders={emailReminders} setEmail={setEmail}
      saving={saving} onSave={(isNew) => saveSchedule(isNew)} existing={!!schedule} onCancel={() => setView('plan')} />
  }

  // ── PLAN VIEW ──────────────────────────────────────────────
  const plan = buildPlan(schedule.period)
  const startD = new Date(schedule.start_date)
  const todayD = new Date()
  todayD.setHours(0,0,0,0)
  startD.setHours(0,0,0,0)
  const dayNum = Math.floor((todayD - startD) / 86400000) + 1
  const totalDays = PERIOD_DAYS[schedule.period] || 30
  const cfg = PERIOD_CONFIG[schedule.period]
  const todayPlan = plan.find(d => d.day === dayNum)
  const pct = Math.min(100, Math.round((dayNum / totalDays) * 100))

  // Count done
  const doneCount = Object.keys(completed).length
  const totalSessions = totalDays * 2

  const startSession = (dayData, which) => {
    const s = which === 'morning' ? dayData.morning : dayData.evening
    const key = `day_${dayData.day}_${which}`
    setActiveSession({ ...s, key, dayNum: dayData.day, which })
  }

  const isDone = (day, which) => !!completed[`day_${day}_${which}`]

  // BUG-02 fix: real streak calculation
  function calcStreak() {
    let streak = 0
    const today = new Date(); today.setHours(0,0,0,0)
    const start = new Date(schedule.start_date); start.setHours(0,0,0,0)
    for (let d = dayNum; d >= 1; d--) {
      const dayDate = new Date(start.getTime() + (d-1)*86400000)
      dayDate.setHours(0,0,0,0)
      if (dayDate > today) continue
      const hasDone = completed[`day_${d}_morning`] || completed[`day_${d}_evening`]
      if (hasDone) { streak++ } else if (d < dayNum) { break } // gap resets
    }
    return streak
  }
  const streak = calcStreak()

  return (
    <div className="app-container anim-fadeUp">

      {/* ── HERO: Today ──────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg, var(--green) 0%, #46A302 100%)', borderRadius:20, padding:'22px 20px', marginBottom:20, border:'3px solid var(--greenD)', position:'relative', overflow:'hidden' }}>
        {/* Background decoration */}
        <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', right:20, top:20, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:900, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:3 }}>
                {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>
                {dayNum < 1 ? 'Plan starts soon!' : dayNum > totalDays ? 'Plan complete!' : `Day ${dayNum} of ${totalDays}`}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:12, padding:'8px 14px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{pct}%</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.7)', fontWeight:700, textTransform:'uppercase' }}>done</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height:8, background:'rgba(255,255,255,0.25)', borderRadius:99, marginBottom:12, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:'#fff', borderRadius:99, transition:'width .4s' }}/>
          </div>

          <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:700 }}>
            {cfg?.label} Plan · {schedule.morning_time?.slice(0,5)} & {schedule.evening_time?.slice(0,5)} daily
          </div>
        </div>
      </div>

      {/* ── TODAY'S SESSIONS ──────────────────────────────── */}
      {todayPlan && dayNum >= 1 && dayNum <= totalDays && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>
            Today's Sessions
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { which:'morning', session:todayPlan.morning, time:schedule.morning_time?.slice(0,5), label:'Morning', timeIcon:'☀️' },
              { which:'evening', session:todayPlan.evening, time:schedule.evening_time?.slice(0,5), label:'Evening', timeIcon:'🌙' },
            ].map(({ which, session, time, label, timeIcon }) => {
              const done = isDone(todayPlan.day, which)
              const color = SKILL_COLORS_MAP[session.type] || 'var(--green)'
              const Icon = SKILL_ICONS[session.type] || BookOpen
              return (
                <div key={which} style={{
                  background: done ? 'var(--bg3)' : 'var(--bg2)',
                  border: `2px solid ${done ? 'var(--green)' : color + '66'}`,
                  borderBottom: `4px solid ${done ? 'var(--greenD)' : color + 'aa'}`,
                  borderRadius: 18, padding: 18, opacity: done ? 0.75 : 1,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    {/* Icon */}
                    <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`, border:`2px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {done ? <CheckCircle size={24} color="var(--green)" /> : <Icon size={24} color={color} />}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                        <span style={{ fontSize:10, fontWeight:900, color:'var(--textD)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{timeIcon} {label} · {time}</span>
                        {done && <span style={{ fontSize:10, fontWeight:900, color:'var(--green)', textTransform:'uppercase', background:'var(--greenBg)', padding:'2px 7px', borderRadius:99 }}>Done</span>}
                      </div>
                      <div style={{ fontSize:15, fontWeight:900, color: done ? 'var(--textM)' : 'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{session.label}</div>
                      <div style={{ fontSize:12, color:'var(--textM)', fontWeight:600, marginTop:2 }}>{session.duration} mins</div>
                    </div>

                    {/* Action button */}
                    {!done ? (
                      <button onClick={() => startSession(todayPlan, which)}
                        style={{ flexShrink:0, padding:'10px 18px', borderRadius:12, border:'none', borderBottom:`4px solid ${color}cc`, background:color, color:'#fff', fontWeight:900, fontSize:13, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:6, textTransform:'uppercase', letterSpacing:'0.4px' }}>
                        <PlayCircle size={16} /> Start
                      </button>
                    ) : (
                      <button onClick={() => startSession(todayPlan, which)}
                        style={{ flexShrink:0, padding:'10px 14px', borderRadius:12, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif', display:'flex', alignItems:'center', gap:6 }}>
                        <RotateCcw size={13} /> Redo
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Plan complete */}
      {dayNum > totalDays && (
        <div style={{ textAlign:'center', padding:'32px 20px', background:'var(--greenBg)', border:'2px solid var(--green)', borderRadius:20, marginBottom:24 }}>
          <Trophy size={40} color="var(--green)" style={{ margin:'0 auto 12px' }} />
          <div style={{ fontSize:20, fontWeight:900, color:'var(--green)', marginBottom:4 }}>Plan Complete!</div>
          <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600, marginBottom:16 }}>You finished your {cfg?.label} plan. Start a new one to keep improving.</div>
          <button onClick={() => setView('setup')} style={{ padding:'12px 24px', borderRadius:12, border:'none', borderBottom:'4px solid var(--greenD)', background:'var(--green)', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
            Start New Plan
          </button>
        </div>
      )}

      {/* Plan not started yet */}
      {dayNum < 1 && (
        <div style={{ textAlign:'center', padding:'32px 20px', background:'var(--amberBg)', border:'2px solid var(--amber)', borderRadius:20, marginBottom:24 }}>
          <Clock size={36} color="var(--amber)" style={{ margin:'0 auto 12px' }} />
          <div style={{ fontSize:16, fontWeight:900, color:'var(--text)', marginBottom:4 }}>Plan starts on {new Date(schedule.start_date).toLocaleDateString('en-GB',{day:'numeric',month:'long'})}</div>
          <div style={{ fontSize:13, color:'var(--textM)', fontWeight:600 }}>Come back then — or change your start date below.</div>
        </div>
      )}

      {/* ── WEEKLY VIEW ───────────────────────────────────── */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px' }}>This Week</div>
          <span style={{ fontSize:12, color:'var(--textM)', fontWeight:700 }}>{doneCount} / {Math.min(dayNum,totalDays)*2} sessions done</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
          {Array.from({length:7},(_,i) => {
            const d = i + Math.max(1, dayNum - 3)
            const dp = plan.find(x => x.day === d)
            if (!dp || d > totalDays) return <div key={i} style={{ height:56, borderRadius:10, background:'var(--bg3)', border:'2px solid var(--border)' }} />
            const mDone = isDone(d, 'morning')
            const eDone = isDone(d, 'evening')
            const isToday = d === dayNum
            const isFuture = d > dayNum
            return (
              <div key={i} onClick={() => !isFuture && startSession(dp, mDone ? 'evening' : 'morning')}
                style={{ borderRadius:10, border:`2px solid ${isToday?'var(--green)':'var(--border)'}`, borderBottom:`3px solid ${isToday?'var(--greenD)':'var(--borderB)'}`, background:isToday?'var(--greenBg)':'var(--bg2)', padding:'8px 4px', textAlign:'center', cursor:isFuture?'default':'pointer', opacity:isFuture?0.4:1, transition:'transform .15s' }}>
                <div style={{ fontSize:9, fontWeight:900, color:isToday?'var(--green)':'var(--textD)', textTransform:'uppercase', marginBottom:4 }}>
                  {['M','T','W','T','F','S','S'][new Date(new Date(schedule.start_date).getTime()+(d-1)*86400000).getDay()]}
                </div>
                <div style={{ fontSize:11, fontWeight:900, color:isToday?'var(--green)':'var(--textM)', marginBottom:4 }}>{d}</div>
                <div style={{ display:'flex', gap:2, justifyContent:'center' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:mDone?'var(--green)':'var(--border)' }}/>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:eDone?'var(--green)':'var(--border)' }}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── UPCOMING ─────────────────────────────────────── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Coming Up</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {plan.filter(d => d.day > dayNum && d.day <= dayNum + 3).map(d => (
            <div key={d.day} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'var(--bg2)', border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', borderRadius:14, opacity:0.7 }}>
              <Lock size={16} color="var(--textD)" style={{ flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:'var(--textD)', fontWeight:700, textTransform:'uppercase', marginBottom:2 }}>Day {d.day}</div>
                <div style={{ fontSize:13, fontWeight:800, color:'var(--textM)' }}>{d.morning.label} · {d.evening.label}</div>
              </div>
              <div style={{ fontSize:11, color:'var(--textD)', fontWeight:700 }}>
                {new Date(new Date(schedule.start_date).getTime()+(d.day-1)*86400000).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER LINKS ─────────────────────────────────── */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', paddingTop:8, borderTop:'2px solid var(--border)' }}>
        <button onClick={() => setView('setup')} style={{ padding:'8px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>
          Edit Plan
        </button>
        <span style={{ fontSize:12, color:'var(--textD)', fontWeight:600, display:'flex', alignItems:'center' }}>
          Want extra practice? Use the <strong style={{ color:'var(--blue)', marginLeft:4 }}>Practice</strong> tab.
        </span>
      </div>
    </div>
  )
}

// ── SETUP VIEW ─────────────────────────────────────────────────
const TIMEZONES = ['Europe/London','Europe/Paris','Africa/Lagos','Africa/Accra','Africa/Nairobi','America/New_York','America/Los_Angeles','Asia/Dubai','Asia/Karachi','Asia/Dhaka','Australia/Sydney']

function SetupView({ period, setPeriod, startDate, setStartDate, morningTime, setMorning, eveningTime, setEvening, timezone, setTimezone, emailReminders, setEmail, saving, onSave, existing, onCancel }) {
  const cfg = PERIOD_CONFIG[period]
  return (
    <div className="app-container anim-fadeUp" style={{ maxWidth:520 }}>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:24 }}>
        {existing && <button onClick={onCancel} style={{ padding:'8px 14px', borderRadius:10, border:'2px solid var(--border)', borderBottom:'3px solid var(--borderB)', background:'var(--bg2)', color:'var(--textM)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito, sans-serif' }}>← Cancel</button>}
        <div>
          <h2 style={{ fontSize:20, fontWeight:900, color:'var(--text)' }}>{existing?'Edit':'Start'} Your Learning Plan</h2>
          <p style={{ fontSize:13, color:'var(--textM)', fontWeight:600, marginTop:2 }}>Your plan will guide every session — let's set it up.</p>
        </div>
      </div>

      {/* Period */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:10 }}>How long do you have?</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
          {Object.entries(PERIOD_CONFIG).map(([key,c]) => (
            <div key={key} onClick={() => setPeriod(key)} style={{ padding:14, borderRadius:14, border:`2px solid ${period===key?'var(--green)':'var(--border)'}`, borderBottom:`4px solid ${period===key?'var(--greenD)':'var(--borderB)'}`, background:period===key?'var(--greenBg)':'var(--bg2)', cursor:'pointer', transition:'all .2s' }}>
              <div style={{ fontSize:16, fontWeight:900, color:period===key?'var(--green)':'var(--text)', marginBottom:3 }}>{c.label}</div>
              <div style={{ fontSize:11, color:'var(--textM)', fontWeight:700 }}>{c.morningHours}h morning + {c.eveningHours}h evening per day</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:8, padding:'10px 14px', background:'var(--bg3)', borderRadius:10, fontSize:12, color:'var(--textM)', fontWeight:600, lineHeight:1.5 }}>
          {cfg.description}
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>Start Date</label>
        <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} min={new Date().toISOString().slice(0,10)} />
      </div>

      {/* Times */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
        {[['☀️ Morning Time', morningTime, setMorning],['🌙 Evening Time', eveningTime, setEvening]].map(([label,val,set]) => (
          <div key={label}>
            <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>{label}</label>
            <input type="time" value={val} onChange={e=>set(e.target.value)} />
          </div>
        ))}
      </div>

      {/* Timezone */}
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:900, color:'var(--textM)', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:6 }}>Timezone</label>
        <select value={timezone} onChange={e=>setTimezone(e.target.value)}>
          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      {/* Email reminders */}
      <div onClick={() => setEmail(e=>!e)} style={{ marginBottom:22, padding:14, background:emailReminders?'var(--greenBg)':'var(--bg3)', border:`2px solid ${emailReminders?'var(--green)':'var(--border)'}`, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${emailReminders?'var(--green)':'var(--border)'}`, background:emailReminders?'var(--green)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:12, color:'#fff', fontWeight:900 }}>
          {emailReminders ? '✓' : ''}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:900, color:'var(--text)' }}>Email Reminders</div>
          <div style={{ fontSize:11, color:'var(--textM)', fontWeight:600, marginTop:1 }}>Get a daily email at {morningTime} with your sessions and a study tip</div>
        </div>
      </div>

      <button onClick={() => onSave(!existing)} disabled={saving} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', borderBottom:`4px solid ${saving?'var(--border)':'var(--greenD)'}`, background:saving?'var(--bg3)':'var(--green)', color:saving?'var(--textM)':'#fff', fontWeight:900, fontSize:15, cursor:saving?'not-allowed':'pointer', fontFamily:'Nunito, sans-serif', textTransform:'uppercase', letterSpacing:'0.6px' }}>
        {saving ? 'Saving...' : existing ? `Save Changes →` : `Start My ${PERIOD_CONFIG[period].label} Plan →`}
      </button>
    </div>
  )
}
