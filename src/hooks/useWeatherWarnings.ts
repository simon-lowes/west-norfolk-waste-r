import { useState, useEffect } from 'react';
import { WeatherWarning, getActiveWeatherWarnings } from '../api';

interface UseWeatherWarningsResult {
  activeWarnings: WeatherWarning[];
  hasSevereWarning: boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to get active weather warnings
 * Automatically fetches on mount and caches results
 */
export function useWeatherWarnings(): UseWeatherWarningsResult {
  const [activeWarnings, setActiveWarnings] = useState<WeatherWarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const warnings = await getActiveWeatherWarnings();
      setActiveWarnings(warnings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weather warnings'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasSevereWarning = activeWarnings.some(
    (w) => w.severity === 'amber' || w.severity === 'red'
  );

  return {
    activeWarnings,
    hasSevereWarning,
    isLoading,
    error,
    refetch: fetchData,
  };
}
