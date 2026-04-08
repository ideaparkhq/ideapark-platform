'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Lightbulb, Calendar, Shield, Star, MessageSquare,
  MapPin, ExternalLink, Eye, ArrowUp, Edit2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { SkillTag } from '@/components/ui/SkillTag'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import type { User, Idea } from '@/types'
import { CATEGORY_LABELS, STAGE_LABELS } from '@/types'
import { formatDate, formatRelativeTime, getStageColor, getCategoryColor, truncate } from '@/lib/utils'

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser } = useUser()
  const supabase = createClient()

  const [profile, setProfile] = useState<User | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'ideas' | 'about'>('ideas')

  const isOwnProfile = currentUser?.id === params.id

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single()

      if (profileError || !profileData) {
        router.push('/ideas')
        return
      }

      setProfile(profileData)

      // Fetch user's public ideas
      const { data: ideasData } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', params.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })

      setIdeas(ideasData || [])
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader />
  if (!profile) return null

  const trustColor = profile.trust_score >= 70 ? 'text-green-400' :
    profile.trust_score >= 40 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar
                src={profile.avatar_url}
                name={profile.name || profile.email}
                size="xl"
                foundingMember={profile.is_founding_member}
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                      {profile.name || 'Anonymous'}
                      {profile.is_founding_member && (
                        <Badge variant="brand" size="md" className="gap-1">
                          <Star className="w-3.5 h-3.5" />
                          Founding Member
                        </Badge>
                      )}
                    </h1>
                    <p className="text-dark-400 mt-1 capitalize">
                      {profile.role.replace('_', ' ')}
                      {profile.plan !== 'free' && (
                        <> · <span className="text-brand-400 capitalize">{profile.plan} Plan</span></>
                      )}
                    </p>
                  </div>

                  {isOwnProfile ? (
                    <Link href="/onboarding">
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                    </Link>
                  ) : currentUser && (
                    <Link href={`/messages?to=${profile.id}`}>
                      <Button size="sm" className="gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Message
                      </Button>
                    </Link>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-dark-300 mt-3 leading-relaxed">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Shield className={`w-4 h-4 ${trustColor}`} />
                    <span className="text-dark-300">Trust Score:</span>
                    <span className={`font-semibold ${trustColor}`}>{profile.trust_score}/100</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-dark-400">
                    <Lightbulb className="w-4 h-4" />
                    {ideas.length} idea{ideas.length !== 1 ? 's' : ''} posted
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-dark-400">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(profile.created_at)}
                  </div>
                </div>

                {/* Skills */}
                {profile.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <SkillTag key={skill} skill={skill} size="md" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {profile.interests.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="outline" size="sm">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-8 border-b border-dark-800">
          {[
            { key: 'ideas', label: 'Ideas', count: ideas.length },
            { key: 'about', label: 'About' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'ideas' | 'about')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-dark-400 hover:text-white'
              }`}
            >
              {tab.label}
              {'count' in tab && tab.count !== undefined && (
                <span className="ml-1.5 text-xs text-dark-500">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'ideas' && (
            <div>
              {ideas.length === 0 ? (
                <EmptyState
                  icon={<Lightbulb className="w-12 h-12" />}
                  title={isOwnProfile ? "You haven't posted any ideas yet" : "No public ideas"}
                  description={isOwnProfile
                    ? "Share your first idea with the community and find builders to bring it to life."
                    : "This user hasn't posted any public ideas yet."
                  }
                  action={isOwnProfile ? (
                    <Link href="/ideas/new">
                      <Button>Post Your First Idea</Button>
                    </Link>
                  ) : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ideas.map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        hover
                        onClick={() => router.push(`/ideas/${idea.id}`)}
                        className="p-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getCategoryColor(idea.category)} size="sm">
                            {CATEGORY_LABELS[idea.category]}
                          </Badge>
                          <Badge className={getStageColor(idea.stage)} size="sm">
                            {STAGE_LABELS[idea.stage]}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-white mb-2">{idea.title}</h3>
                        <p className="text-dark-400 text-sm line-clamp-2 mb-3">
                          {truncate(idea.problem, 120)}
                        </p>
                        <div className="flex items-center gap-3 text-dark-500 text-xs">
                          <span className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            {idea.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {idea.views}
                          </span>
                          <span>{formatRelativeTime(idea.created_at)}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-dark-500">Role</dt>
                    <dd className="text-dark-200 capitalize mt-1">{profile.role.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-dark-500">Plan</dt>
                    <dd className="text-dark-200 capitalize mt-1">{profile.plan}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-dark-500">Member Since</dt>
                    <dd className="text-dark-200 mt-1">{formatDate(profile.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-dark-500">Trust Score</dt>
                    <dd className="mt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-dark-800 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              profile.trust_score >= 70 ? 'bg-green-500' :
                              profile.trust_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${profile.trust_score}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${trustColor}`}>
                          {profile.trust_score}/100
                        </span>
                      </div>
                    </dd>
                  </div>
                </dl>
              </Card>

              {profile.skills.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} size="md" />
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
