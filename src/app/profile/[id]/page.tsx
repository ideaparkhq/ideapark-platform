'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Lightbulb, Calendar, Rocket, Eye,
  DollarSign, Globe, ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate, formatNumber, formatCurrency } from '@/lib/utils'
import type { User, Idea, IdeaStatus } from '@/types'
import { STATUS_CONFIG } from '@/types'

function StatusBadge({ status }: { status: IdeaStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useUser()
  const supabase = createClient()

  const [profile, setProfile] = useState<User | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  const isOwnProfile = currentUser?.id === params.id

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!profileData) {
          router.push('/dashboard')
          return
        }

        setProfile(profileData)

        const { data: ideasData } = await supabase
          .from('ideas')
          .select('*')
          .eq('user_id', params.id)
          .order('created_at', { ascending: false })

        setIdeas(ideasData || [])
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) return null

  const liveIdeas = ideas.filter(i => i.status === 'live')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href={isOwnProfile ? '/dashboard' : '/'}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar
              src={profile.avatar_url}
              name={profile.name || profile.email}
              size="xl"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {profile.name || 'Anonymous'}
                  </h1>
                  <p className="text-white/40 mt-1">
                    {profile.email}
                    {profile.plan !== 'free' && (
                      <span className="ml-2 text-blue-400 capitalize">{profile.plan} Plan</span>
                    )}
                  </p>
                </div>

                {isOwnProfile && (
                  <Link
                    href="/settings/billing"
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all"
                  >
                    Settings
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Lightbulb className="w-4 h-4" />
                  <span>{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Globe className="w-4 h-4" />
                  <span>{liveIdeas.length} live</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ideas */}
        <div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            {isOwnProfile ? 'My Ideas' : 'Ideas'}
          </h2>

          {ideas.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-7 h-7 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No ideas yet</h3>
              <p className="text-white/30 text-sm mb-6">
                {isOwnProfile
                  ? 'Launch your first idea and let AI build it for you.'
                  : 'This user hasn\'t launched any ideas yet.'}
              </p>
              {isOwnProfile && (
                <Link
                  href="/launch"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl transition-all"
                >
                  <Rocket className="w-4 h-4" />
                  Launch My First Idea
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {ideas.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
