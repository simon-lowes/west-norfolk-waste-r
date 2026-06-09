// Weather Warnings API
// Primary: Met Office NSWWS feed
// The Met Office provides public weather warnings as GeoJSON

import { WeatherWarning, WeatherSeverity, MetOfficeWarningsResponse, getCachedData, setCachedData } from './types';

// Met Office public warnings feed
// Note: This URL may require CORS proxy in production web builds
const MET_OFFICE_WARNINGS_URL = 'https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/wm';
// Alternative: Use the DataHub API if we register: https://datahub.metoffice.gov.uk/

// West Norfolk approximate bounding box (for filtering warnings)
const WEST_NORFOLK_BOUNDS = {
  minLat: 52.5,
  maxLat: 52.9,
  minLon: 0.2,
  maxLon: 0.7,
};

const CACHE_KEY = '@west_norfolk_waste_weather_warnings';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if a coordinate is within West Norfolk
 */
function isInWestNorfolk(lat: number, lon: number): boolean {
  return (
    lat >= WEST_NORFOLK_BOUNDS.minLat &&
    lat <= WEST_NORFOLK_BOUNDS.maxLat &&
    lon >= WEST_NORFOLK_BOUNDS.minLon &&
    lon <= WEST_NORFOLK_BOUNDS.maxLon
  );
}

/**
 * Flatten nested coordinate arrays (Polygon or MultiPolygon) into [lon, lat] pairs
 */
function flattenCoordinates(coords: number[][][] | number[][][][]): number[][] {
  const result: number[][] = [];
  const flatten = (arr: unknown): void => {
    if (!Array.isArray(arr)) return;
    // A coordinate pair is [number, number]
    if (arr.length >= 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      result.push(arr as number[]);
      return;
    }
    for (const item of arr) {
      flatten(item);
    }
  };
  flatten(coords);
  return result;
}

/**
 * Map Met Office severity to our severity type
 */
function mapSeverity(metOfficeSeverity: string | null | undefined): WeatherSeverity {
  const severity = (metOfficeSeverity ?? '').toLowerCase();
  if (severity === 'red') return 'red';
  if (severity === 'amber') return 'amber';
  return 'yellow';
}

/**
 * Fetch weather warnings
 * In practice, the Met Office NSWWS feed may have CORS restrictions
 * This provides a structure for when we have proper API access
 */
export async function fetchWeatherWarnings(): Promise<WeatherWarning[]> {
  // Check cache first
  const cached = await getCachedData<WeatherWarning[]>(CACHE_KEY, CACHE_DURATION_MS);
  if (cached) {
    return cached;
  }

  try {
    // Note: In production, this would need a server-side proxy or API key
    // For now, we'll catch errors gracefully and return empty
    const response = await fetch(MET_OFFICE_WARNINGS_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather warnings HTTP ${response.status}`);
    }

    const data: MetOfficeWarningsResponse = await response.json();

    const features = Array.isArray(data?.features) ? data.features : [];

    // Filter and transform warnings. Each feature is transformed inside its own
    // try/catch so a single malformed feature is skipped rather than throwing
    // and discarding every valid warning (and poisoning the cache).
    const warnings: WeatherWarning[] = features
      .filter((feature) => {
        // Check if warning affects West Norfolk area using bounding box overlap
        // Flatten all coordinate arrays to get individual [lon, lat] points
        try {
          const coords = feature.geometry.coordinates;
          const flatCoords = flattenCoordinates(coords);
          // GeoJSON coordinates are [longitude, latitude] order (RFC 7946)
          return flatCoords.some(([lon, lat]) => isInWestNorfolk(lat, lon));
        } catch {
          // If geometry parsing fails, include the warning to be safe
          return true;
        }
      })
      .map((feature): WeatherWarning | null => {
        try {
          const props = feature.properties;
          return {
            id: `met-warning-${props.type}-${props.severity}-${props.valid_from}-${props.valid_to}`,
            title: props.title || `${props.type} Warning`,
            description: props.description,
            severity: mapSeverity(props.severity),
            validFrom: props.valid_from,
            validTo: props.valid_to,
            affectsArea: true,
          };
        } catch (featureError) {
          console.warn('Skipping malformed weather feature:', featureError);
          return null;
        }
      })
      .filter((warning): warning is WeatherWarning => warning !== null);

    // Cache the result
    await setCachedData(CACHE_KEY, warnings);

    return warnings;
  } catch (error) {
    console.warn('Weather warnings fetch skipped:', error);
    // Do NOT cache the empty fallback: caching [] with a fresh timestamp would
    // suppress warnings and block refetch for the full cache window. Returning
    // [] without caching lets the next mount / refetch retry.
    return [];
  }
}

/**
 * Get currently active weather warnings
 */
export async function getActiveWeatherWarnings(): Promise<WeatherWarning[]> {
  const warnings = await fetchWeatherWarnings();
  const now = new Date();

  return warnings.filter((warning) => {
    const validFrom = new Date(warning.validFrom);
    const validTo = new Date(warning.validTo);
    return now >= validFrom && now <= validTo;
  });
}

/**
 * Check if there are any severe (amber/red) warnings
 */
export async function hasSevereWarnings(): Promise<boolean> {
  const warnings = await getActiveWeatherWarnings();
  return warnings.some((w) => w.severity === 'amber' || w.severity === 'red');
}
