import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <circle cx="20" cy="20" r="18" fill="#FDCA40" stroke="#000" strokeWidth="2" />
            </svg>
          </span>
          <span className="logo-text" style={{ color: '#000000', textDecoration: 'underline', textDecorationColor: '#000000', textDecorationThickness: '2px' }}>
            SEO<br/>
            <span className="logo-sub" style={{ color: '#000000' }}>
              Mačak.
            </span>
          </span>
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
  )
}