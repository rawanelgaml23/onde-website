import { Link } from 'react-router-dom'
import { StoreHeader, StoreFooter } from '../StoreChrome.jsx'
import {
  useCart,
  parsePrice,
  getShipping,
  FREE_SHIPPING_MIN,
} from '../cart/cartContext.js'

export default function CartPage() {
  const { items, count, subtotal, changeQty, removeItem } = useCart()
  const shipping = getShipping(subtotal)
  const total = subtotal + shipping
  const remaining = FREE_SHIPPING_MIN - subtotal

  return (
    <>
      <StoreHeader bagCount={count} />
      <main className="cart-page">
        <h1>Your bag</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your bag is empty for now.</p>
            <Link className="button button-dark" to="/products">Shop skincare</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              {items.map(({ product, qty }) => (
                <li className="cart-item" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>{product.detail}</p>
                    <button className="link-button" type="button" onClick={() => removeItem(product.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="qty-controls">
                    <button type="button" aria-label={`Decrease ${product.name}`} onClick={() => changeQty(product.id, -1)}>
                      −
                    </button>
                    <span>{qty}</span>
                    <button type="button" aria-label={`Increase ${product.name}`} onClick={() => changeQty(product.id, 1)}>
                      +
                    </button>
                  </div>

                  <span className="cart-line-price">${parsePrice(product.price) * qty}</span>
                </li>
              ))}
            </ul>

            <aside className="cart-summary">
              <h2>Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <p>
                {remaining > 0
                  ? `Add $${remaining} more for complimentary shipping.`
                  : 'Your order qualifies for complimentary shipping.'}
              </p>
              <Link className="button button-dark" to="/checkout">Checkout</Link>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </>
  )
}
