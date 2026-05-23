
export const config = { runtime: 'edge' }

export default async function handler(req) {
  const RESEND_KEY = process.env.RESEND_API_KEY
  const SB_URL     = process.env.VITE_SUPABASE_URL
  const SB_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!RESEND_KEY) return new Response('MISSING: RESEND_API_KEY', { status: 500 })
  if (!SB_URL)     return new Response('MISSING: VITE_SUPABASE_URL', { status: 500 })

  // Get schedules with email stored directly
  const headers = { apikey: SB_KEY || '', Authorization: `Bearer ${SB_KEY || ''}` }
  const schRes = await fetch(`${SB_URL}/rest/v1/student_schedules?email_reminders=eq.true&select=*`, { headers })
  const schedules = await schRes.json()

  if (!Array.isArray(schedules) || !schedules.length) {
    return new Response(JSON.stringify({ error: 'no schedules found', raw: schedules }), { headers: {'Content-Type':'application/json'} })
  }

  const results = []
  for (const s of schedules) {
    const email = s.user_email
    if (!email) { results.push({ error: 'no email in schedule', schedule_id: s.user_id }); continue }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'ELLTPulse <onboarding@resend.dev>',
        to: [email],
        subject: '✅ ELLTPulse email test — it works!',
        html: `<div style="font-family:sans-serif;padding:24px;max-width:500px">
          <div style="background:#58CC02;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px">
            <div style="font-size:24px;font-weight:900;color:#fff">ELLTPulse</div>
          </div>
          <h2 style="color:#3C3C3C">Email reminders are working! 🎉</h2>
          <p style="color:#777;line-height:1.6">This is a test email confirming your study reminders are set up correctly. You will receive a daily email at <strong>${s.morning_time?.slice(0,5)}</strong> every morning with your sessions for the day.</p>
          <a href="https://ellt-practice-hub.vercel.app" style="display:block;background:#58CC02;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:20px;border-bottom:3px solid #46A302">Open ELLTPulse →</a>
        </div>`
      })
    })
    const body = await r.json()
    results.push({ email, status: r.status, resend: body })
  }

  return new Response(JSON.stringify(results, null, 2), { headers: {'Content-Type':'application/json'} })
}
