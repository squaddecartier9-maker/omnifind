'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SearchBar({ large = false, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const timer = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
      } catch {}
    }, 200);
    return () => clearTimeout(timer.current);
  }, [query]);

  function handleSearch(q) {
    const term = q || query;
    if (!term.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  }

  return (
    <div className={`relative ${large ? 'max-w-xl' : 'max-w-sm'}`}>
      <div className="flex items-center gap-3 bg-ink2 border border-line rounded-xl px-4 py-3 focus-within:border-[#333]">
        <Search size={16} className="text-[#444] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search any product in the world..."
          className={`flex-1 bg-transparent text-white placeholder-[#444] focus:outline-none ${large ? 'text-base' : 'text-sm'}`}
        />
        <button
          onClick={() => handleSearch()}
          className="bg-accent2 hover:bg-accent3 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-ink2 border border-line rounded-xl overflow-hidden z-50">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => handleSearch(s)}
              className="w-full text-left px-4 py-3 text-sm text-[#aaa] hover:bg-ink3 hover:text-white transition-colors flex items-center gap-3"
            >
              <Search size={13} className="text-[#444]" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
