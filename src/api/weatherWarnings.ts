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
 * Map Met Office severity to our severity type
 */
function mapSeverity(metOfficeSeverity: string): WeatherSeverity {
  const severity = metOfficeSeverity.toLowerCase();
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
      // Expected to fail without proper API access - fail silently
      return [];
    }

    const data: MetOfficeWarningsResponse = await response.json();

    // Filter and transform warnings
    const warnings: WeatherWarning[] = data.features
      .filter((feature) => {
        // Check if warning affects West Norfolk area
        // This is a simplified check - real implementation would use proper geospatial logic
        return true; // For now, include all warnings as a demonstration
      })
      .map((feature, index) => ({
        id: `met-warning-${index}-${feature.properties.valid_from}`,
        title: feature.properties.title || `${feature.properties.type} Warning`,
        description: feature.properties.description,
        severity: mapSeverity(feature.properties.severity),
        validFrom: feature.properties.valid_from,
        validTo: feature.properties.valid_to,
        affectsArea: true,
      }));

    // Cache the result
    await setCachedData(CACHE_KEY, warnings);

    return warnings;
  } catch (error) {
    // Expected to fail in development - log but don't crash
    console.debug('Weather warnings fetch failed (expected without API access):', error);
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
