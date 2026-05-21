import { Navbar } from '@/components/layout/Navbar'
import { api } from '@/lib/api'
import { notFound } from 'next/navigation'

export default async function StorePage({ params }: { params: { slug: string } }) {
  let store
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stores/${params.slug}`)
    if (!res.ok) notFound()
    store = await res.json()
  } catch { notFound() }

  return (
    <main>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          {store.logo_url && <img src={store.logo_url} className="w-16 h-16 rounded-xl object-cover" alt={store.name} />}
          <div>
            <h1 className="text-2xl font-medium text-white">{store.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{store.description}</p>
          </div>
        </div>
        <p className="text-gray-500">Products loading... (connect to live API)</p>
      </div>
    </main>
  )
}
