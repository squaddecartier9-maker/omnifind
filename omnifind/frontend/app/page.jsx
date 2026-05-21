'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Zap, Users, TrendingUp, Code2, Check, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';

const DEMO_PRODUCTS = [
  { id: '1', name: 'Aluminium Laptop Stand Pro', price: 8900, currency: 'EUR', store_name: 'TechShop EU', store_slug: 'techshop-eu', category: 'tech', images: [], sales_count: 312 },
  { id: '2', name: 'Merino Wool Jacket — Slim Fit', price: 12400, currency: 'EUR', store_name: 'MerinoWorld', store_slug: 'merino-world', category: 'fashion', images: [], sales_count: 89 },
  { id: '3', name: 'Ethiopia Yirgacheffe 250g Specialty', price: 1800, currency: 'EUR', store_name: 'CoffeeCraft', store_slug: 'coffeecraft', category: 'food', images: [], sales_count: 445 },
  { id: '4', name: 'Adidas Samba OG — Size 42', price: 11000, currency: 'EUR', store_name: 'SportZone EU', store_slug: 'sportzone', category: 'sport', images: [], sales_count: 201 },
  { id: '5', name: 'LED Desk Lamp — Dimmable', price: 4500, currency: 'EUR', store_name: 'HomeHaven', store_slug: 'homehaven', category: 'home', images: [], sales_count: 178 },
  { id: '6', name: 'Mechanical Keyboard TKL RGB', price: 12900, currency: 'EUR', store_name: 'TechShop EU', store_slug: 'techshop-eu', category: 'tech', images: [], sales_count: 95 },
];

const CATEGORIES = ['All', 'Tech', 'Fashion', 'Food', 'Home', 'Sport'];

