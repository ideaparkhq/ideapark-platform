// ============================================
// IdeaPark V2 — Type Definitions
// ============================================

export type PlanTier = 'free' | 'pro' | 'scale'

export type IdeaStatus = 'submitted' | 'validating' | 'validated' | 'building' | 'ready' | 'live' | 'paused'

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  plan: PlanTier
  credits: number
  stripe_customer_id: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string | null
  raw_input: string
  target_customer: string | null
  price_range: string | null
  differentiator: string | null
  score_market: number | null
  score_monetization: number | null
  score_speed: number | null
  score_competition: number | null
  score_overall: number | null
  validation_report: ValidationReport | null
  business_name: string | null
  tagline: string | null
  value_proposition: string | null
  target_persona: string | null
  pricing_strategy: string | null
  revenue_model: string | null
  landing_page_html: string | null
  ad_copy: AdCopy[] | null
  social_posts: SocialPost[] | null
  email_sequence: EmailSequenceItem[] | null
  status: IdeaStatus
  slug: string | null
  published_at: string | null
  visitors: number
  signups: number
  revenue: number
  created_at: string
  updated_at: string
}

export interface ValidationReport {
  summary: string
  market_analysis: string
  competition_analysis: string
  monetization_analysis: string
  speed_analysis: string
  verdict: string
  revenue_potential: string
}

export interface AdCopy {
  platform: string
  headline: string
  body: string
  cta: string
}

export interface SocialPost {
  platform: string
  content: string
  hashtags: string[]
}

export interface EmailSequenceItem {
  subject: string
  body: string
  delay_days: number
}

export interface EmailCapture {
  id: string
  idea_id: string
  email: string
  source: string
  created_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  action: string
  idea_id: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  plan: PlanTier
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string
  created_at: string
}

// Plan configuration
export interface PlanConfig {
  name: string
  price: number
  credits: number
  features: string[]
  cta: string
  highlighted?: boolean
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    credits: 3,
    features: [
      'Submit unlimited ideas',
      'AI validation & scoring',
      'Basic idea report',
      'View full AI build output',
    ],
    cta: 'Start Free',
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 30,
    highlighted: true,
    features: [
      'Everything in Free',
      'AI builds your business',
      'Landing page generator',
      'Brand generator',
      'Ad copy & social content',
      'Email capture system',
      'Publish & go live',
      '5% revenue share',
    ],
    cta: 'Go Pro',
  },
  scale: {
    name: 'Scale',
    price: 99,
    credits: 100,
    features: [
      'Everything in Pro',
      'Priority AI processing',
      'Custom domain support',
      'Revenue share reduced to 3%',
      'API access',
      'White-label option',
      'Dedicated support',
    ],
    cta: 'Go Scale',
  },
}

export const STATUS_CONFIG: Record<IdeaStatus, { label: string; color: string; pulse?: boolean; glow?: boolean }> = {
  submitted: { label: 'Submitted', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  validating: { label: 'Validating', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', pulse: true },
  validated: { label: 'Validated', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  building: { label: 'Building', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', pulse: true },
  ready: { label: 'Ready', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  live: { label: 'Live', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', glow: true },
  paused: { label: 'Paused', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
}
