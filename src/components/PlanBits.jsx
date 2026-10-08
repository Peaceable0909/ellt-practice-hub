// Small presentational pieces shared by Today and the Full plan view.
import { Headphones, BookOpen, PenLine, Mic, ClipboardList, Star, Brain, CheckCircle, Trophy } from 'lucide-react'

export const TASK_META = {
  listening: { Icon: Headphones,    color: 'var(--blue)'   },
  reading:   { Icon: BookOpen,      color: 'var(--amber)'  },
  writing:   { Icon: PenLine,       color: 'var(--purple)' },
  speaking:  { Icon: Mic,           color: 'var(--coral)'  },
  review:    { Icon: Star,          color: 'var(--teal)'   },
  vocab:     { Icon: Brain,         color: 'var(--green)'  },
  mock:      { Icon: ClipboardList, color: 'var(--green)'  },
  intro:     { Icon: Trophy,        color: 'var(--green)'  },
}

export function metaFor(skill) {
  return TASK_META[skill] || { Icon: BookOpen, color: 'var(--textM)' }
}

export const DAY_TYPE_LABELS = {
  mock:      'Mock test day',
  mock_prep: 'Mock prep',
  review:    'Review day',
  vocab:     'Vocab day',
}

/** 120 -> "2 hr", 90 -> "90 min", 150 -> "2.5 hr" */
export function fmtDuration(mins) {
  if (!mins) return ''
  if (mins < 120) return `${mins} min`
  const h = mins / 60
  return `${Number.isInteger(h) ? h : h.toFixed(1)} hr`
}

export function fmtDate(date, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  return date.toLocaleDateString('en-GB', opts)
}

/** Colour-coded task pill. `onGreen` restyles it for use on the green Up Next card. */
export function TaskChip({ task, onGreen = false }) {
  const { Icon, color } = metaFor(task.skill)
  const style = onGreen
    ? { color: '#fff', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.4)' }
    : { color, background: `color-mix(in srgb, ${color} 10%, var(--bg3))`, border: `1px solid color-mix(in srgb, ${color} 30%, var(--border))` }
  return (
    <span style={{ ...style, fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: '100%' }}>
      <Icon size={10} style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.label}</span>
    </span>
  )
}

export function DoneBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 900, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.4px', background: 'var(--greenBg)', border: '1px solid var(--greenBdr)', padding: '2px 8px', borderRadius: 99 }}>
      <CheckCircle size={11} /> Done
    </span>
  )
}

/** Shared "chunky" card styling used for the quieter cards. */
export const quietCard = {
  background: 'var(--bg2)',
  border: '2px solid var(--border)',
  borderBottom: '4px solid var(--borderB)',
  borderRadius: 18,
}

export const sectionLabel = {
  fontSize: 12, fontWeight: 900, color: 'var(--textM)',
  textTransform: 'uppercase', letterSpacing: '0.6px',
}

/** Small "< Back" chip used at the top of the plan screens (<Link style={backLink}>). */
export const backLink = {
  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px 8px 8px', minHeight: 36,
  borderRadius: 10, border: '2px solid var(--border)', borderBottom: '3px solid var(--borderB)',
  background: 'var(--bg2)', color: 'var(--textM)', fontWeight: 800, fontSize: 12,
  fontFamily: 'Nunito, sans-serif', textDecoration: 'none',
}
