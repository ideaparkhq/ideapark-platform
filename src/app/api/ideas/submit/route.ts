import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { raw_input, target_customer, price_range, differentiator } = body

  if (!raw_input || typeof raw_input !== 'string' || raw_input.trim().length === 0) {
    return NextResponse.json({ error: 'Idea description is required' }, { status: 400 })
  }

  if (raw_input.trim().length > 500) {
    return NextResponse.json({ error: 'Idea must be 500 characters or less' }, { status: 400 })
  }

  // If logged in, check credits
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profile && profile.credits < 1) {
      return NextResponse.json(
        { error: 'No credits remaining. Upgrade your plan for more credits.' },
        { status: 403 }
      )
    }
  }

  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: user ? user.id : null,
      raw_input: raw_input.trim(),
      target_customer: target_customer || null,
      price_range: price_range || null,
      differentiator: differentiator || null,
      status: 'submitted',
      visitors: 0,
      signups: 0,
      revenue: 0,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Submit idea error:', error)
    return NextResponse.json({ error: 'Failed to submit idea' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
