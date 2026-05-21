'use client'
import { useEffect, useState } from 'react'
export function StatsBar() {
  const [count, setCount] = useState(2847)
  useEffect(() => { const iv = setInterval(() => setCount(n => n + Math.floor(Math.random()*2+1)), 3200); return () => clearInterval(iv) }, [])
  return (
    <div className="grid grid-cols-4 mx-6 mb-12 border border-[#1a1a1a] rounded-xl overflow-hidden">
      {([[count.toLocaleString(),'Active stores'],['1.2M','Products indexed'],['0.3s','Search time'],['€0','To get started']] as [string,string][]).map(([n,l]) => (
        <div key={l} className="py-5 px-4 text-center border-r border-[#1a1a1a] last:border-r-0">
          <div className="text-2xl font-medium text-white tracking-tight">{n}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{l}</div>
        </div>
      ))}
    </div>
  )
}
