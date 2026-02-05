import { useMemo } from 'react';
import { Property, BinType } from '../types';
import { getNextCollectionDate, getDaysUntil } from '../utils';

export interface Collection {
  binType: BinType;
  date: Date;
  daysUntil: number;
}

interface UseCollectionsResult {
  collections: Collection[];
  nextCollection: Collection | null;
}

export function useCollections(property: Property | null): UseCollectionsResult {
  const collections = useMemo(() => {
    if (!property) {
      return [];
    }

    const today = new Date();

    const collectionsList: Collection[] = [
      {
        binType: BinType.GENERAL,
        date: getNextCollectionDate(property.rubbishDayOfWeek, today),
        daysUntil: 0,
      },
      {
        binType: BinType.RECYCLING,
        date: getNextCollectionDate(property.recyclingDayOfWeek, today),
        daysUntil: 0,
      },
      {
        binType: BinType.GARDEN,
        date: getNextCollectionDate(property.gardenDayOfWeek, today),
        daysUntil: 0,
      },
      {
        binType: BinType.FOOD,
        date: getNextCollectionDate(property.foodDayOfWeek, today),
        daysUntil: 0,
      },
    ];

    // Calculate days until for each collection
    collectionsList.forEach((collection) => {
      collection.daysUntil = getDaysUntil(collection.date, today);
    });

    // Sort by soonest first
    collectionsList.sort((a, b) => a.daysUntil - b.daysUntil);

    return collectionsList;
  }, [property]);

  const nextCollection = collections.length > 0 ? collections[0] : null;

  return {
    collections,
    nextCollection,
  };
}
