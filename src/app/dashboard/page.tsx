'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Lightbulb, Users, Zap, MessageSquare, TrendingUp, Plus,
  ArrowRight, Sparkles, Eye, Star, Target
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { Idea } from '@/types'
import { formatRelativeTime, getStageColor, getCategoryColor } from '@/lib/utils'
import { CATEGORY_LABELS, STAGE_LABELS } from '@/types'

export default function DashboardPage() {
  const { user, loading } = useUser()
  const supabase = createClient()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [myIdeas, setMyIdeas] = useState<Idea[]>([])
  const [stats, setStats] = useState({
    ideasPosted: 0,
    matches: 0,
    messagesUnread: 0,
    aiCreditsUsed: 0,
  })

  useEffect(() => {
    if (!user) return

    async function loadDashboard() {
      // Fetch recent ideas
      const { data: recentIdeas } = await supabase
        .from('ideas')
        .select('*, user:users(*)')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(6)

      if (recentIdeas) setIdeas(recentIdeas)

      // Fetch user's ideas
      const { data: userIdeas } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (userIdeas) setMyIdeas(userIdeas)

      // Fetch stats
      const { count: ideaCount } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('builder_id', user.id)

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)

      setStats({
        ideasPosted: ideaCount || 0,
        matches: matchCount || 0,
        messagesUnread: unreadCount || 0,
        aiCreditsUsed: 0,
      })
    }

    loadDashboard()
  }, [user])

  if (loading) return <PageLoader />
  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {getGreeting()}, {user.name?.split(' ')[0] || 'there'}
              {user.is_founding_member && <Star className="inline w-5 h-5 text-amber-400 ml-2" />}
            </h1>
            <p className="text-dark-400">
              {user.role === 'idea_holder'
                ? 'Your ideas are waiting for the right builders.'
                : user.role === 'builder'
                ? 'New ideas are waiting for your skills.'
                : 'Ready to build something great?'}
            </p>
          </div>
          <Link href="/ideas/new">
            <Button>
              <Plus className="w-4 h-4" />
              Post an Idea
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ideas Posted', value: stats.ideasPosted, icon: Lightbulb, color: 'text-brand-400' },
          { label: 'Matches', value: stats.matches, icon: Target, color: 'text-green-400' },
          { label: 'Unread Messages', value: stats.messagesUnread, icon: MessageSquare, color: 'text-cyan-400' },
          { label: 'AI Credits', value: user.ai_credits, icon: Zap, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-dark-800 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-dark-400">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link href="/ideas/new">
          <Card hover className="p-5 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-brand-600/10 text-brand-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Post a New Idea</h3>
            </div>
            <p className="text-sm text-dark-400">Share your concept and find the builders to make it real.</p>
          </Card>
        </Link>

        <Link href="/ai">
          <Card hover className="p-5 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <p className="text-sm text-dark-400">Validate ideas, generate business plans, and analyze markets.</p>
          </Card>
        </Link>

        <Link href="/ideas">
          <Card hover className="p-5 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-600/10 text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Browse Ideas</h3>
            </div>
            <p className="text-sm text-dark-400">Discover ideas looking for your skills and get matched.</p>
          </Card>
        </Link>
      </div>

      {/* Recent Ideas Feed */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Latest Ideas</h2>
          <Link href="/ideas" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ideas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`}>
                <Card hover className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(idea.category)}>
                      {CATEGORY_LABELS[idea.category]}
                    </Badge>
                    <Badge className={getStageColor(idea.stage)}>
                      {STAGE_LABELS[idea.stage]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-1">{idea.title}</h3>
                  <p className="text-sm text-dark-400 line-clamp-2 mb-3">{idea.problem}</p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span>{idea.user?.name || 'Anonymous'}</span>
                    <span>{formatRelativeTime(idea.created_at)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Lightbulb className="w-10 h-10 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 mb-4">No ideas posted yet. Be the first!</p>
            <Link href="/ideas/new">
              <Button size="sm">Post the First Idea</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* My Ideas */}
      {myIdeas.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Your Ideas</h2>
          <div className="space-y-3">
            {myIdeas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`}>
                <Card hover className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getStageColor(idea.stage)} size="sm">
                        {STAGE_LABELS[idea.stage]}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{idea.title}</h3>
                      <p className="text-xs text-dark-400">{formatRelativeTime(idea.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-dark-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {idea.views}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
