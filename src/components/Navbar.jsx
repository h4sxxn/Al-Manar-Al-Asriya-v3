import { useEffect, useState } from 'react'
import { useLang, WA_NUMBER } from '../i18n'
import { scrollToTarget } from '../fx/scroll'
import { LogoMark, ArrowIcon } from './ui'

const LINKS = [
  ['about', 'about'], ['services', 'services'], ['fleet', 'fleet'], ['why', 'why'], ['contact', 'contact'],
]

export default function Navbar() {
  const { t, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToTarget('#' + id), open ? 60 : 0)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#top" onClick={go('top')}>
          <LogoMark />
          <span>
            <span className="brand-name">AL MANAR AL ASRIYA</span>
            <span className="brand-sub">General Trading & Contracting</span>
          </span>
        </a>
        <nav className="nav-links">
          {LINKS.map(([id, key]) => (
            <a key={id} href={'#' + id} onClick={go(id)}>{t.nav[key]}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <button className="lang-btn" onClick={toggle} aria-label="Switch language">{t.nav.langName}</button>
          <a className="btn btn-solid" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">
            {t.nav.quote} <ArrowIcon />
          </a>
          <button className="burger" onClick={() => setOpen(true)} aria-label={t.nav.menu}>
            <svg viewBox="0 0 18 18" fill="none"><path d="M1 4h16M1 9h16M1 14h16" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="mm-top">
          <a className="brand" href="#top" onClick={go('top')}>
            <LogoMark />
            <span className="brand-name">AL MANAR AL ASRIYA</span>
          </a>
          <button className="burger" style={{ display: 'grid' }} onClick={() => setOpen(false)} aria-label={t.nav.close}>
            <svg viewBox="0 0 18 18" fill="none"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.4" /></svg>
          </button>
        </div>
        <nav>
          {LINKS.map(([id, key], i) => (
            <a key={id} href={'#' + id} onClick={go(id)}>{t.nav[key]}<span>0{i + 1}</span></a>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
          <button className="lang-btn" onClick={toggle}>{t.nav.langName}</button>
          <a className="btn btn-solid" style={{ flex: 1, justifyContent: 'center' }} href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">
            {t.nav.quote} <ArrowIcon />
          </a>
        </div>
      </div>
    </>
  )
}
