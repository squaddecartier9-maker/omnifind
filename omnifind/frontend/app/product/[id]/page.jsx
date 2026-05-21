'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowLeft, Star, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/store';

function fmt(cents, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency }).format(cents / 100);
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    api.getProduct(id).then(d => setProduct(d.product)).catch(console.error);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-ink2 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-ink2 rounded w-1/3" />
            <div className="h-8 bg-ink2 rounded" />
            <div className="h-4 bg-ink2 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const saving = product.compare_at_price ? product.compare_at_price - product.price : 0;

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-20">
        {/* Breadcrumb */}
        <Link href="/search" className="inline-flex items-center gap-1.5 text-xs text-[#555] hover:text-[#888] mb-6 transition-colors">
          <ArrowLeft size={13} /> Back to results
        </Link>

        <div className="grid grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square bg-ink2 border border-line rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
              {product.images?.[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" sizes="500px" />
              ) : (
                <ShoppingBag size={48} className="text-[#2a2a2a]" />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-ink2 rounded-lg border overflow-hidden ${i === selectedImage ? 'border-accent2' : 'border-line'}`}
                  >
                    <Image src={img} alt={`${product.name} ${i+1}`} width={80} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Link href={`/store/${product.store_slug}`} className="text-xs text-accent2 uppercase tracking-wider hover:text-accent transition-colors">
              {product.store_name}
            </Link>

            <h1 className="text-2xl font-medium mt-2 mb-3 leading-snug">{product.name}</h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
              </div>
              <span className="text-xs text-[#555]">4.6 · 312 reviews</span>
            </div>

            {/* Price */}
            <div className="mb-1">
              <span className="text-4xl font-medium tracking-tight">{fmt(product.price, product.currency)}</span>
              {product.compare_at_price && (
                <span className="text-[#444] line-through ml-3 text-lg">{fmt(product.compare_at_price, product.currency)}</span>
              )}
            </div>
            {saving > 0 && (
              <p className="text-sm text-accent2 mb-4">You save {fmt(saving, product.currency)}</p>
            )}

            {product.description && (
              <p className="text-sm text-[#666] leading-relaxed mb-6 border-t border-line pt-4">{product.description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-accent' : 'bg-red-400'}`} />
              <span className="text-[#666]">
                {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
              </span>
            </div>

            {/* CTAs */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all mb-3 ${
                added ? 'bg-accent3 text-white' : 'bg-accent2 hover:bg-accent3 text-white'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {added ? <><Check size={16} /> Added to cart</> : <><ShoppingBag size={16} /> Add to cart — {fmt(product.price, product.currency)}</>}
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-line text-[#666] hover:text-white hover:border-[#333] transition-all text-sm">
              <Heart size={15} /> Save to wishlist
            </button>

            {/* Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-6 border-t border-line pt-4">
                {Object.entries(product.attributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-2 border-b border-line">
                    <span className="text-[#555] capitalize">{k}</span>
                    <span className="text-[#aaa]">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
