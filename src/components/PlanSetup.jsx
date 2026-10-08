// The one place a study plan is created or edited. Two presentations of the same form:
//
//   variant="onboarding"  friendly 2-step wizard, shown by Today when the user has no plan yet
//   variant="edit"        single page form for /today/plan/edit (edit, or ?new=1 for a fresh plan)
//
// Both read the plan from useSchedule() and save through its savePlan(), so there is
// exactly one save path. After a successful save the form leaves the history instead of
// stacking another entry: onboarding swaps itself for Today, and the edit form steps back to
// the screen it was opened from (or Today when it was opened directly).
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronLeft, Clock, Globe, Moon, Sparkles, Sun, CalendarDays, Target, AlertTriangle } from 'lucide-react'
import { PERIOD_CONFIG } from '../data/timetable'
import { useSchedule, localDateKey, parseLocalDate } from '../lib/useSchedule'
import { backLink, quietCard, sectionLabel, fmtDate } from './PlanBits'

export const TIMEZONES = ['Europe/London','Europe/Paris','Africa/Lagos','Africa/Accra','Africa/Nairobi','America/New_York','America/Los_Angeles','Asia/Dubai','Asia/Karachi','Asia/Dhaka','Australia/Sydney']

/** The browser's IANA timezone, so reminders default to the student's own clock. */
export function detectTimezone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London' } catch { return 'Europe/London' }
}

/** Form values for a brand new plan. */
export function defaultPlanValues() {
  return { period: '1_month', startDate: localDateKey(), morningTime: '09:00', eveningTime: '19:00', timezone: detectTimezone(), emailReminders: true }
}

function valuesFromSchedule(s) {
  return {
    period: s.period,
    startDate: String(s.start_date).slice(0, 10),
    morningTime: (s.morning_time || '09:00').slice(0, 5),
    eveningTime: (s.evening_time || '19:00').slice(0, 5),
    timezone: s.timezone || 'Europe/London',
    emailReminders: s.email_reminders ?? true,
  }
}

/** Study hours per day for a PERIOD_CONFIG entry: 5.5 or 4 */
function hoursPerDay(c) {
  const h = (c.morningHours || 0) + (c.noonHours || 0) + (c.eveningHours || 0)
  return Number.isInteger(h) ? String(h) : h.toFixed(1)
}

const fieldLabel = {
  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
  fontSize: 12, fontWeight: 900, color: 'var(--textM)', textTransform: 'uppercase', letterSpacing: '0.5px',
}

const primaryBtn = disabled => ({
  width: '100%', minHeight: 52, padding: '14px', borderRadius: 14, border: 'none',
  borderBottom: `4px solid ${disabled ? 'var(--border)' : 'var(--greenD)'}`,
  background: disabled ? 'var(--bg3)' : 'var(--green)', color: disabled ? 'var(--textM)' : '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
})

