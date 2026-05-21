'use client'
interface Store { id: string; name: string; slug: string }
export function StoreSelector({ stores, activeStore, onSelect }: { stores: Store[]; activeStore: Store|null; onSelect: (s: Store) => void }) {
  return (
    <select value={activeStore?.id||''} onChange={e=>{ const s=stores.find(s=>s.id===e.target.value); if(s) onSelect(s) }}
      className="bg-[#111] border border-[#1a1a1a] text-gray-200 text-sm px-3 py-2 rounded-lg outline-none focus:border-[#5DCAA5] transition-colors">
      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
  )
}
