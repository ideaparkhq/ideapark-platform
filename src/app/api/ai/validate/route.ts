import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check credits
  const { data: profile } = await supabase
    .from('users')
    .select('ai_credits')
    .eq('id', user.id)
    .single()

  if (!profile || profile.ai_credits < 1) {
    return NextResponse.json(
      { error: 'No AI credits remaining. Purchase more credits or upgrade your plan.' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { title, problem, solution, market } = body

  if (!title || !problem || !solution) {
    return NextResponse.json({ error: 'Title, problem, and solution are required' }, { status: 400 })
  }

  const prompt = `You are IdeaPark's AI Idea Validator — sharp, honest, no fluff. Analyze this startup idea and return a structured validation report.

IDEA:
Title: ${title}
Problem: ${problem}
Solution: ${solution}
${market ? `Target Market: ${market}` : ''}

Provide your analysis in this exact JSON format:
{
  "overall_score": <number 1-100>,
  "verdict": "<one of: Strong Potential | Promising with Caveats | Needs Work | Rethink This>",
  "summary": "<2-3 sentence executive summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "market_analysis": {
    "size_estimate": "<market size assessment>",
    "competition_level": "<low/medium/high>",
    "timing": "<why now is or isn't the right time>"
  },
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "next_steps": ["<step 1>", "<step 2>", "<step 3>"]
}

Be direct. Be honest. No corporate speak. Think like a sharp investor doing due diligence in 60 seconds.`

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
          { role: 'system', content: 'You are a startup idea validator. Always respond with valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI error:', errorData)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 })
    }

    // Parse AI response
    let validation
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      validation = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 })
    }

    // Deduct credits and log usage
    await supabase
      .from('users')
      .update({ ai_credits: profile.ai_credits - 1 })
      .eq('id', user.id)

    await supabase
      .from('ai_usage')
      .insert({
        user_id: user.id,
        query_type: 'idea_validation',
        credits_used: 1,
        input_summary: title,
      })

    return NextResponse.json({
      validation,
      credits_remaining: profile.ai_credits - 1,
    })
  } catch (error) {
    console.error('AI validation error:', error)
    return NextResponse.json({ error: 'Failed to validate idea' }, { status: 500 })
  }
}
