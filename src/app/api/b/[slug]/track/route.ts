import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createServerSupabaseClient()
  const { slug } = params

  // Find the idea by slug
  const { data: idea, error: fetchError } = await supabase
    .from('ideas')
    .select('id, visitors')
    .eq('slug', slug)
    .eq('status', 'live')
    .single()

  if (fetchError || !idea) {
    // Silently fail — don't break the page for tracking errors
    return NextResponse.json({ success: true })
  }

  // Increment visitor count
  try {
    await supabase.rpc('increment_idea_visitors', { idea_uuid: idea.id })
  } catch {
    // Fallback: manual increment
    await supabase
      .from('ideas')
      .update({ visitors: idea.visitors + 1 })
      .eq('id', idea.id)
  }

  return NextResponse.json({ success: true })
}
