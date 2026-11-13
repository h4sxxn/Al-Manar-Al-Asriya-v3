import { useEffect, useRef } from 'react'
import { reducedMotion } from '../fx/scroll'

/* Site-wide reactive field: fine particles drifting on a slow flow field.
   The field bends around the visitor's finger / cursor — particles near the
   pointer are pushed aside and lit with the accent colour, with hairlines
   tethering them to the touch point. Cheap 2D canvas, DPR-capped. */
export default function ParticleField() {
  const ref = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf = 0, running = true
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5)
    const pointer = { x: -9999, y: -9999, active: 0 }
    let parts = []

    function resize() {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * DPR; canvas.height = h * DPR
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const n = Math.round(Math.min(120, Math.max(45, (w * h) / 16000)))
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: 0, vy: 0, s: Math.random() * 1.5 + 0.6,
      }))
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = 1
    }
    const onLeave = () => { pointer.active = 0; pointer.x = -9999; pointer.y = -9999 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)

    let t = 0
    function frame() {
      if (running) {
        t += 0.0035
        ctx.clearRect(0, 0, w, h)
        const R = 150
        for (const p of parts) {
          // flow field drift
          const a = Math.sin(p.x * 0.0016 + t * 2.1) + Math.cos(p.y * 0.0019 - t * 1.6)
          p.vx += Math.cos(a * 1.7) * 0.012
          p.vy += Math.sin(a * 1.7) * 0.012
          // pointer interaction — repel + slight swirl, "attentive to the finger"
          const dx = p.x - pointer.x, dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          let heat = 0
          if (pointer.active && d2 < R * R) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / R) * 0.55
            p.vx += (dx / d) * f + (-dy / d) * f * 0.35
            p.vy += (dy / d) * f + (dx / d) * f * 0.35
            heat = 1 - d / R
            if (heat > 0.45) {
              ctx.strokeStyle = `rgba(201,151,79,${(heat - 0.45) * 0.4})`
              ctx.lineWidth = 0.6
              ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.x, p.y); ctx.stroke()
            }
          }
          p.vx *= 0.94; p.vy *= 0.94
          p.x += p.vx; p.y += p.vy
          if (p.x < -12) p.x = w + 12; if (p.x > w + 12) p.x = -12
          if (p.y < -12) p.y = h + 12; if (p.y > h + 12) p.y = -12
          ctx.fillStyle = heat > 0.05
            ? `rgba(255,176,66,${0.3 + heat * 0.6})`
            : 'rgba(216,178,118,0.30)'
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s + heat * 1.1, 0, 6.2832); ctx.fill()
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onVis = () => { running = !document.hidden }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas id="fx-particles" ref={ref} aria-hidden="true" />
}
