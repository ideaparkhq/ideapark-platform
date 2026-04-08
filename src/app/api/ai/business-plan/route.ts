import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check credits (business plan costs 3 credits)
  const creditsCost = 3
  const { data: profile } = await supabase
    .from('users')
    .select('ai_credits')
    .eq('id', user.id)
    .single()

  if (!profile || profile.ai_credits < creditsCost) {
    return NextResponse.json(
      { error: `Business plan generation requires ${creditsCost} credits. You have ${profile?.ai_credits || 0} remaining.` },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { title, problem, solution, market, category } = body

  if (!title || !problem || !solution) {
    return NextResponse.json({ error: 'Title, problem, and solution are required' }, { status: 400 })
  }

  const prompt = `You are IdeaPark's AI Business Plan Generator. Create a concise but comprehensive business plan outline for this startup idea.

IDEA:
Title: ${title}
Problem: ${problem}
Solution: ${solution}
${market ? `Target Market: ${market}` : ''}
${category ? `Category: ${category}` : ''}

Generate a business plan in this exact JSON format:
{
  "company_name": "${title}",
  "executive_summary": "<3-4 sentence compelling summary>",
  "problem_statement": "<expanded problem analysis with data points>",
  "solution_overview": "<detailed solution description with key features>",
  "value_proposition": "<clear unique value prop in 1-2 sentences>",
  "target_market": {
    "primary": "<primary target segment>",
    "secondary": "<secondary target segment>",
    "tam": "<total addressable market estimate>",
    "sam": "<serviceable addressable market>",
    "som": "<serviceable obtainable market, year 1>"
  },
  "business_model": {
    "revenue_streams": ["<stream 1>", "<stream 2>", "<stream 3>"],
    "pricing_strategy": "<pricing approach>",
    "unit_economics": "<brief unit economics outline>"
  },
  "competitive_landscape": {
    "direct_competitors": ["<competitor 1>", "<competitor 2>"],
    "indirect_competitors": ["<competitor 1>", "<competitor 2>"],
    "competitive_advantages": ["<advantage 1>", "<advantage 2>", "<advantage 3>"]
  },
  "go_to_market": {
    "launch_strategy": "<how to launch>",
    "acquisition_channels": ["<channel 1>", "<channel 2>", "<channel 3>"],
    "partnerships": "<potential partnership strategy>"
  },
  "milestones": [
    {"timeline": "Month 1-3", "goals": ["<goal>", "<goal>"]},
    {"timeline": "Month 4-6", "goals": ["<goal>", "<goal>"]},
    {"timeline": "Month 7-12", "goals": ["<goal>", "<goal>"]},
    {"timeline": "Year 2", "goals": ["<goal>", "<goal>"]}
  ],
  "team_needs": ["<role 1>", "<role 2>", "<role 3>"],
  "financial_projections": {
    "startup_costs": "<estimated range>",
    "monthly_burn": "<estimated monthly burn rate>",
    "break_even": "<estimated break-even timeline>",
    "year_1_revenue": "<projected revenue range>"
  },
  "risks_and_mitigation": [
    {"risk": "<risk>", "mitigation": "<strategy>"},
    {"risk": "<risk>", "mitigation": "<strategy>"},
    {"risk": "<risk>", "mitigation": "<strategy>"}
  ],
  "funding_strategy": "<recommended funding approach>"
}

Be specific, realistic, and actionable. No hand-waving. Real numbers where possible, reasonable estimates where not.`

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
          { role: 'system', content: 'You are a business plan generator. Always respond with valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
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

    let plan
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      plan = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 })
    }

    // Deduct credits and log usage
    await supabase
      .from('users')
      .update({ ai_credits: profile.ai_credits - creditsCost })
      .eq('id', user.id)

    await supabase
      .from('ai_usage')
      .insert({
        user_id: user.id,
        query_type: 'business_plan',
        credits_used: creditsCost,
        input_summary: title,
      })

    return NextResponse.json({
      plan,
      credits_remaining: profile.ai_credits - creditsCost,
    })
  } catch (error) {
    console.error('AI business plan error:', error)
    return NextResponse.json({ error: 'Failed to generate business plan' }, { status: 500 })
  }
}
