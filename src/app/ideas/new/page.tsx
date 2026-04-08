'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Lightbulb, AlertCircle, ArrowLeft, Eye, EyeOff, Lock, Shield
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'
import { SkillTag } from '@/components/ui/SkillTag'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import {
  CATEGORY_LABELS, STAGE_LABELS, SKILL_OPTIONS,
  type IdeaCategory, type IdeaStage, type IdeaVisibility
} from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NewIdeaPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    title: '',
    problem: '',
    solution: '',
    market: '',
    category: 'other' as IdeaCategory,
    stage: 'concept' as IdeaStage,
    visibility: 'public' as IdeaVisibility,
    nda_required: false,
    skills_needed: [] as string[],
  })

  const [skillSearch, setSkillSearch] = useState('')
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)

  const filteredSkills = SKILL_OPTIONS.filter(
    (s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !form.skills_needed.includes(s)
  )

  const addSkill = (skill: string) => {
    if (form.skills_needed.length >= 10) {
      toast.error('Maximum 10 skills allowed')
      return
    }
    setForm({ ...form, skills_needed: [...form.skills_needed, skill] })
    setSkillSearch('')
    setShowSkillDropdown(false)
  }

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills_needed: form.skills_needed.filter((s) => s !== skill) })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (form.title.length > 100) newErrors.title = 'Title must be under 100 characters'
    if (!form.problem.trim()) newErrors.problem = 'Describe the problem you\'re solving'
    if (form.problem.length < 20) newErrors.problem = 'Be more specific — at least 20 characters'
    if (!form.solution.trim()) newErrors.solution = 'Describe your solution'
    if (form.solution.length < 20) newErrors.solution = 'Be more specific — at least 20 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to post idea')
        return
      }

      toast.success('Idea posted! Time to find your builder.')
      router.push(`/ideas/${data.id}`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) return <PageLoader />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Lightbulb className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to post an idea</h2>
          <p className="text-dark-400 mb-6">You need an account to share your ideas with the community.</p>
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>
          <h1 className="text-3xl font-bold text-white">Post a New Idea</h1>
          <p className="mt-2 text-dark-400">
            Describe your vision. The more specific, the better your builder matches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Input
              label="Idea Title"
              placeholder="A clear, compelling name for your idea"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={errors.title}
              maxLength={100}
            />
            <p className="mt-1 text-xs text-dark-500">{form.title.length}/100 characters</p>
          </motion.div>

          {/* Problem */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Textarea
              label="The Problem"
              placeholder="What pain point are you solving? Who has this problem? Why does it matter?"
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              error={errors.problem}
              rows={4}
            />
          </motion.div>

          {/* Solution */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Textarea
              label="The Solution"
              placeholder="How does your idea solve this problem? What makes it different from what exists?"
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              error={errors.solution}
              rows={4}
            />
          </motion.div>

          {/* Market */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Textarea
              label="Target Market"
              placeholder="Who are your customers? How big is the opportunity? (Optional but helps matching)"
              value={form.market}
              onChange={(e) => setForm({ ...form, market: e.target.value })}
              rows={3}
            />
          </motion.div>

          {/* Category & Stage */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as IdeaCategory })}
              options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <Select
              label="Stage"
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value as IdeaStage })}
              options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </motion.div>

          {/* Skills Needed */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Skills Needed</label>
            <div className="relative">
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => { setSkillSearch(e.target.value); setShowSkillDropdown(true) }}
                onFocus={() => setShowSkillDropdown(true)}
                placeholder="Search and add skills..."
                className="w-full rounded-lg border border-dark-700 bg-dark-900 px-4 py-2.5 text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
              {showSkillDropdown && filteredSkills.length > 0 && (
                <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-dark-700 bg-dark-900 shadow-xl">
                  {filteredSkills.slice(0, 10).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="w-full text-left px-4 py-2 text-sm text-dark-200 hover:bg-dark-800 hover:text-white transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.skills_needed.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills_needed.map((s) => (
                  <SkillTag key={s} skill={s} removable onRemove={() => removeSkill(s)} />
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-dark-500">
              {form.skills_needed.length}/10 skills — What expertise do you need to build this?
            </p>
          </motion.div>

          {/* Visibility & NDA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" />
                Privacy & Protection
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">Visibility</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'public', label: 'Public', desc: 'Visible to everyone', icon: Eye },
                      { value: 'nda_gated', label: 'NDA Gated', desc: 'Requires NDA to view details', icon: Lock },
                      { value: 'private', label: 'Private', desc: 'Only visible to you', icon: EyeOff },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, visibility: opt.value as IdeaVisibility })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          form.visibility === opt.value
                            ? 'border-brand-500 bg-brand-600/10'
                            : 'border-dark-700 bg-dark-900 hover:border-dark-600'
                        }`}
                      >
                        <opt.icon className={`w-4 h-4 mb-1.5 ${
                          form.visibility === opt.value ? 'text-brand-400' : 'text-dark-500'
                        }`} />
                        <p className={`text-sm font-medium ${
                          form.visibility === opt.value ? 'text-white' : 'text-dark-300'
                        }`}>{opt.label}</p>
                        <p className="text-xs text-dark-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.nda_required}
                    onChange={(e) => setForm({ ...form, nda_required: e.target.checked })}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-brand-500 focus:ring-brand-500/20"
                  />
                  <div>
                    <p className="text-sm font-medium text-dark-200">Require NDA before connecting</p>
                    <p className="text-xs text-dark-500">Builders must sign an NDA before you exchange details</p>
                  </div>
                </label>
              </div>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between pt-4"
          >
            <Link href="/ideas">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={loading} size="lg" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Publish Idea
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
