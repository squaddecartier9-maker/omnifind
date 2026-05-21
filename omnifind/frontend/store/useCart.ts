import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface CartItem { id: string; name: string; price: number; quantity: number; store_id: string; store_name: string; image?: string }
interface CartStore {
  items: CartItem[]
  addItem: (product: any) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: () => number
  count: () => number
}
export const useCart = create<CartStore>()(persist((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items; const exists = items.find(i => i.id === product.id)
    if (exists) { set({ items: items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) }) }
    else { set({ items: [...items, { id: product.id, name: product.name, price: product.price, quantity: 1, store_id: product.store_id, store_name: product.store_name, image: product.images?.[0] }] }) }
  },
  removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
  updateQty: (id, qty) => { if (qty < 1) return get().removeItem(id); set({ items: get().items.map(i => i.id === id ? { ...i, quantity: qty } : i) }) },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
}), { name: 'omnifind-cart' }))
