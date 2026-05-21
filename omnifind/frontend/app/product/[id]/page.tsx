'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ShoppingBag, Heart, ArrowLeft, Star } from 'lucide-react'
import { useCart } from '@/store/useCart'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(r => r.json()).then(setProduct).finally(() => setLoading(false))
  }, [id])

  if (loading) return <main><Navbar /><div className="p-8 text-center text-gray-400">Loading...</div></main>
  if (!product) return <main><Navbar /><div className="p-8 text-center text-red-400">Product not found</div></main>

  const price = (product.price / 100).toFixed(2)
  const compareAt = product.compare_at_price ? (product.compare_at_price / 100).toFixed(2) : null
  const savings = compareAt ? ((product.compare_at_price - product.price) / 100).toFixed(2) : null

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/search" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6">
          <ArrowLeft size={14} /> Back to results
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center mb-4 overflow-hidden">
              {product.images?.[0]
                ? <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                : <ShoppingBag size={80} className="text-gray-300" />
              }
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img: string, i: number) => (
                  <img key={i} src={img} className="rounded-lg aspect-square object-cover cursor-pointer border-2 border-transparent hover:border-green-500" alt="" />
                ))}
              </div>
            )}
          </div>
          <div className="py-2">
            <p className="text-sm text-green-600 font-medium uppercase tracking-wide mb-2">{product.store_name}</p>
            <h1 className="text-3xl font-medium text-gray-900 mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? 'currentColor' : 'none'} />)}</div>
              <span className="text-sm text-gray-400">4.6 · 312 reviews</span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-medium text-gray-900">€{price}</span>
              {compareAt && <span className="text-lg text-gray-400 line-through ml-3">€{compareAt}</span>}
            </div>
            {savings && (
              <p className="text-sm text-green-600 mb-6">You save €{savings} vs other stores</p>
            )}
            <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>
            <button
              onClick={() => { addItem(product); toast.success('Added to cart'); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <ShoppingBag size={18} /> Add to cart — €{price}
            </button>
            <button className="w-full border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Heart size={16} /> Save to wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
