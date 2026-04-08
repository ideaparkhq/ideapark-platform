export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'IdeaPark — Turn Your Idea Into a Business',
  description: 'Turn your idea into a real business in days — using AI. No code. No team. Just execution. The world\'s first AI execution engine.',
  keywords: ['AI', 'startup', 'business launch', 'landing page generator', 'idea validation', 'execution engine'],
  openGraph: {
    title: 'IdeaPark — Turn Your Idea Into a Business',
    description: 'No code. No team. Just execution. Turn your idea into a live business in minutes.',
    url: 'https://ideaparkhq.com',
    siteName: 'IdeaPark',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaPark — Turn Your Idea Into a Business',
    description: 'No code. No team. Just execution.',
    creator: '@ideaparkhq',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  )
}
