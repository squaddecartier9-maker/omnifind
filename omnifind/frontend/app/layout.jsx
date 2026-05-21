import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OmniFind — Find anything, from everywhere',
  description: 'One search across every store. The best price, instantly.',
  openGraph: {
    title: 'OmniFind',
    description: 'One search across every store. The best price, instantly.',
    url: 'https://omnifind.io',
    siteName: 'OmniFind',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
