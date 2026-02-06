// Bank Holidays API - GOV.UK
// https://www.gov.uk/bank-holidays.json
// Free, no auth required

import { BankHolidaysResponse, BankHoliday, getCachedData, setCachedData } from './types';

const BANK_HOLIDAYS_URL = 'https://www.gov.uk/bank-holidays.json';
const CACHE_KEY = '@west_norfolk_waste_bank_holidays';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch bank holidays from GOV.UK API
 * Caches results for 24 hours
 */
export async function fetchBankHolidays(): Promise<BankHoliday[]> {
  // Check cache first
  const cached = await getCachedData<BankHoliday[]>(CACHE_KEY, CACHE_DURATION_MS);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(BANK_HOLIDAYS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: BankHolidaysResponse = await response.json();

    // We only care about England and Wales
    const holidays = data['england-and-wales'].events;

    // Cache the result
    await setCachedData(CACHE_KEY, holidays);

    return holidays;
  } catch (error) {
    console.warn('Bank holidays fetch skipped:', error);
    // Cache empty result to avoid retry-spam on repeated mounts
    await setCachedData(CACHE_KEY, []);
    return [];
  }
}

/**
 * Get upcoming bank holidays within a date range
 * @param daysAhead - Number of days to look ahead (default 14)
 * @returns Bank holidays happening soon
 */
export async function getUpcomingBankHolidays(daysAhead: number = 14): Promise<BankHoliday[]> {
  const holidays = await fetchBankHolidays();

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + daysAhead);

  return holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= now && holidayDate <= cutoff;
  });
}

/**
 * Get the next bank holiday (if any within reasonable timeframe)
 * Returns null if no holiday within 14 days
 */
export async function getNextBankHoliday(): Promise<BankHoliday | null> {
  const upcoming = await getUpcomingBankHolidays(14);
  return upcoming.length > 0 ? upcoming[0] : null;
}

/**
 * Calculate days until a bank holiday
 */
export function getDaysUntilHoliday(holiday: BankHoliday): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const holidayDate = new Date(holiday.date);
  const diffTime = holidayDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
