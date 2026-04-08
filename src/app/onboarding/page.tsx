'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb, Code, Users, ArrowRight, ArrowLeft, Check, Star,
  Briefcase, Palette
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SkillTag } from '@/components/ui/SkillTag'
import { SKILL_OPTIONS, type UserRole } from '@/types'
import toast from 'react-hot-toast'

const STEPS = ['role', 'skills', 'bio', 'founding'] as const
type Step = typeof STEPS[number]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const [role, setRole] = useState<UserRole | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const [foundingCode, setFoundingCode] = useState('')

  const step = STEPS[currentStep]

  const canProceed = () => {
    switch (step) {
      case 'role': return role !== null
      case 'skills': return skills.length >= 1
      case 'bio': return true // optional
      case 'founding': return true // optional
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const isFoundingMember = foundingCode.toUpperCase() === 'IDEAPARK500'

      const { error } = await supabase
        .from('users')
        .update({
          role: role || 'both',
          skills,
          bio: bio || null,
          is_founding_member: isFoundingMember,
          ai_credits: isFoundingMember ? 10 : 5,
          onboarding_completed: true,
        })
        .eq('id', user!.id)

      if (error) throw error

      toast.success(
        isFoundingMember 
          ? '⭐ Welcome, Founding Member!' 
          : 'Welcome to IdeaPark!'
      )
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    if (currentStep === STEPS.length - 1) {
      handleComplete()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const back = () => setCurrentStep((s) => Math.max(0, s - 1))

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hero-glow opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-brand-500' : 'bg-dark-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Role */}
            {step === 'role' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What brings you to IdeaPark?</h2>
                <p className="text-dark-400 mb-8">Choose how you want to engage. You can change this later.</p>

                <div className="grid gap-4">
                  {[
                    {
                      value: 'idea_holder' as UserRole,
                      icon: <Lightbulb className="w-6 h-6" />,
                      title: 'I have ideas',
                      description: 'You have concepts, problems, or opportunities and need builders to bring them to life.',
                    },
                    {
                      value: 'builder' as UserRole,
                      icon: <Code className="w-6 h-6" />,
                      title: 'I\'m a builder',
                      description: 'You have skills and want to find exciting ideas to work on. Developers, designers, marketers welcome.',
                    },
                    {
                      value: 'both' as UserRole,
                      icon: <Users className="w-6 h-6" />,
                      title: 'Both',
                      description: 'You have ideas AND skills. You want to build your own projects and help others build theirs.',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                        role === option.value
                          ? 'border-brand-500 bg-brand-600/10'
                          : 'border-dark-800 bg-dark-900/50 hover:border-dark-700'
                      }`}
                    >
                      <div className={`mt-0.5 ${role === option.value ? 'text-brand-400' : 'text-dark-500'}`}>
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{option.title}</h3>
                        <p className="text-sm text-dark-400 mt-0.5">{option.description}</p>
                      </div>
                      {role === option.value && (
                        <Check className="w-5 h-5 text-brand-400 ml-auto mt-1 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">What are your skills?</h2>
                <p className="text-dark-400 mb-8">Select all that apply. This helps us match you with the right ideas and builders.</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {SKILL_OPTIONS.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      selected={skills.includes(skill)}
                      onClick={() => toggleSkill(skill)}
                      size="md"
                    />
                  ))}
                </div>

                {skills.length > 0 && (
                  <p className="text-sm text-dark-400 mt-4">
                    Selected: <span className="text-brand-400">{skills.length}</span> skills
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Bio */}
            {step === 'bio' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
                <p className="text-dark-400 mb-8">A short bio helps others understand what you bring to the table. Optional but recommended.</p>

                <Textarea
                  label="Bio"
                  placeholder="I'm a full-stack developer passionate about edtech. Looking to co-found my next project..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-dark-500 mt-2">{bio.length}/500 characters</p>
              </div>
            )}

            {/* Step 4: Founding Member */}
            {step === 'founding' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Founding Member code</h2>
                <p className="text-dark-400 mb-8">
                  Have a Founding Member code? Enter it below for free lifetime core access and your exclusive badge.
                  No code? No problem — you can still get started for free.
                </p>

                <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-amber-400">Founding Member Perks</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-dark-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400" />
                      Unlimited idea posts — forever
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400" />
                      Builder matching & messaging
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400" />
                      Exclusive Founding Member badge
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400" />
                      10 bonus AI credits
                    </li>
                  </ul>
                </div>

                <Input
                  label="Founding Member Code"
                  type="text"
                  placeholder="Enter your code"
                  value={foundingCode}
                  onChange={(e) => setFoundingCode(e.target.value)}
                  icon={<Star className="w-4 h-4" />}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <Button
            variant="ghost"
            onClick={back}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={next}
            disabled={!canProceed()}
            loading={loading}
          >
            {currentStep === STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
            {currentStep < STEPS.length - 1 && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
