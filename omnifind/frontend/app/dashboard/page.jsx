'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ShoppingBag, Eye, Users, Plus, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

function fmt(cents) {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

const STATUS_COLORS = {
  pending: 'badge-pending',
  confirmed: 'badge-paid',
  shipped: 'badge-paid',
  delivered: 'badge-paid',
  cancelled: 'badge-cancelled',
};

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [stores, setStores] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState('30d');
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const { stores } = await api.getMyStores(token);
      setStores(stores);
      if (stores.length) setActiveStore(stores[0]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!activeStore) return;
    async function loadAnalytics() {
      const token = await getToken();
      const [analyticsData, ordersData] = await Promise.all([
        api.getAnalytics(token, activeStore.id, period),
        api.getStoreOrders(token, activeStore.id, { limit: 20 }),
      ]);
      setAnalytics(analyticsData);
      setOrders(ordersData.orders || []);
    }
    loadAnalytics();
  }, [activeStore, period]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="text-[#444] text-sm">Loading dashboard...</div>
    </div>
  );

  if (!stores.length) return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-24 text-center">
        <Package size={40} className="text-[#333] mx-auto mb-4" />
        <h2 className="text-2xl font-medium mb-2">No stores yet</h2>
        <p className="text-[#555] mb-6">Create your first store to start selling on OmniFind.</p>
        <button className="btn-primary mx-auto"><Plus size={15} /> Create your first store</button>
      </div>
    </div>
  );

  const s = analytics?.summary;

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium">Dashboard</h1>
            <p className="text-sm text-[#444] mt-1">Seller analytics & order management</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Store switcher */}
            <select
              value={activeStore?.id}
              onChange={e => setActiveStore(stores.find(s => s.id === e.target.value))}
              className="bg-ink2 border border-line rounded-lg px-3 py-2 text-sm text-[#aaa] focus:outline-none"
            >
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="btn-primary"><Plus size={14} /> Add product</button>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex gap-1.5 mb-6">
          {['7d', '30d', '90d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${period === p ? 'bg-ink3 text-white border border-line' : 'text-[#555] hover:text-[#888]'}`}
            >
              {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Revenue', value: s ? fmt(s.total_revenue) : '—', change: s?.revenue_change, icon: <TrendingUp size={16} /> },
            { label: 'Orders', value: s?.total_orders?.toLocaleString() || '—', change: s?.orders_change, icon: <ShoppingBag size={16} /> },
            { label: 'Visitors', value: s?.total_views?.toLocaleString() || '—', icon: <Eye size={16} /> },
            { label: 'Avg order', value: s ? fmt(s.avg_order_value) : '—', icon: <Users size={16} /> },
          ].map(m => (
            <div key={m.label} className="bg-ink2 border border-line rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#444] uppercase tracking-wider">{m.label}</span>
                <span className="text-[#333]">{m.icon}</span>
              </div>
              <div className="text-2xl font-medium tracking-tight">{m.value}</div>
              {m.change != null && (
                <div className={`text-xs mt-1 ${m.change >= 0 ? 'text-accent' : 'text-red-400'}`}>
                  {m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change)}% vs prev period
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-line mb-6">
          {['overview', 'orders', 'products'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-accent text-white' : 'border-transparent text-[#555] hover:text-[#888]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            {/* Revenue chart */}
            <div className="bg-ink2 border border-line rounded-xl p-5 mb-4">
              <div className="text-xs text-[#444] uppercase tracking-wider mb-4">Revenue over time</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics?.revenue_over_time || []} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={d => new Date(d).toLocaleDateString('en', { weekday: 'short' })} />
                  <YAxis tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `€${(v/100).toFixed(0)}`} />
                  <Tooltip
                    contentStyle={{ background: '#141414', border: '1px solid #232323', borderRadius: 8 }}
                    labelStyle={{ color: '#888' }}
                    formatter={v => [`€${(v/100).toFixed(2)}`, 'Revenue']}
                    labelFormatter={d => new Date(d).toLocaleDateString('en', { dateStyle: 'medium' })}
                  />
                  <Bar dataKey="revenue" fill="#1D9E75" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top products */}
            {analytics?.top_products?.length > 0 && (
              <div className="bg-ink2 border border-line rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-line text-xs text-[#444] uppercase tracking-wider">Top products</div>
                {analytics.top_products.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-line last:border-none hover:bg-ink3">
                    <span className="text-xs text-[#333] w-4">{i + 1}</span>
                    <div className="flex-1 text-sm text-[#aaa]">{p.name}</div>
                    <div className="text-xs text-[#555]">{p.units_sold} sold</div>
                    <div className="text-sm font-medium">{fmt(p.revenue)}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <div className="bg-ink2 border border-line rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-line text-xs text-[#444] uppercase tracking-wider">
              <span>Order</span><span>Customer</span><span>Products</span><span>Total</span><span>Status</span>
            </div>
            {orders.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#444]">No orders yet</div>
            ) : orders.map(order => (
              <div key={order.id} className="grid grid-cols-5 px-5 py-3.5 border-b border-line last:border-none hover:bg-ink3 items-center">
                <span className="text-xs text-[#555] font-mono">#{order.id.slice(0, 8)}</span>
                <span className="text-sm text-[#aaa]">{order.buyer_name}</span>
                <span className="text-xs text-[#555]">{order.items?.length} item(s)</span>
                <span className="text-sm font-medium">{fmt(order.total)}</span>
                <span className={STATUS_COLORS[order.status] || 'text-[#555]'}>{order.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'products' && (
          <div className="text-center py-16 text-[#444] text-sm">
            Product management coming here — click "Add product" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
