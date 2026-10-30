export async function getProducts() {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error('Failed to load products')
    const json = await res.json()
    return json.data
}