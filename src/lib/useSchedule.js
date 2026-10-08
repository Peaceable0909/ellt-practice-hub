// Single source of truth for the student's study plan (Supabase table
// student_schedules). App.jsx owns one store via useScheduleStore() and shares
// it through <ScheduleProvider>; Today, Plan and the session runner read it with
// useSchedule(). Nothing else should query or mutate student_schedules.
//
// All date maths here is LOCAL calendar time. Never use toISOString().slice(0,10)
// for "today": that is the UTC date and flips the day for anyone off UTC.
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase'
import { buildPlan, PERIOD_CONFIG } from '../data/timetable'

const pad = n => String(n).padStart(2, '0')

// ── Local date helpers ───────────────────────────────────────────────────────

/** 'YYYY-MM-DD' for a Date, in local time. */
export function localDateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 'YYYY-MM-DD' (or a timestamp starting with it) -> local midnight Date. */
export function parseLocalDate(str) {
  const [y, m, d] = String(str).slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Local date n calendar days after `date` (safe across DST changes). */
export function addDays(date, n) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n)
}

/** Whole calendar days from a to b, by local Y/M/D (DST-proof). */
export function daysBetween(a, b) {
  const ms = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  return Math.round(ms / 86400000)
}

/** Plan day number for `today` (1 on the start date, <1 before it). */
export function dayNumberFor(startDate, today = new Date()) {
  return daysBetween(parseLocalDate(startDate), today) + 1
}

// ── Plan helpers ─────────────────────────────────────────────────────────────

export function sessionKey(day, which) {
  return `day_${day}_${which}`
}

/** The sessions of one plan day in time order, with their slot label and time. */
export function getDaySlots(dayData, schedule) {
  if (!dayData) return []
  const hhmm = v => (v || '').slice(0, 5)
  const slots = [{ which: 'morning', label: 'Morning', time: hhmm(schedule?.morning_time) || '09:00', session: dayData.morning }]
  if (dayData.noon) slots.push({ which: 'noon', label: 'Afternoon', time: '13:00', session: dayData.noon })
  slots.push({ which: 'evening', label: 'Evening', time: hhmm(schedule?.evening_time) || '19:00', session: dayData.evening })
  return slots
}

/** The object StudySession expects as its `session` prop. */
export function buildSession(dayData, which) {
  const s = dayData?.[which]
  if (!s) return null
  return { ...s, key: sessionKey(dayData.day, which), dayNum: dayData.day, which }
}

/**
 * Consecutive days (ending today) with at least one session done. A day that is
 * still in progress (today, nothing done yet) does not break the streak. Once the
 * plan has been over for more than a day the streak is 0.
 */
export function calcStreak(completed, dayNum, totalDays = Infinity) {
  if (!completed || dayNum < 1 || dayNum > totalDays + 1) return 0
  const doneOn = d => !!(completed[sessionKey(d, 'morning')] || completed[sessionKey(d, 'noon')] || completed[sessionKey(d, 'evening')])
  let streak = 0
  for (let d = Math.min(dayNum, totalDays); d >= 1; d--) {
    if (doneOn(d)) streak++
    else if (d < dayNum) break
  }
  return streak
}

// ── The store (one instance, created in App.jsx) ─────────────────────────────

