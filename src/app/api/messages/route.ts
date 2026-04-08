import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partnerId = searchParams.get('partner')

  if (partnerId) {
    // Get messages in a conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(*), receiver:users!receiver_id(*)')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', partnerId)
      .eq('receiver_id', user.id)
      .eq('read', false)

    return NextResponse.json({ messages: messages || [] })
  }

  // Get conversation list
  const { data: conversations, error } = await supabase
    .rpc('get_conversations', { p_user_id: user.id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ conversations: conversations || [] })
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check plan allows messaging
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan === 'free') {
    return NextResponse.json(
      { error: 'Messaging requires a Basic plan or higher. Upgrade to connect with builders.' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { receiver_id, content } = body

  if (!receiver_id || !content) {
    return NextResponse.json({ error: 'Receiver and content are required' }, { status: 400 })
  }

  if (receiver_id === user.id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id,
      content: content.trim(),
    })
    .select('*, sender:users!sender_id(*), receiver:users!receiver_id(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
