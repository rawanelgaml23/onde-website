import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import heroImage from './assets/bg1.jpg'
import storyImage from './assets/korean1.webp'
import bannerImage from './assets/korean2.jpg'
import promoImage from './assets/korean3.webp'
import { getProducts } from './api/products.js'
import { useCart } from './cart/cartContext.js'
import { StoreHeader, StoreFooter } from './StoreChrome.jsx'

const CATEGORIES = ['Sun Screen', 'Toners', 'Moisturizers', 'Cleansers', 'Serums', 'Eye Cream']
const PREVIEW_COUNT = 4

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function App() {
  const { count: bagCount, addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error('Products error:', err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const handleAdd = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 400)
  }

  const featured = products.filter((product) => product.featured)
  const activeItems = products.filter((product) => product.category === activeCategory)
  const shown = activeItems.slice(0, PREVIEW_COUNT)

  return (
    <>
      <StoreHeader bagCount={bagCount} />
      {/* Description BackGround */}
      <main>
        <section className="hero" id="home" style={{ '--hero-image': `url(${heroImage})` }}>
          <div className="hero-copy">
            <p className="eyebrow">A softer kind of skincare</p>
            <h1 className="hero-title">
              <span className="hero-line"><span>Make room</span></span>
              <span className="hero-line"><span>for your</span></span>
              <span className="hero-line hero-glow"><span>glow.</span></span>
            </h1>
            <p className="hero-description">
              Thoughtful formulas, little daily rituals, and a happier relationship with your skin.
            </p>
            <Link className="button button-dark" to="/products">
              Find your favorites <ArrowIcon />
            </Link>
            <div className="hero-note">
              <span className="note-star">✳</span>
              <span>Made for your skin.<br />And your slow mornings.</span>
            </div>
          </div>
          <div className="hero-caption">
            <span>THE EVERYDAY EDIT</span>
            <span>01 / 04</span>
          </div>
        </section>

        <section className="promise-strip reveal" aria-label="Our promises">
          <p>Good skin days, made simple</p>
          <span>✳</span>
          <p>Considered ingredients</p>
          <span>✳</span>
          <p>Care that feels like you</p>
          <span>✳</span>
          <p>A little more glow</p>
        </section>

        {/* Section Products */}
        <section className="products-section section-wrap reveal" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your routine, refined</p>
              <h2>Good things for<br className="mobile-break" /> your skin.</h2>
            </div>
            <Link className="text-link" to="/products">Shop all skincare <ArrowIcon /></Link>
          </div>

          <div className="product-grid">
            {featured.map((product, index) => (
              <article className="product-card" key={product.id} style={{ '--card-index': index }}>
                <div className={`product-visual ${product.tone}`}>
                  <span className="product-tag">{product.tag}</span>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <button
                    className="quick-add"
                    type="button"
                    aria-label={`Add ${product.name} to bag`}
                    onClick={() => handleAdd(product)}
                  >
                    +
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.detail}</p>
                  </div>
                  <span className="product-price">${product.price}</span>
                </div>
                <button
                  className={`add-link${addedId === product.id ? ' is-added' : ''}`}
                  type="button"
                  onClick={() => handleAdd(product)}
                >
                  Add to bag <ArrowIcon />
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Section Banner1 */}
        <section className="story-section reveal" id="story">
          <div className="story-image">
            <img src={storyImage} alt="Ginseng essence and botanical ingredients" loading="lazy" />
            <span className="image-stamp">A little<br />care goes<br />a long way.</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">A note from Onde</p>
            <h2>Skincare should<br />feel like <em>self-care.</em></h2>
            <p>
              We believe the best routines are the ones you look forward to. That's why we bring
              together considered ingredients and comforting textures, to make everyday care feel
              a little more special.
            </p>
            <a className="button button-outline" href="#footer">
              Get to know us <ArrowIcon />
            </a>
            <div className="story-signoff">With care, <span>ONDE</span></div>
          </div>
        </section>
        <br /><br /><br />
        <br /><br />

        {/* Section All Products */}
        <section className="category-section reveal" aria-label="Shop by category">
          <div className="category-banner" style={{ '--banner-image': `url(${bannerImage})` }}>
            <p className="eyebrow">Your routine, refined</p>
            <h2>Our products</h2>
          </div>

          <nav className="category-tabs" aria-label="Product categories">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-tab${activeCategory === category ? ' is-active' : ''}`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          <div className="shop-section">
            {loading ? (
              <p className="category-empty">Loading…</p>
            ) : shown.length === 0 ? (
              <p className="category-empty">Coming soon ✳</p>
            ) : (
              <div className="product-grid">
                {shown.map((product, index) => (
                  <article className="product-card" key={product.id} style={{ '--card-index': index }}>
                    <div className={`product-visual ${product.tone}`}>
                      <span className="product-tag">{product.tag}</span>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <button
                        className="quick-add"
                        type="button"
                        aria-label={`Add ${product.name} to bag`}
                        onClick={() => handleAdd(product)}
                      >
                        +
                      </button>
                    </div>
                    <div className="product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.detail}</p>
                      </div>
                      <span className="product-price">${product.price}</span>
                    </div>
                    <button
                      className={`add-link${addedId === product.id ? ' is-added' : ''}`}
                      type="button"
                      onClick={() => handleAdd(product)}
                    >
                      Add to bag <ArrowIcon />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="category-footer">
            <Link className="button button-dark" to="/products">Shop products <ArrowIcon /></Link>
          </div>
        </section>

        {/* Section Banner2 */}
        <section className="promo-banner reveal" aria-label="Special offer">
          <div className="promo-copy">
            <p className="eyebrow">Limited offer</p>
            <h2>Build your<br /> perfect routine.</h2>
            <p>Choose the products you love and enjoy a better price on every order</p>
            <Link className="button button-light" to="/products">
              Shop the bundles <ArrowIcon />
            </Link>
          </div>
          <div className="promo-image-wrap">
            <img src={promoImage} alt="Special offer" loading="lazy" />
          </div>
        </section>

        {/* Section Email */}
        <section className="newsletter reveal">
          <p className="eyebrow">A little note, now & then</p>
          <h2>Good skin mail.</h2>
          <p>Thoughtful tips, new favorites, and 10% off your first order.</p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" required />
            <button type="submit" aria-label="Subscribe to the newsletter"><ArrowIcon /></button>
          </form>
        </section>
      </main>

      <StoreFooter />
    </>
  )
}

export default App