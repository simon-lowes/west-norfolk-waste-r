// API exports
export {
  fetchBankHolidays,
  getUpcomingBankHolidays,
  getNextBankHoliday,
  getDaysUntilHoliday,
} from './bankHolidays';

export {
  fetchWeatherWarnings,
  getActiveWeatherWarnings,
  hasSevereWarnings,
} from './weatherWarnings';

export type {
  BankHoliday,
  BankHolidaysResponse,
  WeatherWarning,
  WeatherSeverity,
} from './types';
