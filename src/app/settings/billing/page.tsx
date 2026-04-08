'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard, Zap, CheckCircle2, Crown, ArrowRight,
  ExternalLink, Loader2, Shield, Sparkles
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { PLAN_CONFIGS, type PlanTier } from '@/types'
import Link from 'next/link'

const creditPacks = [
  { id: 'credits-5', amount: 50, price: 5, label: '50 Credits', description: 'Quick top-up' },
  { id: 'credits-20', amount: 250, price: 20, label: '250 Credits', description: 'Most popular', popular: true },
  { id: 'credits-50', amount: 750, price: 50, label: '750 Credits', description: 'Best value' },
]

export default function BillingPage() {
  const { user, loading: userLoading } = useUser()
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [buyingCredits, setBuyingCredits] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  if (userLoading) return <PageLoader />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CreditCard className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to manage billing</h2>
          <p className="text-dark-400 mb-6">Access your subscription and payment settings.</p>
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const currentPlan = PLAN_CONFIGS[user.plan]
  const plans: PlanTier[] = ['free', 'basic', 'pro', 'enterprise']

  const handleUpgrade = async (tier: PlanTier) => {
    if (tier === user.plan || tier === 'free') return
    setUpgrading(tier)
    try {
      const res = await fetch('/api/checkout', {
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

  const handleBuyCredits = async (packId: string, price: number) => {
    setBuyingCredits(packId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditPack: packId, price }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Credit purchase error:', err)
    } finally {
      setBuyingCredits(null)
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Billing & Plans</h1>
          <p className="mt-2 text-dark-400 text-lg">
            Manage your subscription, credits, and payment methods.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Current Plan Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">{currentPlan.name} Plan</h2>
                  {user.is_founding_member && (
                    <Badge variant="brand" size="sm">Founding Member</Badge>
                  )}
                </div>
                <p className="text-dark-400 text-sm mt-0.5">
                  {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/month`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-dark-300">
                  <span className="text-white font-medium">{user.ai_credits}</span> AI credits
                </span>
              </div>
              {user.plan !== 'free' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                  loading={portalLoading}
                >
                  <ExternalLink className="w-4 h-4" />
                  Manage Billing
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Upgrade Plans */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Choose Your Plan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((tier, i) => {
              const plan = PLAN_CONFIGS[tier]
              const isCurrent = tier === user.plan
              const isDowngrade = plans.indexOf(tier) < plans.indexOf(user.plan)

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Card
                    className={`relative p-5 h-full flex flex-col ${
                      tier === 'pro' ? 'border-brand-500/50' : ''
                    } ${isCurrent ? 'ring-2 ring-brand-500/50' : ''}`}
                  >
                    {tier === 'pro' && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <Badge variant="brand" size="sm">Most Popular</Badge>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute -top-2.5 right-3">
                        <Badge variant="success" size="sm">Current</Badge>
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                      <div className="mt-1 flex items-baseline gap-0.5">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        {plan.price > 0 && <span className="text-dark-400 text-sm">/mo</span>}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-dark-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : isDowngrade ? (
                      <Button variant="ghost" className="w-full" disabled>
                        Downgrade
                      </Button>
                    ) : tier === 'free' ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Free
                      </Button>
                    ) : (
                      <Button
                        variant={tier === 'pro' ? 'primary' : 'secondary'}
                        className="w-full"
                        onClick={() => handleUpgrade(tier)}
                        loading={upgrading === tier}
                      >
                        {upgrading === tier ? 'Processing...' : `Upgrade to ${plan.name}`}
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Credit Packs */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Buy AI Credit Packs</h2>
          <p className="text-dark-400 text-sm mb-4">
            Need more AI queries? Purchase credit packs that never expire.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {creditPacks.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Card className={`relative p-5 ${pack.popular ? 'border-brand-500/50' : ''}`}>
                  {pack.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge variant="brand" size="sm">Most Popular</Badge>
                    </div>
                  )}
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-brand-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white">{pack.label}</h3>
                    <p className="text-dark-400 text-sm mt-1">{pack.description}</p>
                    <div className="my-4">
                      <span className="text-3xl font-bold text-white">${pack.price}</span>
                    </div>
                    <Button
                      variant={pack.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handleBuyCredits(pack.id, pack.price)}
                      loading={buyingCredits === pack.id}
                    >
                      {buyingCredits === pack.id ? 'Processing...' : 'Purchase'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-dark-400 shrink-0" />
            <p className="text-dark-400 text-sm">
              All payments are securely processed through Stripe. We never store your card details.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
