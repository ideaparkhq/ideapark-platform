import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
  credits_5: process.env.STRIPE_PRICE_CREDITS_5!,
  credits_20: process.env.STRIPE_PRICE_CREDITS_20!,
  credits_50: process.env.STRIPE_PRICE_CREDITS_50!,
}

export const CREDIT_PACKS = [
  { id: 'credits_5', credits: 25, price: 5, label: '25 Credits' },
  { id: 'credits_20', credits: 120, price: 20, label: '120 Credits' },
  { id: 'credits_50', credits: 350, price: 50, label: '350 Credits' },
]
