const API_URL = import.meta.env.VITE_API_URL || ''

export async function getProducts() {
    const res = await fetch(`${API_URL}/api/products`)
    if (!res.ok) throw new Error('Failed to load products')
    const json = await res.json()
    return json.data
}