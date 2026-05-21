'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
export function DashboardChart({ storeId }: { storeId: string }) {
  const [data, setData] = useState<number[]>([38,52,67,91,63,79,74])
  useEffect(() => {
    api.get(\`/analytics/store/\${storeId}\`).then(r => {
      if (r.data.dailyRevenue?.length) setData(r.data.dailyRevenue.map((d:any) => d.revenue))
    }).catch(console.error)
  }, [storeId])
  const max = Math.max(...data)
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Revenue — last 7 days</div>
      <div className="flex items-end gap-2 h-24 mb-2">
        {data.slice(-7).map((v,i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div className={\`rounded-t-sm transition-colors cursor-pointer \${i===3?'bg-[#5DCAA5]':'bg-[#1e1e1e] hover:bg-[#2a2a2a]'}\`} style={{height:\`\${Math.round((v/max)*100)}%\`,minHeight:'4px'}} />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {days.map(d => <div key={d} className="flex-1 text-center text-[9px] text-gray-600">{d}</div>)}
      </div>
    </div>
  )
}
