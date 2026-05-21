import { create } from 'zustand'
import { api } from '@/lib/api'
interface Store { id: string; name: string; slug: string; category: string; is_active: boolean }
interface StoreState { stores: Store[]; activeStore: Store | null; setActiveStore: (s: Store) => void; fetchStores: () => Promise<void> }
export const useStore = create<StoreState>((set) => ({
  stores: [], activeStore: null,
  setActiveStore: (store) => set({ activeStore: store }),
  fetchStores: async () => {
    try { const res = await api.get('/stores/my/stores'); const stores = res.data; set({ stores, activeStore: stores[0] || null }) }
    catch (err) { console.error('Failed to fetch stores:', err) }
  },
}))
