'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import Link from 'next/link'
export function DashboardProducts({ storeId }: { storeId: string }) {
  const [products, setProducts] = useState<any[]>([])
  useEffect(() => { api.get(\`/products/my/products?store_id=\${storeId}\`).then(r=>setProducts(r.data.slice(0,6))).catch(console.error) }, [storeId])
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="text-xs text-gray-500 uppercase tracking-widest">Products</div>
        <Link href="/dashboard/products/new" className="text-xs text-[#5DCAA5] hover:text-[#9FE1CB]">+ Add product</Link>
      </div>
      {products.length === 0 && <div className="text-center py-8 text-gray-600 text-sm">No products yet</div>}
      {products.map(p => (
        <div key={p.id} className="flex items-center px-4 py-3 border-b border-[#141414] last:border-0 hover:bg-[#141414] transition-colors">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-200 font-medium truncate">{p.name}</div>
            <div className="text-xs text-gray-600">€{(p.price/100).toFixed(2)} · {p.stock} in stock</div>
          </div>
          <div className={\`w-1.5 h-1.5 rounded-full \${p.is_active ? 'bg-[#5DCAA5]' : 'bg-gray-600'}\`} />
        </div>
      ))}
    </div>
  )
}
