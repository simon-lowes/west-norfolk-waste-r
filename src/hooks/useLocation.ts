import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<LocationCoordinates | null>;
  hasPermission: boolean | null;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setHasPermission(false);
        setError('Location permission denied');
        setIsLoading(false);
        return null;
      }

      setHasPermission(true);

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      setIsLoading(false);
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    hasPermission,
  };
}
