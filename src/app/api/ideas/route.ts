import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const stage = searchParams.get('stage')
  const skill = searchParams.get('skill')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('ideas')
    .select('*, user:users(*)', { count: 'exact' })
    .eq('visibility', 'public')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (stage && stage !== 'all') {
    query = query.eq('stage', stage)
  }
  if (skill) {
    query = query.contains('skills_needed', [skill])
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  switch (sort) {
    case 'popular':
      query = query.order('upvotes', { ascending: false })
      break
    case 'trending':
      query = query.order('views', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ideas: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  })
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, problem, solution, market, skills_needed, category, stage, visibility, nda_required } = body

  if (!title || !problem || !solution) {
    return NextResponse.json({ error: 'Title, problem, and solution are required' }, { status: 400 })
  }

  // Check user plan limits
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile) {
    const planLimits: Record<string, number> = { free: 1, basic: 5, pro: 999999, enterprise: 999999 }
    const maxPosts = planLimits[profile.plan] || 1

    const { count } = await supabase
      .from('ideas')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count || 0) >= maxPosts) {
      return NextResponse.json(
        { error: `Your ${profile.plan} plan allows ${maxPosts} idea post${maxPosts === 1 ? '' : 's'}. Upgrade to post more.` },
        { status: 403 }
      )
    }
  }

  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: user.id,
      title,
      problem,
      solution,
      market: market || '',
      skills_needed: skills_needed || [],
      category: category || 'other',
      stage: stage || 'concept',
      visibility: visibility || 'public',
      nda_required: nda_required || false,
    })
    .select('*, user:users(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
