'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
const statusColor: Record<string,string> = {
  confirmed:'bg-[#042C20] text-[#5DCAA5] border border-[#0F6E56]',
  pending:'bg-[#1a1200] text-[#EF9F27] border border-[#854F0B]',
  shipped:'bg-[#042C20] text-[#5DCAA5] border border-[#0F6E56]',
  delivered:'bg-[#042C20] text-[#5DCAA5] border border-[#0F6E56]',
  cancelled:'bg-[#1a0000] text-[#F09595] border border-[#A32D2D]',
}
export function DashboardOrders({ storeId }: { storeId: string }) {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => { api.get(\`/orders/store/\${storeId}\`).then(r=>setOrders(r.data.slice(0,6))).catch(console.error) }, [storeId])
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a1a]">
        <div className="text-xs text-gray-500 uppercase tracking-widest">Recent orders</div>
      </div>
      {orders.length === 0 && <div className="text-center py-8 text-gray-600 text-sm">No orders yet</div>}
      {orders.map(o => (
        <div key={o.id} className="flex items-center px-4 py-3 border-b border-[#141414] last:border-0 hover:bg-[#141414] transition-colors">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-200 font-medium truncate">{o.buyer_name || 'Customer'}</div>
            <div className="text-xs text-gray-600">€{(o.total/100).toFixed(2)}</div>
          </div>
          <span className={\`text-[9px] px-2 py-0.5 rounded font-medium \${statusColor[o.status]||'bg-gray-800 text-gray-400'}\`}>{o.status}</span>
        </div>
      ))}
    </div>
  )
}
