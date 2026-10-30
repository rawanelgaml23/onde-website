import { useState } from 'react'
import { CartContext, parsePrice } from './cartContext.js'

export function CartProvider({ children }) {
  // each item: { product, qty }
  const [items, setItems] = useState([])

  const addToCart = (product) => {
    setItems((current) => {
      const exists = current.some((item) => item.product.id === product.id)
      if (exists) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...current, { product, qty: 1 }]
    })
  }

  const changeQty = (id, delta) => {
    setItems((current) =>
      current
        .map((item) =>
          item.product.id === id ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.product.id !== id))
  }

  const clearCart = () => setItems([])

  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.qty,
    0,
  )

  const value = { items, count, subtotal, addToCart, changeQty, removeItem, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}