'use client'
import { useRouter, useSearchParams } from 'next/navigation'
const cats = ['All','Tech','Fashion','Food','Home','Sport','Auto']
const sorts = [['relevance','Most relevant'],['popular','Most popular'],['price_asc','Price: low to high'],['price_desc','Price: high to low'],['newest','Newest first']]
export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(params.toString())
    if (val === 'All' || val === 'relevance') p.delete(key); else p.set(key, val)
    router.push(\`/search?\${p.toString()}\`)
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Category</div>
        {cats.map(c => <button key={c} onClick={()=>setParam('category',c)} className={\`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors \${params.get('category')===c||(c==='All'&&!params.get('category')) ? 'text-[#5DCAA5] bg-[#042C20]' : 'text-gray-400 hover:text-gray-200'}\`}>{c}</button>)}
      </div>
      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Sort by</div>
        {sorts.map(([val,label]) => <button key={val} onClick={()=>setParam('sort',val)} className={\`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors \${params.get('sort')===val||(val==='relevance'&&!params.get('sort')) ? 'text-[#5DCAA5] bg-[#042C20]' : 'text-gray-400 hover:text-gray-200'}\`}>{label}</button>)}
      </div>
    </div>
  )
}
