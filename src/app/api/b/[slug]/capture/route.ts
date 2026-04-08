import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createServerSupabaseClient()
  const { slug } = params

  const body = await request.json()
  const { email } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  // Find the idea by slug
  const { data: idea, error: fetchError } = await supabase
    .from('ideas')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'live')
    .single()

  if (fetchError || !idea) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // Save email capture
  const { error: insertError } = await supabase
    .from('email_captures')
    .insert({
      idea_id: idea.id,
      email: email.trim().toLowerCase(),
      source: 'landing_page',
    })

  if (insertError) {
    // Duplicate email — silently succeed
    if (insertError.code === '23505') {
      return NextResponse.json({ success: true })
    }
    console.error('Email capture error:', insertError)
    return NextResponse.json({ error: 'Failed to save email' }, { status: 500 })
  }

  // Increment signup count
  try {
    await supabase.rpc('increment_idea_signups', { idea_uuid: idea.id })
  } catch {
    // Fallback: manual increment via raw update
    await supabase
      .from('ideas')
      .update({ signups: 1 })
      .eq('id', idea.id)
  }

  return NextResponse.json({ success: true })
}
