// Property type - represents a household address with collection schedule

export interface Property {
  id: string;
  postcode: string;
  address: string;
  // Day of week: 0 = Sunday, 1 = Monday, etc.
  rubbishDayOfWeek: number;
  recyclingDayOfWeek: number;
  gardenDayOfWeek: number;
  foodDayOfWeek: number;
}
