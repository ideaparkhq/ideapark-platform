'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Lightbulb, ArrowRight, Zap, Shield, Users, Brain,
  CheckCircle2, Sparkles, Rocket, Target, Globe, ChevronRight,
  Star, Code, Palette, TrendingUp, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { PLAN_CONFIGS, type PlanTier } from '@/types'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
}

export default function LandingPage() {
  const [foundingSpots, setFoundingSpots] = useState(347)

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="brand" size="md" className="mb-6 inline-flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" />
              {foundingSpots} Founding Member spots remaining
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Where ideas find
            <br />
            <span className="gradient-text">their builders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            The execution layer for the world&apos;s ideas. Post your concept, find your builder,
            validate with AI, and start building — all in one place.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm text-dark-500 mb-10 font-medium tracking-wider uppercase"
          >
            Stop consuming. Start building.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 glow-brand">
                Claim Your Spot
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="secondary" size="lg" className="text-base px-8">
                Browse Ideas
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-dark-500"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 border-2 border-dark-950"
                  />
                ))}
              </div>
              <span>500+ Founding Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-brand-400" />
              <span>Ideas posted daily</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>AI-powered matching</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to go from
              <span className="gradient-text"> idea to execution</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              IdeaPark isn&apos;t another social network. It&apos;s the place where people actually build things together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Smart Matching',
                description: 'Our AI analyzes skills, experience, and work style to connect idea holders with the perfect builders. Not just who can — who will.',
                color: 'text-brand-400',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'IP Protection',
                description: 'Share your problem publicly, reveal your solution only under NDA. Timestamped idea registration and one-click legal agreements.',
                color: 'text-green-400',
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AI Copilot',
                description: 'Validate your idea, generate business plans, analyze markets, and create pitch decks — all powered by AI that understands startups.',
                color: 'text-violet-400',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Trust Scores',
                description: 'No more guessing. See a builder\'s execution history, collaboration ratings, and completion track record before you commit.',
                color: 'text-cyan-400',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Structured Ideas',
                description: 'Post ideas with our proven framework: Problem → Solution → Market → Skills Needed. Clear structure attracts serious builders.',
                color: 'text-amber-400',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Global Community',
                description: 'Connect with builders across time zones. Your next co-founder could be anywhere in the world — IdeaPark makes the introduction.',
                color: 'text-pink-400',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card hover className="h-full p-6">
                  <div className={`mb-4 ${feature.color}`}>{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              From raw idea to active project in three steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Post Your Idea',
                description: 'Describe the problem you want to solve, your proposed solution, and the skills you need. Our AI helps you structure it for maximum clarity.',
                icon: <Lightbulb className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our AI scores compatibility between your idea and builders based on skills, experience, availability, and work style. The best matches surface first.',
                icon: <Zap className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Build Together',
                description: 'Connect directly with matched builders. Use AI tools to create business plans, validate markets, and keep your project on track.',
                icon: <Rocket className="w-8 h-8" />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 mb-6 text-brand-400">
                  {item.icon}
                </div>
                <div className="text-xs font-mono text-brand-500 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              This isn&apos;t <span className="line-through text-dark-600">LinkedIn</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              LinkedIn shows you who people were. IdeaPark shows you what people can become.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div {...fadeInUp}>
              <Card className="p-6 opacity-50">
                <h3 className="text-lg font-semibold text-dark-400 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center text-xs">Li</span>
                  The Old Way
                </h3>
                <ul className="space-y-3">
                  {[
                    'Post and pray someone notices',
                    'Judge people by job titles',
                    'Performance theater content',
                    'No IP protection',
                    'No idea validation tools',
                    'Connections = vanity metric',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-dark-500">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-dark-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp}>
              <Card className="p-6 border-brand-500/30 glow-brand">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  The IdeaPark Way
                </h3>
                <ul className="space-y-3">
                  {[
                    'AI matches you with the right people',
                    'Trust scores based on execution history',
                    'Structured ideas, real collaboration',
                    'NDA-gated idea disclosure',
                    'AI validates, plans, and builds with you',
                    'Trust = earned through building together',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-dark-200">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founding Members CTA */}
      <section className="py-24 px-4 bg-dark-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <Badge variant="warning" size="md" className="mb-6 inline-flex items-center gap-2">
              <Star className="w-3.5 h-3.5" />
              Limited Availability
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              500 Founding Member spots.
              <br />
              <span className="gradient-text">Free core access. Forever.</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Be one of the first 500 people on IdeaPark. Get unlimited idea posts, messaging, and
              community access — for life. No credit card required. No catch. Just build.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 glow-brand">
                  Become a Founding Member
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-sm text-dark-500">
                <span className="text-amber-400 font-semibold">{foundingSpots}</span> of 500 spots remaining
              </p>
            </div>

            {/* What you get */}
            <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: <Lightbulb className="w-5 h-5" />, label: 'Unlimited idea posts' },
                { icon: <Users className="w-5 h-5" />, label: 'Builder matching' },
                { icon: <Star className="w-5 h-5" />, label: 'Founding Member badge' },
              ].map((perk) => (
                <div
                  key={perk.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-dark-900/50 border border-dark-800"
                >
                  <div className="text-brand-400">{perk.icon}</div>
                  <span className="text-sm text-dark-200">{perk.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Start free. Scale as you build. Every plan includes access to the IdeaPark community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {(Object.entries(PLAN_CONFIGS) as [PlanTier, typeof PLAN_CONFIGS[PlanTier]][]).map(([tier, plan], i) => (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`relative p-6 h-full flex flex-col ${
                    tier === 'pro' ? 'border-brand-500/50 glow-brand' : ''
                  }`}
                >
                  {tier === 'pro' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="brand" size="md">Most Popular</Badge>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && <span className="text-dark-400">/mo</span>}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-dark-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup">
                    <Button
                      variant={tier === 'pro' ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {tier === 'free' ? 'Get Started Free' : `Start ${plan.name}`}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-24 px-4 bg-dark-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Partner with <span className="gradient-text">IdeaPark</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Reach the next generation of builders, creators, and entrepreneurs. 
              Integrate your tools into the workflows of ambitious people building the future.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: <Code className="w-6 h-6" />, label: 'SaaS & Dev Tools', desc: 'Surface your product to active builders' },
                { icon: <Palette className="w-6 h-6" />, label: 'Accelerators', desc: 'Discover promising projects early' },
                { icon: <TrendingUp className="w-6 h-6" />, label: 'Brands', desc: 'Reach Gen Z entrepreneurs, 18-35' },
              ].map((item) => (
                <Card key={item.label} className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600/10 text-brand-400 mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                  <p className="text-xs text-dark-400">{item.desc}</p>
                </Card>
              ))}
            </div>

            <Link href="/partners">
              <Button variant="outline" size="lg">
                Explore Partnerships
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />

        <motion.div {...fadeInUp} className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Your idea deserves
            <br />
            <span className="gradient-text">a team</span>
          </h2>
          <p className="text-lg text-dark-400 mb-10 max-w-xl mx-auto">
            Someone just posted a startup idea that could change everything.
            They just need a builder. Maybe that&apos;s you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 glow-brand">
                Join IdeaPark
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="ghost" size="lg" className="text-base">
                See What&apos;s Being Built
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
