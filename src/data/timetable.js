// ─── LEARNING TIMETABLE PLANS ────────────────────────────────────────────────
// Each plan has daily sessions. Session types: listening, reading, writing, speaking, review, mock

const LISTENING_IDS = ['l1','l2','l3','l4','l5','l6']
const READING_IDS   = ['r1','r2','r3','r4','r5','ri1','ri2','ri3']
const WRITING_IDS   = ['w1','w2','w3','w4','w5','wi1']
const SPEAKING_IDS  = ['s1','s2','s3','s4','s5','s6','s7']

// Returns day-by-day schedule for a given period
export function buildPlan(period) {
  switch (period) {
    case '1_week':   return buildWeekPlan()
    case '2_weeks':  return build2WeekPlan()
    case '3_weeks':  return build3WeekPlan()
    case '1_month':  return buildMonthPlan()
    default: return buildMonthPlan()
  }
}

export const PERIOD_CONFIG = {
  '1_week':  { label: '1 Week',   days: 7,  morningHours: 4, eveningHours: 3, description: 'Crash course — 7 hours/day. Intensive preparation for an upcoming exam.' },
  '2_weeks': { label: '2 Weeks',  days: 14, morningHours: 3, eveningHours: 2, description: 'Focused prep — 5 hours/day. Cover all skills with regular practice tests.' },
  '3_weeks': { label: '3 Weeks',  days: 21, morningHours: 2, eveningHours: 2, description: 'Balanced study — 4 hours/day. Build skills progressively with time to review.' },
  '1_month': { label: '1 Month',  days: 30, morningHours: 2, eveningHours: 2, description: 'Full program — 4 hours/day. Complete learning journey from foundation to mock exams.' },
}

