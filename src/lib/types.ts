export interface Property {
  id: string
  postcode: string
  address: string
  rubbishDayOfWeek: number
  recyclingDayOfWeek: number
  gardenDayOfWeek: number
  foodDayOfWeek: number
  nextRubbishDate?: string
  nextRecyclingDate?: string
  nextGardenDate?: string
  nextFoodDate?: string
}

export interface WasteItem {
  id: string
  name: string
  binType: 'general' | 'recycling' | 'garden' | 'food' | 'recycling-centre'
  notes: string
}

export interface RecyclingCentre {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  openingHours: string
  notes: string
}

export interface ServiceAlert {
  id: string
  title: string
  message: string
  affectedPostcodes: string[]
  startDate: string
  endDate: string
  severity: 'info' | 'warning' | 'urgent'
}

export interface Report {
  id: string
  type: 'missed-bin' | 'fly-tipping' | 'street-lighting' | 'other'
  description: string
  location?: {
    latitude: number
    longitude: number
  }
  photo?: string
  postcode?: string
  address?: string
  createdAt: string
  referenceNumber: string
}

export type BinType = 'rubbish' | 'recycling' | 'garden' | 'food'