const PLANS = [
  { name: 'Starter', price: 0, period: 'free forever', stores: '1 store', features: ['100 products', 'Universal search listing', 'Public store URL', '0% transaction fees'], missing: ['Analytics', 'Referral system'] },
  { name: 'Growth', price: 19, period: 'per month', stores: '5 stores', features: ['Unlimited products', 'Advanced analytics', 'Referral system', 'Priority support', '0% transaction fees'], missing: [], popular: true },
  { name: 'Enterprise', price: 59, period: 'per month', stores: 'Unlimited stores', features: ['API access', 'White-label option', 'Dedicated manager', 'Custom integrations', '0% transaction fees'], missing: [] },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [storeCount, setStoreCount] = useState(2847);

  const filtered = activeCategory === 'All'
    ? DEMO_PRODUCTS
    : DEMO_PRODUCTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  useEffect(() => {
    const iv = setInterval(() => setStoreCount(n => n + Math.floor(Math.random() * 2 + 1)), 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-20 pb-0 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-ink2 border border-line rounded-full px-4 py-1.5 text-xs text-[#555] mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {storeCount.toLocaleString()} stores live right now
        </div>

        <h1 className="text-6xl font-medium leading-[1.02] tracking-[-0.04em] mb-4">
          Find anything.<br />
          From <span className="text-accent">everywhere.</span>
        </h1>
        <p className="text-[#555] text-lg leading-relaxed max-w-md mb-10">
          One search across every store on the planet. The best price, the fastest delivery — shown side by side, instantly.
        </p>

        <SearchBar large />

        <div className="flex gap-2 flex-wrap mb-8 mt-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-all ${
                activeCategory === cat
                  ? 'bg-accent3 border-accent3 text-[#E1F5EE]'
                  : 'border-line text-[#555] hover:border-[#333]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product results */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {filtered.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-4 divide-x divide-line bg-ink2 border border-line rounded-xl overflow-hidden">
          {[
            { n: storeCount.toLocaleString(), l: 'Active stores' },
            { n: '1.2M', l: 'Products indexed' },
            { n: '0.3s', l: 'Average search time' },
            { n: '€0', l: 'To get started' },
          ].map(({ n, l }) => (
            <div key={l} className="py-5 text-center">
              <div className="text-2xl font-medium tracking-tight">{n}</div>
              <div className="text-xs text-[#444] uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 max-w-5xl mx-auto flex gap-3">
        <Link href="/sign-up" className="btn-primary text-base px-6 py-3">
          <Zap size={16} /> Open your store free
        </Link>
        <Link href="/search" className="btn-ghost text-base px-6 py-3">
          Browse products <ArrowRight size={16} />
        </Link>
      </section>

      {/* White section */}
      <div className="bg-white text-[#111]">
        {/* How it works */}
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <p className="text-xs font-medium text-accent2 uppercase tracking-widest mb-2">How it works</p>
          <h2 className="text-4xl font-medium tracking-tight mb-2">Simpler than anything.</h2>
          <p className="text-[#666] mb-10">No tutorials. No config. You're live in 10 minutes.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: '01', title: 'Search once', body: 'Type what you want. OmniFind searches every partner store simultaneously — across Europe and beyond.' },
              { n: '02', title: 'Compare instantly', body: 'Price, delivery, stock and reviews — all on one screen. No tabs, no jumping between sites.' },
              { n: '03', title: 'Buy in one click', body: 'One cart, one payment. We handle the rest. You get your package, the seller gets paid.' },
            ].map(s => (
              <div key={s.n} className="bg-[#f6f6f4] border border-[#e8e8e4] rounded-xl p-6">
                <div className="text-xs font-medium text-accent2 uppercase tracking-widest mb-4">{`Step ${s.n}`}</div>
                <div className="text-base font-medium mb-2">{s.title}</div>
                <div className="text-sm text-[#666] leading-relaxed">{s.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 pb-20 max-w-5xl mx-auto">
          <p className="text-xs font-medium text-accent2 uppercase tracking-widest mb-2">Pricing</p>
          <h2 className="text-4xl font-medium tracking-tight mb-2">Start free. Stay free.</h2>
          <p className="text-[#666] mb-10">No credit card. No transaction fees. Ever.</p>
          <div className="grid grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.name} className={`border rounded-xl p-6 ${plan.popular ? 'border-[2px] border-accent2' : 'border-[#e8e8e4]'}`}>
                {plan.popular && (
                  <span className="inline-block bg-[#E1F5EE] text-[#0F6E56] text-xs px-3 py-1 rounded-full mb-3 font-medium">Most popular</span>
                )}
                <div className="text-sm text-[#888] uppercase tracking-wider mb-1">{plan.name}</div>
                <div className="text-4xl font-medium tracking-tight">€{plan.price}</div>
                <div className="text-sm text-[#aaa] mb-5">{plan.period}</div>
                <div className="text-sm font-medium text-[#333] mb-3">{plan.stores}</div>
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#555] py-1.5 border-t border-[#f0f0f0]">
                    <Check size={13} className="text-accent2 flex-shrink-0" /> {f}
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#ccc] py-1.5 border-t border-[#f0f0f0]">
                    <X size={13} className="text-red-300 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Growth engine */}
        <section className="px-6 pb-20 max-w-5xl mx-auto">
          <p className="text-xs font-medium text-accent2 uppercase tracking-widest mb-2">Growth engine</p>
          <h2 className="text-4xl font-medium tracking-tight mb-2">It spreads itself.</h2>
          <p className="text-[#666] mb-10">Every feature brings you more buyers without spending on ads.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Zap size={20} className="text-accent2" />, title: 'Your own store URL', body: 'omnifind.io/yourstore — share everywhere instantly. TikTok, Instagram, WhatsApp.' },
              { icon: <Users size={20} className="text-accent2" />, title: 'Built-in referral system', body: 'Buyers earn discounts when they bring friends. Viral growth by design.' },
              { icon: <TrendingUp size={20} className="text-accent2" />, title: 'Live product rankings', body: 'Real-time public leaderboard. Sellers compete for the top spot.' },
              { icon: <Code2 size={20} className="text-accent2" />, title: 'Free embed widget', body: '"Also on OmniFind" button for any existing site. One line of code.' },
            ].map(v => (
              <div key={v.title} className="bg-[#f6f6f4] border border-[#e8e8e4] rounded-xl p-5 flex gap-4">
                <div className="mt-0.5 flex-shrink-0">{v.icon}</div>
                <div>
                  <div className="text-sm font-medium mb-1">{v.title}</div>
                  <div className="text-sm text-[#777] leading-relaxed">{v.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-medium tracking-tight mb-3">Ready to launch?</h2>
        <p className="text-[#444] mb-8 text-lg">Your first store is free. Always.</p>
        <Link href="/sign-up" className="btn-primary text-base px-8 py-4 mx-auto">
          <Zap size={16} /> Open your store free
        </Link>
        <p className="text-xs text-[#333] mt-4">No credit card · No transaction fees · Cancel anytime</p>
      </section>
    </div>
  );
}
