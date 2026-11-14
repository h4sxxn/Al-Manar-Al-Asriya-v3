import { useEffect, useRef } from 'react'
import { useLang, FLEET } from '../i18n'
import { gsap, reducedMotion } from '../fx/scroll'
import { Lines, FadeUp, ArrowIcon } from './ui'
import ExcavatorStage from './ExcavatorStage'

export default function Fleet({ onQuote }) {
  const { t, lang } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root || reducedMotion()) return
    const ctx = gsap.context(() => {
      root.querySelectorAll('.fleet-media img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.closest('.fleet-row'), start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      root.querySelectorAll('.fleet-row').forEach((row) => {
        gsap.fromTo(row, { opacity: 0, y: 44 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [lang])

  const f = t.fleet
  return (
    <section className="section" id="fleet" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">{f.eyebrow}</span>
        <Lines className="h-title" lines={[f.title]} />
        <FadeUp><p className="lede">{f.sub}</p></FadeUp>

        <ExcavatorStage />

        <div style={{ marginTop: 'clamp(44px,7vh,72px)' }}>
          {FLEET.map((m, i) => {
            const d = m[lang]
            return (
              <article className="fleet-row" key={m.id}>
                <div className="fleet-idx"><b>{String(i + 1).padStart(2, '0')}</b>/ 06</div>
                <div className="fleet-media">
                  <img src={m.img} alt={d.name} loading="lazy" />
                </div>
                <div className="fleet-body">
                  <h3 className="fleet-name">{d.name}</h3>
                  <p className="fleet-blurb">{d.blurb}</p>
                  <div className="fleet-tags">
                    {d.tags.map((tag, j) => <span className="chip" key={j}>{tag}</span>)}
                  </div>
                  <button className="fleet-quote" onClick={() => onQuote(m.id)}>
                    {f.quoteBtn} <ArrowIcon />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
