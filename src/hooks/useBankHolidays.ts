import { useState, useEffect, useCallback } from 'react';
import { BankHoliday, getNextBankHoliday, getDaysUntilHoliday } from '../api';

interface UseBankHolidaysResult {
  upcomingHoliday: BankHoliday | null;
  daysUntilHoliday: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to get upcoming bank holidays
 * Automatically fetches on mount and caches results
 */
export function useBankHolidays(enabled: boolean = true): UseBankHolidaysResult {
  const [upcomingHoliday, setUpcomingHoliday] = useState<BankHoliday | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const holiday = await getNextBankHoliday();
      setUpcomingHoliday(holiday);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bank holidays'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) fetchData();
  }, [fetchData, enabled]);

  const daysUntilHoliday = upcomingHoliday ? getDaysUntilHoliday(upcomingHoliday) : null;

  return {
    upcomingHoliday,
    daysUntilHoliday,
    isLoading,
    error,
    refetch: fetchData,
  };
}
