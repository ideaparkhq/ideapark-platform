import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import type { PlanTier } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { plan, type } = body as { plan?: PlanTier; type?: string }

  const origin = request.headers.get('origin') || 'http://localhost:3000'

  try {
    // Credit pack purchase
    if (type === 'credits') {
      const packId = body.pack_id as keyof typeof STRIPE_PRICES
      const priceId = STRIPE_PRICES[packId]
      const creditsMap: Record<string, number> = {
        credits_5: 25,
        credits_20: 120,
        credits_50: 350,
      }

      if (!priceId) {
        return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: user.email!,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          user_id: user.id,
          type: 'credit_purchase',
          credits: String(creditsMap[packId] || 0),
        },
        success_url: `${origin}/settings/billing?success=credits`,
        cancel_url: `${origin}/settings/billing?canceled=true`,
      })

      return NextResponse.json({ url: session.url })
    }

    // Subscription
    if (!plan || plan === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Check if user already has a Stripe customer
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = existingSub?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        type: 'subscription',
      },
      success_url: `${origin}/settings/billing?success=subscription`,
      cancel_url: `${origin}/settings/billing?canceled=true`,
    })

    // Create/update subscription record
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        stripe_subscription_id: 'pending',
        stripe_customer_id: customerId,
        plan,
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'user_id' })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
