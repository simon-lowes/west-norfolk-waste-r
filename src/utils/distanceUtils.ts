/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format a distance for display
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string like "2.3 km" or "500 m"
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }

  return `${Math.round(distanceKm)} km`;
}

/**
 * Format a distance for display in miles (UK preference)
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string like "1.4 miles"
 */
export function formatDistanceMiles(distanceKm: number): string {
  const miles = distanceKm * 0.621371;

  if (miles < 0.1) {
    const yards = Math.round(miles * 1760);
    return `${yards} yards`;
  }

  if (miles < 10) {
    return `${miles.toFixed(1)} miles`;
  }

  return `${Math.round(miles)} miles`;
}

/**
 * Sort items by distance from a given location
 */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  userLat: number,
  userLon: number
): Array<T & { distance: number }> {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(userLat, userLon, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);
}
