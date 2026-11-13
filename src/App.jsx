import { useEffect, useState } from 'react'
import { LangProvider } from './i18n'
import { initSmoothScroll, ScrollTrigger, scrollToTarget } from './fx/scroll'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import HeroJCB from './components/HeroJCB'
import { About, Services, Why } from './components/Sections'
import Fleet from './components/Fleet'
import Quote from './components/Quote'
import Footer from './components/Footer'

function Site() {
  const [machine, setMachine] = useState('')
  useEffect(() => {
    initSmoothScroll()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const t = setTimeout(() => ScrollTrigger.refresh(), 1200)
    return () => { window.removeEventListener('load', onLoad); clearTimeout(t) }
  }, [])

  const quoteMachine = (id) => {
    setMachine(id)
    scrollToTarget('#contact')
  }

  return (
    <>
      <ParticleField />
      <Navbar />
      <main>
        <HeroJCB onQuote={quoteMachine} />
        <About />
        <Services />
        <Fleet onQuote={quoteMachine} />
        <Why />
        <Quote machine={machine} setMachine={setMachine} />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  )
}
