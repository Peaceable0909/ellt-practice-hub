export const config = { runtime: 'edge' }
export default async function handler(req) {
  const KEY = process.env.RESEND_API_KEY
  if (!KEY) return new Response(JSON.stringify({error:'RESEND_API_KEY not set'}), {status:500,headers:{'Content-Type':'application/json'}})

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json'},
    body: JSON.stringify({
      from: 'ELLTPulse <onboarding@resend.dev>',
      to: ['femiolaniyi36@gmail.com'],
      subject: '✅ ELLTPulse email is working!',
      html: '<div style="font-family:sans-serif;padding:24px;max-width:500px"><div style="background:#58CC02;padding:20px;border-radius:12px;text-align:center;margin-bottom:20px"><div style="font-size:24px;font-weight:900;color:#fff">ELLTPulse</div></div><h2 style="color:#3C3C3C">Your email reminders are working! 🎉</h2><p style="color:#777;line-height:1.6">This confirms your study reminder emails are set up correctly. From tomorrow you will receive a daily email at 9:00am with your sessions for the day.</p><a href="https://ellt-practice-hub.vercel.app" style="display:block;background:#58CC02;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;margin-top:20px;border-bottom:3px solid #46A302">Open ELLTPulse →</a></div>'
    })
  })
  const body = await r.json()
  return new Response(JSON.stringify({status:r.status, resend:body}), {headers:{'Content-Type':'application/json'}})
}