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

const toMins = hhmm => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0) }
const fromMins = n => `${pad(Math.floor(n / 60))}:${pad(n % 60)}`

/**
 * The sessions of one plan day in time order, with their slot label and time.
 * The afternoon session sits at 13:00 when that falls between the student's morning and
 * evening times, otherwise halfway between them, so the order shown always matches the clock.
 */
export function getDaySlots(dayData, schedule) {
  if (!dayData) return []
  const hhmm = v => (v || '').slice(0, 5)
  const morning = hhmm(schedule?.morning_time) || '09:00'
  const evening = hhmm(schedule?.evening_time) || '19:00'
  const slots = [{ which: 'morning', label: 'Morning', time: morning, session: dayData.morning }]
  if (dayData.noon) {
    const am = toMins(morning), pm = toMins(evening)
    const noon = am < 13 * 60 && 13 * 60 < pm ? 13 * 60 : Math.round((am + pm) / 10) * 5
    slots.push({ which: 'noon', label: 'Afternoon', time: Number.isFinite(noon) ? fromMins(noon) : '13:00', session: dayData.noon })
  }
  slots.push({ which: 'evening', label: 'Evening', time: evening, session: dayData.evening })
  return slots.sort((a, b) => toMins(a.time) - toMins(b.time))   // stable: equal times keep morning, noon, evening
}

/** The object StudySession expects as its `session` prop. */
export function buildSession(dayData, which) {
  const s = dayData?.[which]
  if (!s) return null
  return { ...s, key: sessionKey(dayData.day, which), dayNum: dayData.day, which }
}

/**
 * Consecutive CALENDAR days (ending today) on which at least one plan session was completed,
 * read from the completion timestamps. Which plan day a session belongs to does not matter,
 * so catching up on missed days or finishing days in advance cannot inflate the streak. A
 * day that is still in progress (today, nothing done yet) does not break it. Before the
 * plan starts, or once it has been over for more than a day, the streak is 0.
 */
export function calcStreak(completed, todayKey, dayNum, totalDays = Infinity) {
  if (!completed || dayNum < 1 || dayNum > totalDays + 1) return 0
  const days = new Set()
  Object.values(completed).forEach(ts => {
    const t = typeof ts === 'string' ? new Date(ts) : null
    if (t && !Number.isNaN(t.getTime())) days.add(localDateKey(t))
  })
  let day = parseLocalDate(todayKey)
  if (!days.has(localDateKey(day))) day = addDays(day, -1)
  let streak = 0
  while (days.has(localDateKey(day))) { streak++; day = addDays(day, -1) }
  return streak
}

// ── The store (one instance, created in App.jsx) ─────────────────────────────

const REFRESH_AFTER_MS = 5 * 60 * 1000   // re-read the plan when the app wakes after being idle this long

