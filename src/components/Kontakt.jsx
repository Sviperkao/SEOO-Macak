import React from 'react'
import Header from './Header'

export default function Kontakt() {
  return (
    <div>
      <Header />
      <div style={{ padding: '100px 24px', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1>Kontakt</h1>
          <p>Kontaktirajte nas...</p>
        </div>
      </div>
    </div>
  )
}