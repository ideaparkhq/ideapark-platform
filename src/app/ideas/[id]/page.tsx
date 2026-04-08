'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowUp, Eye, Users, Calendar, Shield, Lock,
  MessageSquare, Sparkles, Share2, Flag, ExternalLink, Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { SkillTag } from '@/components/ui/SkillTag'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { CATEGORY_LABELS, STAGE_LABELS, type Idea } from '@/types'
import { formatDate, formatRelativeTime, getStageColor, getCategoryColor } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()

  const [idea, setIdea] = useState<Idea & { has_applied?: boolean; match_count?: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyModal, setApplyModal] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  useEffect(() => {
    fetchIdea()
  }, [params.id])

  const fetchIdea = async () => {
    try {
      const res = await fetch(`/api/ideas/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setIdea(data)
      } else {
        router.push('/ideas')
      }
    } catch (error) {
      console.error('Failed to fetch idea:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpvote = async () => {
    if (!user || !idea) return
    setUpvoted(!upvoted)
    setIdea({ ...idea, upvotes: idea.upvotes + (upvoted ? -1 : 1) })

    await supabase
      .from('ideas')
      .update({ upvotes: idea.upvotes + (upvoted ? -1 : 1) })
      .eq('id', idea.id)
  }

  const handleApply = async () => {
    if (!user || !idea) return
    setApplying(true)

    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          idea_id: idea.id,
          builder_id: user!.id,
          message: applyMessage || null,
          compatibility_score: calculateCompatibility(),
        })

      if (error) {
        if (error.code === '23505') {
          toast.error('You\'ve already applied to this idea')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Application sent! The idea owner will review it.')
      setApplyModal(false)
      setIdea({ ...idea, has_applied: true, match_count: (idea.match_count || 0) + 1 })
    } catch (error) {
      toast.error('Failed to send application')
    } finally {
      setApplying(false)
    }
  }

  const calculateCompatibility = (): number => {
    if (!user || !idea) return 0
    const userSkills = new Set(user.skills.map((s) => s.toLowerCase()))
    const neededSkills = idea.skills_needed.map((s) => s.toLowerCase())
    if (neededSkills.length === 0) return 50
    const matching = neededSkills.filter((s) => userSkills.has(s)).length
    return Math.round((matching / neededSkills.length) * 100)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  if (loading) return <PageLoader />
  if (!idea) return null

  const isOwner = user?.id === idea.user_id
  const compatibility = user ? calculateCompatibility() : null

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ideas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={getCategoryColor(idea.category)}>
                  {CATEGORY_LABELS[idea.category]}
                </Badge>
                <Badge className={getStageColor(idea.stage)}>
                  {STAGE_LABELS[idea.stage]}
                </Badge>
                {idea.nda_required && (
                  <Badge variant="warning" className="gap-1">
                    <Lock className="w-3 h-3" />
                    NDA Required
                  </Badge>
                )}
                {idea.visibility === 'nda_gated' && (
                  <Badge variant="outline" className="gap-1">
                    <Shield className="w-3 h-3" />
                    NDA Gated
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {idea.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-dark-400 text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(idea.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {idea.views} views
                </span>
                <span className="flex items-center gap-1.5">
                  <ArrowUp className="w-4 h-4" />
                  {idea.upvotes} upvotes
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {idea.match_count} applications
                </span>
              </div>
            </motion.div>

            {/* Problem */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-red-400">⚡</span> The Problem
                  </h2>
                  <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">{idea.problem}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Solution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-green-400">💡</span> The Solution
                  </h2>
                  <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">{idea.solution}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market */}
            {idea.market && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-blue-400">🎯</span> Target Market
                    </h2>
                    <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">{idea.market}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Skills Needed */}
            {idea.skills_needed.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-purple-400">🛠</span> Skills Needed
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {idea.skills_needed.map((s) => (
                        <SkillTag
                          key={s}
                          skill={s}
                          size="md"
                          selected={user?.skills.includes(s)}
                        />
                      ))}
                    </div>
                    {compatibility !== null && compatibility > 0 && (
                      <div className="mt-4 p-3 rounded-lg bg-brand-600/10 border border-brand-500/20">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-brand-400" />
                          <span className="text-sm font-medium text-brand-300">
                            {compatibility}% skill match with your profile
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-dark-800 rounded-full h-2">
                          <div
                            className="bg-brand-500 h-2 rounded-full transition-all"
                            style={{ width: `${compatibility}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-4">
                  Posted By
                </h3>
                {idea.user && (
                  <Link href={`/profile/${idea.user.id}`} className="group">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar
                        src={idea.user.avatar_url}
                        name={idea.user.name}
                        size="lg"
                        foundingMember={idea.user.is_founding_member}
                      />
                      <div>
                        <p className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                          {idea.user.name}
                        </p>
                        <p className="text-sm text-dark-400 capitalize">{idea.user.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </Link>
                )}
                {idea.user?.bio && (
                  <p className="text-sm text-dark-400 mb-3 line-clamp-3">{idea.user.bio}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <span>Trust Score: {idea.user?.trust_score}/100</span>
                  {idea.user?.is_founding_member && (
                    <Badge variant="brand" size="sm">⭐ Founding Member</Badge>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-5 space-y-3">
                {!isOwner && user && (
                  <>
                    {idea.has_applied ? (
                      <Button variant="secondary" className="w-full" disabled>
                        ✓ Application Sent
                      </Button>
                    ) : (
                      <Button className="w-full gap-2" onClick={() => setApplyModal(true)}>
                        <Zap className="w-4 h-4" />
                        Apply to Build
                      </Button>
                    )}
                    <Link href={`/messages?to=${idea.user_id}`} className="block">
                      <Button variant="secondary" className="w-full gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                    </Link>
                  </>
                )}

                {!user && (
                  <Link href="/signup" className="block">
                    <Button className="w-full gap-2">
                      <Zap className="w-4 h-4" />
                      Sign Up to Apply
                    </Button>
                  </Link>
                )}

                {isOwner && (
                  <div className="text-center text-sm text-dark-400">
                    This is your idea. {(idea.match_count || 0) > 0
                      ? `You have ${idea.match_count} application${idea.match_count === 1 ? '' : 's'}.`
                      : 'Share it to find builders.'}
                  </div>
                )}

                <Button
                  variant={upvoted ? 'primary' : 'outline'}
                  className="w-full gap-2"
                  onClick={handleUpvote}
                  disabled={!user}
                >
                  <ArrowUp className="w-4 h-4" />
                  Upvote ({idea.upvotes})
                </Button>

                <Button variant="ghost" className="w-full gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </Card>
            </motion.div>

            {/* AI Validate CTA */}
            {isOwner && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-5 border-brand-500/20 bg-brand-600/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <h3 className="font-semibold text-white">AI Idea Validator</h3>
                  </div>
                  <p className="text-sm text-dark-400 mb-4">
                    Get an instant AI-powered analysis of your idea's viability.
                  </p>
                  <Link href="/ai">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      <Sparkles className="w-4 h-4" />
                      Validate with AI
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => setApplyModal(false)}
        title="Apply to Build"
      >
        <div className="space-y-4">
          <p className="text-dark-400 text-sm">
            Tell the idea owner why you're the right builder for this project.
          </p>
          {compatibility !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-dark-300">Your skill match: <strong className="text-brand-400">{compatibility}%</strong></span>
            </div>
          )}
          <Textarea
            label="Your Message"
            placeholder="Why are you interested? What relevant experience do you have? How would you approach this?"
            value={applyMessage}
            onChange={(e) => setApplyMessage(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setApplyModal(false)}>Cancel</Button>
            <Button onClick={handleApply} loading={applying}>Send Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
