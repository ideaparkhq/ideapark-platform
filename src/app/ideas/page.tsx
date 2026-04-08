'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search, Filter, Plus, Eye, ArrowUp, Users, Lightbulb,
  ChevronDown, X, Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { SkillTag } from '@/components/ui/SkillTag'
import { Avatar } from '@/components/ui/Avatar'
import {
  CATEGORY_LABELS, STAGE_LABELS, SKILL_OPTIONS,
  type Idea, type IdeaCategory, type IdeaStage
} from '@/types'
import {
  formatRelativeTime, getStageColor, getCategoryColor, truncate
} from '@/lib/utils'

type SortOption = 'newest' | 'popular' | 'trending' | 'oldest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Upvoted' },
  { value: 'trending', label: 'Trending' },
  { value: 'oldest', label: 'Oldest' },
]

export default function IdeasPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()

  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [stage, setStage] = useState(searchParams.get('stage') || 'all')
  const [skill, setSkill] = useState(searchParams.get('skill') || '')
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      if (stage !== 'all') params.set('stage', stage)
      if (skill) params.set('skill', skill)
      if (search) params.set('search', search)
      params.set('sort', sort)
      params.set('page', String(page))

      const res = await fetch(`/api/ideas?${params}`)
      const data = await res.json()

      if (res.ok) {
        setIdeas(data.ideas)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error)
    } finally {
      setLoading(false)
    }
  }, [category, stage, skill, search, sort, page])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const clearFilters = () => {
    setCategory('all')
    setStage('all')
    setSkill('')
    setSearch('')
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters = category !== 'all' || stage !== 'all' || skill !== '' || search !== ''

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-dark-800 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Discover Ideas
              </h1>
              <p className="mt-2 text-dark-400 text-lg">
                Find your next venture. Connect with the people building it.
              </p>
            </div>
            {user && (
              <Link href="/ideas/new">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Post an Idea
                </Button>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search ideas by title..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-dark-700 bg-dark-900 text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500" />
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl border border-dark-800 bg-dark-900/50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Stage */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-300">Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => { setStage(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="all">All Stages</option>
                    {Object.entries(STAGE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Skill */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-300">Skill Needed</label>
                  <select
                    value={skill}
                    onChange={(e) => { setSkill(e.target.value); setPage(1) }}
                    className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Any Skill</option>
                    {SKILL_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-300">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as SortOption); setPage(1) }}
                    className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <PageLoader />
        ) : ideas.length === 0 ? (
          <EmptyState
            icon={<Lightbulb className="w-12 h-12" />}
            title="No ideas found"
            description={hasActiveFilters
              ? 'Try adjusting your filters or search terms.'
              : 'Be the first to post an idea and find your builder.'
            }
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
              ) : user ? (
                <Link href="/ideas/new">
                  <Button>Post Your First Idea</Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button>Sign Up to Post</Button>
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="flex flex-col h-full"
                  >
                    <div className="p-5 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge className={getCategoryColor(idea.category)}>
                            {CATEGORY_LABELS[idea.category]}
                          </Badge>
                          <Badge className={getStageColor(idea.stage)}>
                            {STAGE_LABELS[idea.stage]}
                          </Badge>
                        </div>
                        {idea.nda_required && (
                          <Badge variant="warning" size="sm">NDA</Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {idea.title}
                      </h3>

                      {/* Problem */}
                      <p className="text-dark-400 text-sm mb-4 line-clamp-3 flex-1">
                        {truncate(idea.problem, 150)}
                      </p>

                      {/* Skills */}
                      {idea.skills_needed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {idea.skills_needed.slice(0, 3).map((s) => (
                            <SkillTag key={s} skill={s} size="sm" />
                          ))}
                          {idea.skills_needed.length > 3 && (
                            <span className="text-xs text-dark-500 self-center">
                              +{idea.skills_needed.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                        <div className="flex items-center gap-2">
                          {idea.user && (
                            <>
                              <Avatar
                                src={idea.user.avatar_url}
                                name={idea.user.name}
                                size="sm"
                                foundingMember={idea.user.is_founding_member}
                              />
                              <span className="text-sm text-dark-300 truncate max-w-[100px]">
                                {idea.user.name}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-dark-500 text-xs">
                          <span className="flex items-center gap-1">
                            <ArrowUp className="w-3.5 h-3.5" />
                            {idea.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {idea.views}
                          </span>
                          <span>{formatRelativeTime(idea.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-dark-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
