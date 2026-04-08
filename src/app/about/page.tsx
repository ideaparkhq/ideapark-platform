'use client'

import { motion } from 'framer-motion'
import {
  Lightbulb, Target, Shield, Users, Sparkles,
  Heart, Rocket, ArrowRight, Zap, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const values = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Execution',
    description: 'Ideas are everywhere. Execution is everything. We build systems that turn thinking into doing, and concepts into products.',
    color: 'text-brand-400',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Trust',
    description: 'Trust is earned through action, not promises. Our trust scores, NDA protections, and transparent matching reflect that belief.',
    color: 'text-green-400',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaboration',
    description: 'The best things are built together. We create the conditions for meaningful collaboration between idea holders and builders.',
    color: 'text-cyan-400',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Innovation',
    description: 'We challenge how things have always been done. Every feature, every decision pushes toward a better way to build together.',
    color: 'text-amber-400',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-dark-800 bg-dark-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="brand" size="md" className="mb-6 inline-flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              Our Story
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              To bring people together to build things
              <br />
              <span className="gradient-text">that would not exist otherwise</span>
            </h1>
            <p className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed">
              IdeaPark exists because too many ideas die in silence. Not because they lack potential — 
              because they lack the right people. We&apos;re changing that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The Gap</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                Every day, people come up with ideas that could change industries, solve real problems, and create 
                meaningful value. But most of those ideas never go anywhere — not because they&apos;re bad, but because 
                the person with the idea doesn&apos;t have the skills, the team, or the tools to make it real.
              </p>
              <p>
                On the other side, there are builders — developers, designers, marketers, operators — who are hungry 
                to work on something meaningful but stuck in jobs that don&apos;t challenge them, or scrolling through 
                freelance platforms looking for projects worth their time.
              </p>
              <p>
                <span className="text-white font-semibold">The gap between ideas and execution is one of the biggest 
                untapped opportunities in the world.</span> IdeaPark is the bridge.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-dark-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 mb-6">
              <Target className="w-8 h-8 text-brand-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
              To bring people together to build things that would not exist otherwise. 
              Empowering individuals to act on their ideas, reducing friction between 
              thinking and doing, creating environments where collaboration leads to real outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What We&apos;re Building</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              A platform that turns the idea-to-execution journey from impossible to inevitable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Structured Idea Posting',
                description: 'A framework that forces clarity: Problem → Solution → Market → Skills Needed. Clear ideas attract serious builders.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'AI-Powered Matching',
                description: 'Our matching engine connects ideas with the right builders based on skills, experience, availability, and work style.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'IP Protection',
                description: 'Share your problem publicly, reveal your solution under NDA. Timestamped registration and one-click legal agreements.',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Global Builder Network',
                description: 'A growing community of developers, designers, marketers, and operators who are ready to build something real.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 h-full">
                  <div className="text-brand-400 mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-dark-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Values</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              These aren&apos;t platitudes on a wall. They drive every product decision, every feature priority, every interaction.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 h-full">
                  <div className={`${value.color} mb-3`}>{value.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">The Team</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              IdeaPark is built by people who believe that the best ideas deserve a fighting chance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-sm mx-auto"
          >
            <Card className="p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">MT</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Mariana Thomaz</h3>
              <p className="text-brand-400 text-sm font-medium mt-1">Founder & CEO</p>
              <p className="text-dark-400 text-sm mt-4 leading-relaxed">
                Supply chain sales leader turned entrepreneur. Driven by the belief that the gap between 
                ideas and execution is the biggest untapped opportunity in the world. Building IdeaPark 
                to make sure good ideas find their builders.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-dark-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to build something?
            </h2>
            <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
              Join a community of idea holders and builders who are turning ambition into reality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 glow-brand">
                  Join IdeaPark
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/ideas">
                <Button variant="secondary" size="lg" className="text-base px-8">
                  Browse Ideas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
