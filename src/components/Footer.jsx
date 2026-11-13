import { useLang, WA_NUMBER, WA_DISPLAY, EMAIL } from '../i18n'
import { scrollToTarget } from '../fx/scroll'

export default function Footer() {
  const { t, lang } = useLang()
  const f = t.footer
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-word">
          {lang === 'ar' ? <>المنار <span className="thin">العصرية</span></> : <>AL MANAR<br /><span className="thin">AL ASRIYA</span></>}
        </div>
        <p className="footer-tag">{f.tag}</p>
      </div>
      <div className="footer-meta">
        <span>{f.since}</span>
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" dir="ltr">{WA_DISPLAY}</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <button onClick={() => scrollToTarget('#top')} style={{ font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'inherit', cursor: 'pointer' }}>
          ↑ {f.back}
        </button>
      </div>
      <div className="footer-credits">
        <div>{f.credits}</div>
        <div style={{ marginTop: 8 }}>© {new Date().getFullYear()} {f.rights}</div>
      </div>
    </footer>
  )
}
