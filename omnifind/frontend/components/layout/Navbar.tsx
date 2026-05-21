'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { ShoppingBag, Search } from 'lucide-react'
import { useCart } from '@/store/useCart'

export function Navbar() {
  const { user, isLoaded } = useUser()
  const { count } = useCart()
  const pathname = usePathname()
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-50">
      <Link href="/" className="text-white font-medium text-lg tracking-tight">Omni<span className="text-[#5DCAA5]">Find</span></Link>
      <div className="flex items-center gap-1">
        {([['/', 'Home'], ['/search', 'Browse'], ['/dashboard', 'Sell']] as [string,string][]).map(([href, label]) => (
          <Link key={href} href={href} className={\`px-4 py-2 rounded-full text-sm transition-colors \${pathname === href ? 'bg-[#1a1a1a] text-white' : 'text-gray-500 hover:text-gray-300'}\`}>{label}</Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/search" className="text-gray-500 hover:text-gray-300" aria-label="Search"><Search size={18} /></Link>
        <Link href="/cart" className="relative text-gray-500 hover:text-gray-300" aria-label="Cart">
          <ShoppingBag size={18} />
          {count() > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#5DCAA5] text-[#04342C] text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">{count()}</span>}
        </Link>
        {isLoaded && (user ? <UserButton afterSignOutUrl="/" /> : <>
          <SignInButton mode="modal"><button className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</button></SignInButton>
          <SignUpButton mode="modal"><button className="bg-[#5DCAA5] text-[#04342C] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#9FE1CB] transition-colors">Start free</button></SignUpButton>
        </>)}
      </div>
    </nav>
  )
}
