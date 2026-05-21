'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
const cats = ['All','Tech','Fashion','Food','Home','Sport']
const demoCards = [
  {store:'TechShop EU',name:'Aluminium laptop stand pro',price:'€89',del:'2-day delivery',badge:'Best price',cat:'Tech'},
  {store:'MerinoWorld',name:'Merino wool jacket slim fit',price:'€124',del:'Free delivery',badge:null,cat:'Fashion'},
  {store:'CoffeeCraft',name:'Ethiopia Yirgacheffe 250g',price:'€18',del:'Roasted 3 days ago',badge:'Exclusive',cat:'Food'},
  {store:'SportZone',name:'Adidas Samba OG size 42',price:'€110',del:'3 pairs left',badge:'Trending',cat:'Sport'},
  {store:'HomeHaven',name:'LED desk lamp dimmable',price:'€45',del:'Free delivery',badge:'New',cat:'Home'},
  {store:'AutoParts EU',name:'Bosch F026 oil filter',price:'€12',del:'Fits 230+ models',badge:null,cat:'Tech'},
]
export function SearchSection() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const router = useRouter()
  const shown = (cat === 'All' ? demoCards : demoCards.filter(c => c.cat === cat)).slice(0,3)
  const submit = (e: React.FormEvent) => { e.preventDefault(); router.push(\`/search?q=\${encodeURIComponent(q)}\`) }
  return (
    <div className="max-w-3xl mx-auto px-6 mb-8">
      <form onSubmit={submit} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden mb-2">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Search size={17} className="text-gray-600 shrink-0" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search any product in the world..." className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none" />
          <button type="submit" className="bg-[#1D9E75] text-white text-xs px-3 py-1.5 rounded-lg">Search</button>
        </div>
        <div className="flex gap-1.5 px-3 pb-3">
          {cats.map(c => (
            <button key={c} type="button" onClick={()=>setCat(c)} className={\`px-3 py-1 rounded-full text-xs border transition-all \${cat===c ? 'bg-[#0F6E56] border-[#0F6E56] text-green-100' : 'border-[#222] text-gray-500 hover:border-[#444]'}\`}>{c}</button>
          ))}
        </div>
      </form>
      <div className="grid grid-cols-3 gap-2">
        {shown.map(c => (
          <div key={c.name} className="bg-[#0d0d0d] border border-[#161616] rounded-lg p-3.5 cursor-pointer hover:border-[#2a2a2a] transition-colors" onClick={()=>router.push('/search')}>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">{c.store}</div>
            <div className="text-xs text-gray-300 font-medium leading-snug mb-2">{c.name}</div>
            <div className="flex items-end justify-between">
              <div><div className="text-lg font-medium text-white">{c.price}</div><div className="text-[10px] text-gray-600">{c.del}</div></div>
              {c.badge && <div className="text-[9px] bg-[#042C20] text-[#5DCAA5] border border-[#0F6E56] px-1.5 py-0.5 rounded">{c.badge}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
