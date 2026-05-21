'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchProducts } from '@/lib/search'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
export function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [time, setTime] = useState(0)
  const params = useSearchParams()
  useEffect(() => {
    setLoading(true)
    searchProducts(query, { category: params.get('category') || undefined, sortBy: params.get('sort') || undefined })
      .then(r => { setResults(r.hits); setTotal(r.estimatedTotalHits || 0); setTime(r.processingTimeMs || 0) })
      .catch(console.error).finally(() => setLoading(false))
  }, [query, params.toString()])
  if (loading) return <div className="text-center py-12 text-gray-500">Searching...</div>
  return (
    <div>
      <div className="text-xs text-gray-500 mb-4">{total.toLocaleString()} results in {time}ms</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r: any) => (
          <Link key={r.id} href={\`/product/\${r.id}\`} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#2a2a2a] transition-colors block">
            <div className="bg-[#1a1a1a] rounded-lg aspect-square mb-3 flex items-center justify-center overflow-hidden">
              {r.images?.[0] ? <img src={r.images[0]} className="w-full h-full object-cover" alt={r.name} /> : <ShoppingBag size={32} className="text-gray-600" />}
            </div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{r.store_name}</div>
            <div className="text-sm text-gray-200 font-medium leading-snug mb-2 line-clamp-2" dangerouslySetInnerHTML={{__html: r._formatted?.name || r.name}} />
            <div className="text-lg font-medium text-white">€{(r.price/100).toFixed(2)}</div>
          </Link>
        ))}
      </div>
      {results.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No results for "{query}"</p>
          <p className="text-sm">Try a different search term or browse by category</p>
        </div>
      )}
    </div>
  )
}
