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
  const bgColor = useTransform(smoothProgress, [0, 0.12], ['#ffffff', '#000000'])
  const heroOpacity = useTransform(smoothProgress, [0, 0.04], [1, 0])
  const logoColor = useTransform(smoothProgress, [0, 0.12], ['#000000', '#ffffff'])

  // "Šta Radimo?" TITLE - centered at top
  const stataTitleOpacity = useTransform(smoothProgress, [0.08, 0.12], [0, 1])
  
  // "Šta Radimo?" animation - appears centered, moves to top-left and shrinks
  const stataTitleScale = useTransform(smoothProgress, [0.15, 0.25], [1, 0.3])
  const stataTitleY = useTransform(smoothProgress, [0.15, 0.25], [0, -350])
  const stataTitleX = useTransform(smoothProgress, [0.15, 0.25], [0, -500])
  
  // SEQUENTIAL CARDS - Šta Radimo (3 cards) - start after title animation finishes
  // Card 1: SEO
  const card1Opacity = useTransform(smoothProgress, [0.25, 0.38, 0.48], [0, 1, 0])
  const card1Y = useTransform(smoothProgress, [0.25, 0.38], [50, 0])
  
  // Card 2: Development
  const card2Opacity = useTransform(smoothProgress, [0.48, 0.61, 0.71], [0, 1, 0])
  const card2Y = useTransform(smoothProgress, [0.48, 0.61], [50, 0])
  
  // Card 3: Design
  const card3Opacity = useTransform(smoothProgress, [0.71, 0.84, 0.94], [0, 1, 0])
  const card3Y = useTransform(smoothProgress, [0.71, 0.84], [50, 0])
  
  // "Kako Radimo?" TITLE - appears centered after card 3, moves to top-left and shrinks
  const kakoTitleOpacity = useTransform(smoothProgress, [0.94, 0.98], [0, 1])
  const kakoTitleScale = useTransform(smoothProgress, [1.02, 1.12], [1, 0.3])
  const kakoTitleY = useTransform(smoothProgress, [1.02, 1.12], [0, -350])
  const kakoTitleX = useTransform(smoothProgress, [1.02, 1.12], [0, -500])
  
  // SEQUENTIAL CARDS - Kako Radimo (3 cards) - start after title animation finishes
  // Card 4: Discovery
  const card4Opacity = useTransform(smoothProgress, [1.12, 1.25, 1.35], [0, 1, 0])
  const card4Y = useTransform(smoothProgress, [1.12, 1.25], [50, 0])
  
  // Card 5: Strategy
  const card5Opacity = useTransform(smoothProgress, [1.35, 1.48, 1.58], [0, 1, 0])
  const card5Y = useTransform(smoothProgress, [1.35, 1.48], [50, 0])
  
  // Card 6: Execution
  const card6Opacity = useTransform(smoothProgress, [1.58, 1.71, 1.81], [0, 1, 0])
  const card6Y = useTransform(smoothProgress, [1.58, 1.71], [50, 0])

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
  const [pinReleased, setPinReleased] = useState(false)

  // toggle sticky -> relative when progress passes 0.38 so the page continues
  useEffect(()=>{
    const unsub = smoothProgress.on('change', (p)=>{
      const released = p >= 0.35
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
    let unsubBg = () => {}

      try{
        unsubScroll = smoothProgress.on('change', (p)=>{
          // log derived values together
          const heroV = typeof heroOpacity.get === 'function' ? heroOpacity.get() : undefined
          const bgV = typeof bgColor.get === 'function' ? bgColor.get() : undefined
          console.debug('[debug] smoothProgress:', p, 'heroOpacity:', heroV, 'bgColor:', bgV)
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
      try{ unsubBg() }catch(e){}
      window.removeEventListener('scroll', logRect)
      window.removeEventListener('resize', logRect)
    }
  }, [smoothProgress, heroOpacity, bgColor])

  return (
    <div ref={containerRef} style={{ height: '1100vh', position: 'relative' }}>
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
            <Link to="/about/">O nama</Link>
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
      </div>
      
      {/* STICKY CONTAINER FOR SEQUENTIAL CARDS */}
      <motion.div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', zIndex: 100, background: '#000' }}>
        
        {/* ŠTA RADIMO TITLE - appears and animates to top-left */}
        <motion.h2 className="section-title" style={{ opacity: stataTitleOpacity, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: 'clamp(4rem, 15vw, 12rem)', margin: 0, zIndex: 200, whiteSpace: 'nowrap', x: stataTitleX, y: stataTitleY, scale: stataTitleScale }}>
          Šta Radimo?
        </motion.h2>

        {/* CARD 1: SEO - Left Image, Right Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card1Opacity,
            y: card1Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>SEO Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>SEO Optimizacija</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Poboljšavamo vidljivost vašeg sajta na pretraživačima kroz detaljnu analizu ključnih reči, optimizaciju on-page elemenata, izgradnju backlink-ova i kontinuirano praćenje performansi. Naš pristup je sveobuhvatan i fokusiran na održive rezultate.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: Development - Right Image, Left Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card2Opacity,
            y: card2Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center', flexDirection: 'row-reverse' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>Development Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Web Development</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Kreiramo moderne, brze i skalabilne web sajtove koristeći najnovije tehnologije. Svaki sajt je optimizovan za performanse, mobilne uređaje i korisničko iskustvo. Naš kod je čist, skalabilan i lakšan za održavanje.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: Design - Left Image, Right Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card3Opacity,
            y: card3Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>Design Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Dizajn</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Kreiramo vizuelno privlačne i funkcionalne interfejse koji odskaču. Naš dizajn je baziran na istraživanju korisnika, pristupačnosti i modernim trendovima. Svaki detalj je pažljivo razmišljen.
              </p>
            </div>
          </div>
        </motion.div>

        {/* KAKO RADIMO TITLE - appears and animates to top-left */}
        <motion.h2 className="section-title" style={{ opacity: kakoTitleOpacity, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: 'clamp(4rem, 15vw, 12rem)', margin: 0, zIndex: 200, whiteSpace: 'nowrap', x: kakoTitleX, y: kakoTitleY, scale: kakoTitleScale }}>
          Kako Radimo?
        </motion.h2>

        {/* CARD 4: Discovery - Left Image, Right Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card4Opacity,
            y: card4Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>Discovery Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Otkrivanje & Analiza</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Počinjemo detaljnom analizom vašeg poslovanja, industrije, konkurencije i ciljne audience. Razumevamo vaše ciljeve i izazove kako bismo kreirali strategiju koja je potpuno prilagođena vašim potrebama.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CARD 5: Strategy - Right Image, Left Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card5Opacity,
            y: card5Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center', flexDirection: 'row-reverse' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>Strategy Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Strategija</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Razvijamo jasnu, merljivu strategiju koja kreira putanju od trenutnog stanja do željenih rezultata. Definišemo KPI-je, vremensku liniju i plan akcije sa tačno definisanim etapama.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CARD 6: Execution - Left Image, Right Text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: card6Opacity,
            y: card6Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px'
          }}
        >
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', gap: '60px', alignItems: 'center' }}>
            <div style={{ flex: 1, minHeight: '400px', background: '#1a1a1a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <span>Execution Image</span>
            </div>
            <div style={{ flex: 1, color: '#fff' }}>
              <h3 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '20px' }}>Izvršavanje & Rezultati</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Implementiramo strategiju sa preciznošću i fokusom. Redovno pratimo progres, prilagođavamo pristup ako je potrebno, i dostavljamo rezultate. Transparency i komunikacija su ključne tokom celog procesa.
              </p>
            </div>
          </div>
        </motion.div>
        
      </motion.div>

      {/* SPACER SECTION */}
      <section style={{ height: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Spremni za saradnju?</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>Kontaktirajte nas danas</p>
        </div>
      </section>
    </div>
  )
}
