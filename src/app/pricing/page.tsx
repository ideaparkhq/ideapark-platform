'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Sparkles, Zap, Rocket } from 'lucide-react'
import { PLAN_CONFIGS, type PlanTier } from '@/types'

const faqs = [
  {
    q: 'Can I try before I pay?',
    a: 'Yes — submit unlimited ideas and see full AI validation results for free. You only need Pro to publish and go live.',
  },
  {
    q: 'What counts as a credit?',
    a: 'Idea validation costs 1 credit. A full AI business build costs 5 credits. Free plan includes 3 credits/month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no hidden fees. Cancel from your dashboard and you keep access until the end of your billing period.',
  },
  {
    q: 'What does "go live" mean?',
    a: 'Your AI-generated landing page gets a real URL (yourname.ideaparkhq.com) with email capture, analytics, and sharing.',
  },
  {
    q: 'What is the revenue share?',
    a: 'If you collect payments through your live page, IdeaPark takes 5% on Pro or 3% on Scale. Free plan cannot collect payments.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Custom domains are available on the Scale plan. We handle SSL and DNS setup for you.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/[0.06] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-white font-medium pr-4">{faq.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pb-5"
        >
          <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function PricingPage() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const tiers: { tier: PlanTier; popular?: boolean }[] = [
    { tier: 'free' },
    { tier: 'pro', popular: true },
    { tier: 'scale' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-hero-glow opacity-30" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Simple pricing
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Start free. Scale when ready.
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            See everything AI builds for free. Only pay when you&apos;re ready to publish.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div ref={ref} className="grid md:grid-cols-3 gap-6 mb-24">
          {tiers.map(({ tier, popular }, i) => {
            const config = PLAN_CONFIGS[tier]
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
                  <p className="text-white/30 text-sm mt-2">
                    {config.credits} credits/month
                  </p>
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
                  className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold transition-all duration-300 block ${
                    popular
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {config.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Feature comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 pr-4 text-white/40 font-medium">Feature</th>
                  <th className="py-4 px-4 text-white/60 font-medium text-center">Free</th>
                  <th className="py-4 px-4 text-blue-400 font-medium text-center">Pro</th>
                  <th className="py-4 px-4 text-white/60 font-medium text-center">Scale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Submit ideas', '✓', '✓', '✓'],
                  ['AI validation', '✓', '✓', '✓'],
                  ['Full build output', '✓', '✓', '✓'],
                  ['Monthly credits', '3', '30', '100'],
                  ['Publish & go live', '—', '✓', '✓'],
                  ['Landing page hosting', '—', '✓', '✓'],
                  ['Email capture', '—', '✓', '✓'],
                  ['Ad copy & social posts', '—', '✓', '✓'],
                  ['Custom domain', '—', '—', '✓'],
                  ['API access', '—', '—', '✓'],
                  ['White-label', '—', '—', '✓'],
                  ['Revenue share', '—', '5%', '3%'],
                ].map(([feature, ...values], i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-3.5 pr-4 text-white/50">{feature}</td>
                    {values.map((val, j) => (
                      <td key={j} className={`py-3.5 px-4 text-center ${val === '✓' ? 'text-blue-400' : val === '—' ? 'text-white/15' : 'text-white/60'}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white text-center mb-8"
          >
            Frequently asked questions
          </motion.h2>
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] px-6">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to build?</h3>
          <p className="text-white/40 mb-8">Your idea is one sentence away from becoming real.</p>
          <Link
            href="/launch"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-lg font-semibold rounded-2xl glow-cta hover:scale-[1.03] transition-all duration-300"
          >
            <Rocket className="w-5 h-5" />
            Launch My Idea
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
