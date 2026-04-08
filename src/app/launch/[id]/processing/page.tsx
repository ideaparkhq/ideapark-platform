'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Circle, Loader2, Sparkles } from 'lucide-react'

interface ProcessingStep {
  label: string
  status: 'pending' | 'active' | 'complete'
}

const initialSteps: ProcessingStep[] = [
  { label: 'Analyzing market demand', status: 'pending' },
  { label: 'Evaluating competition', status: 'pending' },
  { label: 'Designing monetization model', status: 'pending' },
  { label: 'Generating brand identity', status: 'pending' },
  { label: 'Building landing page', status: 'pending' },
  { label: 'Creating marketing assets', status: 'pending' },
]

function StepIcon({ status }: { status: string }) {
  switch (status) {
    case 'complete':
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        </motion.div>
      )
    case 'active':
      return (
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
          <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
        </div>
      )
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Circle className="w-2 h-2 text-white/20" />
        </div>
      )
  }
}

export default function ProcessingPage() {
  const router = useRouter()
  const params = useParams()
  const ideaId = params.id as string

  const [steps, setSteps] = useState(initialSteps)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [validationDone, setValidationDone] = useState(false)
  const [buildDone, setBuildDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Run validation
  const runValidation = useCallback(async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/validate`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Validation failed')
      }
      setValidationDone(true)
    } catch (err: any) {
      setError(err.message)
    }
  }, [ideaId])

  // Run build
  const runBuild = useCallback(async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/build`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Build failed')
      }
      setBuildDone(true)
    } catch (err: any) {
      setError(err.message)
    }
  }, [ideaId])

  // Start the pipeline
  useEffect(() => {
    runValidation()
  }, [runValidation])

  // When validation is done, start build
  useEffect(() => {
    if (validationDone) {
      runBuild()
    }
  }, [validationDone, runBuild])

  // Animate steps progressively (visual pacing independent of API)
  useEffect(() => {
    if (error) return

    const stepDurations = [2500, 2000, 2500, 3000, 4000, 3000]
    let totalElapsed = 0

    const timers: NodeJS.Timeout[] = []

    for (let i = 0; i < steps.length; i++) {
      // Start step
      const startTimer = setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => ({
          ...s,
          status: idx === i ? 'active' : idx < i ? 'complete' : 'pending',
        })))
        setCurrentStep(i)
      }, totalElapsed)
      timers.push(startTimer)

      totalElapsed += stepDurations[i]

      // Complete step
      if (i < steps.length - 1) {
        const completeTimer = setTimeout(() => {
          setSteps(prev => prev.map((s, idx) => ({
            ...s,
            status: idx <= i ? 'complete' : s.status,
          })))
        }, totalElapsed - 200)
        timers.push(completeTimer)
      }
    }

    return () => timers.forEach(clearTimeout)
  }, [error])

  // Progress bar
  useEffect(() => {
    if (error) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95 && !buildDone) return 95
        if (buildDone && prev < 100) return Math.min(prev + 2, 100)
        return Math.min(prev + 0.6, 95)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [buildDone, error])

  // Redirect when everything is done
  useEffect(() => {
    if (buildDone && progress >= 100) {
      // Complete all steps visually
      setSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })))
      const timer = setTimeout(() => {
        router.push(`/ideas/${ideaId}`)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [buildDone, progress, router, ideaId])

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-24 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-glow opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-hero-glow-violet opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {/* Brain icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 mb-8"
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Building your business
        </h1>
        <p className="text-white/40 text-lg mb-12">
          AI is working its magic. This takes about 2 minutes.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4 text-left mb-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-500 ${
                step.status === 'active'
                  ? 'bg-blue-500/5 border border-blue-500/20'
                  : step.status === 'complete'
                  ? 'bg-white/[0.02] border border-transparent'
                  : 'border border-transparent opacity-40'
              }`}
            >
              <StepIcon status={step.status} />
              <span className={`text-sm font-medium ${
                step.status === 'active' ? 'text-white' :
                step.status === 'complete' ? 'text-white/60' :
                'text-white/30'
              }`}>
                {step.label}
                {step.status === 'active' && '...'}
              </span>
              {step.status === 'complete' && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto text-xs text-emerald-400/60"
                >
                  Done
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4"
          >
            <p className="font-medium mb-1">Something went wrong</p>
            <p className="text-red-400/60">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setProgress(0)
                setSteps(initialSteps)
                runValidation()
              }}
              className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Progress percentage */}
        <p className="text-sm text-white/20">
          {Math.round(progress)}% complete
        </p>
      </motion.div>
    </div>
  )
}
