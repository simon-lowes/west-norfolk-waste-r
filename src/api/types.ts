// API types and cache utilities
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache utilities
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data if it exists and is not expired
 * @param key - Storage key
 * @param maxAgeMs - Maximum age in milliseconds
 * @returns Cached data or null if expired/missing
 */
export async function getCachedData<T>(key: string, maxAgeMs: number): Promise<T | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const age = Date.now() - entry.timestamp;

    if (age > maxAgeMs) {
      // Cache expired
      await AsyncStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.warn(`Cache read failed for ${key}:`, error);
    return null;
  }
}

/**
 * Store data in cache
 * @param key - Storage key
 * @param data - Data to cache
 */
export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn(`Cache write failed for ${key}:`, error);
  }
}

// Bank Holiday types (from GOV.UK API)
export interface BankHoliday {
  title: string;
  date: string; // ISO date string e.g. "2026-04-06"
  notes: string;
  bunting: boolean;
}

export interface BankHolidaysResponse {
  'england-and-wales': {
    division: string;
    events: BankHoliday[];
  };
  scotland: {
    division: string;
    events: BankHoliday[];
  };
  'northern-ireland': {
    division: string;
    events: BankHoliday[];
  };
}

// Weather warning types
export type WeatherSeverity = 'yellow' | 'amber' | 'red';

export interface WeatherWarning {
  id: string;
  title: string;
  description: string;
  severity: WeatherSeverity;
  validFrom: string;
  validTo: string;
  affectsArea: boolean; // Whether it affects West Norfolk
}

// Met Office NSWWS types (simplified)
export interface MetOfficeFeature {
  type: 'Feature';
  properties: {
    type: string; // e.g. "Wind", "Rain", "Snow"
    title: string;
    description: string;
    severity: string; // e.g. "YELLOW", "AMBER", "RED"
    valid_from: string;
    valid_to: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface MetOfficeWarningsResponse {
  type: 'FeatureCollection';
  features: MetOfficeFeature[];
}
