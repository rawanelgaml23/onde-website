import { useEffect, useState } from 'react'
import { StoreHeader, StoreFooter } from '../StoreChrome.jsx'
import { products } from '../products.js'
import { useCart } from '../cart/cartContext.js'
import bannerImage from '../assets/korean2.jpg'

const CATEGORIES = ['All', 'Sun Screen', 'Toners', 'Moisturizers', 'Cleansers', 'Serums', 'Eye Cream']
const PAGE_SIZE = 12

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function ProductsPage() {
  const { count, addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((product) => product.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)

  const changeCategory = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.is-visible)')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [activeCategory, currentPage])

  return (
    <>
      <StoreHeader bagCount={count} />
      <main className="shop-page">
        <div className="category-banner" style={{ '--banner-image': `url(${bannerImage})` }}>
          <p className="eyebrow">Shop all skincare</p>
          <h2>Our products</h2>
        </div>

        <nav className="category-tabs" aria-label="Product categories">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-tab${activeCategory === category ? ' is-active' : ''}`}
              aria-pressed={activeCategory === category}
              onClick={() => changeCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="product-grid" key={`${activeCategory}-${currentPage}`}>
          {visibleProducts.map((product, index) => (
            <article
              className="product-card reveal"
              key={product.id}
              style={{ '--card-index': index }}
            >
              <div className={`product-visual ${product.tone}`}>
                <span className="product-tag">{product.tag}</span>
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="product-info">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                </div>
                <span className="product-price">${product.price}</span>
              </div>
              <button className="add-link" type="button" onClick={() => addToCart(product)}>
                Add to bag <ArrowIcon />
              </button>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`page-btn${currentPage === page ? ' is-active' : ''}`}
                aria-current={currentPage === page ? 'page' : undefined}
                onClick={() => {
                  setCurrentPage(page)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                {page}
              </button>
            ))}
          </nav>
        )}

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
