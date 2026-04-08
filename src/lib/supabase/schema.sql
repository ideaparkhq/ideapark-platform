-- ============================================
-- IdeaPark V2 — AI Execution Engine
-- Database Schema
-- ============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'scale')),
  credits INTEGER NOT NULL DEFAULT 3,
  stripe_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas (the core entity)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Input
  raw_input TEXT NOT NULL,
  target_customer TEXT,
  price_range TEXT,
  differentiator TEXT,
  
  -- AI Validation Scores (0-10)
  score_market INTEGER,
  score_monetization INTEGER,
  score_speed INTEGER,
  score_competition INTEGER,
  score_overall INTEGER,
  validation_report JSONB,
  
  -- AI Build Output
  business_name TEXT,
  tagline TEXT,
  value_proposition TEXT,
  target_persona TEXT,
  pricing_strategy TEXT,
  revenue_model TEXT,
  landing_page_html TEXT,
  ad_copy JSONB,
  social_posts JSONB,
  email_sequence JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'validating', 'validated', 'building', 'ready', 'live', 'paused')),
  slug TEXT UNIQUE,
  published_at TIMESTAMPTZ,
  
  -- Metrics
  visitors INTEGER DEFAULT 0,
  signups INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email captures for live businesses
CREATE TABLE IF NOT EXISTS email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit usage tracking
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_slug ON ideas(slug);
CREATE INDEX IF NOT EXISTS idx_email_captures_idea_id ON email_captures(idea_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Ideas: owners can CRUD, anyone can read live ideas
CREATE POLICY "Users can view own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view live ideas" ON ideas FOR SELECT USING (status = 'live');
CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);

-- Email captures: anyone can insert, owners can read
CREATE POLICY "Anyone can insert email captures" ON email_captures FOR INSERT WITH CHECK (true);
CREATE POLICY "Idea owners can view captures" ON email_captures FOR SELECT USING (
  EXISTS (SELECT 1 FROM ideas WHERE ideas.id = email_captures.idea_id AND ideas.user_id = auth.uid())
);

-- Credit transactions: users can view their own
CREATE POLICY "Users can view own credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
