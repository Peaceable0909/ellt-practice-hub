// Vercel Edge Function — daily email digest
// Runs once per day at 6am UTC (Hobby plan compatible)
// Sends each student a single email listing both sessions for that day

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  const SB_URL = process.env.VITE_SUPABASE_URL
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!RESEND_KEY || !SB_URL || !SB_KEY) {
    return new Response('Missing env vars', { status: 500 })
  }

  try {
    // Get all students with email reminders enabled
    const res = await fetch(
      `${SB_URL}/rest/v1/student_schedules?email_reminders=eq.true&select=*`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    )
    const schedules = await res.json()

    // Get user emails from auth
    const usersRes = await fetch(
      `${SB_URL}/auth/v1/admin/users?per_page=1000`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    )
    const usersData = await usersRes.json()
    const userMap = {}
    for (const u of (usersData.users || [])) {
      userMap[u.id] = u.email
    }

    // Get profiles for names
    const profilesRes = await fetch(
      `${SB_URL}/rest/v1/profiles?select=id,full_name`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    )
    const profiles = await profilesRes.json()
    const profileMap = {}
    for (const p of (profiles || [])) profileMap[p.id] = p.full_name

    let sent = 0
    const now = new Date()
    const PERIOD_DAYS = { '1_week': 7, '2_weeks': 14, '3_weeks': 21, '1_month': 30 }

    for (const schedule of (schedules || [])) {
      const email = userMap[schedule.user_id]
      if (!email) continue

      const name = profileMap[schedule.user_id] || email.split('@')[0]
      const startDate = new Date(schedule.start_date)
      const dayNum = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1
      const totalDays = PERIOD_DAYS[schedule.period] || 30

      if (dayNum < 1 || dayNum > totalDays) continue

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'ELLTPulse <onboarding@resend.dev>',
          to: [email],
          subject: `📅 Your study sessions today — Day ${dayNum} of ${totalDays}`,
          html: `
            <div style="font-family: 'Nunito', sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #ffffff;">
              
              <div style="background: #58CC02; padding: 20px 24px; border-radius: 16px; margin-bottom: 24px; text-align: center; border-bottom: 4px solid #46A302;">
                <div style="font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -0.5px;">ELLTPulse</div>
                <div style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 2px;">Oxford ELLT Practice Hub</div>
              </div>

              <h2 style="font-size: 20px; font-weight: 900; color: #3C3C3C; margin: 0 0 6px;">Good morning, ${name}! 🌟</h2>
              <p style="color: #777; font-size: 14px; font-weight: 600; margin: 0 0 20px;">Day ${dayNum} of ${totalDays} — here are your study sessions for today.</p>

              <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                <div style="flex: 1; background: #DDF4FF; border: 2px solid #1CB0F6; border-bottom: 4px solid #1899D6; border-radius: 14px; padding: 16px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 6px;">☀️</div>
                  <div style="font-size: 13px; font-weight: 900; color: #1CB0F6; text-transform: uppercase; letter-spacing: 0.5px;">Morning</div>
                  <div style="font-size: 22px; font-weight: 900; color: #3C3C3C; margin-top: 4px;">${schedule.morning_time}</div>
                  <div style="font-size: 12px; color: #777; font-weight: 600;">2 hour session</div>
                </div>
                <div style="flex: 1; background: #F1DAFF; border: 2px solid #CE82FF; border-bottom: 4px solid #A560E8; border-radius: 14px; padding: 16px; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 6px;">🌙</div>
                  <div style="font-size: 13px; font-weight: 900; color: #CE82FF; text-transform: uppercase; letter-spacing: 0.5px;">Evening</div>
                  <div style="font-size: 22px; font-weight: 900; color: #3C3C3C; margin-top: 4px;">${schedule.evening_time}</div>
                  <div style="font-size: 12px; color: #777; font-weight: 600;">2 hour session</div>
                </div>
              </div>

              <div style="background: #FFF0CD; border: 2px solid #FF9600; border-bottom: 4px solid #cc7700; border-radius: 14px; padding: 14px; margin-bottom: 20px; text-align: center;">
                <span style="font-size: 16px; margin-right: 6px;">🔥</span>
                <span style="font-weight: 900; color: #FF9600; font-size: 14px;">Keep your streak going! Log in and complete both sessions today.</span>
              </div>

              <a href="https://ellt-practice-hub.vercel.app"
                 style="display: block; background: #58CC02; color: #fff; text-decoration: none; text-align: center; padding: 16px 24px; border-radius: 14px; font-weight: 900; font-size: 15px; border-bottom: 4px solid #46A302; text-transform: uppercase; letter-spacing: 0.8px;">
                Open ELLTPulse →
              </a>

              <p style="color: #AFAFAF; font-size: 11px; text-align: center; margin-top: 20px; font-weight: 600;">
                To stop reminders, log in → My Plan → Edit Schedule → turn off email reminders.
              </p>
            </div>
          `
        })
      })
      sent++
    }

    return new Response(JSON.stringify({ sent, day: now.toISOString() }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
