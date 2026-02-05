// Waste item type - represents a searchable waste disposal item

export enum BinType {
  GENERAL = 'general',        // Black bin - general waste
  RECYCLING = 'recycling',    // Blue bin - recyclables
  GARDEN = 'garden',          // Green bin - garden waste
  FOOD = 'food',              // Brown caddy - food waste
  RECYCLING_CENTRE = 'recyclingCentre', // Must go to recycling centre
}

export interface WasteItem {
  id: string;
  name: string;
  binType: BinType;
  notes: string;
  keywords: string[];
}

// Helper to get bin display name
export function getBinTypeName(binType: BinType): string {
  switch (binType) {
    case BinType.GENERAL:
      return 'General Waste';
    case BinType.RECYCLING:
      return 'Recycling';
    case BinType.GARDEN:
      return 'Garden Waste';
    case BinType.FOOD:
      return 'Food Waste';
    case BinType.RECYCLING_CENTRE:
      return 'Recycling Centre';
  }
}

// Helper to get bin color key
export function getBinColorKey(binType: BinType): 'rubbish' | 'recycling' | 'garden' | 'food' | 'centre' {
  switch (binType) {
    case BinType.GENERAL:
      return 'rubbish';
    case BinType.RECYCLING:
      return 'recycling';
    case BinType.GARDEN:
      return 'garden';
    case BinType.FOOD:
      return 'food';
    case BinType.RECYCLING_CENTRE:
      return 'centre';
  }
}