export function useScheduleStore(userId, userEmail, enabled = true) {
  const [schedule, setSchedule] = useState(null)
  const [loadedFor, setLoadedFor] = useState(null)   // userId whose schedule has been fetched
  const [error, setError] = useState(null)
  const [reloadTick, setReloadTick] = useState(0)
  const [todayKey, setTodayKey] = useState(() => localDateKey())
  const scheduleRef = useRef(null)                   // latest schedule, so rapid writes never use a stale copy

  const commit = useCallback(next => {
    scheduleRef.current = next
    setSchedule(next)
  }, [])

  const active = !!userId && enabled
  const loading = active && loadedFor !== userId

  // Load whenever the signed-in user changes (or reload() is called)
  useEffect(() => {
    if (!active) { commit(null); setLoadedFor(null); setError(null); return }
    let cancelled = false
    ;(async () => {
      const { data, error: err } = await supabase
        .from('student_schedules').select('*').eq('user_id', userId).maybeSingle()
      if (cancelled) return
      if (err) {
        console.error('[schedule] load failed:', err.message, err.code)
        setError(err)
      } else {
        setError(null)
        commit(data || null)
      }
      setLoadedFor(userId)
    })()
    return () => { cancelled = true }
  }, [userId, active, reloadTick, commit])

  // Roll the day over at local midnight even if the tab stays open
  useEffect(() => {
    const tick = () => setTodayKey(prev => { const k = localDateKey(); return prev === k ? prev : k })
    const id = setInterval(tick, 30000)
    document.addEventListener('visibilitychange', tick)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick) }
  }, [])

  const reload = useCallback(() => { setLoadedFor(null); setReloadTick(t => t + 1) }, [])

  /** Mark one plan session done. Optimistic, then persisted exactly like the old Plan.jsx did. */
  const markDone = useCallback(async key => {
    const prev = scheduleRef.current
    if (!prev || !userId) return
    const updated = { ...(prev.completed_sessions || {}), [key]: new Date().toISOString() }
    commit({ ...prev, completed_sessions: updated })
    const { error: err } = await supabase.from('student_schedules')
      .update({ completed_sessions: updated })
      .eq('user_id', userId)
    if (err) console.error('[schedule] markDone failed:', err.message, err.code)
  }, [userId, commit])

  /**
   * Create or update the plan. Only a BRAND NEW plan resets completed_sessions.
   * values: { period, startDate, morningTime, eveningTime, timezone, emailReminders }
   */
  const savePlan = useCallback(async (values, isNewPlan) => {
    const prev = scheduleRef.current
    const keepCompleted = !isNewPlan && prev ? (prev.completed_sessions || {}) : {}
    const row = {
      user_id: userId, user_email: userEmail,
      period: values.period, start_date: values.startDate,
      morning_time: values.morningTime, evening_time: values.eveningTime,
      timezone: values.timezone, email_reminders: values.emailReminders,
      completed_sessions: keepCompleted, updated_at: new Date().toISOString(),
    }
    const { data, error: err } = await supabase
      .from('student_schedules').upsert([row], { onConflict: 'user_id' }).select().single()
    if (err) {
      console.error('[schedule] savePlan failed:', err.message, err.code, err.hint)
      return { ok: false, error: err }
    }
    if (data) commit({ ...data, completed_sessions: data.completed_sessions || keepCompleted })
    return { ok: true }
  }, [userId, userEmail, commit])

  const completed = schedule?.completed_sessions
  const period = schedule?.period
  const startDate = schedule?.start_date

  const derived = useMemo(() => {
    const done = completed || {}
    if (!period || !startDate) {
      return { cfg: null, plan: [], totalDays: 0, dayNum: 0, status: 'none', streak: 0, doneSessions: 0, totalSessions: 0 }
    }
    const cfg = PERIOD_CONFIG[period] || null
    const plan = buildPlan(period, startDate)
    const totalDays = cfg?.days || plan.length
    const dayNum = dayNumberFor(startDate, parseLocalDate(todayKey))
    const status = dayNum < 1 ? 'upcoming' : dayNum > totalDays ? 'finished' : 'active'
    let doneSessions = 0
    let totalSessions = 0
    plan.forEach(d => {
      getDaySlots(d, null).forEach(s => {
        totalSessions++
        if (done[sessionKey(d.day, s.which)]) doneSessions++
      })
    })
    return { cfg, plan, totalDays, dayNum, status, streak: calcStreak(done, dayNum, totalDays), doneSessions, totalSessions }
  }, [completed, period, startDate, todayKey])

  return useMemo(() => ({
    schedule, loading, error, completed: completed || {}, todayKey,
    ...derived,
    markDone, savePlan, reload,
  }), [schedule, loading, error, completed, todayKey, derived, markDone, savePlan, reload])
}

// ── Context ──────────────────────────────────────────────────────────────────

const ScheduleContext = createContext(null)

export function ScheduleProvider({ value, children }) {
  return createElement(ScheduleContext.Provider, { value }, children)
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext)
  if (!ctx) throw new Error('useSchedule() must be used inside <ScheduleProvider>')
  return ctx
}
