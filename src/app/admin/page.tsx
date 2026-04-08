'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Lightbulb, Globe, DollarSign,
  TrendingUp, Eye, Shield, BarChart3, Activity
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRelativeTime, formatNumber, formatCurrency } from '@/lib/utils'

interface Stats {
  totalUsers: number
  ideasPosted: number
  liveIdeas: number
  totalRevenue: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  plan: string
  created_at: string
}

interface TopIdea {
  id: string
  business_name: string | null
  raw_input: string
  status: string
  visitors: number
  signups: number
  created_at: string
}

export default function AdminPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    ideasPosted: 0,
    liveIdeas: 0,
    totalRevenue: 0,
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [topIdeas, setTopIdeas] = useState<TopIdea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && (!user || user.email !== 'mfunkthomaz@gmail.com')) {
      router.push('/')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, userLoading])

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ideasRes, liveRes, recentUsersRes, topIdeasRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('ideas').select('id', { count: 'exact', head: true }),
        supabase.from('ideas').select('id', { count: 'exact', head: true }).eq('status', 'live'),
        supabase.from('users').select('id, name, email, plan, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('ideas').select('id, business_name, raw_input, status, visitors, signups, created_at').order('visitors', { ascending: false }).limit(10),
      ])

      setStats({
        totalUsers: usersRes.count || 0,
        ideasPosted: ideasRes.count || 0,
        liveIdeas: liveRes.count || 0,
        totalRevenue: 0,
      })

      setRecentUsers(recentUsersRes.data || [])
      setTopIdeas(topIdeasRes.data || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.email !== 'mfunkthomaz@gmail.com') return null

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Ideas Posted', value: stats.ideasPosted.toLocaleString(), icon: Lightbulb, color: 'bg-amber-500/10 text-amber-400' },
    { label: 'Live Businesses', value: stats.liveIdeas.toLocaleString(), icon: Globe, color: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-violet-500/10 text-violet-400' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Founder Dashboard</h1>
            <p className="text-white/40 text-sm">IdeaPark at a glance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/30 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              Recent Signups
            </h2>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-white truncate block">{u.name}</span>
                      <span className="text-xs text-white/30 truncate block">{u.email}</span>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">{u.plan}</span>
                      <div className="text-xs text-white/20 mt-1">
                        {formatRelativeTime(u.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Ideas */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Top Ideas
            </h2>
            <div className="space-y-3">
              {topIdeas.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No ideas yet</p>
              ) : (
                topIdeas.map((idea, i) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-white/20 w-5 text-right shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-white truncate">
                        {idea.business_name || idea.raw_input.slice(0, 40)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/30 shrink-0 ml-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(idea.visitors)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {idea.signups}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
