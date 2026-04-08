'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillTagProps {
  skill: string
  removable?: boolean
  onRemove?: () => void
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function SkillTag({ skill, removable, onRemove, selected, onClick, size = 'sm' }: SkillTagProps) {
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium transition-all duration-200',
        sizes[size],
        selected
          ? 'bg-brand-600/20 text-brand-400 border-brand-500/30'
          : 'bg-dark-800 text-dark-300 border-dark-700',
        onClick && 'cursor-pointer hover:border-brand-500/50 hover:text-brand-400'
      )}
      onClick={onClick}
    >
      {skill}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-0.5 rounded-full hover:bg-dark-700 p-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}