function buildMonthPlan() {
  return [
    // WEEK 1 — FOUNDATION
    { day:1,  week:1, theme:'Foundation',
      morning:{ type:'intro',    label:'Introduction to IELT/ELLT Format',    duration:120, desc:'Learn exam structure, question types, and time management strategies.' },
      evening:{ type:'listening',label:'Listening: Concerts',                 duration:120, testId:'l1', skill:'listening' }},
    { day:2,  week:1, theme:'Foundation',
      morning:{ type:'reading',  label:'Reading: The Cicada\'s Song',         duration:120, testId:'ri1', skill:'reading' },
      evening:{ type:'listening',label:'Listening: Cycling Gadgets',          duration:120, testId:'l2', skill:'listening' }},
    { day:3,  week:1, theme:'Foundation',
      morning:{ type:'reading',  label:'Reading: Indoor Farming',             duration:120, testId:'r3', skill:'reading' },
      evening:{ type:'writing',  label:'Writing: Introduction to Task 1',     duration:120, testId:'wt1', skill:'writing', desc:'Learn how to describe charts, graphs and tables. Practice with Grandville Stadium.' }},
    { day:4,  week:1, theme:'Foundation',
      morning:{ type:'speaking', label:'Speaking: Tourism (Stage 2)',         duration:120, testId:'s1', skill:'speaking' },
      evening:{ type:'reading',  label:'Reading: The Beach',                  duration:120, testId:'r5', skill:'reading' }},
    { day:5,  week:1, theme:'Foundation',
      morning:{ type:'listening',label:'Listening: Family Traditions',        duration:120, testId:'l3', skill:'listening' },
      evening:{ type:'writing',  label:'Writing: Team Work Essay',            duration:120, testId:'w1', skill:'writing' }},
    { day:6,  week:1, theme:'Foundation',
      morning:{ type:'reading',  label:'Reading: Do Animals Have Friends?',   duration:120, testId:'r2', skill:'reading' },
      evening:{ type:'speaking', label:'Speaking: Social Media Age Limits',   duration:120, testId:'s5', skill:'speaking' }},
    { day:7,  week:1, theme:'Foundation',
      morning:{ type:'review',   label:'Week 1 Review & Vocabulary',          duration:120, desc:'Review all vocabulary from this week\'s tests. Focus on unknown words.' },
      evening:{ type:'review',   label:'Week 1 Self-Assessment',              duration:120, desc:'Re-read your writing tasks. Compare to model answers. Identify weak areas.' }},

    // WEEK 2 — BUILDING
    { day:8,  week:2, theme:'Building',
      morning:{ type:'listening',label:'Listening: Hydration',                duration:120, testId:'l4', skill:'listening' },
      evening:{ type:'reading',  label:'Reading: Museums in the Digital Age', duration:120, testId:'r4', skill:'reading' }},
    { day:9,  week:2, theme:'Building',
      morning:{ type:'writing',  label:'Writing: Digital Detox Essay',        duration:120, testId:'w2', skill:'writing' },
      evening:{ type:'listening',label:'Listening: Locally Sourced Food',     duration:120, testId:'l5', skill:'listening' }},
    { day:10, week:2, theme:'Building',
      morning:{ type:'reading',  label:'Reading: Art of Pompeii',             duration:120, testId:'ri2', skill:'reading' },
      evening:{ type:'speaking', label:'Speaking: Keeping Pets',              duration:120, testId:'s6', skill:'speaking' }},
    { day:11, week:2, theme:'Building',
      morning:{ type:'listening',label:'Listening: Cherry Blossoms',          duration:120, testId:'l6', skill:'listening' },
      evening:{ type:'writing',  label:'Writing: Post vs Email Essay',        duration:120, testId:'w3', skill:'writing' }},
    { day:12, week:2, theme:'Building',
      morning:{ type:'reading',  label:'Reading: Consumer Purchasing',        duration:120, testId:'ri3', skill:'reading' },
      evening:{ type:'speaking', label:'Speaking: Watching vs Doing Sports',  duration:120, testId:'s2', skill:'speaking' }},
    { day:13, week:2, theme:'Building',
      morning:{ type:'reading',  label:'Reading: A New Generation of Curling',duration:120, testId:'r1', skill:'reading' },
      evening:{ type:'writing',  label:'Writing: Tablets in Schools (IELTS)', duration:120, testId:'wi1', skill:'writing' }},
    { day:14, week:2, theme:'Building',
      morning:{ type:'review',   label:'Week 2 Review — Reading Strategies',  duration:120, desc:'Focus on inference questions and heading matching techniques.' },
      evening:{ type:'review',   label:'Week 2 Review — Writing Feedback',    duration:120, desc:'Re-read your essays with model answers. Focus on linking words and paragraph structure.' }},

    // WEEK 3 — EXAM READY
    { day:15, week:3, theme:'Exam Ready',
      morning:{ type:'listening',label:'Listening: All 6 Tests Speed Review', duration:120, testId:'l1', skill:'listening', desc:'Redo your lowest-scoring listening test under timed conditions.' },
      evening:{ type:'reading',  label:'Reading: Timed Practice (60 mins)',   duration:120, testId:'r1', skill:'reading', desc:'Complete a full reading test under strict exam conditions.' }},
    { day:16, week:3, theme:'Exam Ready',
      morning:{ type:'writing',  label:'Writing: Working from Home Essay',    duration:120, testId:'w4', skill:'writing' },
      evening:{ type:'speaking', label:'Speaking: Sleep Apps',                duration:120, testId:'s4', skill:'speaking' }},
    { day:17, week:3, theme:'Exam Ready',
      morning:{ type:'reading',  label:'Reading: Intensive Comprehension',    duration:120, testId:'ri1', skill:'reading', desc:'Focus on True/False/NG and section matching question types.' },
      evening:{ type:'listening',label:'Listening: Focus on Note Completion', duration:120, testId:'l4', skill:'listening', desc:'Practise writing one and two word answers quickly and accurately.' }},
    { day:18, week:3, theme:'Exam Ready',
      morning:{ type:'speaking', label:'Speaking: Phone Design + Littering',  duration:120, testId:'s7', skill:'speaking' },
      evening:{ type:'writing',  label:'Writing: Daily Journal Essay',        duration:120, testId:'w5', skill:'writing' }},
    { day:19, week:3, theme:'Exam Ready',
      morning:{ type:'reading',  label:'Reading: Pompeii + Consumer Decisions',duration:120, testId:'ri2', skill:'reading' },
      evening:{ type:'listening',label:'Listening: Full Test Under Time',     duration:120, testId:'l2', skill:'listening' }},
    { day:20, week:3, theme:'Exam Ready',
      morning:{ type:'writing',  label:'Writing: Task 1 + Task 2 Combined',   duration:120, testId:'wt1', skill:'writing', desc:'Write both a Task 1 (150 words) and Task 2 (250 words) in the same 60-minute session.' },
      evening:{ type:'speaking', label:'Speaking: Full Presentation Practice',duration:120, testId:'s3', skill:'speaking' }},
    { day:21, week:3, theme:'Exam Ready',
      morning:{ type:'review',   label:'Week 3 Review — Weak Areas',          duration:120, desc:'Identify your two weakest skills. Do targeted exercises for each.' },
      evening:{ type:'review',   label:'Mock Test Preparation',               duration:120, desc:'Read exam tips, practise timing, prepare your mindset for mock exam week.' }},

    // WEEK 4 — MOCK EXAMS
    { day:22, week:4, theme:'Mock Exams',
      morning:{ type:'mock',     label:'Full Mock Test 1',                    duration:120, desc:'Start mock test — Listening and Reading sections under exam conditions.' },
      evening:{ type:'mock',     label:'Full Mock Test 1 (continued)',        duration:120, desc:'Writing and Speaking sections. Complete the full test.' }},
    { day:23, week:4, theme:'Mock Exams',
      morning:{ type:'review',   label:'Mock Test 1 Review',                  duration:120, desc:'Review every answer. Read model essays. Understand every mistake.' },
      evening:{ type:'reading',  label:'Targeted Reading Practice',           duration:120, testId:'ri3', skill:'reading', desc:'Focus on your weakest reading question types.' }},
    { day:24, week:4, theme:'Mock Exams',
      morning:{ type:'listening',label:'Targeted Listening Practice',         duration:120, testId:'l3', skill:'listening', desc:'Practise the listening format that challenged you most.' },
      evening:{ type:'writing',  label:'Essay Revision Practice',             duration:120, testId:'wi1', skill:'writing', desc:'Rewrite your weakest essay from Mock Test 1. Compare to model.' }},
    { day:25, week:4, theme:'Mock Exams',
      morning:{ type:'speaking', label:'Speaking: All 7 Topics Speed Round',  duration:120, testId:'s1', skill:'speaking', desc:'Do a 10-minute practice for each of 7 topics. Focus on structure and fluency.' },
      evening:{ type:'review',   label:'Vocabulary & Grammar Revision',       duration:120, desc:'Review high-frequency IELTS vocabulary. Practise complex sentences and conditional structures.' }},
    { day:26, week:4, theme:'Mock Exams',
      morning:{ type:'mock',     label:'Full Mock Test 2',                    duration:120, desc:'Full mock test under strict exam conditions — no pausing, no notes.' },
      evening:{ type:'mock',     label:'Full Mock Test 2 (continued)',        duration:120, desc:'Complete all 4 sections. Submit for AI scoring.' }},
    { day:27, week:4, theme:'Mock Exams',
      morning:{ type:'review',   label:'Mock Test 2 Deep Review',             duration:120, desc:'Compare Mock Test 1 vs Mock Test 2 scores. Measure your improvement.' },
      evening:{ type:'review',   label:'Final Vocabulary & Strategy Session', duration:120, desc:'Review 50 key academic words. Practise 3 opening sentences for Speaking Stage 2.' }},
    { day:28, week:4, theme:'Mock Exams',
      morning:{ type:'review',   label:'Exam Day Simulation',                 duration:120, desc:'Simulate the full exam experience. Wake up, eat well, then do listening + reading in one sitting.' },
      evening:{ type:'review',   label:'Final Preparation & Confidence',      duration:120, desc:'Light review only. Read your best writing. Listen back to your best speaking. Sleep early.' }},
    { day:29, week:4, theme:'Mock Exams',
      morning:{ type:'review',   label:'Last Minute Tips & Strategies',       duration:120, desc:'Review all exam tips. Practise quickly scanning reading passages. Final speaking topic.' },
      evening:{ type:'review',   label:'Rest & Mental Preparation',           duration:60,  desc:'Short session only. Relax. You are ready.' }},
    { day:30, week:4, theme:'Mock Exams',
      morning:{ type:'mock',     label:'Final Mock Test',                     duration:120, desc:'Your final practice run before the real exam. Give it everything.' },
      evening:{ type:'review',   label:'Program Complete — Final Review',     duration:120, desc:'Review your journey. Compare Band 1 score vs Band 30 score. Celebrate your progress!' }},
  ]
}

