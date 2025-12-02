import { AddressSelector } from './AddressSelector'
import { Card } from '@/components/ui/card'
import { Trash, Recycle, Plant, Coffee, Calendar } from '@phosphor-icons/react'
import type { Property } from '@/lib/types'
import { getNextCollectionDate, getDayName, formatDate } from '@/lib/dates'

interface FindBinDayScreenProps {
  properties: Property[]
  selectedProperty?: Property
  onPropertySelect: (property: Property) => void
}

export function FindBinDayScreen({ properties, selectedProperty, onPropertySelect }: FindBinDayScreenProps) {
  const binTypes = [
    { 
      type: 'rubbish', 
      label: 'Rubbish bin', 
      icon: Trash, 
      color: 'text-[oklch(0.13_0_0)]',
      bgColor: 'bg-[oklch(0.13_0_0)]/5',
      dayOfWeek: selectedProperty?.rubbishDayOfWeek,
    },
    { 
      type: 'recycling', 
      label: 'Recycling bin', 
      icon: Recycle, 
      color: 'text-[oklch(0.52_0.11_254)]',
      bgColor: 'bg-[oklch(0.52_0.11_254)]/5',
      dayOfWeek: selectedProperty?.recyclingDayOfWeek,
    },
    { 
      type: 'garden', 
      label: 'Garden waste bin', 
      icon: Plant, 
      color: 'text-[oklch(0.45_0.13_163)]',
      bgColor: 'bg-[oklch(0.45_0.13_163)]/5',
      dayOfWeek: selectedProperty?.gardenDayOfWeek,
    },
    { 
      type: 'food', 
      label: 'Food waste bin', 
      icon: Coffee, 
      color: 'text-[oklch(0.35_0.08_60)]',
      bgColor: 'bg-[oklch(0.35_0.08_60)]/5',
      dayOfWeek: selectedProperty?.foodDayOfWeek,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find my bin day</h1>
        <p className="text-lg text-muted-foreground">
          Enter your postcode to see your collection schedule
        </p>
      </div>

      <AddressSelector
        properties={properties}
        onAddressSelected={onPropertySelect}
      />

      {selectedProperty && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Collection days for</h2>
            <p className="text-lg text-muted-foreground">
              {selectedProperty.address}, {selectedProperty.postcode}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {binTypes.map(({ type, label, icon: Icon, color, bgColor, dayOfWeek }) => {
              if (dayOfWeek === undefined) return null
              
              const nextDate = getNextCollectionDate(dayOfWeek)
              
              return (
                <Card key={type} className={`p-5 ${bgColor} border-l-4 ${color.replace('text-', 'border-')}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${bgColor}`}>
                      <Icon size={32} weight="duotone" className={color} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{label}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Every {getDayName(dayOfWeek)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Next collection: <span className="font-semibold text-foreground">{formatDate(nextDate)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="p-4 bg-muted/50">
            <p className="text-sm">
              <strong>Note:</strong> Collection dates may change on bank holidays. 
              Collections will usually be moved to the next working day.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
