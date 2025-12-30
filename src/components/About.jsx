import React from 'react'
import { motion } from 'framer-motion'
import Header from './Header'

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  }

  return (
    <div>
      <Header />
      <div style={{ padding: '100px 24px', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.h1 className="section-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '50px', textAlign: 'center' }}>Ko je SEO Mačak?</motion.h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <motion.article 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              viewport={{ once: false }}
              style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Ja sam Marko, developer i SEO strateg. SEO Mačak je nastao iz ideje da klijentima pružim direktnu, zanatsku posvećenost kakvu agencije često gube, ali sa tehničkom snagom koja može da iznese i najkompleksnije projekte.
              </p>
            </motion.article>

            <motion.article 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              viewport={{ once: false }}
              style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Kako radim? Svaki projekat vodim lično – ja sam vaša prva i glavna tačka kontakta. Ipak, niko ne može biti najbolji u svemu. Zato, kada projekat zahteva veći obim posla ili specifične dodatne ekspertize, u priču uključujem svoj provereni tim saradnika i partnerskih firmi.
              </p>
            </motion.article>

            <motion.article 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              viewport={{ once: false }}
              style={{ padding: '30px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.8' }}>
                To znači da dobijate agencijsku snagu i sigurnost, ali uz personalizovanu pažnju jednog profesionalca koji bdi nad svakim detaljom vašeg sajta.
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </div>
  )
}
