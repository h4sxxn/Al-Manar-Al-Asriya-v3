import { useEffect, useRef } from 'react'
import { useLang, WA_NUMBER } from '../i18n'
import { gsap, ScrollTrigger, reducedMotion, scrollToTarget } from '../fx/scroll'
import { makeShowroom } from '../three/showroom'
import { loadJCB } from '../three/loadJCB'
import { Lines, ArrowIcon } from './ui'

export default function HeroJCB({ onQuote }) {
  const { t, lang } = useLang()
  const sectionRef = useRef(null)
  const mountRef = useRef(null)
  const loaderRef = useRef(null)
  const copyRef = useRef(null)
  const topRef = useRef(null)
  const roRefs = { slew: useRef(null), camera: useRef(null) }

  useEffect(() => {
    const mount = mountRef.current
    const section = sectionRef.current
    if (!mount || !section) return
    let disposed = false
    const stage = makeShowroom(mount, { fov: 36 })
    const fit = () => {
      const a = mount.clientWidth / Math.max(mount.clientHeight, 1)
      stage.snapCamera(a < 0.8 ? 16.5 : a < 1.25 ? 13.6 : 11.8, a < 0.8 ? 3.6 : 3.1)
    }
    fit()

    // the real JCB 3CX (downloaded GLB) — the branded loader lifts only
    // once the machine is actually on the platform
    const group = loadJCB(() => { if (!disposed) loaderRef.current?.classList.add('done') })
    group.position.y = 0.245 // standing on the platform
    stage.turntable.add(group)

    const failSafe = setTimeout(() => loaderRef.current?.classList.add('done'), 9000)

    // readouts — a few times a second; they only ever show motion that is
    // really happening: the turntable rotation and the camera distance
    let frames = 0
    stage.onTick(() => {
      if (++frames % 8) return
      const rot = ((stage.rotation() * 57.2958) % 360 + 360) % 360
      if (roRefs.slew.current) roRefs.slew.current.textContent = `${String(Math.round(rot)).padStart(3, '0')}°`
      if (roRefs.camera.current) roRefs.camera.current.textContent = `${stage.cameraDist().toFixed(1)} M`
    })

    // —— scroll choreography: the turntable turns and the camera dollies in ——
    let st = null
    if (!reducedMotion()) {
      let lastP = 0
      st = ScrollTrigger.create({
        trigger: section, start: 'top top', end: '+=110%', scrub: 0.5,
        pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          stage.nudge((p - lastP) * Math.PI * 1.7)
          lastP = p
          const a = mount.clientWidth / Math.max(mount.clientHeight, 1)
          const d0 = a < 0.8 ? 16.5 : a < 1.25 ? 13.6 : 11.8
          stage.setCamera(d0 - 1.7 * p, (a < 0.8 ? 3.6 : 3.1) - 0.45 * p)
          if (copyRef.current) gsap.set(copyRef.current, { y: -46 * p, opacity: 1 - 0.55 * p })
          if (topRef.current) gsap.set(topRef.current, { opacity: 1 - Math.min(p / 0.3, 1) })
        },
      })
    }
    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    return () => {
      disposed = true
      clearTimeout(failSafe)
      window.removeEventListener('resize', onResize)
      st?.kill()
      stage.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="hero-stage" ref={mountRef} />
          <div className="hero-loader" ref={loaderRef}>
            <div>AL MANAR AL ASRIYA<div className="bar"><i /></div></div>
          </div>
          <div className="hero-top" ref={topRef}>
            <span className="hud"><span className="dot" /><b>{h.hudUnit}</b></span>
            <span className="hud hud-coords">{h.hudCoords}</span>
          </div>
          <div className="hero-hint">
            <span className="hud">↺ {h.hudDrag}</span>
            <span className="hud">↓ {h.hudScroll}</span>
          </div>
          <div className="hero-readout" aria-hidden="true">
            <div>{h.readout.slew} <b ref={roRefs.slew}>000°</b></div>
            <div>{h.readout.camera} <b ref={roRefs.camera}>—</b></div>
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
