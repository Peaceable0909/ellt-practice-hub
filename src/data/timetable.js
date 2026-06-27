// ─── ELLTPulse Study Plan Builder ────────────────────────────────────────────

export const PERIOD_CONFIG = {
  '1_week':  { label: '1 Week',   days: 7,  morningHours: 2, noonHours: 1.5, eveningHours: 2, sessionsPerDay: 3, intensity: 'max',    desc: 'Maximum intensity — 5.5hrs · all 4 skills daily', description: '5.5 hours daily · 3 sessions · all 4 skills every day. Designed for students who need rapid, total-immersion preparation.' },
  '2_weeks': { label: '2 Weeks',  days: 14, morningHours: 2, noonHours: 1.5, eveningHours: 2, sessionsPerDay: 3, intensity: 'high',   desc: 'Intensive preparation — 5.5hrs daily', description: '5.5 hours daily · 3 sessions · intensive. Covers all skills with more practice time per day than the longer plans.' },
  '3_weeks': { label: '3 Weeks',  days: 21, morningHours: 2, eveningHours: 2, sessionsPerDay: 2, intensity: 'normal', desc: 'Thorough preparation — 4hrs daily', description: '4 hours daily · 2 sessions · thorough. Comprehensive preparation with time to improve weak areas significantly.' },
  '1_month': { label: '1 Month',  days: 30, morningHours: 2, eveningHours: 2, sessionsPerDay: 2, intensity: 'normal', desc: 'Complete preparation — 4hrs daily', description: '4 hours daily · 2 sessions · steady pace. Full preparation with review days, mock tests, and all 4 skills covered deeply.' },
}

// Listening — 22 tests
const L = [
  'l1','l2','l3','l4','l5','l6',
  'li1','li2','li3','li4','li5','li6',
  'lc1','lc2','lc3','lc4',
  'lc17t3p1','lc17t3p2','lc17t3p3','lc17t3p4',
  'lc17t2p1','lc17t4p1',
]
// Reading — 16 passages
const R = ['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','r13','ri1','ri2','ri3']
// Writing — 23 tasks
const W = [
  'w1','w2','w3','w4','w5','wi1',
  'wt1','wi2','wi3','wo1','wo2','wo3',
  'wi4','wi5','wi6','wi7','wi8','wi9',
  'wi10','wi11','wi12','wi13','wi14',
]
// Speaking — 15 topics
const S = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','si1','si2']

function pick(arr, i) { return arr[i % arr.length] }

// ─── Day type schedules ───────────────────────────────────────────────────────
// 1-week: every day is productive — no pure rest days, mock on final day
const SCHEDULE_7  = ['normal','normal','normal','normal','normal','mock_prep','mock']
// 2-week: introduce one vocab day and one review, mock at end
const SCHEDULE_14 = ['normal','normal','normal','vocab','normal','normal','normal','review','normal','normal','normal','vocab','mock_prep','mock']
// 3-week: steady rhythm with regular reviews
const SCHEDULE_21 = ['normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','review','vocab','mock_prep','normal','normal','normal','normal','review','mock_prep','mock']
// 1-month: full curriculum with breathing room
const SCHEDULE_30 = ['normal','normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','mock_prep','mock','normal','normal','normal','normal','normal','review','vocab','normal','mock']
const SCHEDULES   = { '1_month':SCHEDULE_30,'3_weeks':SCHEDULE_21,'2_weeks':SCHEDULE_14,'1_week':SCHEDULE_7 }

// ─── Session builders — intensity drives task count ───────────────────────────
//
// max (1-week):   3 tasks per session — all 4 skills covered every day
// high (2-weeks): 3 tasks morning, 2 tasks afternoon + evening
// normal (rest):  2 tasks per session — steady pace

