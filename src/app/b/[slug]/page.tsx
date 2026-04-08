'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Lightbulb, Zap } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Idea } from '@/types'

export default function LiveBusinessPage() {
  const params = useParams()
  const slug = params.slug as string
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [captured, setCaptured] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('ideas')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'live')
        .single()

      if (data) {
        setIdea(data)
        // Track visit
        fetch(`/api/b/${slug}/track`, { method: 'POST' }).catch(() => {})
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await fetch(`/api/b/${slug}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      setCaptured(true)
    } catch {
      // Silently fail
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Business Not Found</h1>
          <p className="text-white/40 mb-8">This business doesn&apos;t exist or hasn&apos;t been published yet.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            Go to IdeaPark
          </Link>
        </div>
      </div>
    )
  }

  // If there's a full generated landing page HTML, render it
  if (idea.landing_page_html) {
    // Inject the email capture form and IdeaPark badge
    const injectedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${idea.business_name || 'Business'} - ${idea.tagline || ''}</title>
        <style>
          .ideapark-badge {
            position: fixed;
            bottom: 16px;
            right: 16px;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 8px 14px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: Inter, system-ui, sans-serif;
            font-size: 12px;
            color: rgba(255,255,255,0.6);
            text-decoration: none;
            transition: all 0.2s;
            z-index: 9999;
          }
          .ideapark-badge:hover {
            color: white;
            border-color: rgba(255,255,255,0.2);
          }
          .ideapark-badge svg {
            width: 14px;
            height: 14px;
          }
        </style>
      </head>
      <body>
        ${idea.landing_page_html}
        <a href="https://ideaparkhq.com" target="_blank" class="ideapark-badge">
          ⚡ Built with IdeaPark
        </a>
      </body>
      </html>
    `

    return (
      <div className="min-h-screen bg-white relative">
        <iframe
          srcDoc={injectedHtml}
          className="w-full min-h-screen border-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
          title={idea.business_name || 'Business'}
        />

        {/* Email capture overlay (if not embedded in page) */}
        {!captured && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-40">
            <form onSubmit={handleCapture} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? '...' : 'Join'}
              </button>
            </form>
          </div>
        )}

        {captured && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium z-40">
            ✓ You&apos;re on the list!
          </div>
        )}
      </div>
    )
  }

  // Fallback: minimal business page
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{idea.business_name}</h1>
        {idea.tagline && (
          <p className="text-xl text-white/50 mb-8">{idea.tagline}</p>
        )}
        {idea.value_proposition && (
          <p className="text-white/40 mb-8">{idea.value_proposition}</p>
        )}

        {!captured ? (
          <form onSubmit={handleCapture} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/40"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <p className="text-emerald-400 font-medium">✓ You&apos;re on the list!</p>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-12 text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          <Zap className="w-3 h-3" />
          Built with IdeaPark
        </Link>
      </div>
    </div>
  )
}
