// ─── ELLTPulse Study Plan Builder ─────────────────────────────────────────────
//
// Each session now has MULTIPLE TASKS — a proper 2-hour study block.
// Morning = Listening + Reading (comprehension)
// Evening = Writing + Speaking (production)
// Special days: Vocabulary, Review, Mock Prep, Full Mock

export const PERIOD_CONFIG = {
  '1_week':  { label: '1 Week',   days: 7,  desc: 'Intensive crash course — 4hrs daily' },
  '2_weeks': { label: '2 Weeks',  days: 14, desc: 'Focused preparation — 4hrs daily' },
  '3_weeks': { label: '3 Weeks',  days: 21, desc: 'Thorough preparation — 4hrs daily' },
  '1_month': { label: '1 Month',  days: 30, desc: 'Complete preparation — 4hrs daily' },
}

// Skill rotation arrays — IDs from data files
const L = ['l1','l2','l3','l4','l5','l6','li1','li2','li3','li4','li5','li6','lc1','lc2','lc3','lc4','lc17t3p1','lc17t3p2','lc17t3p3','lc17t3p4','lc17t2p1','lc17t4p1']
const R = ['r1','r2','r3','r4','r5','ri1','ri2','ri3']
const W = ['w1','w2','w3','w4','w5','wi1','wi2','wi3','wo1','wo2','wo3','wt1']
const S = ['s1','s2','s3','s4','s5','s6','s7','si1','si2']

function pick(arr, i) { return arr[i % arr.length] }

// Day-type schedule for different plan lengths
// Types: 'normal' | 'review' | 'vocab' | 'mock_prep' | 'mock'
const SCHEDULE_30 = [
  'normal','normal','normal','normal','normal','review','vocab',     // Week 1
  'normal','normal','normal','normal','normal','review','vocab',     // Week 2
  'normal','normal','normal','normal','normal','mock_prep','mock',   // Week 3
  'normal','normal','normal','normal','normal','review','vocab',     // Week 4
  'normal','mock_prep','mock',                                       // Final push
]
const SCHEDULE_21 = [
  'normal','normal','normal','normal','review','vocab','normal',
  'normal','normal','normal','normal','review','vocab','mock_prep',
  'normal','normal','normal','normal','review','mock_prep','mock',
]
const SCHEDULE_14 = [
  'normal','normal','normal','review','normal','normal','vocab',
  'normal','normal','mock_prep','normal','normal','review','mock',
]
const SCHEDULE_7 = [
  'normal','normal','review','normal','normal','mock_prep','mock',
]

const SCHEDULES = { '1_month':SCHEDULE_30, '3_weeks':SCHEDULE_21, '2_weeks':SCHEDULE_14, '1_week':SCHEDULE_7 }

function morningTasks(dayType, dayIdx) {
  if (dayType === 'mock' || dayType === 'mock_prep') {
    return [
      { skill:'listening', testId: pick(L, dayIdx),   label:'Listening Practice' },
      { skill:'reading',   testId: pick(R, dayIdx+3), label:'Reading Practice' },
    ]
  }
  if (dayType === 'review') {
    return [
      { skill:'review', testId: null, label:'Review & Consolidate', desc:'Go over your notes, redo questions you got wrong, and review vocabulary from this week.' },
    ]
  }
  if (dayType === 'vocab') {
    return [
      { skill:'listening', testId: pick(L, dayIdx+5), label:'Listening (Vocabulary Focus)' },
      { skill:'vocab',     testId: null,              label:'Vocabulary Building', desc:'Study 20 new academic words. Write each in a sentence. Group them by topic.' },
    ]
  }
  // Normal day — Listening + Reading
  return [
    { skill:'listening', testId: pick(L, dayIdx),     label:'Listening Test' },
    { skill:'reading',   testId: pick(R, dayIdx),     label:'Reading Passage' },
  ]
}

function eveningTasks(dayType, dayIdx) {
  if (dayType === 'mock') {
    return [
      { skill:'mock', testId: null, label:'Full Mock Test', desc:'Complete all 4 sections: Listening, Reading, Writing, Speaking. No breaks between sections.' },
    ]
  }
  if (dayType === 'mock_prep') {
    return [
      { skill:'writing',  testId: pick(W, dayIdx),   label:'Timed Writing Practice', desc:'Set a timer for 40 minutes. Write Task 1 (20 min) + Task 2 (40 min). No extensions.' },
      { skill:'speaking', testId: pick(S, dayIdx),   label:'Speaking Preparation' },
    ]
  }
  if (dayType === 'review') {
    return [
      { skill:'writing',  testId: pick(W, dayIdx+2), label:'Writing Review' },
      { skill:'review',   testId: null,              label:'Evening Review', desc:'Re-read your written responses. Compare with model answers. Note what to improve tomorrow.' },
    ]
  }
  if (dayType === 'vocab') {
    return [
      { skill:'speaking', testId: pick(S, dayIdx+2), label:'Speaking Practice' },
      { skill:'vocab',    testId: null,              label:'Grammar & Vocabulary Drill', desc:'Focus on: linking words, academic phrases, and sentence variety. Write 10 example sentences.' },
    ]
  }
  // Normal day — Writing + Speaking
  return [
    { skill:'writing',  testId: pick(W, dayIdx),     label:'Writing Task' },
    { skill:'speaking', testId: pick(S, dayIdx),     label:'Speaking Practice' },
  ]
}

export function buildPlan(period, startDate) {
  const config = PERIOD_CONFIG[period]
  if (!config) return []
  const schedule = SCHEDULES[period] || SCHEDULE_30
  const sessions = []

  for (let d = 1; d <= config.days; d++) {
    const dayType = schedule[d - 1] || 'normal'
    const date = new Date(startDate)
    date.setDate(date.getDate() + d - 1)
    const idx = d - 1

    sessions.push({
      dayNum: d,
      which:  'morning',
      date:   date.toISOString().slice(0, 10),
      label:  dayType === 'review' ? 'Morning Review Session'
            : dayType === 'vocab'  ? 'Vocabulary & Listening'
            : dayType === 'mock'   ? 'Mock Test Morning'
            : 'Morning: Listening + Reading',
      tasks: morningTasks(dayType, idx),
      dayType,
    })

    sessions.push({
      dayNum: d,
      which:  'evening',
      date:   date.toISOString().slice(0, 10),
      label:  dayType === 'review'    ? 'Evening Review Session'
            : dayType === 'vocab'     ? 'Speaking & Grammar'
            : dayType === 'mock'      ? '📝 Full Mock Exam'
            : dayType === 'mock_prep' ? 'Mock Test Preparation'
            : 'Evening: Writing + Speaking',
      tasks: eveningTasks(dayType, idx),
      dayType,
    })
  }
  return sessions
}
