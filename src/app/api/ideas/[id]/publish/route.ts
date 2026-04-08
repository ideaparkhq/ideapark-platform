import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const { id } = params

  // Must be authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan — must be pro or scale
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (!profile || profile.plan === 'free') {
    return NextResponse.json(
      { error: 'Publishing requires a Pro or Scale plan.' },
      { status: 403 }
    )
  }

  // Fetch the idea
  const { data: idea, error: fetchError } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  // Must belong to user
  if (idea.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Must be in ready state
  if (idea.status !== 'ready') {
    return NextResponse.json(
      { error: 'Idea must be fully built before publishing.' },
      { status: 400 }
    )
  }

  // Generate slug
  let slug = slugify(idea.business_name || idea.raw_input.slice(0, 40))

  // Check for slug collisions
  const { data: existing } = await supabase
    .from('ideas')
    .select('id')
    .eq('slug', slug)
    .neq('id', id)
    .single()

  if (existing) {
    slug = `${slug}-${id.slice(0, 6)}`
  }

  // Publish
  const { error: updateError } = await supabase
    .from('ideas')
    .update({
      status: 'live',
      slug,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    console.error('Publish error:', updateError)
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug })
}
