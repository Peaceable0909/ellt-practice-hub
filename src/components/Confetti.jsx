import { useEffect, useRef } from 'react'

const COLORS = ['#58CC02','#1CB0F6','#FF9600','#CE82FF','#FF4B4B','#FFD700','#00D4AA']

export default function Confetti({ active, onDone }) {
  const canvasRef = useRef(null)
  const pieces = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create pieces
    pieces.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 5,
      vrot: (Math.random() - 0.5) * 0.2,
      gravity: 0.08 + Math.random() * 0.06,
      opacity: 1,
    }))

    let done = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.rot += p.vrot
        if (p.y > canvas.height - 40) p.opacity -= 0.03
        if (p.opacity <= 0) { done++; return }
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (done < pieces.current.length) {
        rafRef.current = requestAnimationFrame(draw)
      } else {
        onDone?.()
      }
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  if (!active) return null
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: 9999,
    }} />
  )
}
