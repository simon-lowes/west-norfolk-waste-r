import { cn } from '@/lib/utils'

interface BinBadgeProps {
  type: 'general' | 'recycling' | 'garden' | 'food' | 'recycling-centre'
  className?: string
}

const binConfig = {
  general: {
    label: 'General waste',
    color: 'bg-[oklch(0.13_0_0)] text-white',
  },
  recycling: {
    label: 'Recycling',
    color: 'bg-[oklch(0.52_0.11_254)] text-white',
  },
  garden: {
    label: 'Garden waste',
    color: 'bg-[oklch(0.45_0.13_163)] text-white',
  },
  food: {
    label: 'Food waste',
    color: 'bg-[oklch(0.35_0.08_60)] text-white',
  },
  'recycling-centre': {
    label: 'Recycling centre',
    color: 'bg-[oklch(0.40_0.009_240)] text-white',
  },
}

export function BinBadge({ type, className }: BinBadgeProps) {
  const config = binConfig[type]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-1 text-sm font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
