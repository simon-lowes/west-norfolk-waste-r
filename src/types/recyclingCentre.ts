// Recycling centre type - represents a household waste recycling centre

export interface RecyclingCentre {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  notes: string;
  materialsAccepted: string[];
  phoneNumber: string;
}
