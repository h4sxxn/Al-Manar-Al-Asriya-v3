import { useRef } from 'react'
import { useLang } from '../i18n'
import { Lines, FadeUp, useRevealGroup } from './ui'

export function About() {
  const { t } = useLang()
  const a = t.about
  const ref = useRef(null)
  useRevealGroup(ref, [t])
  return (
    <section className="section" id="about" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">{a.eyebrow}</span>
        <Lines className="h-title" lines={[a.title]} />
        <div className="about-grid" style={{ marginTop: 54 }}>
          <div className="about-copy" data-reveal>
            <p>{a.p1}</p>
            <p>{a.p2}</p>
          </div>
          <div className="values">
            {a.values.map((v, i) => (
              <div className="value" key={i} data-reveal>
                <span className="idx">/0{i + 1}</span>
                <div><h3>{v.t}</h3><p>{v.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Services() {
  const { t } = useLang()
  const s = t.services
  const ref = useRef(null)
  useRevealGroup(ref, [t])
  return (
    <section className="services" id="services" ref={ref}>
      <div className="wrap" style={{ paddingTop: 'clamp(84px,13vh,150px)' }}>
        <span className="eyebrow">{s.eyebrow}</span>
        <Lines className="h-title" lines={[s.title]} />
      </div>
      <div style={{ marginTop: 'clamp(40px,7vh,80px)' }}>
        {s.scenes.map((sc, i) => (
          <div className="svc-scene" key={i}>
            <div className="svc-ghost" aria-hidden="true">{sc.n}</div>
            <div className="wrap">
              <div className="svc-inner">
                <span className="eyebrow" data-reveal>{sc.tag} — {sc.n}</span>
                <Lines className="svc-title" lines={[sc.t]} />
                <p data-reveal>{sc.d}</p>
                <div className="svc-specs" data-reveal>
                  {sc.specs.map((sp, j) => <span className="chip" key={j}>{sp}</span>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Why() {
  const { t } = useLang()
  const w = t.why
  const ref = useRef(null)
  useRevealGroup(ref, [t])
  return (
    <section className="section" id="why" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">{w.eyebrow}</span>
        <Lines className="h-title" lines={[w.title]} />
        <div className="why-grid">
          {w.items.map((it, i) => (
            <div className="why-cell" key={i} data-reveal>
              <span className="n">/0{i + 1}</span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
