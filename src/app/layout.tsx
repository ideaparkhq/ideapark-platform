import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'IdeaPark — Where Ideas Find Their Builders',
  description: 'The execution layer for the world\'s ideas. Connect with builders, validate concepts with AI, and turn your vision into reality. Stop consuming. Start building.',
  keywords: ['startup', 'ideas', 'builders', 'co-founder', 'innovation', 'collaboration', 'AI', 'business plan'],
  openGraph: {
    title: 'IdeaPark — Where Ideas Find Their Builders',
    description: 'Stop consuming. Start building. The execution layer for the world\'s ideas.',
    url: 'https://ideaparkhq.com',
    siteName: 'IdeaPark',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaPark — Where Ideas Find Their Builders',
    description: 'Stop consuming. Start building.',
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
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
