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

  // Update status to building
  await supabase
    .from('ideas')
    .update({ status: 'building' })
    .eq('id', id)

  const prompt = `You are IdeaPark's AI Business Builder. Given this validated idea, generate a COMPLETE business package.

IDEA: "${idea.raw_input}"
${idea.target_customer ? `TARGET CUSTOMER: ${idea.target_customer}` : ''}
${idea.price_range ? `PRICE RANGE: ${idea.price_range}` : ''}
${idea.differentiator ? `DIFFERENTIATOR: ${idea.differentiator}` : ''}
VALIDATION SCORE: ${idea.score_overall || 'N/A'}/10

Return ONLY valid JSON (no markdown, no code blocks):
{
  "business_name": "<catchy 1-2 word name>",
  "tagline": "<punchy tagline under 10 words>",
  "value_proposition": "<clear value prop, 2-3 sentences>",
  "target_persona": "<specific customer persona description>",
  "pricing_strategy": "<recommended pricing with specific numbers>",
  "revenue_model": "<subscription/one-time/freemium/etc with details>",
  "landing_page_html": "<COMPLETE self-contained HTML page with inline CSS. Dark theme. Must include: hero section with headline + tagline, features/benefits section, social proof placeholder, email signup form (input + button), and footer. Use modern design with gradients, good typography, and responsive layout. Make it look premium and professional. All styles must be inline or in a <style> tag within the HTML. Do NOT use external stylesheets.>",
  "ad_copy": [
    {"platform": "Facebook", "headline": "<headline>", "body": "<ad body>", "cta": "<call to action>"},
    {"platform": "Instagram", "headline": "<headline>", "body": "<ad body>", "cta": "<call to action>"},
    {"platform": "Google Ads", "headline": "<headline>", "body": "<ad body>", "cta": "<call to action>"}
  ],
  "social_posts": [
    {"platform": "Twitter/X", "content": "<tweet text>", "hashtags": ["#tag1", "#tag2"]},
    {"platform": "LinkedIn", "content": "<post text>", "hashtags": ["#tag1", "#tag2"]},
    {"platform": "Instagram", "content": "<caption>", "hashtags": ["#tag1", "#tag2", "#tag3"]}
  ],
  "email_sequence": [
    {"subject": "<welcome email subject>", "body": "<welcome email body>", "delay_days": 0},
    {"subject": "<day 3 subject>", "body": "<nurture email body>", "delay_days": 3},
    {"subject": "<day 7 subject>", "body": "<conversion email body>", "delay_days": 7}
  ]
}

Make everything specific, compelling, and ready to use. The landing page HTML must be complete and visually impressive.`

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
          { role: 'system', content: 'You are a business builder AI. Respond with valid JSON only. The landing_page_html field must contain complete, self-contained HTML with inline styles.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI build error:', response.status)
      await supabase.from('ideas').update({ status: 'validated' }).eq('id', id)
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      await supabase.from('ideas').update({ status: 'validated' }).eq('id', id)
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 })
    }

    let parsed
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      await supabase.from('ideas').update({ status: 'validated' }).eq('id', id)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 502 })
    }

    // Update idea with build results
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        business_name: parsed.business_name,
        tagline: parsed.tagline,
        value_proposition: parsed.value_proposition,
        target_persona: parsed.target_persona,
        pricing_strategy: parsed.pricing_strategy,
        revenue_model: parsed.revenue_model,
        landing_page_html: parsed.landing_page_html,
        ad_copy: parsed.ad_copy,
        social_posts: parsed.social_posts,
        email_sequence: parsed.email_sequence,
        status: 'ready',
      })
      .eq('id', id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save build' }, { status: 500 })
    }

    // Deduct credits (build costs 5 credits)
    if (idea.user_id) {
      const { data: profile } = await supabase
        .from('users')
        .select('credits')
        .eq('id', idea.user_id)
        .single()

      if (profile && profile.credits >= 5) {
        await supabase
          .from('users')
          .update({ credits: profile.credits - 5 })
          .eq('id', idea.user_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Build error:', error)
    await supabase.from('ideas').update({ status: 'validated' }).eq('id', id)
    return NextResponse.json({ error: 'Build failed' }, { status: 500 })
  }
}
