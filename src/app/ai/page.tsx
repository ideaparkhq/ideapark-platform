'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, Sparkles, FileText, Zap, Send, Loader2,
  CheckCircle2, AlertCircle, CreditCard
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import Link from 'next/link'

type Tab = 'validator' | 'business-plan'

interface ValidationResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  marketFit: string
  recommendation: string
}

interface BusinessPlanResult {
  executiveSummary: string
  marketAnalysis: string
  revenueModel: string
  goToMarket: string
  financialProjections: string
  risks: string
}

export default function AIPage() {
  const { user, loading: userLoading } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('validator')
  const [validatorInput, setValidatorInput] = useState('')
  const [planInput, setPlanInput] = useState('')
  const [validatorResult, setValidatorResult] = useState<ValidationResult | null>(null)
  const [planResult, setPlanResult] = useState<BusinessPlanResult | null>(null)
  const [validatorLoading, setValidatorLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const creditsUsed = user ? (user.ai_credits !== undefined ? Math.max(0, 5 - user.ai_credits) : 0) : 0
  const creditsRemaining = user ? user.ai_credits : 5

  const handleValidate = async () => {
    if (!validatorInput.trim() || !user) return
    setValidatorLoading(true)
    setError(null)
    setValidatorResult(null)

    try {
      const res = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: validatorInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Validation failed')
      setValidatorResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setValidatorLoading(false)
    }
  }

  const handleGeneratePlan = async () => {
    if (!planInput.trim() || !user) return
    setPlanLoading(true)
    setError(null)
    setPlanResult(null)

    try {
      const res = await fetch('/api/ai/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: planInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setPlanResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setPlanLoading(false)
    }
  }

  if (userLoading) return <PageLoader />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Brain className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to use AI tools</h2>
          <p className="text-dark-400 mb-6">
            Validate ideas and generate business plans with our AI assistant.
          </p>
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'validator' as Tab, label: 'Idea Validator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'business-plan' as Tab, label: 'Business Plan Generator', icon: <FileText className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                <Brain className="w-8 h-8 text-brand-400" />
                AI Assistant
              </h1>
              <p className="mt-2 text-dark-400 text-lg">
                Validate your ideas and generate business plans in seconds.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-900 border border-dark-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-dark-300">
                <span className="text-white font-semibold">{creditsRemaining}</span> credits remaining
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null) }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Idea Validator Tab */}
        {activeTab === 'validator' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Validate Your Idea</h2>
              <p className="text-dark-400 text-sm mb-4">
                Describe your idea in detail — the problem, your solution, and target market. 
                Our AI will analyze viability, market fit, and potential challenges.
              </p>
              <Textarea
                value={validatorInput}
                onChange={(e) => setValidatorInput(e.target.value)}
                placeholder="Describe your idea... What problem does it solve? Who is your target customer? How does your solution work?"
                className="min-h-[160px]"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-dark-500">
                  {validatorInput.length > 0 ? `${validatorInput.length} characters` : 'Minimum 50 characters recommended'}
                </span>
                <Button
                  onClick={handleValidate}
                  disabled={validatorInput.trim().length < 20 || validatorLoading || creditsRemaining <= 0}
                  loading={validatorLoading}
                >
                  {validatorLoading ? 'Analyzing...' : 'Validate Idea'}
                  {!validatorLoading && <Sparkles className="w-4 h-4" />}
                </Button>
              </div>
            </Card>

            {validatorResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Score Card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Viability Score</h3>
                    <div className={`text-3xl font-bold ${
                      validatorResult.score >= 80 ? 'text-green-400' :
                      validatorResult.score >= 60 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {validatorResult.score}/100
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        validatorResult.score >= 80 ? 'bg-green-500' :
                        validatorResult.score >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${validatorResult.score}%` }}
                    />
                  </div>
                </Card>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {validatorResult.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Challenges</h3>
                    <ul className="space-y-2">
                      {validatorResult.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Market Fit & Recommendation */}
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Market Fit</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{validatorResult.marketFit}</p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">Recommendation</h3>
                  <p className="text-dark-300 text-sm leading-relaxed">{validatorResult.recommendation}</p>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Business Plan Tab */}
        {activeTab === 'business-plan' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Generate a Business Plan</h2>
              <p className="text-dark-400 text-sm mb-4">
                Provide your idea details and our AI will generate a comprehensive business plan 
                covering market analysis, revenue model, go-to-market strategy, and more.
              </p>
              <Textarea
                value={planInput}
                onChange={(e) => setPlanInput(e.target.value)}
                placeholder="Describe your business idea in detail... Include the problem, solution, target audience, and any competitive advantages you have."
                className="min-h-[160px]"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-dark-500">
                  {planInput.length > 0 ? `${planInput.length} characters` : 'More detail = better results'}
                </span>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={planInput.trim().length < 20 || planLoading || creditsRemaining <= 0}
                  loading={planLoading}
                >
                  {planLoading ? 'Generating...' : 'Generate Plan'}
                  {!planLoading && <FileText className="w-4 h-4" />}
                </Button>
              </div>
            </Card>

            {planResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {[
                  { title: 'Executive Summary', content: planResult.executiveSummary },
                  { title: 'Market Analysis', content: planResult.marketAnalysis },
                  { title: 'Revenue Model', content: planResult.revenueModel },
                  { title: 'Go-to-Market Strategy', content: planResult.goToMarket },
                  { title: 'Financial Projections', content: planResult.financialProjections },
                  { title: 'Risks & Mitigation', content: planResult.risks },
                ].map((section, i) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className="p-6">
                      <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <p className="text-dark-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Credits Warning */}
        {creditsRemaining <= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <Card className="p-6 border-amber-500/30 text-center">
              <CreditCard className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No credits remaining</h3>
              <p className="text-dark-400 text-sm mb-4">
                You&apos;ve used all your AI credits for this month. Upgrade your plan for more.
              </p>
              <Link href="/settings/billing">
                <Button>Upgrade Plan</Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