export default function PlanSetup({ variant = 'edit', existing = false, name = '' }) {
  const { schedule, savePlan } = useSchedule()
  const navigate = useNavigate()
  const location = useLocation()
  const onboarding = variant === 'onboarding'
  const hasPlan = !!schedule

  const [form, setForm] = useState(() => (existing && schedule ? valuesFromSchedule(schedule) : defaultPlanValues()))
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const savingRef = useRef(false)
  const headingRef = useRef(null)
  const prevStep = useRef(step)
  const set = key => val => setForm(f => ({ ...f, [key]: val }))
  const cfg = PERIOD_CONFIG[form.period] || PERIOD_CONFIG['1_month']
  const canSave = !saving && !!form.startDate

  // New wizard step: start at the top and move focus to the step heading (screen readers, keyboards)
  useEffect(() => {
    if (prevStep.current === step) return
    prevStep.current = step
    window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  async function handleSave() {
    if (savingRef.current || !form.startDate) return
    savingRef.current = true
    setSaving(true)
    setError('')
    let res
    try { res = await savePlan(form, !existing) } catch { res = { ok: false } }
    savingRef.current = false
    setSaving(false)
    if (!res.ok) {
      setError('Could not save your plan. Please check your connection and try again.')
      return
    }
    window.scrollTo(0, 0)
    // Never push /today on top of the form: Back would re-open it. Onboarding already lives at
    // /today, so it just replaces itself. The edit form pops back to where it was opened from
    // (key 'default' means there is nothing in the app below it, e.g. a bookmarked URL).
    if (!onboarding && location.key !== 'default') navigate(-1)
    else navigate('/today', { replace: true })
  }

  const errorBanner = error && (
    <div role="alert" style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--coralBg)', border: '2px solid var(--coral)', borderRadius: 12, fontSize: 12, color: 'var(--text)', fontWeight: 700, lineHeight: 1.5, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <AlertTriangle size={14} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />
      {error}
    </div>
  )

  // ── Edit / new plan: everything on one page ─────────────────
  if (!onboarding) {
    return (
      <div className="app-container anim-fadeUp" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          {hasPlan && <Link to="/today" style={backLink}><ChevronLeft size={16} /> Cancel</Link>}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{existing ? 'Edit' : 'Start'} Your Learning Plan</h1>
            <p style={{ fontSize: 13, color: 'var(--textM)', fontWeight: 600, marginTop: 2 }}>Your plan will guide every session. Let's set it up.</p>
          </div>
        </div>

        {hasPlan && !existing && (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: 'var(--amberBg)', border: '2px solid var(--amber)', borderRadius: 12, fontSize: 12, color: 'var(--text)', fontWeight: 700, lineHeight: 1.5, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Clock size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
            Starting a new plan clears the sessions you have ticked off in your current one. Your test results and progress are kept.
          </div>
        )}

        <div style={{ ...sectionLabel, marginBottom: 10 }}>How long do you have?</div>
        <div style={{ marginBottom: 20 }}>
          <PeriodPicker value={form.period} onChange={set('period')} />
        </div>

        <ScheduleFields form={form} set={set} minDate={existing ? undefined : localDateKey()} />

        {errorBanner}
        <button type="button" onClick={handleSave} disabled={!canSave} style={primaryBtn(!canSave)}>
          {saving ? 'Saving...' : existing ? 'Save Changes' : `Start My ${cfg.label} Plan`}
          {!saving && <ArrowRight size={18} />}
        </button>
      </div>
    )
  }

  // ── First-run onboarding: 2 steps ───────────────────────────
  return (
    <div className="app-container fade-up" style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 36, marginBottom: 10 }}>
        {step === 2
          ? <button type="button" onClick={() => setStep(1)} style={{ ...backLink, cursor: 'pointer' }}><ChevronLeft size={16} /> Back</button>
          : <div style={{ ...sectionLabel, fontSize: 11, minWidth: 0 }}>Welcome{name ? `, ${name}` : ' to ELLTPulse'}</div>}
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--textM)', flexShrink: 0 }}>Step {step} of 2</div>
      </div>
      <StepBar step={step} total={2} />

      <div key={step} className="anim-fadeUp" style={{ marginTop: 22 }}>
        {step === 1 ? (
          <>
            <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', lineHeight: 1.2, outline: 'none' }}>How long do you have?</h1>
            <p style={{ fontSize: 14, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.6, margin: '6px 0 18px' }}>
              Pick a plan length. We will fill every day with sessions that cover all four skills, so you always know what to do next.
            </p>
            <div style={{ marginBottom: 22 }}>
              <PeriodPicker value={form.period} onChange={set('period')} />
            </div>
            <button type="button" onClick={() => setStep(2)} style={primaryBtn(false)}>
              Continue <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <h1 ref={headingRef} tabIndex={-1} style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', lineHeight: 1.2, outline: 'none' }}>When will you study?</h1>
            <p style={{ fontSize: 14, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.6, margin: '6px 0 16px' }}>
              Choose a start date and the times that suit you. You can change all of this later.
            </p>

            <div style={{ ...quietCard, padding: '12px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--greenBg)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={20} color="var(--green)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text)' }}>{cfg.label} plan</div>
                <div style={{ fontSize: 12, color: 'var(--textM)', fontWeight: 700 }}>{hoursPerDay(cfg)} hrs a day · {cfg.days} days</div>
              </div>
              <button type="button" onClick={() => setStep(1)} style={{ flexShrink: 0, minHeight: 36, padding: '6px 12px', borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)', background: 'var(--bg2)', color: 'var(--blue)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                Change
              </button>
            </div>

            <ScheduleFields form={form} set={set} minDate={localDateKey()} />

            {errorBanner}
            <button type="button" onClick={handleSave} disabled={!canSave} style={primaryBtn(!canSave)}>
              {saving ? 'Saving...' : <><Sparkles size={18} /> Start my {cfg.label} plan</>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Pieces ─────────────────────────────────────────────────────

function StepBar({ step, total }) {
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}`} style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 10, borderRadius: 99, background: i < step ? 'var(--green)' : 'var(--bg3)', border: `2px solid ${i < step ? 'var(--greenD)' : 'var(--border)'}`, transition: 'background .25s, border-color .25s' }} />
      ))}
    </div>
  )
}

function PeriodPicker({ value, onChange }) {
  const cfg = PERIOD_CONFIG[value] || PERIOD_CONFIG['1_month']
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {Object.entries(PERIOD_CONFIG).map(([key, c]) => {
          const on = key === value
          return (
            <button key={key} type="button" aria-pressed={on} onClick={() => onChange(key)}
              style={{ position: 'relative', minWidth: 0, textAlign: 'left', padding: '14px 12px', borderRadius: 14, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', color: 'var(--text)',
                border: `2px solid ${on ? 'var(--green)' : 'var(--border)'}`, borderBottom: `4px solid ${on ? 'var(--greenD)' : 'var(--borderB)'}`,
                background: on ? 'var(--greenBg)' : 'var(--bg2)', transition: 'all .15s' }}>
              {on && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={13} color="#fff" strokeWidth={3.5} />
                </span>
              )}
              <div style={{ fontSize: 17, fontWeight: 900, color: on ? 'var(--green)' : 'var(--text)', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{hoursPerDay(c)} hrs a day</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--textM)', marginTop: 1 }}>{c.sessionsPerDay} sessions · {c.days} days</div>
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, fontSize: 12, color: 'var(--textM)', fontWeight: 600, lineHeight: 1.5 }}>
        {cfg.description}
      </div>
    </div>
  )
}

// Start date, session times, timezone and the email reminder opt-in
function ScheduleFields({ form, set, minDate }) {
  const uid = useId()
  const { startDate, morningTime, eveningTime, timezone, emailReminders } = form
  const tzOptions = TIMEZONES.includes(timezone) ? TIMEZONES : [timezone, ...TIMEZONES]

  let startNote = 'Pick a start date'
  if (startDate) {
    const today = localDateKey()
    const when = fmtDate(parseLocalDate(startDate), { weekday: 'long', day: 'numeric', month: 'long' })
    startNote = startDate === today ? 'Your plan starts today' : startDate < today ? `Your plan started on ${when}` : `Your plan starts on ${when}`
  }

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor={`${uid}-start`} style={fieldLabel}><CalendarDays size={13} /> Start date</label>
        <input id={`${uid}-start`} type="date" value={startDate} min={minDate} onChange={e => set('startDate')(e.target.value)} />
        <div style={{ fontSize: 11, color: 'var(--textM)', fontWeight: 700, marginTop: 6 }}>{startNote}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor={`${uid}-am`} style={fieldLabel}><Sun size={13} /> Morning</label>
          <input id={`${uid}-am`} type="time" value={morningTime} onChange={e => set('morningTime')(e.target.value)} />
        </div>
        <div>
          <label htmlFor={`${uid}-pm`} style={fieldLabel}><Moon size={13} /> Evening</label>
          <input id={`${uid}-pm`} type="time" value={eveningTime} onChange={e => set('eveningTime')(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label htmlFor={`${uid}-tz`} style={fieldLabel}><Globe size={13} /> Timezone</label>
        <select id={`${uid}-tz`} value={timezone} onChange={e => set('timezone')(e.target.value)}>
          {tzOptions.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      <button type="button" role="checkbox" aria-checked={emailReminders} onClick={() => set('emailReminders')(!emailReminders)}
        style={{ width: '100%', marginBottom: 22, padding: 14, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Nunito, sans-serif', color: 'var(--text)',
          background: emailReminders ? 'var(--greenBg)' : 'var(--bg3)', border: `2px solid ${emailReminders ? 'var(--green)' : 'var(--border)'}`, borderRadius: 12 }}>
        <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${emailReminders ? 'var(--green)' : 'var(--borderB)'}`, background: emailReminders ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {emailReminders && <Check size={14} color="#fff" strokeWidth={3.5} />}
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>Email reminders</span>
          <span style={{ display: 'block', fontSize: 11, color: 'var(--textM)', fontWeight: 600, marginTop: 1, lineHeight: 1.45 }}>
            Get a daily email at {morningTime || 'your morning time'} with your sessions and a study tip
          </span>
        </span>
      </button>
    </>
  )
}
