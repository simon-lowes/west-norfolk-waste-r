import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { BinBadge } from '@/components/BinBadge'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { WasteItem } from '@/lib/types'

interface WhatGoesWhereScreenProps {
  wasteItems: WasteItem[]
}

export function WhatGoesWhereScreen({ wasteItems }: WhatGoesWhereScreenProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = wasteItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">What goes in which bin?</h1>
        <p className="text-lg text-muted-foreground">
          Search for an item to find out how to dispose of it correctly
        </p>
      </div>

      <div>
        <Label htmlFor="item-search" className="text-base font-medium mb-2 block">
          Search for an item
        </Label>
        <div className="relative">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            id="item-search"
            type="text"
            placeholder="e.g. plastic bottle, cardboard, batteries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-lg"
          />
        </div>
      </div>

      {searchTerm && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
          </p>
          
          {filteredItems.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                We couldn't find "{searchTerm}". Try a different word or contact the council for guidance.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      {item.notes && (
                        <p className="text-muted-foreground">{item.notes}</p>
                      )}
                    </div>
                    <BinBadge type={item.binType} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-3">Popular searches</h3>
          <div className="flex flex-wrap gap-2">
            {['Cardboard', 'Glass bottles', 'Plastic bags', 'Food waste', 'Batteries', 'Paint', 'Electronics'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
