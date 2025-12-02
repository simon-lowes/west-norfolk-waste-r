import { CollectionCard } from '@/components/CollectionCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  MagnifyingGlass, 
  Trash, 
  Recycle, 
  MapPin, 
  Warning,
  PencilSimple 
} from '@phosphor-icons/react'
import type { Property, ServiceAlert } from '@/lib/types'
import { getNextCollectionDate } from '@/lib/dates'

interface HomeScreenProps {
  property: Property
  alerts: ServiceAlert[]
  onNavigate: (screen: string) => void
}

export function HomeScreen({ property, alerts, onNavigate }: HomeScreenProps) {
  const activeAlerts = alerts.filter(alert => {
    const now = new Date()
    const start = new Date(alert.startDate)
    const end = new Date(alert.endDate)
    
    return now >= start && now <= end && 
      (alert.affectedPostcodes.length === 0 || 
       alert.affectedPostcodes.includes(property.postcode))
  })

  const collections = [
    {
      type: 'rubbish' as const,
      date: getNextCollectionDate(property.rubbishDayOfWeek),
    },
    {
      type: 'recycling' as const,
      date: getNextCollectionDate(property.recyclingDayOfWeek),
    },
    {
      type: 'garden' as const,
      date: getNextCollectionDate(property.gardenDayOfWeek),
    },
    {
      type: 'food' as const,
      date: getNextCollectionDate(property.foodDayOfWeek),
    },
  ].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Collections for</p>
            <h2 className="text-xl font-semibold">{property.address}</h2>
            <p className="text-sm opacity-90">{property.postcode}</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onNavigate('settings')}
          >
            <PencilSimple size={16} className="mr-1" />
            Change
          </Button>
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={alert.severity === 'urgent' ? 'destructive' : 'default'}
              className="border-l-4"
            >
              <Warning size={20} />
              <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold mb-4">Upcoming collections</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.type}
              binType={collection.type}
              nextDate={collection.date}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Quick links</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onNavigate('find-bin-day')}
          >
            <div className="flex items-center gap-3">
              <MagnifyingGlass size={24} className="text-primary" weight="duotone" />
              <div>
                <h4 className="font-semibold">Find my bin day</h4>
                <p className="text-sm text-muted-foreground">Look up collection days</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onNavigate('what-goes-where')}
          >
            <div className="flex items-center gap-3">
              <Trash size={24} className="text-primary" weight="duotone" />
              <div>
                <h4 className="font-semibold">What goes in which bin?</h4>
                <p className="text-sm text-muted-foreground">Search for items</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onNavigate('recycling-centres')}
          >
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-primary" weight="duotone" />
              <div>
                <h4 className="font-semibold">Recycling centres</h4>
                <p className="text-sm text-muted-foreground">Find your nearest centre</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onNavigate('report-issue')}
          >
            <div className="flex items-center gap-3">
              <Recycle size={24} className="text-primary" weight="duotone" />
              <div>
                <h4 className="font-semibold">Report an issue</h4>
                <p className="text-sm text-muted-foreground">Missed bin or problem</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
