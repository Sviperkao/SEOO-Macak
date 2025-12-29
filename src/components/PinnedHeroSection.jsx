import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function PinnedHeroSection() {
  const containerRef = useRef(null)

  // Track scroll progress across the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Map progress from the container's top reaching the viewport top
    // until the container's bottom reaches the viewport top (pin duration)
    offset: ['start start', 'end start'],
  })

  // Transforms per spec
  const bgColor = useTransform(scrollYProgress, [0, 0.4], ['#ffffff', '#000000'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  // cards will fade in between 0.5 and 0.8, reach 1 by 0.8, and hold until 0.9 (pin release)
  const cardsOpacity = useTransform(scrollYProgress, [0.5, 0.8, 0.9], [0, 1, 1])
  const cardsY = useTransform(scrollYProgress, [0.5, 0.8], [24, 0]) // px
  const logoColor = useTransform(scrollYProgress, [0, 0.4], ['#000000', '#ffffff'])

  useLayoutEffect(()=>{
    // ensure target has a non-static position for framer's offset calculations
    if(containerRef.current){
      containerRef.current.style.position = containerRef.current.style.position || 'relative'
      const comp = getComputedStyle(containerRef.current).position
      console.debug('[debug] container computed position:', comp)
    }
  }, [])

  // UI state derived from motion values
  const pinWrapRef = useRef(null)
  const [showCards, setShowCards] = useState(false)
  const [pinReleased, setPinReleased] = useState(false)

  // subscribe to cardsOpacity to toggle display/pointer-events when fully hidden
  useEffect(()=>{
    // avoid using tiny motion-value noise to decide visibility; rely on scroll progress window
    const unsub = scrollYProgress.on('change', (p)=>{
      setShowCards(p >= 0.5 && p < 0.95)
    })
    return ()=>unsub()
  }, [cardsOpacity])

  // toggle sticky -> relative when progress passes 0.9 so the page continues
  useEffect(()=>{
    const unsub = scrollYProgress.on('change', (p)=>{
      const released = p >= 0.9
      setPinReleased(released)
      if(pinWrapRef.current){
        pinWrapRef.current.style.position = released ? 'relative' : 'sticky'
      }
    })
    return ()=>unsub()
  }, [scrollYProgress])

  useEffect(()=>{
    // subscribe to bgColor MotionValue and update CSS var so body background follows
    // set initial value
    document.documentElement.style.setProperty('--bg-color', '#FBFAF8')
    const unsubscribe = bgColor.on('change', (v)=>{
      document.documentElement.style.setProperty('--bg-color', v)
    })

    return () => unsubscribe()
  }, [bgColor])

  // Debugging: subscribe to scroll and motion values to inspect progress
  useEffect(()=>{
    let unsubScroll = () => {}
    let unsubHero = () => {}
    let unsubCards = () => {}
    let unsubBg = () => {}

      try{
        unsubScroll = scrollYProgress.on('change', (p)=>{
          // log derived values together
          const heroV = typeof heroOpacity.get === 'function' ? heroOpacity.get() : undefined
          const cardsV = typeof cardsOpacity.get === 'function' ? cardsOpacity.get() : undefined
          const bgV = typeof bgColor.get === 'function' ? bgColor.get() : undefined
          console.debug('[debug] scrollYProgress:', p, 'heroOpacity:', heroV, 'cardsOpacity:', cardsV, 'bgColor:', bgV)
        })
      }catch(e){
        console.warn('[debug] failed to subscribe to motion values', e)
      }

    // log container rect on scroll/resize to check offsets
    const logRect = ()=>{
      if(containerRef.current){
        const r = containerRef.current.getBoundingClientRect()
        console.debug('[debug] container rect', {top:r.top, bottom:r.bottom, height:r.height})
      }
    }
    window.addEventListener('scroll', logRect, {passive:true})
    window.addEventListener('resize', logRect)

    // initial
    logRect()

    return ()=>{
      try{ unsubScroll() }catch(e){}
      try{ unsubHero() }catch(e){}
      try{ unsubCards() }catch(e){}
      try{ unsubBg() }catch(e){}
      window.removeEventListener('scroll', logRect)
      window.removeEventListener('resize', logRect)
    }
  }, [scrollYProgress, heroOpacity, cardsOpacity, bgColor])

  return (
    <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
      <motion.div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: bgColor }} aria-hidden />

      <header className="site-header">
        <div className="container">
          <a href="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                <circle cx="20" cy="20" r="18" fill="#FDCA40" stroke="#000" strokeWidth="2" />
              </svg>
            </span>
            <motion.span className="logo-text" style={{ color: logoColor, textDecoration: 'underline', textDecorationColor: logoColor, textDecorationThickness: '2px' }}>
              SEO<br/>
              <motion.span className="logo-sub" style={{ color: logoColor }}>
                Mačak.
              </motion.span>
            </motion.span>
          </a>
          <nav className="nav-pill">
            <a href="/">Početna</a>
            <a href="/izrada-sajtova/">Izrada sajtova</a>
            <a href="/seo/">SEO</a>
            <a href="/blog/">Blog</a>
            <a href="/kontakt/" className="btn nav-cta">Kontakt</a>
          </nav>
        </div>
      </header>

      <div className="pin-wrap" ref={pinWrapRef} style={{ position: pinReleased ? 'relative' : 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section className="hero fullscreen">
          <div className="hero-inner container">
            <motion.div className="hero-center" style={{ opacity: heroOpacity }}>
              <h1 className="hero-head">Vaše rešenje <strong className="em">SEO</strong> problema</h1>
              <p className="subhead">Stručna SEO optimizacija, moderni web sajtovi i jasno dizajnirana komunikacija.</p>
            </motion.div>
          </div>
        </section>
        <motion.div
          className="cards-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            display: showCards ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: showCards ? 'auto' : 'none',
            opacity: cardsOpacity,
            y: cardsY,
            zIndex: 250,
            padding: '0 24px',
          }}
        >
          <div style={{width:'100%', maxWidth:1000}}>
            <h2 className="section-title" style={{color:'#fff', textAlign:'center', marginBottom:20}}>Ko je SEO Mačak?</h2>
            <div className="cards" style={{display:'flex',flexDirection:'column',gap:22}}>
              <article className="card left">
                <p style={{color:'#fff'}}>Ja sam Marko, developer i SEO strateg. SEO Mačak je nastao iz ideje da klijentima pružim direktnu, zanatsku posvećenost kakvu agencije često gube, ali sa tehničkom snagom koja može da iznese i najkompleksnije projekte.</p>
              </article>

              <article className="card right">
                <p style={{color:'#fff'}}>Kako radim? Svaki projekat vodim lično – ja sam vaša prva i glavna tačka kontakta. Ipak, niko ne može biti najbolji u svemu. Zato, kada projekat zahteva veći obim posla ili specifične dodatne ekspertize, u priču uključujem svoj provereni tim saradnika i partnerskih firmi.</p>
              </article>

              <article className="card left">
                <p style={{color:'#fff'}}>To znači da dobijate agencijsku snagu i sigurnost, ali uz personalizovanu pažnju jednog profesionalca koji bdi nad svakim detaljom vašeg sajta.</p>
              </article>
            </div>
          </div>
        </motion.div>
      </div>
      <section className="about container" aria-hidden={false} style={{display: pinReleased ? 'block' : 'none'}}>
        <div>
          <h2 className="section-title" style={{color:'#fff'}}>Ko je SEO Mačak?</h2>
          <div className="cards">
            <article className="card left">
              <p style={{color:'#fff'}}>Ja sam Marko, developer i SEO strateg. SEO Mačak je nastao iz ideje da klijentima pružim direktnu, zanatsku posvećenost kakvu agencije često gube, ali sa tehničkom snagom koja može da iznese i najkompleksnije projekte.</p>
            </article>

            <article className="card right">
              <p style={{color:'#fff'}}>Kako radim? Svaki projekat vodim lično – ja sam vaša prva i glavna tačka kontakta. Ipak, niko ne može biti najbolji u svemu. Zato, kada projekat zahteva veći obim posla ili specifične dodatne ekspertize, u priču uključujem svoj provereni tim saradnika i partnerskih firmi.</p>
            </article>

            <article className="card left">
              <p style={{color:'#fff'}}>To znači da dobijate agencijsku snagu i sigurnost, ali uz personalizovanu pažnju jednog profesionalca koji bdi nad svakim detaljom vašeg sajta.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
