// Vercel Edge Function — Gemini AI proxy
// Supports both text-only and multimodal (images) requests

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    const body = await req.json()
    const { messages, images } = body

    // Build Gemini parts — text + optional images
    const parts = []

    // Add images first if provided (handwriting upload)
    if (images && images.length > 0) {
      for (const img of images) {
        parts.push({
          inline_data: {
            mime_type: img.mimeType || 'image/jpeg',
            data: img.data  // base64 string
          }
        })
      }
    }

    // Add text prompt
    const textContent = messages?.[0]?.content || ''
    if (textContent) parts.push({ text: textContent })

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No feedback generated.'

    return new Response(JSON.stringify({ content: [{ type: 'text', text }] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
}
