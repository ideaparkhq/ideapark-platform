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
    .select('*')
    .eq('id', id)
    .single()

  if (error || !idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  return NextResponse.json(idea)
}
