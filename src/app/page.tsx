'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Rocket, Zap, BarChart3, Globe, ArrowRight, Check,
  Sparkles, Target, TrendingUp, Mail, Share2, Lightbulb,
  ChevronRight, Star, MousePointer
} from 'lucide-react'
import { PLAN_CONFIGS, type PlanTier } from '@/types'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function GlowingInput() {
  const router = useRouter()
  const [idea, setIdea] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (idea.trim()) {
      sessionStorage.setItem('ideapark_idea', idea.trim())
      router.push('/launch')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`relative rounded-2xl transition-all duration-500 ${focused ? 'glow-input' : ''}`}>
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe your idea in one sentence..."
          className="w-full px-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white text-lg placeholder:text-white/25 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
        />
        <button
          type="submit"
          disabled={!idea.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-2"
        >
          Launch My Idea
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}

function ProcessStep({ step, title, description, icon: Icon, delay }: {
  step: number; title: string; description: string; icon: React.ElementType; delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-6 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-500">
        <Icon className="w-7 h-7 text-blue-400" />
      </div>
      <div className="text-xs font-bold text-blue-400/60 tracking-widest uppercase mb-2">Step {step}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed max-w-xs">{description}</p>
    </motion.div>
  )
}

function PricingCard({ tier, config, popular }: { tier: PlanTier; config: typeof PLAN_CONFIGS.free; popular?: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: tier === 'free' ? 0 : tier === 'pro' ? 0.1 : 0.2 }}
      className={`relative rounded-2xl p-8 flex flex-col ${
        popular
          ? 'bg-gradient-to-b from-blue-500/10 to-violet-500/10 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10'
          : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
      } transition-all duration-300`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full text-xs font-bold text-white">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">{config.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">${config.price}</span>
          {config.price > 0 && <span className="text-white/40 text-sm">/mo</span>}
        </div>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {config.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <span className="text-white/60">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={config.price === 0 ? '/launch' : '/signup'}
        className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-300 ${
          popular
            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]'
            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
        }`}
      >
        {config.cta}
      </Link>
    </motion.div>
  )
}

function TransformationDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activePhase, setActivePhase] = useState(0)

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      setActivePhase(p => (p + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [inView])

  const phases = [
    {
      label: 'Your Idea',
      content: '"A subscription box for pet owners that delivers monthly themed toys and treats based on dog size"',
      color: 'from-white/5 to-white/[0.02]',
      borderColor: 'border-white/10',
    },
    {
      label: 'AI Validates',
      content: 'Market: 9/10 · Monetization: 8/10 · Speed: 7/10 · Verdict: BUILD IT 🟢',
      color: 'from-blue-500/10 to-blue-500/5',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Business Ready',
      content: 'PawBox — "Monthly joy, delivered to your doorstep" — Landing page live, ads ready, email sequence built',
      color: 'from-emerald-500/10 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
    },
  ]

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        {phases.map((phase, i) => (
          <button
            key={phase.label}
            onClick={() => setActivePhase(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activePhase === i
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {i < activePhase ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">{i + 1}</span>
            )}
            {phase.label}
          </button>
        ))}
      </div>
      <motion.div
        key={activePhase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`bg-gradient-to-b ${phases[activePhase].color} border ${phases[activePhase].borderColor} rounded-2xl p-8 text-center`}
      >
        <p className="text-white/80 text-lg leading-relaxed">{phases[activePhase].content}</p>
      </motion.div>
    </div>
  )
}

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-hero-glow opacity-60" />
        <div className="absolute top-[200px] left-1/4 w-[400px] h-[400px] bg-hero-glow-violet opacity-40" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            The AI Execution Engine
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95] mb-6"
          >
            Turn your idea into
            <br />
            <span className="gradient-text">a business</span> in days
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/40 mb-12 max-w-xl mx-auto"
          >
            No code. No team. Just execution.
          </motion.p>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <GlowingInput />
          </motion.div>

          {/* Social proof mini */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-white/25"
          >
            <span>Free to start</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Results in minutes</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/20">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof Bar */}
      <section className="relative py-16 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 2847, suffix: '', label: 'Ideas Launched' },
              { value: 1200000, suffix: '', label: 'Revenue Generated', prefix: '$' },
              { value: 47, suffix: '', label: 'Countries' },
              { value: 15, suffix: ' min', label: 'Avg. Time to Launch' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.prefix || ''}<AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Demo */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Watch your idea become a business
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              From raw thought to live landing page in minutes. AI does the heavy lifting.
            </p>
          </motion.div>
          <TransformationDemo />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Three steps. One business.
            </h2>
            <p className="text-white/40 text-lg">
              Everyone has ideas. We build them.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <ProcessStep
              step={1}
              title="Describe"
              description="Tell us your idea in one sentence. That's it. No business plan needed."
              icon={MousePointer}
              delay={0}
            />
            <ProcessStep
              step={2}
              title="AI Builds"
              description="We validate your market, generate branding, build a landing page, and create marketing assets."
              icon={Sparkles}
              delay={0.15}
            />
            <ProcessStep
              step={3}
              title="Launch"
              description="Go live with a real landing page, email capture, and ad copy. Start collecting customers."
              icon={Rocket}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="relative py-24 sm:py-32 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to launch
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              AI generates a complete business kit — brand, landing page, marketing, all ready to go.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target, title: 'Market Validation', desc: 'AI scores your idea on market demand, competition, monetization potential, and speed to launch.' },
              { icon: Lightbulb, title: 'Brand Identity', desc: 'Business name, tagline, value proposition, and brand voice — generated in seconds.' },
              { icon: Globe, title: 'Landing Page', desc: 'A complete, responsive landing page with email capture. Ready to publish instantly.' },
              { icon: BarChart3, title: 'Pricing Strategy', desc: 'AI-recommended pricing tiers, revenue model, and target customer persona.' },
              { icon: Share2, title: 'Ad Copy & Social', desc: 'Facebook ads, Instagram captions, Twitter posts — ready to copy and paste.' },
              { icon: Mail, title: 'Email Sequence', desc: '3-part welcome and nurture sequence to convert signups into customers.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 sm:py-32 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-white/40 text-lg">
              Start free. Upgrade when you&apos;re ready to go live.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard tier="free" config={PLAN_CONFIGS.free} />
            <PricingCard tier="pro" config={PLAN_CONFIGS.pro} popular />
            <PricingCard tier="scale" config={PLAN_CONFIGS.scale} />
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="relative py-24 sm:py-32 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Built with IdeaPark
            </h2>
            <p className="text-white/40 text-lg">
              From idea to revenue. Real businesses, real results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'PawBox',
                tagline: 'Monthly themed toys for dogs',
                revenue: '$4,800/mo',
                days: 3,
                quote: 'I described my idea in 30 seconds. Three days later I had paying customers.',
              },
              {
                name: 'CodeMentor AI',
                tagline: 'AI-powered code review',
                revenue: '$12,400/mo',
                days: 5,
                quote: 'The landing page IdeaPark generated converted better than anything I could have built.',
              },
              {
                name: 'FitMeal Prep',
                tagline: 'Meal plans that actually work',
                revenue: '$2,100/mo',
                days: 2,
                quote: 'From shower thought to live business with real signups. This is the future.',
              },
            ].map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{story.name}</div>
                    <div className="text-white/30 text-xs">{story.tagline}</div>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-4 italic">&ldquo;{story.quote}&rdquo;</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">{story.revenue}</span>
                  <span className="text-white/25">Launched in {story.days} days</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Your idea is waiting.
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto">
              Everyone has ideas. Most people stop there. Don&apos;t be most people.
            </p>
            <Link
              href="/launch"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-semibold rounded-2xl glow-cta hover:scale-[1.03] transition-all duration-300"
            >
              Launch My Idea
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
