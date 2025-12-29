import React from 'react'
import Header from './Header'

export default function Blog() {
  return (
    <div>
      <Header />
      <div style={{ padding: '100px 24px', background: '#000', color: '#fff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1>Blog</h1>
          <p>Blog stranica...</p>
        </div>
      </div>
    </div>
  )
}