import { useEffect, useRef } from 'react'
import { useLang } from '../i18n'
import { gsap, reducedMotion } from '../fx/scroll'

const PHOTO = `${import.meta.env.BASE_URL}images/fleet-excavator.webp`

/* Showcase slot at the head of the fleet: a photographic tracked excavator
   on the showroom platform, full-bleed in the same framed panel the 3D
   scene used to occupy, with a gentle scroll parallax. */
export default function ExcavatorStage() {
  const { t } = useLang()
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root || reducedMotion()) return
    const ctx = gsap.context(() => {
      const img = root.querySelector('.exc-media img')
      if (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }
      gsap.fromTo(root, { opacity: 0, y: 44 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const x = t.fleet.excavator3d
  return (
    <div className="excavator-stage" ref={ref}>
      <div className="exc-head">
        <h3 className="exc-title">{x.title}</h3>
        <span className="hud">{x.hint}</span>
      </div>
      <div className="exc-media">
        <img src={PHOTO} alt={x.title} loading="lazy" />
      </div>
    </div>
  )
}
