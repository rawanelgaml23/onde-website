import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImage from './assets/Onde.logo.png'

export function StoreHeader({ bagCount }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="announcement">
        <span>Little rituals, lovely skin.</span>
        <span className="announcement-note">Complimentary shipping on orders over $50</span>
      </div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Esse home" onClick={closeMenu}>
          <img src={logoImage} alt="Esse" />
        </Link>
        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        {/* NavBar */}
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <Link to="/#home" onClick={closeMenu}>Home</Link>
          <Link to="/products" onClick={closeMenu}>Shop</Link>
          <Link to="/#story" onClick={closeMenu}>Our story</Link>
          <Link to="/#footer" onClick={closeMenu}>Contact</Link>
        </nav>
        <Link className="bag-link" to="/cart" aria-label={`Shopping bag, ${bagCount} items`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M5 8.5h14l1 12H4l1-12Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span>Bag</span>
          <span className="bag-count">{bagCount}</span>
        </Link>
      </header>
    </>
  )
}
      // Fooooter Section
export function StoreFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-brand">
        <img src={logoImage} alt="Esse" />
        <p>Little rituals.<br />Lovely skin.</p>
      </div>
      <div className="footer-links">
        <Link to="/products">Shop skincare</Link>
        <Link to="/#story">Our story</Link>
        <a href="mailto:hello@esse.com">hello@onde.com</a>
      </div>
      <p className="copyright">© 2026 onde. Made with care.</p>
    </footer>
  )
}
