'use client';
import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between px-6 py-3.5 border-b border-line sticky top-0 z-50 bg-ink/95 backdrop-blur-sm">
      <Link href="/" className="text-lg font-medium tracking-tight">
        Omni<span className="text-accent">Find</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link href="/search" className="text-sm text-[#555] hover:text-white px-3 py-1.5 rounded-lg transition-colors">Browse</Link>
        <Link href="/pricing" className="text-sm text-[#555] hover:text-white px-3 py-1.5 rounded-lg transition-colors">Pricing</Link>
        {isSignedIn && (
          <Link href="/dashboard" className="text-sm text-[#555] hover:text-white px-3 py-1.5 rounded-lg transition-colors">Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="text-sm text-[#555] hover:text-white transition-colors">Sign in</button>
            </SignInButton>
            <Link href="/sign-up" className="bg-accent text-accentbg text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#9FE1CB] transition-colors">
              Start free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
