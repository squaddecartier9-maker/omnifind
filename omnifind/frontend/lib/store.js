import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find(i => i.product_id === product.id);
        if (existing) {
          set({ items: items.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ items: [...items, { product_id: product.id, product, quantity }] });
        }
      },

      removeItem: (productId) => set({ items: get().items.filter(i => i.product_id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) return get().removeItem(productId);
        set({ items: get().items.map(i => i.product_id === productId ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'omnifind-cart' }
  )
);

export const useUIStore = create(set => ({
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));