function build3WeekPlan() {
  const full = buildMonthPlan()
  // Pick days 1-21 but compress content
  return full.slice(0, 21)
}

function build2WeekPlan() {
  // More intensive — skip review days
  return buildMonthPlan()
    .filter(d => d.morning.type !== 'review' || d.day === 7 || d.day === 14)
    .slice(0, 14)
    .map((d, i) => ({ ...d, day: i + 1 }))
}

function buildWeekPlan() {
  // 7 days — cover everything once
  return [
    { day:1, week:1, theme:'Crash Course',
      morning:{ type:'listening', label:'Listening: Concerts + Cycling Gadgets', duration:240, testId:'l1', skill:'listening' },
      evening:{ type:'reading',   label:'Reading: Cicada\'s Song + Indoor Farming', duration:180, testId:'ri1', skill:'reading' }},
    { day:2, week:1, theme:'Crash Course',
      morning:{ type:'reading',  label:'Reading: Pompeii + Consumer Decisions',  duration:240, testId:'ri2', skill:'reading' },
      evening:{ type:'listening',label:'Listening: Family Traditions + Hydration',duration:180, testId:'l3', skill:'listening' }},
    { day:3, week:1, theme:'Crash Course',
      morning:{ type:'writing',  label:'Writing: Task 1 + Task 2 Practice',      duration:240, testId:'wt1', skill:'writing' },
      evening:{ type:'speaking', label:'Speaking: Tourism + Phone Design',        duration:180, testId:'s1', skill:'speaking' }},
    { day:4, week:1, theme:'Crash Course',
      morning:{ type:'listening',label:'Listening: Cherry Blossoms + Locally Sourced', duration:240, testId:'l5', skill:'listening' },
      evening:{ type:'reading',  label:'Reading: Museums + Do Animals Have Friends?',  duration:180, testId:'r4', skill:'reading' }},
    { day:5, week:1, theme:'Crash Course',
      morning:{ type:'writing',  label:'Writing: Two Full Essays',                duration:240, testId:'w1', skill:'writing' },
      evening:{ type:'speaking', label:'Speaking: All Remaining Topics',          duration:180, testId:'s2', skill:'speaking' }},
    { day:6, week:1, theme:'Crash Course',
      morning:{ type:'mock',     label:'Full Mock Test (all sections)',            duration:240, desc:'Complete all 4 sections under strict exam conditions.' },
      evening:{ type:'review',   label:'Mock Test Review',                         duration:180, desc:'Review every answer and compare to model answers.' }},
    { day:7, week:1, theme:'Crash Course',
      morning:{ type:'review',   label:'Final Revision + Strategy',               duration:240, desc:'Focus on your weakest skill. Review vocabulary and exam tips.' },
      evening:{ type:'mock',     label:'Final Practice Mock',                     duration:180, desc:'One more full practice run. Check your scores have improved.' }},
  ]
}

export const SESSION_ICONS = {
  listening: '🎧', reading: '📖', writing: '✍️', speaking: '🎤',
  review: '📝', mock: '📋', intro: '🎯'
}

export const SESSION_COLORS = {
  listening: 'var(--blue)', reading: 'var(--amber)', writing: 'var(--purple)',
  speaking: 'var(--coral)', review: 'var(--teal)', mock: '#22c55e', intro: 'var(--teal)'
}
