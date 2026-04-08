import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  foundingMember?: boolean
}

export function Avatar({ src, name, size = 'md', className, foundingMember }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div className={cn('relative', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-semibold text-white',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {foundingMember && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px]">
          ⭐
        </div>
      )}
    </div>
  )
}
