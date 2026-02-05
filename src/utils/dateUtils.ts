// Date utilities for collection schedule calculations

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Get the next occurrence of a specific day of the week
 * @param dayOfWeek - 0 = Sunday, 1 = Monday, etc.
 * @param fromDate - Starting date (defaults to today)
 * @returns The next occurrence as a Date object
 */
export function getNextCollectionDate(dayOfWeek: number, fromDate: Date = new Date()): Date {
  const result = new Date(fromDate);
  result.setHours(0, 0, 0, 0);

  const currentDay = result.getDay();
  let daysUntil = dayOfWeek - currentDay;

  // If the day has passed this week, or it's today, go to next week
  if (daysUntil <= 0) {
    daysUntil += 7;
  }

  result.setDate(result.getDate() + daysUntil);
  return result;
}

/**
 * Format a date in a friendly way
 * @param date - The date to format
 * @returns Formatted string like "Mon 15 Feb"
 */
export function formatDate(date: Date): string {
  const dayName = DAY_NAMES_SHORT[date.getDay()];
  const dayNum = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  return `${dayName} ${dayNum} ${month}`;
}

/**
 * Format a date with day name like "Monday"
 */
export function formatDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

/**
 * Get the number of days until a date
 * @param targetDate - The target date
 * @param fromDate - Starting date (defaults to today)
 * @returns Number of days
 */
export function getDaysUntil(targetDate: Date, fromDate: Date = new Date()): number {
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Format days until as a friendly string
 * @param days - Number of days
 * @returns Friendly string like "Tomorrow", "In 3 days", etc.
 */
export function formatDaysUntil(days: number): string {
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Tomorrow';
  } else if (days < 7) {
    return `In ${days} days`;
  } else if (days === 7) {
    return 'In 1 week';
  } else {
    return `In ${days} days`;
  }
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}
