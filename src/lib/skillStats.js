// Per-skill performance maths shared by Practice (Recommended card) and Progress
// (overview rows, Focus-area card), so they always agree on every number and on which
// skill is weakest. Rounding lives here and nowhere else.

export const SKILLS = ['listening', 'reading', 'writing', 'speaking']
export const SKILL_LABELS = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' }

/**
 * A real test attempt: one of the four skills, and not the Daily Challenge. The Daily Challenge
 * is a 5-question quiz stored under skill 'listening' that only lives in memory (it is never
 * saved), so counting it would make the stats flip on reload. Vocab drills use skill 'vocab'.
 */
export const isTestResult = r => SKILLS.includes(r.skill) && r.test_id !== 'daily_challenge'

/** Average band (1 d.p.) over the rows that carry a band_score, else null. */
export function averageBand(rows = []) {
  const banded = rows.filter(r => r.band_score > 0)
  return banded.length
    ? Math.round((banded.reduce((t, r) => t + parseFloat(r.band_score), 0) / banded.length) * 10) / 10
    : null
}

/** Average percent-correct (whole number) over the rows that carry score/total, else null. */
export function averagePct(rows = []) {
  const scored = rows.filter(r => r.total > 0)
  return scored.length
    ? Math.round((scored.reduce((t, r) => t + r.score / r.total, 0) / scored.length) * 100)
    : null
}

/**
 * One entry per skill that has at least one scored result:
 * { skill, count, band, pct, score }
 *   band  average band (1 d.p.) over results that carry a band_score, else null
 *   pct   average percent-correct over results that carry score/total, else null
 *   score band as a percentage of 9 when there is a band, otherwise pct (0-100, for comparing skills)
 */
export function skillScores(results = []) {
  return SKILLS.map(skill => {
    const rows = results.filter(r => r.skill === skill && r.test_id !== 'daily_challenge')
    const band = averageBand(rows)
    const pct = averagePct(rows)
    return { skill, count: rows.length, band, pct, score: band != null ? (band / 9) * 100 : pct }
  }).filter(s => s.count > 0 && s.score != null)
}

/** Lowest-scoring entry of a skillScores() list (null when empty). */
export function lowestSkill(scores) {
  return scores.length ? scores.reduce((a, b) => (a.score < b.score ? a : b)) : null
}

/** Highest-scoring entry of a skillScores() list (null when empty). */
export function highestSkill(scores) {
  return scores.length ? scores.reduce((a, b) => (a.score > b.score ? a : b)) : null
}

/**
 * The skill to work on next. Only meaningful once results exist in at least two
 * skills (one skill cannot be "weaker" than nothing); otherwise null.
 */
export function weakestSkill(results) {
  const scores = skillScores(results)
  return scores.length >= 2 ? lowestSkill(scores) : null
}

/** "Band 6.5" when the entry has a band, otherwise "72%". */
export function formatSkillScore(s) {
  return s.band != null ? `Band ${s.band.toFixed(1)}` : `${s.pct}%`
}
