'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Lightbulb, FolderKanban, DollarSign,
  TrendingUp, ArrowUp, Eye, Clock, Shield,
  BarChart3, Activity
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'

interface Stats {
  totalUsers: number
  ideasPosted: number
  activeProjects: number
  revenue: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  plan: string
  created_at: string
  is_founding_member: boolean
}

interface TrendingIdea {
  id: string
  title: string
  upvotes: number
  views: number
  created_at: string
}

export default function AdminPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    ideasPosted: 0,
    activeProjects: 0,
    revenue: 0,
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [trendingIdeas, setTrendingIdeas] = useState<TrendingIdea[]>([])
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
      const [usersRes, ideasRes, projectsRes, recentUsersRes, trendingRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('ideas').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
        supabase.from('users').select('id, name, email, plan, created_at, is_founding_member').order('created_at', { ascending: false }).limit(10),
        supabase.from('ideas').select('id, title, upvotes, views, created_at').order('upvotes', { ascending: false }).limit(10),
      ])

      setStats({
        totalUsers: usersRes.count || 0,
        ideasPosted: ideasRes.count || 0,
        activeProjects: projectsRes.count || 0,
        revenue: 0,
      })

      setRecentUsers(recentUsersRes.data || [])
      setTrendingIdeas(trendingRes.data || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading || loading) return <PageLoader />

  if (!user || user.email !== 'mfunkthomaz@gmail.com') return null

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <Users className="w-6 h-6" />, color: 'text-brand-400', bgColor: 'bg-brand-600/10', borderColor: 'border-brand-500/20' },
    { label: 'Ideas Posted', value: stats.ideasPosted.toLocaleString(), icon: <Lightbulb className="w-6 h-6" />, color: 'text-amber-400', bgColor: 'bg-amber-600/10', borderColor: 'border-amber-500/20' },
    { label: 'Active Projects', value: stats.activeProjects.toLocaleString(), icon: <FolderKanban className="w-6 h-6" />, color: 'text-green-400', bgColor: 'bg-green-600/10', borderColor: 'border-green-500/20' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'text-cyan-400', bgColor: 'bg-cyan-600/10', borderColor: 'border-cyan-500/20' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Founder Dashboard</h1>
              <p className="text-dark-400 text-sm">IdeaPark at a glance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-dark-400 mt-0.5">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Signups */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-400" />
                Recent Signups
              </h2>
              <Badge variant="default" size="sm">{recentUsers.length} latest</Badge>
            </div>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-dark-500 text-sm text-center py-4">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-2 border-b border-dark-800 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{u.name}</span>
                        {u.is_founding_member && (
                          <Badge variant="brand" size="sm">Founder</Badge>
                        )}
                      </div>
                      <span className="text-xs text-dark-500 truncate block">{u.email}</span>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <Badge variant="default" size="sm">{u.plan}</Badge>
                      <div className="text-xs text-dark-500 mt-1">
                        {formatRelativeTime(u.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Trending Ideas */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Top Trending Ideas
              </h2>
              <Badge variant="default" size="sm">By upvotes</Badge>
            </div>
            <div className="space-y-3">
              {trendingIdeas.length === 0 ? (
                <p className="text-dark-500 text-sm text-center py-4">No ideas posted yet</p>
              ) : (
                trendingIdeas.map((idea, i) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="flex items-center justify-between py-2 border-b border-dark-800 last:border-0 hover:bg-dark-800/50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-dark-500 w-5 text-right shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-white truncate">{idea.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-500 shrink-0 ml-4">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        {idea.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {idea.views}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-brand-400" />
              User Growth
            </h2>
            <div className="h-48 flex items-center justify-center rounded-lg bg-dark-800/50 border border-dark-700">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                <p className="text-sm text-dark-500">Chart renders with live data</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Idea Activity
            </h2>
            <div className="h-48 flex items-center justify-center rounded-lg bg-dark-800/50 border border-dark-700">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-dark-600 mx-auto mb-2" />
                <p className="text-sm text-dark-500">Chart renders with live data</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
