import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PinnedHeroSection() {
  const containerRef = useRef(null)

  // Track scroll progress across the 2000vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Map progress from the container's top reaching the viewport top
    // until the container's bottom reaches the viewport top (pin duration)
    offset: ['start start', 'end start'],
  })

  // Smooth the scroll progress for premium feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })

  // Transforms per spec
  const bgColor = useTransform(smoothProgress, [0, 0.3], ['#ffffff', '#000000'])
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0])
  // cards will fade in between 0.15 and 0.6, hold until 0.85, then fade out 0.85 to 0.9
  const cardsOpacity = useTransform(smoothProgress, [0.15, 0.6, 0.85, 0.9], [0, 1, 1, 0])
  const cardsY = useTransform(smoothProgress, [0.15, 0.35], [24, 0]) // px
  const logoColor = useTransform(smoothProgress, [0, 0.3], ['#000000', '#ffffff'])

  // Title fade in
  const titleOpacity = useTransform(smoothProgress, [0.35, 0.6], [0, 1])

  // Individual card transforms for staggered slide-in
  const card1X = useTransform(smoothProgress, [0.4, 0.6], [-100, 0])
  const card1Opacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1])
  const card2X = useTransform(smoothProgress, [0.5, 0.7], [100, 0])
  const card2Opacity = useTransform(smoothProgress, [0.5, 0.7], [0, 1])
  const card3X = useTransform(smoothProgress, [0.6, 0.8], [-100, 0])
  const card3Opacity = useTransform(smoothProgress, [0.6, 0.8], [0, 1])

  // New section transforms
  const newSectionOpacity = useTransform(smoothProgress, [0.93, 0.95, 0.98, 1.0], [0, 1, 1, 0])
  const newSectionY = useTransform(smoothProgress, [0.93, 0.94], [24, 0])
  const cardsScale = useTransform(smoothProgress, [0.85, 0.9], [1, 0.8])

  // New section cards staggered
  const newCard1Opacity = useTransform(smoothProgress, [0.93, 0.935], [0, 1])
  const newCard2Opacity = useTransform(smoothProgress, [0.935, 0.94], [0, 1])
  const newCard3Opacity = useTransform(smoothProgress, [0.94, 0.945], [0, 1])
  const newCard4Opacity = useTransform(smoothProgress, [0.945, 0.95], [0, 1])

  // Static section fade in
  const staticOpacity = useTransform(smoothProgress, [0.98, 1.0], [0, 1])

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
  const [showNewSection, setShowNewSection] = useState(false)

  // subscribe to cardsOpacity to toggle display/pointer-events when fully hidden
  useEffect(()=>{
    // avoid using tiny motion-value noise to decide visibility; rely on scroll progress window
    const unsub = smoothProgress.on('change', (p)=>{
      setShowCards(p >= 0.15 && p < 0.9)
      setShowNewSection(p >= 0.93 && p < 1.0)
    })
    return ()=>unsub()
  }, [cardsOpacity])

  // toggle sticky -> relative when progress passes 0.97 so the page continues
  useEffect(()=>{
    const unsub = smoothProgress.on('change', (p)=>{
      const released = p >= 0.97
      setPinReleased(released)
      if(pinWrapRef.current){
        pinWrapRef.current.style.position = released ? 'relative' : 'sticky'
      }
    })
    return ()=>unsub()
  }, [smoothProgress])

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
        unsubScroll = smoothProgress.on('change', (p)=>{
          // log derived values together
          const heroV = typeof heroOpacity.get === 'function' ? heroOpacity.get() : undefined
          const cardsV = typeof cardsOpacity.get === 'function' ? cardsOpacity.get() : undefined
          const bgV = typeof bgColor.get === 'function' ? bgColor.get() : undefined
          console.debug('[debug] smoothProgress:', p, 'heroOpacity:', heroV, 'cardsOpacity:', cardsV, 'bgColor:', bgV)
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
  }, [smoothProgress, heroOpacity, cardsOpacity, bgColor])

  return (
    <div ref={containerRef} style={{ height: '2000vh', position: 'relative' }}>
      <motion.div style={{ position: 'fixed', inset: 0, zIndex: -1, backgroundColor: bgColor }} aria-hidden />

      <header className="site-header">
        <div className="container">
          <Link to="/" className="logo">
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
          </Link>
          <nav className="nav-pill">
            <Link to="/">Početna</Link>
            <Link to="/izrada-sajtova/">Izrada sajtova</Link>
            <Link to="/seo/">SEO</Link>
            <Link to="/blog/">Blog</Link>
            <Link to="/kontakt/" className="btn nav-cta">Kontakt</Link>
          </nav>
        </div>
      </header>

      <div className="pin-wrap" ref={pinWrapRef} style={{ position: pinReleased ? 'relative' : 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section className="hero fullscreen">
          <div
            className="moving-dots"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: -1,
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.22) 4px, transparent 4px)',
              backgroundSize: '40px 40px',
              opacity: 0.95,
            }}
          />
          <div className="hero-inner container">
            <motion.div className="hero-center" style={{ opacity: heroOpacity }}>
              <h1 className="hero-head">Vaše rešenje <strong className="em">SEO</strong> problema</h1>
              <p className="subhead">Stručna SEO optimizacija, moderni web sajtovi i jasno dizajnirana komunikacija.</p>
              <motion.div 
                className="scroll-arrow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 30 L28 20 L25 20 L25 10 L15 10 L15 20 L12 20 Z" fill="currentColor"/>
                </svg>
              </motion.div>
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
            y: cardsY,
            scale: cardsScale,
            zIndex: 250,
            padding: '0 24px',
            overflowX: 'hidden',
          }}
        >
          <div style={{width:'100%', maxWidth:1000}}>
            <motion.h2 className="section-title" style={{color:'#fff', textAlign:'center', marginBottom:20, fontSize: 'clamp(3rem, 8vw, 6rem)', opacity: titleOpacity}}>Ko je SEO Mačak?</motion.h2>
            <div className="cards" style={{display:'flex',flexDirection:'column',gap:22}}>
              <motion.article className="card left" style={{ x: card1X, opacity: card1Opacity }} transition={{ type: 'spring', stiffness: 100 }}>
                <p style={{color:'#fff'}}>Ja sam Marko, developer i SEO strateg. SEO Mačak je nastao iz ideje da klijentima pružim direktnu, zanatsku posvećenost kakvu agencije često gube, ali sa tehničkom snagom koja može da iznese i najkompleksnije projekte.</p>
              </motion.article>

              <motion.article className="card right" style={{ x: card2X, opacity: card2Opacity }} transition={{ type: 'spring', stiffness: 100 }}>
                <p style={{color:'#fff'}}>Kako radim? Svaki projekat vodim lično – ja sam vaša prva i glavna tačka kontakta. Ipak, niko ne može biti najbolji u svemu. Zato, kada projekat zahteva veći obim posla ili specifične dodatne ekspertize, u priču uključujem svoj provereni tim saradnika i partnerskih firmi.</p>
              </motion.article>

              <motion.article className="card left" style={{ x: card3X, opacity: card3Opacity }} transition={{ type: 'spring', stiffness: 100 }}>
                <p style={{color:'#fff'}}>To znači da dobijate agencijsku snagu i sigurnost, ali uz personalizovanu pažnju jednog profesionalca koji bdi nad svakim detaljom vašeg sajta.</p>
              </motion.article>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="new-section-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            display: showNewSection ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: showNewSection ? 'auto' : 'none',
            opacity: newSectionOpacity,
            y: newSectionY,
            zIndex: 260,
            padding: '0 24px',
          }}
        >
          <div style={{width:'100%', maxWidth:1000}}>
            <h2 className="section-title" style={{color:'#fff', textAlign:'center', marginBottom:20}}>Šta Radimo?</h2>
            <div className="new-cards" style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap:22}}>
              <motion.article className="card" style={{ opacity: newCard1Opacity }}>
                <p style={{color:'#fff'}}>SEO Optimizacija - Poboljšavamo vidljivost vašeg sajta u pretragama.</p>
              </motion.article>
              <motion.article className="card" style={{ opacity: newCard2Opacity }}>
                <p style={{color:'#fff'}}>Izrada Sajtova - Moderni, responsivni web sajtovi po meri.</p>
              </motion.article>
              <motion.article className="card" style={{ opacity: newCard3Opacity }}>
                <p style={{color:'#fff'}}>Dizajn - Kreativno rešenje za vaš brend.</p>
              </motion.article>
              <motion.article className="card" style={{ opacity: newCard4Opacity }}>
                <p style={{color:'#fff'}}>Konsultacije - Stručni saveti za digitalni marketing.</p>
              </motion.article>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.section className="about container" style={{ opacity: staticOpacity, marginTop: '400px' }} aria-hidden={false}>
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
      </motion.section>
    </div>
  )
}
