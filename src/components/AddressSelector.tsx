import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin } from '@phosphor-icons/react'
import { validatePostcode, formatPostcode } from '@/lib/postcodes'
import type { Property } from '@/lib/types'

interface AddressSelectorProps {
  onAddressSelected: (property: Property) => void
  properties: Property[]
}

export function AddressSelector({ onAddressSelected, properties }: AddressSelectorProps) {
  const [postcode, setPostcode] = useState('')
  const [error, setError] = useState('')
  const [matchingAddresses, setMatchingAddresses] = useState<Property[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')

  const handlePostcodeSearch = () => {
    setError('')
    
    if (!postcode.trim()) {
      setError('Please enter a postcode')
      return
    }
    
    if (!validatePostcode(postcode)) {
      setError('Please enter a valid postcode (e.g. PE30 1XX)')
      return
    }
    
    const formatted = formatPostcode(postcode)
    const matches = properties.filter(p => p.postcode === formatted)
    
    if (matches.length === 0) {
      setError('No addresses found for this postcode. Please check and try again.')
      setMatchingAddresses([])
      return
    }
    
    setMatchingAddresses(matches)
  }

  const handleAddressSelect = (propertyId: string) => {
    setSelectedAddress(propertyId)
    const property = matchingAddresses.find(p => p.id === propertyId)
    if (property) {
      onAddressSelected(property)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePostcodeSearch()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <MapPin size={32} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Find your address</h2>
            <p className="text-muted-foreground">Enter your postcode to get started</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="postcode" className="text-base font-medium mb-2 block">
              Postcode
            </Label>
            <div className="flex gap-2">
              <Input
                id="postcode"
                type="text"
                placeholder="PE30 1XX"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
              <Button onClick={handlePostcodeSearch} size="lg">
                Search
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {matchingAddresses.length > 0 && (
            <div>
              <Label htmlFor="address" className="text-base font-medium mb-2 block">
                Select your address
              </Label>
              <Select value={selectedAddress} onValueChange={handleAddressSelect}>
                <SelectTrigger id="address" className="text-lg">
                  <SelectValue placeholder="Choose an address" />
                </SelectTrigger>
                <SelectContent>
                  {matchingAddresses.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