export function useScheduleStore(userId, userEmail, enabled = true) {
  const [schedule, setSchedule] = useState(null)
  const [loadedFor, setLoadedFor] = useState(null)   // userId whose schedule has been fetched
  const [error, setError] = useState(null)
  const [reloadTick, setReloadTick] = useState(0)
  const [todayKey, setTodayKey] = useState(() => localDateKey())
  const [syncError, setSyncError] = useState(false)  // a completed session has not reached the database yet
  const scheduleRef = useRef(null)                   // latest schedule, so rapid writes never use a stale copy
  const pendingRef = useRef({})                      // completions ticked here but not yet confirmed saved: { key: isoTimestamp }
  const queueRef = useRef(Promise.resolve())         // writes run one at a time, so read-merge-write never interleaves
  const revRef = useRef(0)                           // bumped by every local change; a background refresh that started earlier is dropped
  const lastWakeRef = useRef(Date.now())

  const commit = useCallback(next => {
    scheduleRef.current = next
    setSchedule(next)
  }, [])

  const enqueue = useCallback(job => {
    const run = queueRef.current.then(job)
    queueRef.current = run.catch(() => {})
    return run
  }, [])

  const active = !!userId && enabled
  const loading = active && loadedFor !== userId

  // Unsaved completions belong to one user
  useEffect(() => { pendingRef.current = {}; setSyncError(false) }, [userId])

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

  /**
   * Save every completion that is not confirmed saved yet. The map is merged into the row as it
   * is in the database right now, not into the copy this tab loaded earlier, so sessions
   * completed on another device or tab are never overwritten. Returns true when saved.
   */
  const flush = useCallback(async () => {
    const pending = { ...pendingRef.current }
    if (!userId || !Object.keys(pending).length) return true
    try {
      const { data: row, error: readErr } = await supabase
        .from('student_schedules').select('completed_sessions').eq('user_id', userId).maybeSingle()
      if (readErr) { console.error('[schedule] markDone could not read the plan:', readErr.message, readErr.code); return false }
      if (!row) { pendingRef.current = {}; return true }   // no plan row to write to
      const merged = { ...pending, ...(row.completed_sessions || {}) }   // an earlier completion time wins
      const { error: err } = await supabase.from('student_schedules')
        .update({ completed_sessions: merged })
        .eq('user_id', userId)
      if (err) { console.error('[schedule] markDone failed:', err.message, err.code); return false }
      for (const k of Object.keys(pending)) if (pendingRef.current[k] === pending[k]) delete pendingRef.current[k]
      revRef.current++
      // Show sessions that were completed elsewhere too
      const cur = scheduleRef.current
      if (cur && Object.keys(merged).some(k => !(k in (cur.completed_sessions || {})))) {
        commit({ ...cur, completed_sessions: { ...merged, ...(cur.completed_sessions || {}) } })
      }
      return true
    } catch (e) {
      console.error('[schedule] markDone failed:', e?.message || e)
      return false
    }
  }, [userId, commit])

  /** Mark one plan session done. Optimistic; if saving fails it stays queued (see syncError / retrySync). */
  const markDone = useCallback(async key => {
    const prev = scheduleRef.current
    if (!prev || !userId) return
    const existing = prev.completed_sessions?.[key]
    if (existing && !pendingRef.current[key]) return   // already done and saved: keep the original completion time
    const ts = existing || new Date().toISOString()
    pendingRef.current[key] = ts
    revRef.current++
    commit({ ...prev, completed_sessions: { ...(prev.completed_sessions || {}), [key]: ts } })
    const ok = await enqueue(flush)
    setSyncError(!ok)
  }, [userId, commit, enqueue, flush])

  /** Try again to save completions that failed earlier (Today's Retry button). */
  const retrySync = useCallback(async () => {
    const ok = await enqueue(flush)
    setSyncError(!ok)
  }, [enqueue, flush])

  /**
   * Re-read the plan quietly (no loading state) so a tab that has been open for hours picks up
   * sessions completed on another device. Skipped while this tab has unsaved changes, and
   * dropped if anything changed locally while the read was in flight.
   */
  const refresh = useCallback(async () => {
    if (!userId || !scheduleRef.current || Object.keys(pendingRef.current).length) return
    const rev = revRef.current
    const { data, error: err } = await supabase
      .from('student_schedules').select('*').eq('user_id', userId).maybeSingle()
    if (err || !data || rev !== revRef.current || Object.keys(pendingRef.current).length) return
    if (JSON.stringify(data) !== JSON.stringify(scheduleRef.current)) commit(data)
  }, [userId, commit])

  // Waking up: retry unsaved completions when the connection returns, and refresh a stale plan
  useEffect(() => {
    if (!active) return
    const wake = () => {
      if (document.visibilityState === 'hidden') return
      const idle = Date.now() - lastWakeRef.current
      lastWakeRef.current = Date.now()
      if (Object.keys(pendingRef.current).length) retrySync()
      else if (idle > REFRESH_AFTER_MS) refresh()
    }
    const online = () => { if (Object.keys(pendingRef.current).length) retrySync() }
    document.addEventListener('visibilitychange', wake)
    window.addEventListener('focus', wake)
    window.addEventListener('online', online)
    return () => {
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('focus', wake)
      window.removeEventListener('online', online)
    }
  }, [active, retrySync, refresh])

  /**
   * Create or update the plan. Only a BRAND NEW plan resets completed_sessions.
   * values: { period, startDate, morningTime, eveningTime, timezone, emailReminders }
   */
  const savePlan = useCallback((values, isNewPlan) => enqueue(async () => {
    const prev = scheduleRef.current
    let keepCompleted = {}
    if (!isNewPlan) {
      keepCompleted = { ...(prev?.completed_sessions || {}) }
      // The stored map may hold sessions completed on another device since this tab loaded
      const { data: fresh } = await supabase
        .from('student_schedules').select('completed_sessions').eq('user_id', userId).maybeSingle()
      keepCompleted = { ...keepCompleted, ...(fresh?.completed_sessions || {}) }
    }
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
    pendingRef.current = {}   // everything local is now in the saved map (or belonged to the plan that was replaced)
    revRef.current++
    setSyncError(false)
    if (data) commit({ ...data, completed_sessions: data.completed_sessions || keepCompleted })
    return { ok: true }
  }), [userId, userEmail, commit, enqueue])

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
    return { cfg, plan, totalDays, dayNum, status, streak: calcStreak(done, todayKey, dayNum, totalDays), doneSessions, totalSessions }
  }, [completed, period, startDate, todayKey])

  return useMemo(() => ({
    schedule, loading, error, completed: completed || {}, todayKey, syncError,
    ...derived,
    markDone, savePlan, reload, retrySync,
  }), [schedule, loading, error, completed, todayKey, syncError, derived, markDone, savePlan, reload, retrySync])
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
