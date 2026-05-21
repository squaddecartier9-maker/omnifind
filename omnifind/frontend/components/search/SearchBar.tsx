'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
export function SearchBar({ initialQuery = '', className = '' }: { initialQuery?: string; className?: string }) {
  const [q, setQ] = useState(initialQuery)
  const router = useRouter()
  const submit = (e: React.FormEvent) => { e.preventDefault(); router.push(\`/search?q=\${encodeURIComponent(q)}\`) }
  return (
    <form onSubmit={submit} className={\`flex items-center gap-3 bg-[#111] border border-[#222] rounded-xl px-4 py-3 \${className}\`}>
      <Search size={17} className="text-gray-500 shrink-0" />
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search anything..." className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none" />
      <button type="submit" className="bg-[#1D9E75] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#0F6E56] transition-colors">Search</button>
    </form>
  )
}
