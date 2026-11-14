import { useEffect, useRef } from 'react'
import { useLang, WA_NUMBER } from '../i18n'
import { gsap, ScrollTrigger, reducedMotion, scrollToTarget } from '../fx/scroll'
import { Lines, ArrowIcon } from './ui'

const PHOTO = `${import.meta.env.BASE_URL}images/hero-jcb.webp`

/* The hero: a photographic JCB backhoe in the bronze showroom, presented
   full-bleed on the stage side while the copy keeps the left column.
   Motion comes from a slow Ken Burns drift on the photograph, a scroll
   parallax while the hero is pinned, the ember field above it and the
   copy reveals — no 3D model ships in the hero anymore. */
export default function HeroJCB({ onQuote }) {
  const { t, lang } = useLang()
  const sectionRef = useRef(null)
  const loaderRef = useRef(null)
  const copyRef = useRef(null)
  const topRef = useRef(null)
  const photoWrapRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    // the branded loader lifts as soon as the local photograph is ready —
    // no model download to wait for anymore
    const done = () => loaderRef.current?.classList.add('done')
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) done()
    const failSafe = setTimeout(done, 2500)

    // —— scroll choreography: while the hero pins, the copy lifts away and
    // the photograph parallaxes inside its frame ——
    let st = null
    if (!reducedMotion()) {
      if (photoWrapRef.current) gsap.set(photoWrapRef.current, { yPercent: -2.2 })
      st = ScrollTrigger.create({
        trigger: section, start: 'top top', end: '+=110%', scrub: 0.5,
        pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          if (photoWrapRef.current) gsap.set(photoWrapRef.current, { yPercent: -2.2 + 4.4 * p })
          if (copyRef.current) gsap.set(copyRef.current, { y: -46 * p, opacity: 1 - 0.55 * p })
          if (topRef.current) gsap.set(topRef.current, { opacity: 1 - Math.min(p / 0.3, 1) })
        },
      })
    }
    return () => {
      clearTimeout(failSafe)
      st?.kill()
    }
  }, [])

  const h = t.hero
  const titleLines = lang === 'en' ? ['Heavy', 'machinery,', 'ready when', 'you are.'] : [h.titleA, h.titleB]
  return (
    <section className="hero" id="top" ref={sectionRef}>
      <div className="hero-main">
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-accent">{h.accent}</p>
          <span className="eyebrow">{h.eyebrow}</span>
          <Lines as="h1" className="hero-title" lines={titleLines} delay={0.25} />
          <p className="hero-sub" ref={(el) => {
            if (el && !reducedMotion()) gsap.to(el, { opacity: 1, duration: 1, delay: 0.9, ease: 'power2.out' })
            else if (el) el.style.opacity = 1
          }}>{h.sub}</p>
          <div className="hero-ctas" ref={(el) => {
            if (el && !reducedMotion()) gsap.to(el, { opacity: 1, duration: 1, delay: 1.1, ease: 'power2.out' })
            else if (el) el.style.opacity = 1
          }}>
            <a className="btn btn-solid" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">
              {h.cta1} <ArrowIcon />
            </a>
            <button className="btn btn-bronze" onClick={() => onQuote('jcb')}>{h.cta3}</button>
            <button className="btn btn-ghost" onClick={() => scrollToTarget('#fleet')}>{h.cta2}</button>
          </div>
        </div>

        <div className="hero-stagewrap">
          <div className="hero-photo-wrap" ref={photoWrapRef}>
            <img
              className="hero-photo"
              ref={imgRef}
              src={PHOTO}
              alt={h.hudUnit}
              fetchPriority="high"
              onLoad={() => loaderRef.current?.classList.add('done')}
            />
          </div>
          <div className="hero-loader" ref={loaderRef}>
            <div>AL MANAR AL ASRIYA<div className="bar"><i /></div></div>
          </div>
          <div className="hero-top" ref={topRef}>
            <span className="hud"><span className="dot" /><b>{h.hudUnit}</b></span>
            <span className="hud hud-coords">{h.hudCoords}</span>
          </div>
          <div className="hero-hint">
            <span className="hud">↓ {h.hudScroll}</span>
          </div>
          <div className="hero-points">
            {h.points.map((p, i) => <span className="chip" key={i}>{p}</span>)}
          </div>
        </div>
      </div>

      <div className="hero-facts">
        {h.facts.map((f, i) => (
          <div className={`fact fact-${i + 1}`} key={i}>
            <div className="v">{f.v}</div>
            <div className="l">{f.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
