import { useState } from 'react'
import { useLang, FLEET, WA_NUMBER, WA_DISPLAY, PHONE_2_DISPLAY, EMAIL } from '../i18n'
import { Lines, FadeUp, ArrowIcon } from './ui'

export default function Quote({ machine, setMachine }) {
  const { t, lang } = useLang()
  const q = t.quote
  const [period, setPeriod] = useState(q.periods[2])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [site, setSite] = useState('')
  const [notes, setNotes] = useState('')

  const machineName = (id) => {
    const m = FLEET.find((f) => f.id === id)
    return m ? m[lang].name : q.other
  }

  const submit = (e) => {
    e.preventDefault()
    const lines = [q.waIntro, '']
    lines.push(`${q.waMachine}: ${machineName(machine)}`)
    lines.push(`${q.waPeriod}: ${period}`)
    if (name) lines.push(`${q.waName}: ${name}`)
    if (phone) lines.push(`${q.waPhone}: ${phone}`)
    if (site) lines.push(`${q.waSite}: ${site}`)
    if (notes) lines.push(`${q.waNotes}: ${notes}`)
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
  }

  const c = q.contact
  return (
    <section className="section quote" id="contact">
      <div className="wrap">
        <span className="eyebrow">{q.eyebrow}</span>
        <Lines className="h-title" lines={[q.title]} />
        <FadeUp><p className="lede">{q.sub}</p></FadeUp>

        <div className="quote-grid" style={{ marginTop: 'clamp(44px,7vh,72px)' }}>
          <div>
            <div className="contact-list">
              <div className="contact-row">
                <span className="k">{c.addressL}</span>
                <span className="val" style={{ fontSize: '1.05rem', lineHeight: 1.45 }}>{c.address}</span>
              </div>
              <div className="contact-row">
                <span className="k">{c.phoneL}</span>
                <a className="val" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" dir="ltr">{WA_DISPLAY}</a>
              </div>
              <div className="contact-row">
                <span className="k">{c.phone2L}</span>
                <a className="val" href="tel:+96597558200" dir="ltr">{PHONE_2_DISPLAY}</a>
              </div>
              <div className="contact-row">
                <span className="k">{c.emailL}</span>
                <a className="val" href={`mailto:${EMAIL}`} style={{ fontSize: 'clamp(0.95rem,1.5vw,1.2rem)' }}>{EMAIL}</a>
              </div>
            </div>
          </div>

          <form className="qform" onSubmit={submit}>
            <h3>{q.formTitle}</h3>
            <div className="field">
              <label htmlFor="q-machine">{q.machine}</label>
              <select id="q-machine" value={machine} onChange={(e) => setMachine(e.target.value)}>
                <option value="">{q.machinePlaceholder}</option>
                {FLEET.map((m) => <option key={m.id} value={m.id}>{m[lang].name}</option>)}
                <option value="other">{q.other}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-period">{q.period}</label>
              <select id="q-period" value={period} onChange={(e) => setPeriod(e.target.value)}>
                {q.periods.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-name">{q.name}</label>
              <input id="q-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={q.namePh} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="q-phone">{q.phone}</label>
              <input id="q-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={q.phonePh} dir="ltr" style={{ textAlign: 'start' }} autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="q-site">{q.site}</label>
              <input id="q-site" value={site} onChange={(e) => setSite(e.target.value)} placeholder={q.sitePh} />
            </div>
            <div className="field">
              <label htmlFor="q-notes">{q.notes}</label>
              <textarea id="q-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={q.notesPh} />
            </div>
            <button className="btn btn-solid" type="submit">{q.send} <ArrowIcon /></button>
            <p className="qnote">{q.note}</p>
          </form>
        </div>
      </div>
    </section>
  )
}
