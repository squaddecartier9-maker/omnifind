import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';

function formatPrice(cents, currency = 'EUR') {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency }).format(cents / 100);
}

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const hasImage = product.images?.length > 0;

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-ink2 border border-line rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-all">
        {/* Image */}
        <div className="aspect-square bg-ink3 flex items-center justify-center relative overflow-hidden">
          {hasImage ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="300px" />
          ) : (
            <ShoppingBag size={32} className="text-[#2a2a2a]" />
          )}
          {product.compare_at_price && (
            <div className="absolute top-2 left-2 bg-[#A32D2D] text-white text-xs px-2 py-0.5 rounded">
              -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-[10px] text-[#444] uppercase tracking-wider mb-2">{product.store_name}</div>
          <div className="text-sm text-[#aaa] font-medium leading-snug mb-3 line-clamp-2">{product.name}</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-medium">{formatPrice(product.price, product.currency)}</div>
              {product.compare_at_price && (
                <div className="text-xs text-[#444] line-through">{formatPrice(product.compare_at_price, product.currency)}</div>
              )}
            </div>
            <button
              onClick={e => { e.preventDefault(); addItem(product); }}
              className="bg-ink3 hover:bg-accent2 border border-line hover:border-accent2 text-[#555] hover:text-white p-2 rounded-lg transition-all"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
