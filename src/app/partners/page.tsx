'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Handshake, Users, BarChart3, TrendingUp, Megaphone,
  Target, Zap, Star, CheckCircle2, ArrowRight, Send,
  Building2, Globe, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

const demographics = [
  { label: 'Age Range', value: '18–35', icon: <Users className="w-5 h-5" /> },
  { label: 'Monthly Active', value: '10K+', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Avg. Session', value: '12 min', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Builder Rate', value: '64%', icon: <Zap className="w-5 h-5" /> },
]

const partnershipTiers = [
  {
    name: 'Sponsored Ideas',
    price: '$500–$5,000',
    period: 'per campaign',
    description: 'Sponsor idea challenges that align with your product. Your brand is front and center when builders solve real problems.',
    features: [
      'Branded idea challenges',
      'Community engagement tracking',
      'Featured placement in feed',
      'Direct builder exposure',
      'Campaign analytics dashboard',
    ],
    icon: <Star className="w-6 h-6" />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    name: 'Featured Placements',
    price: 'Custom',
    period: 'pricing',
    description: 'Premium visibility across the platform. Your product appears where builders are actively searching for tools and resources.',
    features: [
      'Homepage feature banner',
      'Category page placements',
      'Store integration',
      'Newsletter inclusion',
      'Priority support',
    ],
    icon: <Megaphone className="w-6 h-6" />,
    color: 'text-brand-400',
    borderColor: 'border-brand-500/30',
    featured: true,
  },
  {
    name: 'Builder Access',
    price: '$299–$999',
    period: '/month',
    description: 'Direct access to our builder community. Recruit talent, gather feedback, and build relationships with the next generation of entrepreneurs.',
    features: [
      'Builder directory access',
      'Talent pipeline tools',
      'Community AMAs',
      'Beta tester recruitment',
      'Monthly insights report',
    ],
    icon: <Target className="w-6 h-6" />,
    color: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
  {
    name: 'Native Ads',
    price: 'CPM / CPC',
    period: 'pricing',
    description: 'Non-intrusive, context-aware ads that feel native to the platform. Shown to users based on their interests and activity.',
    features: [
      'Contextual targeting',
      'Skill-based audiences',
      'Performance analytics',
      'A/B testing tools',
      'Transparent reporting',
    ],
    icon: <Globe className="w-6 h-6" />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
]

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    website: '',
    tier: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ company: '', name: '', email: '', website: '', tier: '', message: '' })
      }
    } catch (err) {
      console.error('Partnership inquiry error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-dark-800 bg-dark-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="brand" size="md" className="mb-6 inline-flex items-center gap-2">
              <Handshake className="w-3.5 h-3.5" />
              Partnerships
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Partner with the platform where
              <br />
              <span className="gradient-text">builders and ideas connect</span>
            </h1>
            <p className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed">
              Reach ambitious entrepreneurs, developers, and creators who are actively building the future.
              Integrate your brand into the workflows of the next generation of founders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Audience Demographics */}
      <section className="py-16 px-4 bg-dark-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Our Audience</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              IdeaPark attracts ambitious, action-oriented builders who are ready to invest in tools and resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {demographics.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="p-5 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-600/10 text-brand-400 mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Founders & Idea Holders', pct: '45%' },
              { label: 'Developers & Engineers', pct: '32%' },
              { label: 'Designers & Marketers', pct: '23%' },
            ].map((seg) => (
              <Card key={seg.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-300">{seg.label}</span>
                  <span className="text-sm font-semibold text-brand-400">{seg.pct}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-dark-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: seg.pct }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Partnership Tiers</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Choose the partnership model that fits your goals. All tiers include dedicated support and performance reporting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {partnershipTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className={`p-6 h-full ${tier.featured ? 'border-brand-500/50' : ''}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-dark-800 border ${tier.borderColor} flex items-center justify-center shrink-0 ${tier.color}`}>
                      {tier.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-bold text-white">{tier.price}</span>
                        <span className="text-sm text-dark-400">{tier.period}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-dark-400 text-sm mb-4 leading-relaxed">{tier.description}</p>
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-dark-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 px-4 bg-dark-900/30">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Get in Touch</h2>
            <p className="text-dark-400">
              Tell us about your brand and goals. We&apos;ll put together a custom partnership proposal.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Inquiry Received</h3>
                <p className="text-dark-400">
                  We&apos;ll review your inquiry and reach out within 2 business days. Looking forward to connecting.
                </p>
              </Card>
            </motion.div>
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Inc."
                    required
                  />
                  <Input
                    label="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@acme.com"
                    required
                  />
                  <Input
                    label="Website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://acme.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-dark-200">
                    Partnership Interest
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full rounded-lg border border-dark-700 bg-dark-900 px-4 py-2.5 text-white transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  >
                    <option value="">Select a tier</option>
                    <option value="sponsored-ideas">Sponsored Ideas ($500–$5K)</option>
                    <option value="featured-placements">Featured Placements (Custom)</option>
                    <option value="builder-access">Builder Access ($299–$999/mo)</option>
                    <option value="native-ads">Native Ads (CPM/CPC)</option>
                    <option value="custom">Custom / Multiple</option>
                  </select>
                </div>
                <Textarea
                  label="Tell us about your goals"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What are you hoping to achieve through a partnership with IdeaPark? Share your goals, target audience, and any specific ideas you have."
                  className="min-h-[120px]"
                  required
                />
                <Button type="submit" className="w-full" loading={submitting}>
                  {submitting ? 'Sending...' : 'Submit Partnership Inquiry'}
                  {!submitting && <Send className="w-4 h-4" />}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
