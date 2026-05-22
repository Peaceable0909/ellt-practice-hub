// Vercel Cron — daily study reminder email
// Runs once at 6am UTC (Hobby plan compatible)
// Sends each student a beautiful motivational digest

export const config = { runtime: 'edge' }

function buildEmail({ name, dayNum, totalDays, morningTime, eveningTime, period, streak = 1, xp = 0 }) {
  const periodLabel = { '1_week': '1 Week', '2_weeks': '2 Weeks', '3_weeks': '3 Weeks', '1_month': '1 Month' }[period] || '1 Month'
  const pct = Math.round((dayNum / totalDays) * 100)
  const daysLeft = totalDays - dayNum

  // Motivational message based on progress
  let headline, sub
  if (dayNum === 1) {
    headline = `Your journey starts today, ${name}!`
    sub = `Day 1 of ${totalDays} — every expert was once a beginner. Let's do this!`
  } else if (pct >= 75) {
    headline = `You're almost there, ${name}!`
    sub = `Only ${daysLeft} days left — you've come too far to stop now.`
  } else if (pct >= 50) {
    headline = `Halfway through, ${name}!`
    sub = `${dayNum} days down, ${daysLeft} to go. You're building serious momentum.`
  } else if (pct >= 25) {
    headline = `Keep the streak alive, ${name}!`
    sub = `Day ${dayNum} — consistency beats intensity every time.`
  } else {
    headline = `Good morning, ${name}!`
    sub = `Day ${dayNum} of your ${periodLabel} Oxford ELLT plan. Two sessions await you today.`
  }

  // Progress bar blocks (email-safe)
  const filledBlocks = Math.round(pct / 10)
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ELLTPulse — Day ${dayNum}</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F7;font-family:'Nunito',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F7;padding:20px 0;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

    <!-- HEADER -->
    <tr><td style="background:#58CC02;border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;border-bottom:5px solid #46A302;">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;margin-bottom:2px;">ELLTPulse</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.85);font-weight:600;">Oxford ELLT Practice Hub</div>
    </td></tr>

    <!-- MAIN CARD -->
    <tr><td style="background:#ffffff;padding:28px 32px;border-left:3px solid #E5E5E5;border-right:3px solid #E5E5E5;">

      <!-- Greeting -->
      <div style="font-size:22px;font-weight:900;color:#3C3C3C;margin-bottom:6px;">${headline}</div>
      <div style="font-size:14px;color:#777;font-weight:600;margin-bottom:24px;line-height:1.5;">${sub}</div>

      <!-- Day badge -->
      <div style="background:#D7FFB8;border:2px solid #58CC02;border-radius:12px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
        <table width="100%"><tr>
          <td style="font-size:28px;font-weight:900;color:#58CC02;width:60px;">📅</td>
          <td>
            <div style="font-size:18px;font-weight:900;color:#3C3C3C;">Day ${dayNum} of ${totalDays}</div>
            <div style="font-size:12px;color:#777;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${periodLabel} Oxford ELLT Plan</div>
          </td>
          <td align="right">
            <div style="background:#58CC02;color:#fff;font-size:16px;font-weight:900;padding:8px 14px;border-radius:99px;border-bottom:3px solid #46A302;">${pct}%</div>
          </td>
        </tr></table>
      </div>

      <!-- Progress bar -->
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:900;color:#AFAFAF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;">Your Progress</div>
        <div style="font-family:monospace;font-size:18px;color:#58CC02;letter-spacing:2px;">${progressBar}</div>
        <div style="font-size:11px;color:#AFAFAF;font-weight:600;margin-top:4px;">${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining</div>
      </div>

      <!-- Today's sessions -->
      <div style="font-size:13px;font-weight:900;color:#AFAFAF;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:12px;">Today's Study Sessions</div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td width="48%" style="background:#DDF4FF;border:2px solid #1CB0F6;border-bottom:4px solid #1899D6;border-radius:14px;padding:16px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">☀️</div>
            <div style="font-size:11px;font-weight:900;color:#1CB0F6;text-transform:uppercase;letter-spacing:0.5px;">Morning</div>
            <div style="font-size:22px;font-weight:900;color:#3C3C3C;margin-top:4px;">${morningTime}</div>
            <div style="font-size:11px;color:#777;font-weight:600;margin-top:2px;">2 hour session</div>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:#F1DAFF;border:2px solid #CE82FF;border-bottom:4px solid #A560E8;border-radius:14px;padding:16px;text-align:center;">
            <div style="font-size:28px;margin-bottom:6px;">🌙</div>
            <div style="font-size:11px;font-weight:900;color:#CE82FF;text-transform:uppercase;letter-spacing:0.5px;">Evening</div>
            <div style="font-size:22px;font-weight:900;color:#3C3C3C;margin-top:4px;">${eveningTime}</div>
            <div style="font-size:11px;color:#777;font-weight:600;margin-top:2px;">2 hour session</div>
          </td>
        </tr>
      </table>

      <!-- Stats row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td align="center" style="background:#FFF0CD;border:2px solid #FF9600;border-bottom:3px solid #cc7700;border-radius:12px;padding:12px 8px;">
            <div style="font-size:20px;">🔥</div>
            <div style="font-size:18px;font-weight:900;color:#FF9600;">${streak}</div>
            <div style="font-size:10px;color:#777;font-weight:700;text-transform:uppercase;">Streak</div>
          </td>
          <td width="8"></td>
          <td align="center" style="background:#F1DAFF;border:2px solid #CE82FF;border-bottom:3px solid #A560E8;border-radius:12px;padding:12px 8px;">
            <div style="font-size:20px;">⚡</div>
            <div style="font-size:18px;font-weight:900;color:#CE82FF;">${xp}</div>
            <div style="font-size:10px;color:#777;font-weight:700;text-transform:uppercase;">XP</div>
          </td>
          <td width="8"></td>
          <td align="center" style="background:#D7FFB8;border:2px solid #58CC02;border-bottom:3px solid #46A302;border-radius:12px;padding:12px 8px;">
            <div style="font-size:20px;">🎯</div>
            <div style="font-size:18px;font-weight:900;color:#58CC02;">${dayNum}</div>
            <div style="font-size:10px;color:#777;font-weight:700;text-transform:uppercase;">Days done</div>
          </td>
        </tr>
      </table>

      <!-- Motivational tip -->
      <div style="background:#FFF0CD;border-left:5px solid #FF9600;border-radius:0 12px 12px 0;padding:14px 16px;margin-bottom:24px;">
        <div style="font-size:13px;font-weight:800;color:#FF9600;margin-bottom:4px;">💡 Today's tip</div>
        <div style="font-size:13px;color:#3C3C3C;font-weight:600;line-height:1.6;">
          ${getTip(dayNum)}
        </div>
      </div>

      <!-- CTA Button -->
      <table width="100%"><tr><td align="center">
        <a href="https://ellt-practice-hub.vercel.app"
           style="display:inline-block;background:#58CC02;color:#ffffff;text-decoration:none;font-size:16px;font-weight:900;padding:16px 40px;border-radius:14px;border-bottom:5px solid #46A302;text-transform:uppercase;letter-spacing:0.8px;font-family:Arial,sans-serif;">
          Open ELLTPulse →
        </a>
      </td></tr></table>

    </td></tr>

    <!-- FOOTER -->
    <tr><td style="background:#F7F7F7;border:3px solid #E5E5E5;border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center;">
      <div style="font-size:12px;color:#AFAFAF;font-weight:600;line-height:1.7;">
        You're receiving this because you enabled study reminders.<br/>
        <a href="https://ellt-practice-hub.vercel.app" style="color:#58CC02;text-decoration:none;font-weight:700;">Log in to manage your settings</a>
      </div>
    </td></tr>

  </table>
  </td></tr>
</table>

</body>
</html>`
}

function getTip(day) {
  const tips = [
    'For listening, always read the questions BEFORE the audio starts. You will know exactly what to listen for.',
    'In reading, scan for keywords from the question first — don\'t read the whole passage before looking at what\'s asked.',
    'For writing, spend 5 minutes planning before you write. A clear plan means a better structure.',
    'When speaking, use linking phrases like "Furthermore", "On the other hand", and "To conclude" to sound more academic.',
    'True/False/Not Given questions: NOT GIVEN means the information isn\'t in the text — not that it\'s wrong.',
    'For Band 7+, use a variety of sentence structures. Mix simple, compound, and complex sentences.',
    'In the mock test, if you\'re stuck on a question, move on and come back. Never waste time on one question.',
    'Vocabulary tip: learn words in families — "achieve / achievement / achievable / unachievable".',
    'Reading inference questions: the answer is suggested, not stated. Think about what the author implies.',
    'Speaking tip: pace yourself. Students who speak too quickly make more errors. Aim for 120–140 words per minute.',
  ]
  return tips[(day - 1) % tips.length]
}

export default async function handler(req) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  const SB_URL     = process.env.VITE_SUPABASE_URL
  const SB_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (!RESEND_KEY || !SB_URL || !SB_KEY) {
    return new Response('Missing env vars: RESEND_API_KEY, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY', { status: 500 })
  }

  try {
    const headers = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    const now = new Date()
    const PERIOD_DAYS = { '1_week': 7, '2_weeks': 14, '3_weeks': 21, '1_month': 30 }

    // Fetch schedules with email reminders on
    const schRes = await fetch(`${SB_URL}/rest/v1/student_schedules?email_reminders=eq.true&select=*`, { headers })
    const schedules = await schRes.json()
    if (!schedules?.length) return new Response(JSON.stringify({ sent: 0, reason: 'no schedules' }), { headers: { 'Content-Type': 'application/json' } })

    // Fetch user emails via admin API
    const usersRes = await fetch(`${SB_URL}/auth/v1/admin/users?per_page=1000`, { headers })
    const usersData = await usersRes.json()
    const userMap = {}
    for (const u of (usersData.users || [])) userMap[u.id] = u.email

    // Fetch profiles for names
    const profRes = await fetch(`${SB_URL}/rest/v1/profiles?select=id,full_name`, { headers })
    const profiles = await profRes.json()
    const profileMap = {}
    for (const p of (profiles || [])) profileMap[p.id] = p.full_name

    // Fetch XP-like stats (test count × 10)
    const statsRes = await fetch(`${SB_URL}/rest/v1/ellt_test_results?select=user_id,score`, { headers })
    const statsData = await statsRes.json()
    const xpMap = {}
    for (const r of (statsData || [])) {
      xpMap[r.user_id] = (xpMap[r.user_id] || 0) + (r.score || 0) * 10
    }

    let sent = 0
    const errors = []

    for (const schedule of schedules) {
      const email = userMap[schedule.user_id]
      if (!email) continue

      const startDate = new Date(schedule.start_date)
      const dayNum = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1
      const totalDays = PERIOD_DAYS[schedule.period] || 30

      // Only send if within active plan period
      if (dayNum < 1 || dayNum > totalDays) continue

      const name = profileMap[schedule.user_id]?.split(' ')[0] || email.split('@')[0]
      const xp = xpMap[schedule.user_id] || 0

      const htmlBody = buildEmail({
        name, dayNum, totalDays,
        morningTime: schedule.morning_time?.slice(0, 5) || '09:00',
        eveningTime: schedule.evening_time?.slice(0, 5) || '19:00',
        period: schedule.period,
        streak: Math.min(dayNum, 30),
        xp,
      })

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'ELLTPulse <onboarding@resend.dev>',
          to: [email],
          subject: `📅 Day ${dayNum} of ${totalDays} — your sessions today are at ${schedule.morning_time?.slice(0,5)} & ${schedule.evening_time?.slice(0,5)}`,
          html: htmlBody,
        })
      })

      if (emailRes.ok) {
        sent++
      } else {
        const errBody = await emailRes.text()
        errors.push({ email, error: errBody })
      }
    }

    return new Response(JSON.stringify({ sent, errors: errors.length, day: now.toISOString() }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
