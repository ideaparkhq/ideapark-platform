// ============================================
// IdeaPark Type Definitions
// ============================================

export type UserRole = 'idea_holder' | 'builder' | 'both'
export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise'
export type IdeaStage = 'concept' | 'validation' | 'prototype' | 'mvp' | 'growth'
export type IdeaVisibility = 'public' | 'nda_gated' | 'private'
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'completed'

export type IdeaCategory =
  | 'saas'
  | 'mobile_app'
  | 'ecommerce'
  | 'marketplace'
  | 'ai_ml'
  | 'fintech'
  | 'healthtech'
  | 'edtech'
  | 'sustainability'
  | 'social'
  | 'productivity'
  | 'entertainment'
  | 'hardware'
  | 'other'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  bio: string | null
  skills: string[]
  interests: string[]
  avatar_url: string | null
  trust_score: number
  plan: PlanTier
  ai_credits: number
  is_founding_member: boolean
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string
  title: string
  problem: string
  solution: string
  market: string
  skills_needed: string[]
  category: IdeaCategory
  stage: IdeaStage
  visibility: IdeaVisibility
  nda_required: boolean
  upvotes: number
  views: number
  created_at: string
  updated_at: string
  // Joined fields
  user?: User
  match_count?: number
}

export interface Match {
  id: string
  idea_id: string
  builder_id: string
  status: MatchStatus
  compatibility_score: number
  message: string | null
  created_at: string
  // Joined fields
  idea?: Idea
  builder?: User
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
  // Joined fields
  sender?: User
  receiver?: User
}

export interface Conversation {
  user: User
  last_message: Message
  unread_count: number
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  file_url: string
  image_url: string | null
  category: string
  featured: boolean
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  product_id: string
  stripe_payment_id: string
  created_at: string
  product?: Product
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

export interface AIUsage {
  id: string
  user_id: string
  query_type: 'idea_validation' | 'business_plan' | 'market_analysis'
  credits_used: number
  created_at: string
}

export interface PartnershipInquiry {
  id: string
  company: string
  contact_name: string
  email: string
  message: string
  tier: 'starter' | 'growth' | 'enterprise'
  created_at: string
}

export interface AdminStats {
  total_users: number
  total_ideas: number
  total_matches: number
  total_messages: number
  active_subscriptions: number
  monthly_revenue: number
  new_signups_today: number
  ideas_posted_today: number
  founding_members: number
}

// Plan configuration
export interface PlanConfig {
  name: string
  price: number
  idea_posts: number | 'unlimited'
  ai_credits: number
  messaging: boolean
  nda_per_month: number
  advanced_matching: boolean
  project_workspaces: boolean
  priority_support: boolean
  api_access: boolean
  features: string[]
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    idea_posts: 1,
    ai_credits: 5,
    messaging: false,
    nda_per_month: 0,
    advanced_matching: false,
    project_workspaces: false,
    priority_support: false,
    api_access: false,
    features: [
      'Browse all ideas',
      '1 idea post',
      '5 AI queries/month',
      'Basic profile',
    ],
  },
  basic: {
    name: 'Basic',
    price: 9,
    idea_posts: 5,
    ai_credits: 50,
    messaging: true,
    nda_per_month: 1,
    advanced_matching: false,
    project_workspaces: false,
    priority_support: false,
    api_access: false,
    features: [
      '5 idea posts',
      '50 AI credits/month',
      'Direct messaging',
      '1 NDA/month',
      'Builder matching',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    idea_posts: 'unlimited',
    ai_credits: 500,
    messaging: true,
    nda_per_month: -1, // unlimited
    advanced_matching: true,
    project_workspaces: true,
    priority_support: true,
    api_access: false,
    features: [
      'Unlimited idea posts',
      '500 AI credits/month',
      'Advanced matching',
      'Project workspaces',
      'NDA generator',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    idea_posts: 'unlimited',
    ai_credits: 5000,
    messaging: true,
    nda_per_month: -1,
    advanced_matching: true,
    project_workspaces: true,
    priority_support: true,
    api_access: true,
    features: [
      'Everything in Pro',
      'Multi-seat access',
      'White-label rooms',
      'API access',
      'Custom AI training',
      'Dedicated account manager',
    ],
  },
}

export const SKILL_OPTIONS = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Node.js',
  'AI/ML', 'Data Science', 'Mobile Dev', 'iOS', 'Android',
  'UI/UX Design', 'Product Design', 'Graphic Design', 'Branding',
  'Marketing', 'Growth Hacking', 'SEO', 'Content Writing', 'Copywriting',
  'Sales', 'Business Development', 'Finance', 'Legal',
  'DevOps', 'Cloud Infrastructure', 'Blockchain', 'Web3',
  'Product Management', 'Project Management', 'Strategy',
  'Video Production', 'Photography', 'Animation',
  'Supply Chain', 'Operations', 'E-commerce',
]

export const CATEGORY_LABELS: Record<IdeaCategory, string> = {
  saas: 'SaaS',
  mobile_app: 'Mobile App',
  ecommerce: 'E-Commerce',
  marketplace: 'Marketplace',
  ai_ml: 'AI / ML',
  fintech: 'FinTech',
  healthtech: 'HealthTech',
  edtech: 'EdTech',
  sustainability: 'Sustainability',
  social: 'Social',
  productivity: 'Productivity',
  entertainment: 'Entertainment',
  hardware: 'Hardware',
  other: 'Other',
}

export const STAGE_LABELS: Record<IdeaStage, string> = {
  concept: 'Concept',
  validation: 'Validation',
  prototype: 'Prototype',
  mvp: 'MVP',
  growth: 'Growth',
}