function makeMorning(dayType, idx, intensity) {
  if (dayType === 'review') return {
    type: 'review', testId: null, duration: 120,
    label: intensity === 'max' ? 'Review + Listening' : 'Morning Review',
    tasks: intensity === 'max'
      ? [
          { skill:'review',    testId: null,          label:'Review & Consolidate' },
          { skill:'listening', testId: pick(L, idx+8), label:'Listening Test' },
          { skill:'vocab',     testId: null,           label:'Vocabulary Drill' },
        ]
      : [{ skill:'review', testId:null, label:'Review & Consolidate' }],
  }
  if (dayType === 'vocab') return {
    type: 'listening', testId: pick(L, idx+5), duration: 120,
    label: intensity === 'max' ? 'Vocab · Listening · Reading' : 'Vocabulary & Listening',
    tasks: intensity === 'max'
      ? [
          { skill:'vocab',     testId: null,            label:'Vocabulary Drill' },
          { skill:'listening', testId: pick(L, idx+5),  label:'Listening Test' },
          { skill:'reading',   testId: pick(R, idx+4),  label:'Reading Passage' },
        ]
      : [
          { skill:'listening', testId: pick(L, idx+5), label:'Listening Test' },
          { skill:'vocab',     testId: null,            label:'Vocabulary Building' },
        ],
  }
  if (dayType === 'mock' || dayType === 'mock_prep') return {
    type: 'listening', testId: pick(L, idx), duration: 120,
    label: 'Listening + Reading',
    tasks: [
      { skill:'listening', testId: pick(L, idx),   label:'Listening Test' },
      { skill:'reading',   testId: pick(R, idx+2), label:'Reading Passage' },
    ],
  }
  // Normal
  if (intensity === 'max') return {
    type: 'listening', testId: pick(L, idx), duration: 120,
    label: 'Listening · Reading · Vocab',
    tasks: [
      { skill:'listening', testId: pick(L, idx),   label:'Listening Test' },
      { skill:'reading',   testId: pick(R, idx),   label:'Reading Passage' },
      { skill:'vocab',     testId: null,            label:'Vocabulary Drill' },
    ],
  }
  if (intensity === 'high') return {
    type: 'listening', testId: pick(L, idx), duration: 120,
    label: 'Listening · Reading · Vocab',
    tasks: [
      { skill:'listening', testId: pick(L, idx),   label:'Listening Test' },
      { skill:'reading',   testId: pick(R, idx),   label:'Reading Passage' },
      { skill:'vocab',     testId: null,            label:'Vocabulary Building' },
    ],
  }
  return {
    type: 'listening', testId: pick(L, idx), duration: 120,
    label: 'Listening + Reading',
    tasks: [
      { skill:'listening', testId: pick(L, idx), label:'Listening Test' },
      { skill:'reading',   testId: pick(R, idx), label:'Reading Passage' },
    ],
  }
}

function makeAfternoon(dayType, idx, intensity) {
  if (dayType === 'mock' || dayType === 'mock_prep') return {
    type: 'reading', testId: pick(R, idx+1), duration: 90,
    label: 'Reading + Exam Strategy',
    tasks: [
      { skill:'reading', testId: pick(R, idx+1), label:'Reading Passage' },
      { skill:'review',  testId: null,            label:'Exam Strategy' },
    ],
  }
  if (dayType === 'review') return {
    type: 'review', testId: null, duration: 90,
    label: intensity === 'max' ? 'Speaking + Review' : 'Afternoon Review',
    tasks: intensity === 'max'
      ? [
          { skill:'speaking', testId: pick(S, idx+4), label:'Speaking Practice' },
          { skill:'review',   testId: null,            label:'Review & Consolidate' },
        ]
      : [{ skill:'review', testId:null, label:'Review & Consolidate' }],
  }
  if (dayType === 'vocab') return {
    type: 'writing', testId: pick(W, idx+4), duration: 90,
    label: 'Writing + Vocab',
    tasks: [
      { skill:'writing', testId: pick(W, idx+4), label:'Writing Task' },
      { skill:'vocab',   testId: null,            label:'Vocabulary Drill' },
    ],
  }
  // Normal
  if (intensity === 'max') return {
    type: 'writing', testId: pick(W, idx+3), duration: 90,
    label: 'Writing + Speaking',
    tasks: [
      { skill:'writing',  testId: pick(W, idx+3), label:'Writing Task' },
      { skill:'speaking', testId: pick(S, idx+3), label:'Speaking Practice' },
    ],
  }
  return {
    type: 'writing', testId: pick(W, idx+3), duration: 90,
    label: 'Writing + Vocab',
    tasks: [
      { skill:'writing', testId: pick(W, idx+3), label:'Writing Task' },
      { skill:'vocab',   testId: null,            label:'Vocabulary Building' },
    ],
  }
}

