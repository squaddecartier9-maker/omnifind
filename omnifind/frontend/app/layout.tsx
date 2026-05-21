import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OmniFind — Find anything, from everywhere',
  description: 'One search across every store. The best price, instantly.',
  openGraph: {
    title: 'OmniFind',
    description: 'One search. Every store. The best price.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#111', color: '#fff', border: '0.5px solid #333' }
          }} />
        </body>
      </html>
    </ClerkProvider>
  )
}
