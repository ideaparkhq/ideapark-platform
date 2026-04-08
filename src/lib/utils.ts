// Lightweight cn utility — no external dependency needed
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return inputs
    .flatMap((input) => {
      if (!input) return []
      if (typeof input === 'string') return [input]
      return Object.entries(input)
        .filter(([, value]) => value)
        .map(([key]) => key)
    })
    .join(' ')
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    concept: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    validation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    prototype: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    mvp: 'bg-green-500/20 text-green-400 border-green-500/30',
    growth: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }
  return colors[stage] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    saas: 'bg-indigo-500/20 text-indigo-400',
    mobile_app: 'bg-pink-500/20 text-pink-400',
    ecommerce: 'bg-orange-500/20 text-orange-400',
    marketplace: 'bg-cyan-500/20 text-cyan-400',
    ai_ml: 'bg-violet-500/20 text-violet-400',
    fintech: 'bg-emerald-500/20 text-emerald-400',
    healthtech: 'bg-red-500/20 text-red-400',
    edtech: 'bg-amber-500/20 text-amber-400',
    sustainability: 'bg-green-500/20 text-green-400',
    social: 'bg-blue-500/20 text-blue-400',
    productivity: 'bg-slate-500/20 text-slate-400',
    entertainment: 'bg-fuchsia-500/20 text-fuchsia-400',
    hardware: 'bg-gray-500/20 text-gray-400',
    other: 'bg-neutral-500/20 text-neutral-400',
  }
  return colors[category] || 'bg-neutral-500/20 text-neutral-400'
}
