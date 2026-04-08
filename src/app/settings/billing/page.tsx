'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard, Zap, Check, Crown, ArrowRight,
  ExternalLink, Shield, Sparkles
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { PLAN_CONFIGS, type PlanTier } from '@/types'
import Link from 'next/link'

export default function BillingPage() {
  const { user, loading: userLoading } = useUser()
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
          <CreditCard className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to manage billing</h2>
          <p className="text-white/40 mb-6">Access your subscription and payment settings.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const currentPlan = PLAN_CONFIGS[user.plan]
  const tiers: PlanTier[] = ['free', 'pro', 'scale']

  const handleUpgrade = async (tier: PlanTier) => {
    if (tier === user.plan || tier === 'free') return
    setUpgrading(tier)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: tier }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Upgrade error:', err)
    } finally {
      setUpgrading(null)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/create-portal-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Portal error:', err)
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Billing & Plans</h1>
          <p className="mt-2 text-white/40">
            Manage your subscription and credits.
          </p>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{currentPlan.name} Plan</h2>
                <p className="text-white/40 text-sm mt-0.5">
                  {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/month`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-white/60">
                  <span className="text-white font-medium">{user.credits}</span> credits
                </span>
              </div>
              {user.plan !== 'free' && (
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {portalLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Manage Billing
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => {
              const plan = PLAN_CONFIGS[tier]
              const isCurrent = tier === user.plan
              const isDowngrade = tiers.indexOf(tier) < tiers.indexOf(user.plan)
              const popular = tier === 'pro'

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`relative rounded-2xl p-6 flex flex-col ${
                    popular
                      ? 'bg-gradient-to-b from-blue-500/10 to-violet-500/10 border-2 border-blue-500/30'
                      : 'bg-white/[0.03] border border-white/10'
                  } ${isCurrent ? 'ring-2 ring-blue-500/50' : ''} transition-all`}
                >
                  {popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full text-xs font-bold text-white">
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400">
                      Current
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      {plan.price > 0 && <span className="text-white/40 text-sm">/mo</span>}
                    </div>
                    <p className="text-white/30 text-sm mt-1">{plan.credits} credits/month</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-white/60">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm font-medium cursor-default"
                    >
                      Current Plan
                    </button>
                  ) : isDowngrade || tier === 'free' ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/20 text-sm font-medium cursor-default"
                    >
                      {tier === 'free' ? 'Free' : 'Downgrade'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier)}
                      disabled={upgrading === tier}
                      className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        popular
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      } disabled:opacity-50`}
                    >
                      {upgrading === tier ? 'Processing...' : `Upgrade to ${plan.name}`}
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Security Note */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-white/20 shrink-0" />
          <p className="text-white/30 text-sm">
            All payments are securely processed through Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
