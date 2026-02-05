import { useMemo } from 'react';
import { ServiceAlert, AlertSeverity, alertAffectsPostcode, isAlertActive } from '../types';
import { mockAlerts } from '../data';
import { useDevMode } from './useDevMode';
import { useBankHolidays } from './useBankHolidays';
import { useWeatherWarnings } from './useWeatherWarnings';
import { BankHoliday, WeatherWarning } from '../api';

interface UseAlertsResult {
  alerts: ServiceAlert[];
  urgentAlerts: ServiceAlert[];
  warningAlerts: ServiceAlert[];
  infoAlerts: ServiceAlert[];
  alertCount: number;
  hasUrgentAlerts: boolean;
  isLoading: boolean;
}

/**
 * Generate a ServiceAlert from a bank holiday
 */
function generateBankHolidayAlert(holiday: BankHoliday, daysUntil: number): ServiceAlert {
  const startDate = new Date();
  const endDate = new Date(holiday.date);
  endDate.setDate(endDate.getDate() + 1); // Include the holiday day

  return {
    id: `bank-holiday-${holiday.date}`,
    title: `${holiday.title} - Collection schedule change`,
    message: `Due to the bank holiday on ${formatHolidayDate(holiday.date)}, bin collections may be delayed by one day. Please leave your bins out if not collected on your usual day. Collections should return to normal the following week.`,
    affectedPostcodes: [], // Affects everyone
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    severity: daysUntil <= 3 ? AlertSeverity.WARNING : AlertSeverity.INFO,
  };
}

/**
 * Format a holiday date nicely
 */
function formatHolidayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Map weather warning severity to alert severity
 */
function mapWeatherSeverity(severity: string): AlertSeverity {
  switch (severity) {
    case 'red':
      return AlertSeverity.URGENT;
    case 'amber':
      return AlertSeverity.WARNING;
    default:
      return AlertSeverity.INFO;
  }
}

/**
 * Generate a ServiceAlert from a weather warning
 */
function generateWeatherAlert(warning: WeatherWarning): ServiceAlert {
  return {
    id: `weather-${warning.id}`,
    title: `Weather warning: ${warning.title}`,
    message: `${warning.description} Collections may be affected - please check back for updates.`,
    affectedPostcodes: [], // Weather affects everyone
    startDate: warning.validFrom,
    endDate: warning.validTo,
    severity: mapWeatherSeverity(warning.severity),
  };
}

export function useAlerts(postcode: string | null): UseAlertsResult {
  const { isDemoMode } = useDevMode();
  const { upcomingHoliday, daysUntilHoliday, isLoading: holidaysLoading } = useBankHolidays();
  const { activeWarnings, isLoading: warningsLoading } = useWeatherWarnings();

  const alerts = useMemo(() => {
    // In demo mode, return all mock alerts for council demonstrations
    if (isDemoMode) {
      return mockAlerts.filter((alert) => {
        if (!isAlertActive(alert)) {
          return false;
        }
        if (postcode) {
          return alertAffectsPostcode(alert, postcode);
        }
        return alert.affectedPostcodes.length === 0;
      });
    }

    // In real mode, generate alerts from live API data only
    const realAlerts: ServiceAlert[] = [];

    // Add bank holiday alert if there's an upcoming holiday
    if (upcomingHoliday && daysUntilHoliday !== null && daysUntilHoliday <= 7) {
      realAlerts.push(generateBankHolidayAlert(upcomingHoliday, daysUntilHoliday));
    }

    // Add weather warnings
    activeWarnings.forEach((warning) => {
      realAlerts.push(generateWeatherAlert(warning));
    });

    // Filter by postcode (though most real alerts affect everyone)
    return realAlerts.filter((alert) => {
      if (!isAlertActive(alert)) {
        return false;
      }
      if (postcode) {
        return alertAffectsPostcode(alert, postcode);
      }
      return alert.affectedPostcodes.length === 0;
    });
  }, [isDemoMode, postcode, upcomingHoliday, daysUntilHoliday, activeWarnings]);

  const urgentAlerts = useMemo(
    () => alerts.filter((a) => a.severity === AlertSeverity.URGENT),
    [alerts]
  );

  const warningAlerts = useMemo(
    () => alerts.filter((a) => a.severity === AlertSeverity.WARNING),
    [alerts]
  );

  const infoAlerts = useMemo(
    () => alerts.filter((a) => a.severity === AlertSeverity.INFO),
    [alerts]
  );

  return {
    alerts,
    urgentAlerts,
    warningAlerts,
    infoAlerts,
    alertCount: alerts.length,
    hasUrgentAlerts: urgentAlerts.length > 0,
    isLoading: !isDemoMode && (holidaysLoading || warningsLoading),
  };
}
