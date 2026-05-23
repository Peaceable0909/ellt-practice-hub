export const config = { runtime: 'edge' }

function getTip(day) {
  const tips = [
    'For listening, read the questions BEFORE the audio starts. You will know exactly what to listen for.',
    'In reading, scan for keywords from the question first — don\'t read the whole passage before checking what\'s asked.',
    'For writing, spend 5 minutes planning before you write. A clear plan means a better structure.',
    'When speaking, use linking phrases like "Furthermore", "On the other hand", and "To conclude" to sound academic.',
    'True/False/Not Given: NOT GIVEN means the information simply isn\'t in the text.',
    'For Band 7+, vary your sentence structures. Mix simple, compound, and complex sentences.',
    'In the mock test, if stuck on a question move on and come back. Never waste time on one question.',
    'Vocabulary tip: learn words in families — "achieve / achievement / achievable / unachievable".',
    'Reading inference questions: the answer is suggested, not stated. Think about what the author implies.',
    'Speaking tip: pace yourself. Students who speak too quickly make more errors. Aim for 130 words per minute.',
  ]
  return tips[(day - 1) % tips.length]
}

function buildEmail({ name, email, dayNum, totalDays, morningTime, eveningTime, period, streak = 1, xp = 0 }) {
  const periodLabel = { '1_week':'1 Week','2_weeks':'2 Weeks','3_weeks':'3 Weeks','1_month':'1 Month' }[period] || '1 Month'
  const pct = Math.round((dayNum / totalDays) * 100)
  const daysLeft = totalDays - dayNum
  const bar = '█'.repeat(Math.round(pct/10)) + '░'.repeat(10 - Math.round(pct/10))

  let headline, sub
  if (dayNum === 1)    { headline = `Your journey starts today, ${name}!`; sub = `Day 1 of ${totalDays} — every expert was once a beginner.` }
  else if (pct >= 75)  { headline = `You're almost there, ${name}!`; sub = `Only ${daysLeft} days left — you've come too far to stop now.` }
  else if (pct >= 50)  { headline = `Halfway through, ${name}!`; sub = `${dayNum} days done, ${daysLeft} to go. Keep going!` }
  else                 { headline = `Good morning, ${name}!`; sub = `Day ${dayNum} of your ${periodLabel} Oxford ELLT plan.` }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;padding:24px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

<tr><td style="background:#58CC02;border-radius:16px 16px 0 0;padding:24px 28px;text-align:center;border-bottom:4px solid #46A302;">
  <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">ELLTPulse</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.85);">Oxford ELLT Practice Hub</div>
</td></tr>

<tr><td style="background:#ffffff;padding:24px 28px;border:2px solid #E5E5E5;border-top:none;">

  <div style="font-size:20px;font-weight:900;color:#3C3C3C;margin-bottom:4px;">${headline}</div>
  <div style="font-size:13px;color:#777;margin-bottom:20px;">${sub}</div>

  <table width="100%" style="background:#D7FFB8;border:2px solid #58CC02;border-radius:12px;padding:14px;margin-bottom:18px;" cellpadding="14">
  <tr>
    <td><div style="font-size:22px;font-weight:900;color:#3C3C3C;">Day ${dayNum} of ${totalDays}</div>
        <div style="font-size:11px;color:#777;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${periodLabel} Plan</div></td>
    <td align="right"><div style="background:#58CC02;color:#fff;font-size:18px;font-weight:900;padding:8px 14px;border-radius:99px;border-bottom:3px solid #46A302;">${pct}%</div></td>
  </tr></table>

  <div style="margin-bottom:20px;">
    <div style="font-size:10px;font-weight:700;color:#AFAFAF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:5px;">Progress</div>
    <div style="font-family:monospace;font-size:16px;color:#58CC02;letter-spacing:3px;">${bar}</div>
    <div style="font-size:11px;color:#AFAFAF;margin-top:3px;">${daysLeft} day${daysLeft!==1?'s':''} remaining</div>
  </div>

  <div style="font-size:11px;font-weight:700;color:#AFAFAF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">Today's Sessions</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
    <td width="48%" style="background:#DDF4FF;border:2px solid #1CB0F6;border-bottom:3px solid #1899D6;border-radius:12px;padding:14px;text-align:center;">
      <div style="font-size:22px;margin-bottom:4px;">☀️</div>
      <div style="font-size:10px;font-weight:700;color:#1CB0F6;text-transform:uppercase;">Morning</div>
      <div style="font-size:20px;font-weight:900;color:#3C3C3C;margin-top:3px;">${morningTime}</div>
      <div style="font-size:11px;color:#777;">2 hours</div>
    </td>
    <td width="4%"></td>
    <td width="48%" style="background:#F1DAFF;border:2px solid #CE82FF;border-bottom:3px solid #A560E8;border-radius:12px;padding:14px;text-align:center;">
      <div style="font-size:22px;margin-bottom:4px;">🌙</div>
      <div style="font-size:10px;font-weight:700;color:#CE82FF;text-transform:uppercase;">Evening</div>
      <div style="font-size:20px;font-weight:900;color:#3C3C3C;margin-top:3px;">${eveningTime}</div>
      <div style="font-size:11px;color:#777;">2 hours</div>
    </td>
  </tr></table>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
    <td align="center" style="background:#FFF0CD;border:2px solid #FF9600;border-bottom:3px solid #cc7700;border-radius:10px;padding:10px;">
      <div style="font-size:18px;">🔥</div>
      <div style="font-size:16px;font-weight:900;color:#FF9600;">${streak}</div>
      <div style="font-size:9px;color:#777;font-weight:700;text-transform:uppercase;">Streak</div>
    </td>
    <td width="8"></td>
    <td align="center" style="background:#F1DAFF;border:2px solid #CE82FF;border-bottom:3px solid #A560E8;border-radius:10px;padding:10px;">
      <div style="font-size:18px;">⚡</div>
      <div style="font-size:16px;font-weight:900;color:#CE82FF;">${xp}</div>
      <div style="font-size:9px;color:#777;font-weight:700;text-transform:uppercase;">XP</div>
    </td>
    <td width="8"></td>
    <td align="center" style="background:#D7FFB8;border:2px solid #58CC02;border-bottom:3px solid #46A302;border-radius:10px;padding:10px;">
      <div style="font-size:18px;">🎯</div>
      <div style="font-size:16px;font-weight:900;color:#58CC02;">${dayNum}</div>
      <div style="font-size:9px;color:#777;font-weight:700;text-transform:uppercase;">Days done</div>
    </td>
  </tr></table>

  <div style="background:#FFF0CD;border-left:4px solid #FF9600;border-radius:0 10px 10px 0;padding:12px 14px;margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;color:#FF9600;margin-bottom:3px;">💡 Study tip for today</div>
    <div style="font-size:13px;color:#3C3C3C;line-height:1.6;">${getTip(dayNum)}</div>
  </div>

  <table width="100%"><tr><td align="center">
    <a href="https://ellt-practice-hub.vercel.app"
       style="display:inline-block;background:#58CC02;color:#fff;text-decoration:none;font-size:15px;font-weight:900;padding:14px 36px;border-radius:12px;border-bottom:4px solid #46A302;text-transform:uppercase;letter-spacing:0.8px;">
      Open ELLTPulse →
    </a>
  </td></tr></table>

</td></tr>
<tr><td style="background:#F7F7F7;border:2px solid #E5E5E5;border-top:none;border-radius:0 0 16px 16px;padding:16px 28px;text-align:center;">
  <div style="font-size:11px;color:#AFAFAF;">
    To turn off reminders: log in → My Plan → Edit Plan → uncheck Email Reminders
  </div>
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

export default async function handler(req) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  const SB_URL     = process.env.VITE_SUPABASE_URL
  const SB_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (!RESEND_KEY) {
    return new Response('Missing RESEND_API_KEY — set it in Vercel environment variables', { status: 500 })
  }
  if (!SB_URL || !SB_KEY) {
    return new Response('Missing Supabase env vars', { status: 500 })
  }

  try {
    const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    const now = new Date()
    const PERIOD_DAYS = { '1_week':7,'2_weeks':14,'3_weeks':21,'1_month':30 }

    // ── Fetch schedules WITH email stored directly ───────────────
    const schRes = await fetch(
      `${SB_URL}/rest/v1/student_schedules?email_reminders=eq.true&select=*`,
      { headers }
    )
    const schedules = await schRes.json()
    if (!Array.isArray(schedules) || !schedules.length) {
      return new Response(JSON.stringify({ sent:0, reason:'no active schedules' }), { headers:{'Content-Type':'application/json'} })
    }

    // ── Fetch profiles for names ─────────────────────────────────
    const profRes = await fetch(`${SB_URL}/rest/v1/profiles?select=id,full_name`, { headers })
    const profiles = await profRes.json()
    const nameMap = {}
    for (const p of (Array.isArray(profiles) ? profiles : [])) nameMap[p.id] = p.full_name

    // ── Fetch XP from results ────────────────────────────────────
    const xpRes = await fetch(`${SB_URL}/rest/v1/ellt_test_results?select=user_id,score`, { headers })
    const xpData = await xpRes.json()
    const xpMap = {}
    for (const r of (Array.isArray(xpData) ? xpData : [])) {
      xpMap[r.user_id] = (xpMap[r.user_id] || 0) + (r.score || 0) * 10
    }

    let sent = 0
    const errors = []

    for (const s of schedules) {
      const email = s.user_email  // ← stored directly, no admin API needed
      if (!email) continue

      const startDate = new Date(s.start_date)
      startDate.setHours(0,0,0,0)
      const today = new Date(); today.setHours(0,0,0,0)
      const dayNum = Math.floor((today - startDate) / 86400000) + 1
      const totalDays = PERIOD_DAYS[s.period] || 30

      if (dayNum < 1 || dayNum > totalDays) continue

      const name = nameMap[s.user_id]?.split(' ')[0] || email.split('@')[0]
      const xp   = xpMap[s.user_id] || 0

      const html = buildEmail({
        name, email, dayNum, totalDays,
        morningTime: s.morning_time?.slice(0,5) || '09:00',
        eveningTime: s.evening_time?.slice(0,5) || '19:00',
        period: s.period,
        streak: Math.min(dayNum, 30),
        xp,
      })

      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization':`Bearer ${RESEND_KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          from: 'ELLTPulse <onboarding@resend.dev>',
          to: [email],
          subject: `📅 Day ${dayNum} of ${totalDays} — sessions at ${s.morning_time?.slice(0,5)} & ${s.evening_time?.slice(0,5)}`,
          html,
        })
      })

      if (r.ok) { sent++ }
      else { errors.push({ email, status: r.status, body: await r.text() }) }
    }

    return new Response(JSON.stringify({ sent, errors: errors.length, errorDetails: errors }), {
      headers: {'Content-Type':'application/json'}
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status:500, headers:{'Content-Type':'application/json'} })
  }
}
