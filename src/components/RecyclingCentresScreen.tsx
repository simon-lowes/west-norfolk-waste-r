import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, NavigationArrow } from '@phosphor-icons/react'
import type { RecyclingCentre } from '@/lib/types'

interface RecyclingCentresScreenProps {
  centres: RecyclingCentre[]
}

export function RecyclingCentresScreen({ centres }: RecyclingCentresScreenProps) {
  const handleGetDirections = (centre: RecyclingCentre) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${centre.latitude},${centre.longitude}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recycling centres</h1>
        <p className="text-lg text-muted-foreground">
          Find your nearest household waste recycling centre (HWRC)
        </p>
      </div>

      <div className="space-y-4">
        {centres.map((centre) => (
          <Card key={centre.id} className="p-5">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{centre.name}</h3>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{centre.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={18} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Opening hours</p>
                  <p className="text-muted-foreground whitespace-pre-line">{centre.openingHours}</p>
                </div>
              </div>

              {centre.notes && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">{centre.notes}</p>
                </div>
              )}

              <Button 
                onClick={() => handleGetDirections(centre)}
                className="w-full sm:w-auto"
              >
                <NavigationArrow size={18} className="mr-2" />
                Get directions
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
