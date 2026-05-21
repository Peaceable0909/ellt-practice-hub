/**
 * Calls the /api/feedback Vercel serverless function which proxies to Anthropic.
 * The API key is never exposed in the browser.
 */
export async function getAIFeedback(messages) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data?.content?.[0]?.text || 'No feedback generated.'
}

export function buildWritingPrompt(task, essay) {
  return `You are an expert Oxford ELLT examiner. Analyze this student essay and provide structured feedback in exactly this format:

BAND: [B1/B2/C1/C2]
SCORE: [50-100]

STRENGTHS:
- [Point 1]
- [Point 2]
- [Point 3]

AREAS TO IMPROVE:
- [Point 1]
- [Point 2]
- [Point 3]

GRAMMAR TIP: [One specific grammar improvement]
VOCABULARY TIP: [One specific vocabulary improvement]
EXAMINER NOTE: [One overall exam strategy tip - 2 sentences max]

Writing prompt: "${task}"

Student essay:
"""
${essay}
"""`
}

export function buildSpeakingPrompt(task, response) {
  return `You are an Oxford ELLT speaking examiner. Evaluate this written simulation of a spoken response. Give structured feedback:

BAND: [B1/B2/C1/C2]
FLUENCY SCORE: [1-9]
COHERENCE SCORE: [1-9]
VOCABULARY SCORE: [1-9]
GRAMMAR SCORE: [1-9]

TOP 2 STRENGTHS:
- [Strength 1]
- [Strength 2]

2 KEY IMPROVEMENTS:
- [Improvement 1]
- [Improvement 2]

SAMPLE PHRASE: "[Give one example phrase they could use to improve their answer]"
EXAMINER TIP: [One practical speaking tip - 1 sentence]

Topic: "${task}"
Student response: "${response}"`
}
