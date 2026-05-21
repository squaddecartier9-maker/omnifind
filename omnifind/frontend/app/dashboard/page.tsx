'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Navbar } from '@/components/layout/Navbar'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DashboardChart } from '@/components/dashboard/DashboardChart'
import { DashboardOrders } from '@/components/dashboard/DashboardOrders'
import { DashboardProducts } from '@/components/dashboard/DashboardProducts'
import { StoreSelector } from '@/components/dashboard/StoreSelector'
import { useStore } from '@/store/useStore'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { activeStore, setActiveStore, stores, fetchStores } = useStore()

  useEffect(() => {
    if (isLoaded && user) fetchStores()
  }, [isLoaded, user])

  if (!isLoaded) return <div className="min-h-screen bg-[#0a0a0a]" />

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-white">Seller dashboard</h1>
          <StoreSelector stores={stores} activeStore={activeStore} onSelect={setActiveStore} />
        </div>
        {activeStore ? (
          <div className="space-y-6">
            <DashboardStats storeId={activeStore.id} />
            <DashboardChart storeId={activeStore.id} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardOrders storeId={activeStore.id} />
              <DashboardProducts storeId={activeStore.id} />
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg mb-4">No stores yet</p>
            <a href="/dashboard/new-store" className="bg-[#5DCAA5] text-[#04342C] px-6 py-3 rounded-lg font-medium hover:bg-[#9FE1CB] transition-colors">
              Create your first store
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
