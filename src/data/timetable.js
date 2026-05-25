// ─── ELLTPulse Study Plan Builder ────────────────────────────────────────────

export const PERIOD_CONFIG = {
  '1_week':  { label: '1 Week',   days: 7,  desc: 'Intensive crash course — 4hrs daily' },
  '2_weeks': { label: '2 Weeks',  days: 14, desc: 'Focused preparation — 4hrs daily' },
  '3_weeks': { label: '3 Weeks',  days: 21, desc: 'Thorough preparation — 4hrs daily' },
  '1_month': { label: '1 Month',  days: 30, desc: 'Complete preparation — 4hrs daily' },
}

const L = ['l1','l2','l3','l4','l5','l6','li1','li2','li3','li4','li5','li6','lc1','lc2','lc3','lc4','lc17t3p1','lc17t3p2','lc17t3p3','lc17t3p4','lc17t2p1','lc17t4p1']
const R = ['r1','r2','r3','r4','r5','ri1','ri2','ri3']
const W = ['w1','w2','w3','w4','w5','wi1','wi2','wi3','wo1','wo2','wo3']
const S = ['s1','s2','s3','s4','s5','s6','s7','si1','si2']

function pick(arr, i) { return arr[i % arr.length] }

const SCHEDULE_30 = ['normal','normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','mock_prep','mock','normal','normal','normal','normal','normal','review','vocab','normal','mock']
const SCHEDULE_21 = ['normal','normal','normal','normal','review','vocab','normal','normal','normal','normal','normal','review','vocab','mock_prep','normal','normal','normal','normal','review','mock_prep','mock']
const SCHEDULE_14 = ['normal','normal','normal','review','normal','normal','vocab','normal','normal','mock_prep','normal','normal','review','mock']
const SCHEDULE_7  = ['normal','normal','review','normal','normal','mock_prep','mock']
const SCHEDULES   = { '1_month':SCHEDULE_30,'3_weeks':SCHEDULE_21,'2_weeks':SCHEDULE_14,'1_week':SCHEDULE_7 }

function makeMorning(dayType, idx) {
  if (dayType === 'review') return {
    type: 'review', testId: null, duration: 120,
    label: 'Morning Review',
    tasks: [{ skill:'review', testId:null, label:'Review & Consolidate' }],
  }
  if (dayType === 'vocab') return {
    type: 'listening', testId: pick(L, idx+5), duration: 120,
    label: 'Vocabulary & Listening',
    tasks: [
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
  return {
    type: 'listening', testId: pick(L, idx), duration: 120,
    label: 'Listening + Reading',
    tasks: [
      { skill:'listening', testId: pick(L, idx),   label:'Listening Test' },
      { skill:'reading',   testId: pick(R, idx),   label:'Reading Passage' },
    ],
  }
}

function makeEvening(dayType, idx) {
  if (dayType === 'mock') return {
    type: 'mock', testId: null, duration: 180,
    label: '📝 Full Mock Exam',
    tasks: [{ skill:'mock', testId:null, label:'Full Mock Test' }],
  }
  if (dayType === 'mock_prep') return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: 'Timed Writing + Speaking',
    tasks: [
      { skill:'writing',  testId: pick(W, idx), label:'Timed Writing' },
      { skill:'speaking', testId: pick(S, idx), label:'Speaking Practice' },
    ],
  }
  if (dayType === 'review') return {
    type: 'writing', testId: pick(W, idx+2), duration: 120,
    label: 'Writing + Evening Review',
    tasks: [
      { skill:'writing', testId: pick(W, idx+2), label:'Writing Task' },
      { skill:'review',  testId: null,            label:'Evening Review' },
    ],
  }
  if (dayType === 'vocab') return {
    type: 'speaking', testId: pick(S, idx+2), duration: 120,
    label: 'Speaking + Grammar',
    tasks: [
      { skill:'speaking', testId: pick(S, idx+2), label:'Speaking Practice' },
      { skill:'vocab',    testId: null,            label:'Grammar & Vocab Drill' },
    ],
  }
  // Normal
  return {
    type: 'writing', testId: pick(W, idx), duration: 120,
    label: 'Writing + Speaking',
    tasks: [
      { skill:'writing',  testId: pick(W, idx), label:'Writing Task' },
      { skill:'speaking', testId: pick(S, idx), label:'Speaking Practice' },
    ],
  }
}

export function buildPlan(period, startDate) {
  const config = PERIOD_CONFIG[period]
  if (!config) return []
  const schedule = SCHEDULES[period] || SCHEDULE_30

  return Array.from({ length: config.days }, (_, i) => {
    const dayType = schedule[i] || 'normal'
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return {
      day:     i + 1,
      date:    date.toISOString().slice(0, 10),
      dayType,
      morning: makeMorning(dayType, i),
      evening: makeEvening(dayType, i),
    }
  })
}
