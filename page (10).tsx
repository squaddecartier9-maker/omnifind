'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
export function DashboardStats({ storeId }: { storeId: string }) {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get(\`/analytics/store/\${storeId}\`).then(r=>setData(r.data)).catch(console.error) }, [storeId])
  const revenue = data ? (data.totalRevenue/100).toLocaleString('de-DE',{style:'currency',currency:'EUR'}) : '—'
  const stats = [
    {label:'Total revenue',value:revenue,change:'↑ 18%'},
    {label:'Total orders',value:data?.totalOrders?.toLocaleString()||'—',change:'↑ 9%'},
    {label:'Avg order value',value:data?.totalOrders ? '€'+(data.totalRevenue/data.totalOrders/100).toFixed(0) : '—',change:''},
    {label:'Search rank',value:'#4',change:'↑ 2 spots'},
  ]
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{s.label}</div>
          <div className="text-2xl font-medium text-white tracking-tight">{s.value}</div>
          {s.change && <div className="text-xs text-[#5DCAA5] mt-1">{s.change} this month</div>}
        </div>
      ))}
    </div>
  )
}
