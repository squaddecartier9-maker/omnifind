'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResults } from '@/components/search/SearchResults'

function SearchContent() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <SearchBar initialQuery={q} className="mb-8" />
      <div className="flex gap-8">
        <aside className="w-60 shrink-0">
          <SearchFilters />
        </aside>
        <div className="flex-1">
          <SearchResults query={q} />
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
