-- ============================================
-- IdeaPark Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'both' CHECK (role IN ('idea_holder', 'builder', 'both')),
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  ai_credits INTEGER NOT NULL DEFAULT 5,
  is_founding_member BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_plan ON public.users(plan);
CREATE INDEX idx_users_skills ON public.users USING gin(skills);

-- ============================================
-- IDEAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  market TEXT NOT NULL DEFAULT '',
  skills_needed TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'other' CHECK (category IN (
    'saas', 'mobile_app', 'ecommerce', 'marketplace', 'ai_ml',
    'fintech', 'healthtech', 'edtech', 'sustainability', 'social',
    'productivity', 'entertainment', 'hardware', 'other'
  )),
  stage TEXT NOT NULL DEFAULT 'concept' CHECK (stage IN ('concept', 'validation', 'prototype', 'mvp', 'growth')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'nda_gated', 'private')),
  nda_required BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_ideas_category ON public.ideas(category);
CREATE INDEX idx_ideas_stage ON public.ideas(stage);
CREATE INDEX idx_ideas_visibility ON public.ideas(visibility);
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX idx_ideas_skills ON public.ideas USING gin(skills_needed);
CREATE INDEX idx_ideas_title_trgm ON public.ideas USING gin(title gin_trgm_ops);

-- ============================================
-- MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  builder_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  compatibility_score INTEGER NOT NULL DEFAULT 0 CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(idea_id, builder_id)
);

CREATE INDEX idx_matches_idea_id ON public.matches(idea_id);
CREATE INDEX idx_matches_builder_id ON public.matches(builder_id);
CREATE INDEX idx_matches_status ON public.matches(status);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id),
  created_at DESC
);

-- ============================================
-- PRODUCTS TABLE (Digital Store)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0), -- price in cents
  file_url TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'template',
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX idx_products_active ON public.products(active) WHERE active = true;

-- ============================================
-- PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_purchases_product ON public.purchases(product_id);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_stripe_cust ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- AI USAGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  query_type TEXT NOT NULL CHECK (query_type IN ('idea_validation', 'business_plan', 'market_analysis')),
  credits_used INTEGER NOT NULL DEFAULT 1,
  input_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user ON public.ai_usage(user_id);
CREATE INDEX idx_ai_usage_type ON public.ai_usage(query_type);
CREATE INDEX idx_ai_usage_created ON public.ai_usage(created_at DESC);

