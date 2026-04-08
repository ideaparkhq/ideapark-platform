import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const { id } = params

  const { data: idea, error } = await supabase
    .from('ideas')
    .select('*, user:users(*)')
    .eq('id', id)
    .single()

  if (error || !idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  // Increment view count
  await supabase.rpc('increment_idea_views', { idea_uuid: id })

  // Get match count
  const { count: matchCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('idea_id', id)

  // Check if current user has already applied
  const { data: { user } } = await supabase.auth.getUser()
  let hasApplied = false
  if (user) {
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('idea_id', id)
      .eq('builder_id', user.id)
      .single()
    hasApplied = !!existingMatch
  }

  return NextResponse.json({
    ...idea,
    match_count: matchCount || 0,
    has_applied: hasApplied,
  })
}
