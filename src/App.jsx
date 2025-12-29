import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PinnedHeroSection from './components/PinnedHeroSection'
import IzradaSajtova from './components/IzradaSajtova'
import SEO from './components/SEO'
import Blog from './components/Blog'
import Kontakt from './components/Kontakt'

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PinnedHeroSection />} />
        <Route path="/izrada-sajtova/" element={<IzradaSajtova />} />
        <Route path="/seo/" element={<SEO />} />
        <Route path="/blog/" element={<Blog />} />
        <Route path="/kontakt/" element={<Kontakt />} />
      </Routes>
    </Router>
  )
}
