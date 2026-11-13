import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../fx/scroll'

/* Headline split into masked lines, revealed with a precise rise. */
export function Lines({ lines, className = '', as: Tag = 'h2', delay = 0, once = true }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) {
      el?.querySelectorAll('.rl > span').forEach((s) => (s.style.transform = 'none'))
      return
    }
    const spans = el.querySelectorAll('.rl > span')
    const tween = gsap.to(spans, {
      y: 0, duration: 1.15, ease: 'power4.out', stagger: 0.12, delay,
      scrollTrigger: once ? { trigger: el, start: 'top 86%' } : undefined,
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [delay, once])
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="rl" key={i}><span>{l}</span></span>
      ))}
    </Tag>
  )
}

/* Fade-and-rise on scroll for any block. */
export function FadeUp({ children, className = '', delay = 0, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) { if (el) { el.style.opacity = 1; el.style.transform = 'none' } ; return }
    const tween = gsap.to(el, {
      opacity: 1, y: 0, duration: 1.05, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [delay])
  return <div ref={ref} className={`fade-up ${className}`} style={style}>{children}</div>
}

/* Animate every [data-reveal] child of the referenced element. */
export function useRevealGroup(ref, deps = []) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (reducedMotion()) { items.forEach((i) => { i.style.opacity = 1; i.style.transform = 'none' }); return }
    const tweens = []
    items.forEach((item, i) => {
      tweens.push(gsap.fromTo(item, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: item, start: 'top 90%' },
      }))
    })
    return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function ArrowIcon() {
  return (
    <svg className="arr" width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
      <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function LogoMark() {
  // Luxurious bronze monogram: an A with an M interlocked inside it,
  // held in a double ring.
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="21.5" stroke="#c9974f" strokeWidth="1.6" />
        <circle cx="24" cy="24" r="17.8" stroke="#c9974f" strokeWidth="0.7" opacity="0.65" />
        <path d="M14.5 34 L24 13.5 L33.5 34" stroke="#e9c886" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.6 34 V25.2 L24 30.4 L29.4 25.2 V34" stroke="#c9974f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export { ScrollTrigger }
