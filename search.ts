'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';

const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
];

const CATS = ['All', 'Tech', 'Fashion', 'Food', 'Home', 'Sport', 'Auto'];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('relevance');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  async function doSearch() {
    setLoading(true);
    try {
      const data = await api.search({ q: initialQ, sort, category: category || undefined, page });
      setResults(data.hits || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { doSearch(); }, [initialQ, sort, category, page]);

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="mb-6">
          <SearchBar initialValue={initialQ} />
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[#444]">
            <SlidersHorizontal size={13} />
            {total.toLocaleString()} results {initialQ && `for "${initialQ}"`}
          </div>

          <div className="flex gap-1.5 ml-auto flex-wrap">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c === 'All' ? '' : c.toLowerCase())}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  (c === 'All' && !category) || c.toLowerCase() === category
                    ? 'bg-accent3 border-accent3 text-[#E1F5EE]'
                    : 'border-line text-[#555] hover:border-[#333]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-ink2 border border-line rounded-lg px-3 py-1.5 text-xs text-[#aaa] focus:outline-none focus:border-[#333]"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ink2 border border-line rounded-xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-[#444]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg">No results found</p>
            <p className="text-sm mt-1">Try a different search term or category</p>
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-10 pb-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost text-xs px-4 py-2 disabled:opacity-30">Previous</button>
            <span className="text-xs text-[#444] flex items-center px-3">Page {page}</span>
            <button disabled={results.length < 20} onClick={() => setPage(p => p + 1)} className="btn-ghost text-xs px-4 py-2 disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
