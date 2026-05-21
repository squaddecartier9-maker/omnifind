'use client'
import { useEffect, useState } from 'react'
const queries = ['wireless headphones under €100','nike air max size 42','ethiopian specialty coffee','electric standing desk','mechanical keyboard TKL']
export function HeroSection() {
  const [typed, setTyped] = useState('')
  const [qi, setQi] = useState(0)
  useEffect(() => {
    let i = 0; const q = queries[qi]
    const iv = setInterval(() => {
      if (i < q.length) { setTyped(q.slice(0, ++i)) }
      else { clearInterval(iv); setTimeout(() => { setQi(p => (p+1)%queries.length); setTyped('') }, 2400) }
    }, 55)
    return () => clearInterval(iv)
  }, [qi])
  return (
    <section className="px-6 pt-20 pb-8 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-4 py-2 text-xs text-[#5DCAA5] mb-8 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-pulse" />2,847 stores live · Beta
      </div>
      <h1 className="text-6xl font-medium leading-[1.02] tracking-[-0.04em] text-white mb-5">Find anything.<br />From <span className="text-[#5DCAA5]">everywhere.</span></h1>
      <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">One search across every store. The best price, the fastest delivery — shown side by side, instantly.</p>
      <div className="mt-3 h-8 text-[#5DCAA5] text-sm font-mono">{typed}<span className="animate-pulse">|</span></div>
    </section>
  )
}