-- ============================================
-- PARTNERSHIP INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  tier TEXT NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'growth', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partnerships_status ON public.partnership_inquiries(status);
CREATE INDEX idx_partnerships_created ON public.partnership_inquiries(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- USERS: Anyone can read profiles, users can update their own
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- IDEAS: Public ideas are visible to all, users manage their own
CREATE POLICY "Public ideas are viewable by everyone" ON public.ideas
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Authenticated users can create ideas" ON public.ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON public.ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON public.ideas
  FOR DELETE USING (auth.uid() = user_id);

-- MATCHES: Visible to idea owner and builder
CREATE POLICY "Matches visible to participants" ON public.matches
  FOR SELECT USING (
    builder_id = auth.uid() OR
    idea_id IN (SELECT id FROM public.ideas WHERE user_id = auth.uid())
  );

CREATE POLICY "Authenticated users can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = builder_id);

CREATE POLICY "Participants can update matches" ON public.matches
  FOR UPDATE USING (
    builder_id = auth.uid() OR
    idea_id IN (SELECT id FROM public.ideas WHERE user_id = auth.uid())
  );

-- MESSAGES: Only sender and receiver can see messages
CREATE POLICY "Messages visible to participants" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Authenticated users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receiver can update message read status" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid());

-- PRODUCTS: Everyone can view active products
CREATE POLICY "Active products are viewable by everyone" ON public.products
  FOR SELECT USING (active = true);

-- PURCHASES: Users can see their own purchases
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS: Users can see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- AI USAGE: Users can see their own usage
CREATE POLICY "Users can view own AI usage" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI usage records" ON public.ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PARTNERSHIP INQUIRIES: Anyone can submit, only admins can view all
CREATE POLICY "Anyone can submit partnership inquiry" ON public.partnership_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Inquiries viewable by admins" ON public.partnership_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND email IN ('ideaparkhq@gmail.com', 'mfunkthomaz@gmail.com')
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_ideas_updated
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment idea views
CREATE OR REPLACE FUNCTION public.increment_idea_views(idea_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ideas SET views = views + 1 WHERE id = idea_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get conversation list for a user
CREATE OR REPLACE FUNCTION public.get_conversations(p_user_id UUID)
RETURNS TABLE (
  other_user_id UUID,
  other_user_name TEXT,
  other_user_avatar TEXT,
  other_user_founding BOOLEAN,
  last_message_content TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender UUID,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH conversation_partners AS (
    SELECT DISTINCT
      CASE WHEN sender_id = p_user_id THEN receiver_id ELSE sender_id END AS partner_id
    FROM public.messages
    WHERE sender_id = p_user_id OR receiver_id = p_user_id
  ),
  latest_messages AS (
    SELECT DISTINCT ON (
      LEAST(m.sender_id, m.receiver_id),
      GREATEST(m.sender_id, m.receiver_id)
    )
    m.*
    FROM public.messages m
    WHERE m.sender_id = p_user_id OR m.receiver_id = p_user_id
    ORDER BY
      LEAST(m.sender_id, m.receiver_id),
      GREATEST(m.sender_id, m.receiver_id),
      m.created_at DESC
  ),
  unread_counts AS (
    SELECT sender_id AS from_user, COUNT(*) AS cnt
    FROM public.messages
    WHERE receiver_id = p_user_id AND read = false
    GROUP BY sender_id
  )
  SELECT
    cp.partner_id,
    u.name,
    u.avatar_url,
    u.is_founding_member,
    lm.content,
    lm.created_at,
    lm.sender_id,
    COALESCE(uc.cnt, 0)
  FROM conversation_partners cp
  JOIN public.users u ON u.id = cp.partner_id
  LEFT JOIN latest_messages lm ON (
    (lm.sender_id = p_user_id AND lm.receiver_id = cp.partner_id) OR
    (lm.sender_id = cp.partner_id AND lm.receiver_id = p_user_id)
  )
  LEFT JOIN unread_counts uc ON uc.from_user = cp.partner_id
  ORDER BY lm.created_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get admin stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM public.users),
    'total_ideas', (SELECT COUNT(*) FROM public.ideas),
    'total_matches', (SELECT COUNT(*) FROM public.matches),
    'total_messages', (SELECT COUNT(*) FROM public.messages),
    'active_subscriptions', (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active'),
    'monthly_revenue', (
      SELECT COALESCE(SUM(
        CASE
          WHEN plan = 'basic' THEN 9
          WHEN plan = 'pro' THEN 29
          WHEN plan = 'enterprise' THEN 99
          ELSE 0
        END
      ), 0)
      FROM public.subscriptions WHERE status = 'active'
    ),
    'new_signups_today', (SELECT COUNT(*) FROM public.users WHERE created_at >= CURRENT_DATE),
    'ideas_posted_today', (SELECT COUNT(*) FROM public.ideas WHERE created_at >= CURRENT_DATE),
    'founding_members', (SELECT COUNT(*) FROM public.users WHERE is_founding_member = true)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA: Products for Digital Store
-- ============================================
INSERT INTO public.products (title, description, price, file_url, image_url, category, featured) VALUES
  ('Startup Pitch Deck Template', 'A proven pitch deck template used by YC-backed founders. 15 slides covering problem, solution, market, traction, team, and financials.', 1900, '/files/pitch-deck.pptx', NULL, 'template', true),
  ('Business Model Canvas Kit', 'Interactive canvas with guided prompts for validating your business model. Includes competitor analysis framework.', 900, '/files/bmc-kit.pdf', NULL, 'template', true),
  ('Co-Founder Agreement Template', 'Lawyer-reviewed co-founder agreement covering equity splits, vesting, IP assignment, and decision-making framework.', 2900, '/files/cofounder-agreement.docx', NULL, 'legal', true),
  ('MVP Roadmap Planner', 'Notion + spreadsheet bundle for planning your minimum viable product. Prioritization matrix, sprint templates, and launch checklist.', 1400, '/files/mvp-planner.zip', NULL, 'template', false),
  ('Market Research Toolkit', 'Step-by-step guide to validating market demand. Includes survey templates, interview scripts, and analysis frameworks.', 1900, '/files/market-research.zip', NULL, 'toolkit', true),
  ('NDA Template Pack', '3 NDA templates (mutual, one-way, employee) reviewed by startup attorneys. Customize and send in minutes.', 700, '/files/nda-pack.zip', NULL, 'legal', false),
  ('Growth Playbook: 0 to 1000 Users', 'Tactical guide covering 12 acquisition channels. Real examples, budget templates, and tracking dashboards.', 2400, '/files/growth-playbook.pdf', NULL, 'guide', true),
  ('Financial Model Template', 'Excel financial model for early-stage startups. Revenue projections, burn rate calculator, and fundraising scenarios.', 1900, '/files/financial-model.xlsx', NULL, 'template', false)
ON CONFLICT DO NOTHING;
