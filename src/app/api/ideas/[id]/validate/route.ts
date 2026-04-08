import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  const { id } = params

  // Fetch the idea
  const { data: idea, error: fetchError } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  }

  // Update status to validating
  await supabase
    .from('ideas')
    .update({ status: 'validating' })
    .eq('id', id)

  const prompt = `You are IdeaPark's AI Idea Validator. Analyze this business idea and return a structured validation.

IDEA: "${idea.raw_input}"
${idea.target_customer ? `TARGET CUSTOMER: ${idea.target_customer}` : ''}
${idea.price_range ? `PRICE RANGE: ${idea.price_range}` : ''}
${idea.differentiator ? `DIFFERENTIATOR: ${idea.differentiator}` : ''}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "score_market": <1-10>,
  "score_monetization": <1-10>,
  "score_speed": <1-10>,
  "score_competition": <1-10>,
  "score_overall": <1-10>,
  "validation_report": {
    "summary": "<2-3 sentence summary>",
    "market_analysis": "<market opportunity analysis>",
    "competition_analysis": "<competitive landscape>",
    "monetization_analysis": "<revenue potential>",
    "speed_analysis": "<time to market>",
    "verdict": "<BUILD IT 🟢 or PROCEED WITH CAUTION 🟡 or RETHINK 🔴>",
    "revenue_potential": "<estimated monthly revenue range>"
  }
}

Be direct and honest. Real scores, no inflation.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a startup validator. Respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI validation error:', response.status)
      await supabase.from('ideas').update({ status: 'submitted' }).eq('id', id)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      await supabase.from('ideas').update({ status: 'submitted' }).eq('id', id)
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 })
    }

    let parsed
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      await supabase.from('ideas').update({ status: 'submitted' }).eq('id', id)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 })
    }

    // Update idea with validation scores
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        score_market: parsed.score_market,
        score_monetization: parsed.score_monetization,
        score_speed: parsed.score_speed,
        score_competition: parsed.score_competition,
        score_overall: parsed.score_overall,
        validation_report: parsed.validation_report,
        status: 'validated',
      })
      .eq('id', id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save validation' }, { status: 500 })
    }

    // Deduct credit if user is logged in
    if (idea.user_id) {
      const { data: profile } = await supabase
        .from('users')
        .select('credits')
        .eq('id', idea.user_id)
        .single()

      if (profile && profile.credits > 0) {
        await supabase
          .from('users')
          .update({ credits: profile.credits - 1 })
          .eq('id', idea.user_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Validation error:', error)
    await supabase.from('ideas').update({ status: 'submitted' }).eq('id', id)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
