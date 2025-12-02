import { Card } from '@/components/ui/card'
import { Trash, Recycle, Plant, Coffee } from '@phosphor-icons/react'
import { formatDate, getDaysUntil } from '@/lib/dates'
import type { BinType } from '@/lib/types'

interface CollectionCardProps {
  binType: BinType
  nextDate: Date
}

const binConfig = {
  rubbish: {
    label: 'Rubbish bin',
    icon: Trash,
    color: 'text-[oklch(0.13_0_0)]',
    bgColor: 'bg-[oklch(0.13_0_0)]/5',
  },
  recycling: {
    label: 'Recycling bin',
    icon: Recycle,
    color: 'text-[oklch(0.52_0.11_254)]',
    bgColor: 'bg-[oklch(0.52_0.11_254)]/5',
  },
  garden: {
    label: 'Garden waste bin',
    icon: Plant,
    color: 'text-[oklch(0.45_0.13_163)]',
    bgColor: 'bg-[oklch(0.45_0.13_163)]/5',
  },
  food: {
    label: 'Food waste bin',
    icon: Coffee,
    color: 'text-[oklch(0.35_0.08_60)]',
    bgColor: 'bg-[oklch(0.35_0.08_60)]/5',
  },
}

export function CollectionCard({ binType, nextDate }: CollectionCardProps) {
  const config = binConfig[binType]
  const Icon = config.icon
  const daysUntil = getDaysUntil(nextDate)
  
  const getTimeText = () => {
    if (daysUntil === 0) return 'Today'
    if (daysUntil === 1) return 'Tomorrow'
    return `In ${daysUntil} days`
  }
  
  return (
    <Card className={`p-4 transition-all hover:shadow-md ${config.bgColor} border-l-4 ${config.color.replace('text-', 'border-')}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <Icon size={32} weight="duotone" className={config.color} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{config.label}</h3>
          <p className="text-2xl font-bold mb-1">{getTimeText()}</p>
          <p className="text-muted-foreground">{formatDate(nextDate)}</p>
        </div>
      </div>
    </Card>
  )
}
