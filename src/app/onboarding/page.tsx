'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Welcome to IdeaPark! 🚀')
      router.push('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-glow opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 mb-8"
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          Welcome to IdeaPark
        </h1>
        <p className="text-white/40 text-lg mb-4 max-w-md mx-auto">
          The AI execution engine that turns your ideas into real businesses.
        </p>

        <div className="space-y-4 text-left mb-10 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="text-white font-semibold text-center mb-4">Here&apos;s how it works</h3>
          {[
            { step: '1', title: 'Describe your idea', desc: 'One sentence is all it takes.' },
            { step: '2', title: 'AI validates & builds', desc: 'Market scoring, brand, landing page, marketing — all generated.' },
            { step: '3', title: 'Go live', desc: 'Publish with a real URL and start collecting customers.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-blue-400">{item.step}</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">{item.title}</p>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          disabled={loading}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-semibold rounded-2xl glow-cta hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Setting up...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Let&apos;s Go!
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
