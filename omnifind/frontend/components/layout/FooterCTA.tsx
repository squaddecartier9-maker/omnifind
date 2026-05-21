import Link from 'next/link'
export function FooterCTA() {
  return (
    <section className="text-center px-6 py-20">
      <h2 className="text-4xl font-medium text-white tracking-tight mb-3">Ready to build this?</h2>
      <p className="text-gray-500 mb-8">Join 2,847 sellers already on OmniFind.</p>
      <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#5DCAA5] text-[#04342C] font-medium px-8 py-4 rounded-xl hover:bg-[#9FE1CB] transition-colors">Open your store — it is free</Link>
      <p className="text-gray-600 text-sm mt-4">No credit card · Free plan available · Cancel anytime</p>
    </section>
  )
}