function makeEvening(dayType, idx, intensity) {
  if (dayType === 'mock') return {
    type: 'mock', testId: null, duration: 180,
    label: '📝 Full Mock Exam',
    tasks: [{ skill:'mock', testId:null, label:'Full Mock Test' }],
  }
  if (dayType === 'mock_prep') return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: intensity === 'max' ? 'Writing · Speaking · Listening' : 'Timed Writing + Speaking',
    tasks: intensity === 'max'
      ? [
          { skill:'writing',   testId: pick(W, idx),    label:'Timed Writing' },
          { skill:'speaking',  testId: pick(S, idx),    label:'Speaking Practice' },
          { skill:'listening', testId: pick(L, idx+10), label:'Extra Listening' },
        ]
      : [
          { skill:'writing',  testId: pick(W, idx), label:'Timed Writing' },
          { skill:'speaking', testId: pick(S, idx), label:'Speaking Practice' },
        ],
  }
  if (dayType === 'review') return {
    type: 'writing', testId: pick(W, idx+2), duration: 120,
    label: intensity === 'max' ? 'Writing · Reading · Review' : 'Writing + Evening Review',
    tasks: intensity === 'max'
      ? [
          { skill:'writing', testId: pick(W, idx+2),  label:'Writing Task' },
          { skill:'reading', testId: pick(R, idx+6),  label:'Reading Passage' },
          { skill:'review',  testId: null,             label:'Evening Review' },
        ]
      : [
          { skill:'writing', testId: pick(W, idx+2), label:'Writing Task' },
          { skill:'review',  testId: null,            label:'Evening Review' },
        ],
  }
  if (dayType === 'vocab') return {
    type: 'speaking', testId: pick(S, idx+2), duration: 120,
    label: intensity === 'max' ? 'Speaking · Writing · Grammar' : 'Speaking + Grammar',
    tasks: intensity === 'max'
      ? [
          { skill:'speaking', testId: pick(S, idx+2), label:'Speaking Practice' },
          { skill:'writing',  testId: pick(W, idx+6), label:'Writing Task' },
          { skill:'vocab',    testId: null,            label:'Grammar & Vocab Drill' },
        ]
      : [
          { skill:'speaking', testId: pick(S, idx+2), label:'Speaking Practice' },
          { skill:'vocab',    testId: null,            label:'Grammar & Vocab Drill' },
        ],
  }
  // Normal
  if (intensity === 'max') return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: 'Writing · Speaking · Listening',
    tasks: [
      { skill:'writing',   testId: pick(W, idx),    label:'Writing Task' },
      { skill:'speaking',  testId: pick(S, idx),    label:'Speaking Practice' },
      { skill:'listening', testId: pick(L, idx+11), label:'Extra Listening' },
    ],
  }
  if (intensity === 'high') return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: 'Writing + Speaking',
    tasks: [
      { skill:'writing',  testId: pick(W, idx), label:'Writing Task' },
      { skill:'speaking', testId: pick(S, idx), label:'Speaking Practice' },
    ],
  }
  return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: 'Writing + Speaking',
    tasks: [
      { skill:'writing',  testId: pick(W, idx), label:'Writing Task' },
      { skill:'speaking', testId: pick(S, idx), label:'Speaking Practice' },
    ],
  }
}

export function buildPlan(period, startDate = new Date().toISOString().slice(0,10)) {
  const config = PERIOD_CONFIG[period]
  if (!config) return []
  const schedule = SCHEDULES[period] || SCHEDULE_30
  const hasNoon = (config.sessionsPerDay || 2) >= 3
  const intensity = config.intensity || 'normal'

  return Array.from({ length: config.days }, (_, i) => {
    const dayType = schedule[i] || 'normal'
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const day = {
      day:     i + 1,
      date:    date.toISOString().slice(0, 10),
      dayType,
      morning: makeMorning(dayType, i, intensity),
      evening: makeEvening(dayType, i, intensity),
    }
    if (hasNoon) day.noon = makeAfternoon(dayType, i, intensity)
    return day
  })
}

// ─── Exported constants used by Plan.jsx ─────────────────────────────────────
export const SESSION_ICONS = {
  listening: 'Headphones',
  reading:   'BookOpen',
  writing:   'PenLine',
  speaking:  'Mic',
  review:    'Star',
  vocab:     'Brain',
  mock:      'ClipboardList',
}

export const SESSION_COLORS = {
  listening: 'var(--blue)',
  reading:   'var(--amber)',
  writing:   'var(--green)',
  speaking:  'var(--purple)',
  review:    'var(--coral)',
  vocab:     'var(--teal)',
  mock:      'var(--green)',
}
