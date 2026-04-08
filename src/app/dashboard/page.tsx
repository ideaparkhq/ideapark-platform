'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb, Globe, Eye, DollarSign, Rocket, Plus,
  ArrowRight, TrendingUp, ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Idea, IdeaStatus, STATUS_CONFIG } from '@/types'
import { STATUS_CONFIG as statusConfig } from '@/types'

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all duration-300"
    >
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-white/30">{label}</p>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: IdeaStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      {config.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {config.glow && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />}
      {config.label}
    </span>
  )
}

function IdeaRow({ idea, delay }: { idea: Idea; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={`/ideas/${idea.id}`}
        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-white/[0.06] flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {idea.business_name || idea.raw_input.slice(0, 50)}
            </p>
            {idea.tagline && (
              <p className="text-white/30 text-xs truncate mt-0.5">{idea.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <StatusBadge status={idea.status} />
          {idea.status === 'live' && (
            <div className="hidden sm:flex items-center gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(idea.visitors)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(idea.revenue)}
              </span>
            </div>
          )}
          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchIdeas() {
      if (!user) return
      const { data } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setIdeas(data)
      setLoading(false)
    }
    if (user) fetchIdeas()
  }, [user])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-white/5 rounded-lg mb-8 animate-shimmer" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/[0.02] animate-shimmer" />
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.02] animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const liveIdeas = ideas.filter(i => i.status === 'live')
  const totalVisitors = ideas.reduce((sum, i) => sum + i.visitors, 0)
  const totalRevenue = ideas.reduce((sum, i) => sum + Number(i.revenue), 0)

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-hero-glow opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-white"
            >
              {user?.name ? `Hey ${user.name.split(' ')[0]}` : 'Dashboard'}
            </motion.h1>
            {liveIdeas.length > 0 && (
              <p className="text-white/30 text-sm mt-1">
                You have {liveIdeas.length} {liveIdeas.length === 1 ? 'business' : 'businesses'} live
              </p>
            )}
          </div>
          <Link
            href="/launch"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Launch New Idea</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Lightbulb}
            label="Ideas"
            value={ideas.length.toString()}
            color="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            icon={Globe}
            label="Live"
            value={liveIdeas.length.toString()}
            color="bg-emerald-500/10 text-emerald-400"
          />
          <StatCard
            icon={Eye}
            label="Visitors"
            value={formatNumber(totalVisitors)}
            color="bg-violet-500/10 text-violet-400"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={formatCurrency(totalRevenue)}
            color="bg-amber-500/10 text-amber-400"
          />
        </div>

        {/* Ideas list */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">My Ideas</h2>
          </div>

          {ideas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-7 h-7 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No ideas yet</h3>
              <p className="text-white/30 text-sm mb-6 max-w-sm mx-auto">
                Your first business is one sentence away. Describe an idea and let AI build it for you.
              </p>
              <Link
                href="/launch"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <Rocket className="w-4 h-4" />
                Launch My First Idea
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <IdeaRow key={idea.id} idea={idea} delay={i * 0.05} />
              ))}
            </div>
          )}
        </div>

        {/* Trending section */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending on IdeaPark
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'AI tutoring platform', time: '2h ago', stat: '340 signups' },
              { name: 'Sustainable packaging finder', time: '48hrs', stat: '$2.1K revenue' },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{item.name}</p>
                    <p className="text-white/30 text-xs mt-1">
                      Launched {item.time} · {item.stat}
                    </p>
                  </div>
                  <Rocket className="w-4 h-4 text-white/10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
