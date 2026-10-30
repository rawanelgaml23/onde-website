import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreHeader, StoreFooter } from '../StoreChrome.jsx'
import { useCart, parsePrice, getShipping } from '../cart/cartContext.js'

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  notes: '',
  payment: 'cash',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name'
  if (!/^01[0-9]{9}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid Egyptian mobile number (11 digits)'
  }
  if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!form.address.trim()) errors.address = 'Please enter your address'
  if (!form.city.trim()) errors.city = 'Please enter your city'
  return errors
}

export default function CheckoutPage() {
  const { items, count, subtotal, clearCart } = useCart()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const shipping = getShipping(subtotal)
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    const found = validate(form)
    setErrors(found)
    setServerError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            city: form.city,
            notes: form.notes,
          },
          payment: form.payment,
          items: items.map(({ product, qty }) => ({ productId: product.id, qty })),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setErrors(json.errors || {})
        setServerError(json.message || 'Something went wrong, please try again.')
        return
      }

      setPlacedOrder(json.data)
      clearCart()
    } catch {
      setServerError('Network error, please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  let content
  if (placedOrder) {
    content = (
      <div className="checkout-done">
        <h2>Thank you, {placedOrder.name}!</h2>
        <p>
          Your order <strong>{placedOrder.orderNumber}</strong> has been placed for a total of $
          {placedOrder.total}. We'll contact you on {placedOrder.phone} to confirm delivery.
        </p>
        <Link className="button button-dark" to="/products">Keep shopping</Link>
      </div>
    )
  } else if (items.length === 0) {
    content = (
      <div className="cart-empty">
        <p>Your bag is empty, so there's nothing to check out yet.</p>
        <Link className="button button-dark" to="/products">Shop skincare</Link>
      </div>
    )
  } else {
    content = (
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Shipping details</h2>

          <div className="field-grid">
            <div className="field full">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Mona Ahmed" />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="phone">Mobile number</label>
              <input id="phone" name="phone" inputMode="tel" value={form.phone} onChange={handleChange} placeholder="01xxxxxxxxx" />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="field">
              <label htmlFor="email">Email (optional)</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@email.com" />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field full">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Street, building, apartment" />
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Cairo" />
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>

            <div className="field">
              <label htmlFor="notes">Delivery notes (optional)</label>
              <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Any extra details" />
              {errors.notes && <p className="field-error">{errors.notes}</p>}
            </div>
          </div>

          <h2>Payment method</h2>
          <label className="radio-option">
            <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={handleChange} />
            Cash on delivery
          </label>
          <label className="radio-option">
            <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} />
            Card (Visa / Mastercard)
          </label>
          {errors.payment && <p className="field-error">{errors.payment}</p>}

          {serverError && <p className="field-error">{serverError}</p>}

          <button className="button button-dark checkout-submit" type="submit" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Confirm order'}
          </button>
          <Link className="back-link" to="/cart">← Back to bag</Link>
        </form>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <ul className="checkout-items">
            {items.map(({ product, qty }) => (
              <li key={product.id}>
                <span>{product.name} × {qty}</span>
                <span>${parsePrice(product.price) * qty}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal ({count} items)</span>
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
        </aside>
      </div>
    )
  }

  return (
    <>
      <StoreHeader bagCount={count} />
      <main className="cart-page checkout-page">
        {content}
      </main>
      <StoreFooter />
    </>
  )
}
