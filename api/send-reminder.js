// Vercel Edge Function — send email reminders via Resend
// Called by Vercel Cron every 30 minutes

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  const SB_URL = process.env.VITE_SUPABASE_URL
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // service role for server-side
  const authHeader = req.headers.get('authorization')

  // Protect cron endpoint
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!RESEND_KEY || !SB_URL || !SB_KEY) {
    return new Response('Missing env vars', { status: 500 })
  }

  try {
    // Get current UTC time
    const now = new Date()
    const currentHour = now.getUTCHours()
    const currentMinute = now.getUTCMinutes()

    // Fetch schedules where email_reminders = true
    const res = await fetch(
      `${SB_URL}/rest/v1/student_schedules?email_reminders=eq.true&select=*,profiles(full_name),users:user_id(email)`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    )
    const schedules = await res.json()

    let sent = 0
    for (const schedule of (schedules || [])) {
      const [mHour, mMin] = schedule.morning_time.split(':').map(Number)
      const [eHour, eMin] = schedule.evening_time.split(':').map(Number)

      const ismorning = Math.abs(currentHour * 60 + currentMinute - (mHour * 60 + mMin)) <= 30
      const isEvening = Math.abs(currentHour * 60 + currentMinute - (eHour * 60 + eMin)) <= 30

      if (!ismorning && !isEvening) continue

      const email = schedule.users?.email
      const name = schedule.profiles?.full_name || 'Student'
      if (!email) continue

      const session = ismorning ? 'Morning' : 'Evening'
      const startDate = new Date(schedule.start_date)
      const dayNum = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1
      const totalDays = { '1_week': 7, '2_weeks': 14, '3_weeks': 21, '1_month': 30 }[schedule.period] || 30

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'ELLTPulse <reminders@ellt-practice-hub.vercel.app>',
          to: [email],
          subject: `⏰ ${session} Study Session — Day ${dayNum} of ${totalDays}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
              <div style="background: linear-gradient(135deg, #00D4AA, #3B82F6); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <h1 style="color: #000; font-size: 24px; margin: 0;">ELLTPulse</h1>
                <p style="color: #000; margin: 4px 0 0; opacity: 0.8;">Oxford ELLT Practice Hub</p>
              </div>
              <h2 style="color: #1a1d2e;">Hi ${name}! 👋</h2>
              <p style="color: #475569; line-height: 1.6;">
                It's time for your <strong>${session.toLowerCase()} study session</strong>.
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0;">
                <div style="font-size: 14px; color: #64748b;">📅 Day ${dayNum} of ${totalDays}</div>
                <div style="font-size: 14px; color: #64748b; margin-top: 4px;">⏱ ${session === 'Morning' ? '2 hours' : '2 hours'} session</div>
              </div>
              <a href="https://ellt-practice-hub.vercel.app" 
                 style="display: block; background: linear-gradient(135deg, #00D4AA, #3B82F6); color: #000; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 10px; font-weight: 700; font-size: 15px; margin-top: 20px;">
                Start Studying Now →
              </a>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                To stop receiving reminders, log in and update your schedule settings.
              </p>
            </div>
          `
        })
      })
      sent++
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
