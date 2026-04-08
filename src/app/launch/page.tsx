'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const placeholders = [
  'A subscription box for pet owners that delivers monthly themed toys based on dog size...',
  'An AI tutor that creates personalized study plans for college students...',
  'A marketplace connecting local chefs with people who want home-cooked meals...',
  'A Chrome extension that summarizes any webpage into bullet points...',
  'A fitness app that builds workouts around equipment you actually have at home...',
]

export default function LaunchPage() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [targetCustomer, setTargetCustomer] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [differentiator, setDifferentiator] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    const saved = sessionStorage.getItem('ideapark_idea')
    if (saved) {
      setIdea(saved)
      sessionStorage.removeItem('ideapark_idea')
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % placeholders.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ideas/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_input: idea.trim(),
          target_customer: targetCustomer.trim() || null,
          price_range: priceRange.trim() || null,
          differentiator: differentiator.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit idea')
      }

      router.push(`/launch/${data.id}/processing`)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-24 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-glow opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI-powered business builder
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            What&apos;s your idea?
          </h1>
          <p className="text-white/40 text-lg">
            Describe it in a few sentences. AI handles the rest.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main textarea */}
          <div className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={placeholders[placeholderIdx]}
              rows={5}
              className="w-full px-6 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all duration-300 resize-none"
              autoFocus
            />
            <div className="absolute bottom-3 right-3 text-xs text-white/20">
              {idea.length}/500
            </div>
          </div>

          {/* Optional details toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-white/30 hover:text-white/50 transition-colors mx-auto"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Hide' : 'Add more'} details (optional)
          </button>

          {/* Optional fields */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm text-white/40 mb-2">Target customer</label>
                  <input
                    type="text"
                    value={targetCustomer}
                    onChange={(e) => setTargetCustomer(e.target.value)}
                    placeholder="e.g., Dog owners aged 25-45 in urban areas"
                    className="w-full px-5 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-2">Price range</label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g., $29-49/month"
                    className="w-full px-5 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-2">What makes it different?</label>
                  <input
                    type="text"
                    value={differentiator}
                    onChange={(e) => setDifferentiator(e.target.value)}
                    placeholder="e.g., Personalized by dog size and breed"
                    className="w-full px-5 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all duration-300 text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!idea.trim() || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-semibold rounded-2xl glow-cta hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-40 disabled:hover:shadow-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Build My Business
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-white/20 mb-3">Need inspiration? Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['AI resume builder', 'Pet subscription box', 'Meal prep service', 'Coding bootcamp'].map((example) => (
              <button
                key={example}
                onClick={() => setIdea(example)}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
