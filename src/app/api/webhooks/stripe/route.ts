import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  try {
    switch (event.type) {
      // Product purchase completed
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (metadata?.type === 'product_purchase') {
          await supabase.from('purchases').insert({
            user_id: metadata.user_id,
            product_id: metadata.product_id,
            stripe_payment_id: session.payment_intent as string,
          })
        }

        if (metadata?.type === 'credit_purchase') {
          const credits = parseInt(metadata.credits || '0')
          const { data: user } = await supabase
            .from('users')
            .select('ai_credits')
            .eq('id', metadata.user_id)
            .single()

          if (user) {
            await supabase
              .from('users')
              .update({ ai_credits: user.ai_credits + credits })
              .eq('id', metadata.user_id)
          }
        }
        break
      }

      // Subscription created or updated
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by stripe customer ID
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        const planMap: Record<string, string> = {}
        if (process.env.STRIPE_PRICE_BASIC) planMap[process.env.STRIPE_PRICE_BASIC] = 'basic'
        if (process.env.STRIPE_PRICE_PRO) planMap[process.env.STRIPE_PRICE_PRO] = 'pro'
        if (process.env.STRIPE_PRICE_ENTERPRISE) planMap[process.env.STRIPE_PRICE_ENTERPRISE] = 'enterprise'

        const priceId = subscription.items.data[0]?.price.id
        const plan = planMap[priceId] || 'basic'

        const statusMap: Record<string, string> = {
          active: 'active',
          canceled: 'canceled',
          past_due: 'past_due',
          trialing: 'trialing',
        }

        const subData = {
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customerId,
          plan,
          status: statusMap[subscription.status] || 'active',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }

        if (existingSub) {
          await supabase
            .from('subscriptions')
            .update(subData)
            .eq('stripe_customer_id', customerId)

          // Update user plan
          await supabase
            .from('users')
            .update({ plan })
            .eq('id', existingSub.user_id)
        }
        break
      }

      // Subscription canceled
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_customer_id', customerId)

          await supabase
            .from('users')
            .update({ plan: 'free', ai_credits: 5 })
            .eq('id', sub.user_id)
        }
        break
      }

      // Invoice payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customerId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
