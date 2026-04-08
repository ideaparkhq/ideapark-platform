'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import {
  Globe, Share2, Rocket, Lock, Check, ChevronDown, ChevronUp,
  Copy, ExternalLink, Mail, MessageSquare, FileText, X, Sparkles,
  TrendingUp, Target, Zap, DollarSign
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Idea } from '@/types'
import toast from 'react-hot-toast'

function ScoreRing({ score, label, delay }: { score: number; label: string; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (score / 10) * circumference

  const getColor = (s: number) => {
    if (s >= 8) return { stroke: '#34d399', text: 'text-emerald-400', bg: 'text-emerald-500/20' }
    if (s >= 6) return { stroke: '#60a5fa', text: 'text-blue-400', bg: 'text-blue-500/20' }
    if (s >= 4) return { stroke: '#fbbf24', text: 'text-amber-400', bg: 'text-amber-500/20' }
    return { stroke: '#f87171', text: 'text-red-400', bg: 'text-red-500/20' }
  }

  const colors = getColor(score)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <motion.circle
            cx="40" cy="40" r="36" fill="none"
            stroke={colors.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset } : {}}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-white/40 text-center">{label}</span>
    </motion.div>
  )
}

function ExpandableCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-white/10 transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-white font-semibold">{title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pb-6 border-t border-white/[0.06]"
        >
          <div className="pt-4">{children}</div>
        </motion.div>
      )}
    </div>
  )
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-gray-950 border border-white/10 p-8 text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60">
          <X className="w-5 h-5" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-7 h-7 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Go Pro to Publish</h3>
        <p className="text-white/40 mb-6">
          Your business is built and ready. Upgrade to Pro to publish it live and start collecting customers.
        </p>
        <div className="space-y-3">
          <a
            href="/pricing"
            className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Upgrade to Pro — $29/mo
          </a>
          <button
            onClick={onClose}
            className="block w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function IdeaResultPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchIdea() {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) setIdea(data)
      setLoading(false)
    }
    fetchIdea()
  }, [params.id])

  const handlePublish = async () => {
    if (!user) {
      router.push('/login?redirect=/ideas/' + params.id)
      return
    }
    if (user.plan === 'free') {
      setShowUpgrade(true)
      return
    }

    setPublishing(true)
    try {
      const res = await fetch(`/api/ideas/${params.id}/publish`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Your business is live! 🚀')
      setIdea(prev => prev ? { ...prev, status: 'live', slug: data.slug } : null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish')
    }
    setPublishing(false)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/ideas/${params.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="space-y-4 w-full max-w-4xl px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/[0.02] animate-shimmer" />
          ))}
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Idea not found</h2>
          <p className="text-white/40 mb-6">This idea doesn&apos;t exist or you don&apos;t have access.</p>
          <a href="/launch" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            Launch a new idea
          </a>
        </div>
      </div>
    )
  }

  const isReady = idea.status === 'ready' || idea.status === 'live'

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-hero-glow opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-hero-glow-violet opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Status banner */}
        {idea.status === 'live' && idea.slug && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium text-sm">Your business is live!</span>
            </div>
            <a
              href={`/b/${idea.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View live page <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">AI Build Complete</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {idea.business_name || 'Your Business'}
          </h1>
          {idea.tagline && (
            <p className="text-lg text-white/40">{idea.tagline}</p>
          )}
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
          >
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Idea Score</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <ScoreRing score={idea.score_market || 0} label="Market" delay={0} />
              <ScoreRing score={idea.score_monetization || 0} label="Monetization" delay={0.1} />
              <ScoreRing score={idea.score_speed || 0} label="Speed" delay={0.2} />
              <ScoreRing score={idea.score_competition || 0} label="Competition" delay={0.3} />
            </div>
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/40">Overall</span>
                <span className="text-2xl font-bold text-white">{idea.score_overall || 0}<span className="text-sm text-white/30">/10</span></span>
              </div>
              {idea.validation_report?.verdict && (
                <p className="text-sm text-emerald-400 font-medium mt-2">
                  {idea.validation_report.verdict}
                </p>
              )}
            </div>
          </motion.div>

          {/* Business Concept */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6"
          >
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Business Concept</h3>
            <div className="space-y-5">
              {idea.value_proposition && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs text-white/30 uppercase tracking-wider">Value Proposition</span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{idea.value_proposition}</p>
                </div>
              )}
              {idea.target_persona && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-white/30 uppercase tracking-wider">Target Customer</span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{idea.target_persona}</p>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                {idea.pricing_strategy && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-white/30 uppercase tracking-wider">Pricing</span>
                    </div>
                    <p className="text-white/70 text-sm">{idea.pricing_strategy}</p>
                  </div>
                )}
                {idea.revenue_model && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-white/30 uppercase tracking-wider">Revenue Model</span>
                    </div>
                    <p className="text-white/70 text-sm">{idea.revenue_model}</p>
                  </div>
                )}
              </div>
              {idea.validation_report?.revenue_potential && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-violet-500/5 border border-blue-500/10">
                  <span className="text-xs text-white/30 uppercase tracking-wider">Revenue Potential</span>
                  <p className="text-lg font-semibold text-white mt-1">{idea.validation_report.revenue_potential}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Landing Page Preview */}
        {idea.landing_page_html && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Generated Landing Page
              </h3>
              {idea.status === 'live' && idea.slug && (
                <a
                  href={`/b/${idea.slug}`}
                  target="_blank"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  View live <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-gray-950">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto px-4 py-1.5 rounded-lg bg-white/5 text-xs text-white/30 text-center">
                    {idea.slug ? `ideaparkhq.com/b/${idea.slug}` : 'ideaparkhq.com/b/your-business'}
                  </div>
                </div>
              </div>
              {/* Page content */}
              <div className="max-h-[500px] overflow-y-auto">
                <iframe
                  srcDoc={idea.landing_page_html}
                  className="w-full h-[500px] border-0"
                  sandbox="allow-scripts"
                  title="Landing page preview"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Marketing Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-12"
        >
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Marketing Assets</h3>

          {/* Ad Copy */}
          {idea.ad_copy && idea.ad_copy.length > 0 && (
            <ExpandableCard title={`Ad Copy (${idea.ad_copy.length})`} icon={FileText}>
              <div className="space-y-4">
                {idea.ad_copy.map((ad, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-400 font-medium">{ad.platform}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${ad.headline}\n\n${ad.body}\n\n${ad.cta}`)
                          toast.success('Copied!')
                        }}
                        className="text-white/20 hover:text-white/60 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-white font-semibold text-sm mb-1">{ad.headline}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{ad.body}</p>
                    <p className="text-blue-400 text-sm mt-2 font-medium">{ad.cta}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          )}

          {/* Social Posts */}
          {idea.social_posts && idea.social_posts.length > 0 && (
            <ExpandableCard title={`Social Posts (${idea.social_posts.length})`} icon={MessageSquare}>
              <div className="space-y-4">
                {idea.social_posts.map((post, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-violet-400 font-medium">{post.platform}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${post.content}\n\n${post.hashtags.join(' ')}`)
                          toast.success('Copied!')
                        }}
                        className="text-white/20 hover:text-white/60 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{post.content}</p>
                    <p className="text-blue-400/50 text-xs mt-2">{post.hashtags.join(' ')}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          )}

          {/* Email Sequence */}
          {idea.email_sequence && idea.email_sequence.length > 0 && (
            <ExpandableCard title={`Email Sequence (${idea.email_sequence.length})`} icon={Mail}>
              <div className="space-y-4">
                {idea.email_sequence.map((email, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-emerald-400 font-medium">
                        {email.delay_days === 0 ? 'Immediately' : `Day ${email.delay_days}`}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`)
                          toast.success('Copied!')
                        }}
                        className="text-white/20 hover:text-white/60 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-white font-semibold text-sm mb-2">Subject: {email.subject}</p>
                    <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{email.body}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {idea.status !== 'live' && isReady && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-semibold rounded-2xl glow-cta hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Go Live — Publish This Business
                </>
              )}
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-2xl hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share This Idea
          </button>
        </motion.div>

        {/* Upgrade Modal */}
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </div>
    </div>
  )
}
