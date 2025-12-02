import { AddressSelector } from './AddressSelector'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gear, MapPin } from '@phosphor-icons/react'
import type { Property } from '@/lib/types'

interface SettingsScreenProps {
  properties: Property[]
  currentProperty?: Property
  onPropertySelect: (property: Property) => void
  onClearAddress: () => void
}

export function SettingsScreen({ 
  properties, 
  currentProperty, 
  onPropertySelect,
  onClearAddress 
}: SettingsScreenProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your address and preferences
        </p>
      </div>

      {currentProperty && (
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <MapPin size={24} className="text-primary mt-1" weight="duotone" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Current address</h3>
              <p className="text-muted-foreground">{currentProperty.address}</p>
              <p className="text-muted-foreground">{currentProperty.postcode}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClearAddress}>
            Change address
          </Button>
        </Card>
      )}

      {!currentProperty && (
        <AddressSelector
          properties={properties}
          onAddressSelected={onPropertySelect}
        />
      )}

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">About this service</h3>
        <p className="text-sm text-muted-foreground mb-4">
          West Norfolk Waste & Recycling helps residents of the Borough Council of King's Lynn & 
          West Norfolk manage their household waste and recycling.
        </p>
        <p className="text-sm text-muted-foreground">
          Version 1.0.0
        </p>
      </Card>
    </div>
  )
}
