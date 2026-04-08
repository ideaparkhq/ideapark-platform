import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const body = await request.json()
  const { company, contact_name, email, message, tier } = body

  if (!company || !contact_name || !email) {
    return NextResponse.json(
      { error: 'Company name, contact name, and email are required' },
      { status: 400 }
    )
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('partnership_inquiries')
    .insert({
      company,
      contact_name,
      email,
      message: message || '',
      tier: tier || 'starter',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 })
}
