'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Tag, BookOpen, FileSpreadsheet, Download,
  Star, ArrowRight, Loader2, Search
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

type Category = 'all' | 'business-guides' | 'templates' | 'ebooks'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: Category
  badge?: string
  features: string[]
}

const products: Product[] = [
  {
    id: 'guide-idea-validation',
    title: 'Idea Validation Playbook',
    description: 'A step-by-step guide to validating your startup idea before writing a single line of code. Covers customer discovery, market sizing, and competitive analysis.',
    price: 19,
    category: 'business-guides',
    badge: 'Bestseller',
    features: ['48-page PDF', 'Validation frameworks', 'Real-world case studies'],
  },
  {
    id: 'guide-cofounder',
    title: 'The Co-Founder Agreement Kit',
    description: 'Everything you need to structure a co-founder relationship. Equity splits, vesting schedules, roles, and legal templates included.',
    price: 29,
    category: 'business-guides',
    features: ['Legal templates', 'Equity calculator', 'Vesting schedule guide'],
  },
  {
    id: 'guide-go-to-market',
    title: 'Go-to-Market Strategy Blueprint',
    description: 'Launch your product with confidence. Covers positioning, pricing, channels, and the first 90 days of customer acquisition.',
    price: 24,
    category: 'business-guides',
    features: ['90-day launch plan', 'Channel strategy', 'Pricing frameworks'],
  },
  {
    id: 'template-pitch-deck',
    title: 'Pitch Deck Template Pack',
    description: 'Investor-ready pitch deck templates used by YC-backed startups. Includes Figma and Google Slides formats with speaker notes.',
    price: 14,
    category: 'templates',
    badge: 'Popular',
    features: ['5 deck layouts', 'Figma + Slides', 'Speaker notes included'],
  },
  {
    id: 'template-financial-model',
    title: 'SaaS Financial Model',
    description: 'Plug-and-play financial model for SaaS startups. Three-year projections, unit economics, and investor-ready formatting.',
    price: 39,
    category: 'templates',
    features: ['Excel + Sheets', '3-year projections', 'Unit economics'],
  },
  {
    id: 'template-lean-canvas',
    title: 'Lean Canvas Bundle',
    description: 'Digital Lean Canvas templates with guided prompts. Perfect for brainstorming sessions and early-stage ideation.',
    price: 9,
    category: 'templates',
    features: ['Fillable PDF', 'Notion template', 'Guided prompts'],
  },
  {
    id: 'ebook-builder-mindset',
    title: 'The Builder Mindset',
    description: 'How to think, act, and execute like the founders who actually ship. Practical frameworks from 50+ interviews with successful builders.',
    price: 12,
    category: 'ebooks',
    badge: 'New',
    features: ['180 pages', '50+ founder insights', 'Action worksheets'],
  },
  {
    id: 'ebook-side-project-revenue',
    title: 'Side Project to Revenue',
    description: 'Turn your weekend project into a real business. Covers monetization, growth loops, and the psychology of shipping fast.',
    price: 15,
    category: 'ebooks',
    features: ['140 pages', 'Revenue playbooks', 'Growth frameworks'],
  },
  {
    id: 'ebook-no-code-launch',
    title: 'No-Code Launch Guide',
    description: 'Build and launch your MVP without writing code. Covers the best no-code tools, integrations, and strategies for non-technical founders.',
    price: 17,
    category: 'ebooks',
    features: ['120 pages', 'Tool comparisons', 'Step-by-step tutorials'],
  },
]

const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Products', icon: <ShoppingBag className="w-4 h-4" /> },
  { value: 'business-guides', label: 'Business Guides', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'templates', label: 'Templates', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { value: 'ebooks', label: 'Ebooks', icon: <Download className="w-4 h-4" /> },
]

export default function StorePage() {
  const { user } = useUser()
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const handleBuy = async (product: Product) => {
    setPurchasing(product.id)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, price: product.price }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-brand-400" />
                Store
              </h1>
              <p className="mt-2 text-dark-400 text-lg">
                Resources built for builders. Skip the guesswork, start executing.
              </p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800 border border-transparent'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className="flex flex-col h-full overflow-hidden">
                {/* Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center">
                    {product.category === 'business-guides' && <BookOpen className="w-8 h-8 text-brand-400" />}
                    {product.category === 'templates' && <FileSpreadsheet className="w-8 h-8 text-brand-400" />}
                    {product.category === 'ebooks' && <Download className="w-8 h-8 text-brand-400" />}
                  </div>
                  {product.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="brand" size="sm">{product.badge}</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" size="sm">
                      {categories.find((c) => c.value === product.category)?.label}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {product.title}
                  </h3>

                  <p className="text-dark-400 text-sm mb-4 flex-1 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs text-dark-400 px-2 py-1 rounded-md bg-dark-800 border border-dark-700"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Price + Buy */}
                  <div className="flex items-center justify-between pt-4 border-t border-dark-800">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <Button
                      onClick={() => handleBuy(product)}
                      loading={purchasing === product.id}
                      disabled={purchasing === product.id}
                    >
                      {purchasing === product.id ? 'Processing...' : 'Buy Now'}
                      {purchasing !== product.id && <ArrowRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No products in this category</h3>
            <p className="text-dark-400 text-sm">Check back soon — new resources are added regularly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
