import { createContext, useContext } from 'react'

export const CartContext = createContext(null)

export const FREE_SHIPPING_MIN = 50
export const SHIPPING_FEE = 5

// يشتغل مع الرقم والنص: 24 أو "$24" -> 24
export function parsePrice(price) {
  return Number(String(price).replace(/[^0-9.]/g, ''))
}

// shipping is free from FREE_SHIPPING_MIN, otherwise SHIPPING_FEE (0 when bag is empty)
export function getShipping(subtotal) {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_MIN) return 0
  return SHIPPING_FEE
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
