import { useMemo } from 'react';
import { ServiceAlert, alertAffectsPostcode, isAlertActive } from '../types';
import { mockAlerts } from '../data';

interface UseAlertsResult {
  alerts: ServiceAlert[];
  urgentAlerts: ServiceAlert[];
  warningAlerts: ServiceAlert[];
  infoAlerts: ServiceAlert[];
  alertCount: number;
  hasUrgentAlerts: boolean;
}

export function useAlerts(postcode: string | null): UseAlertsResult {
  const filteredAlerts = useMemo(() => {
    // Filter alerts that are active and affect the postcode
    return mockAlerts.filter((alert) => {
      if (!isAlertActive(alert)) {
        return false;
      }
      if (postcode) {
        return alertAffectsPostcode(alert, postcode);
      }
      // If no postcode, only show global alerts (empty affectedPostcodes)
      return alert.affectedPostcodes.length === 0;
    });
  }, [postcode]);

  const urgentAlerts = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'urgent'),
    [filteredAlerts]
  );

  const warningAlerts = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'warning'),
    [filteredAlerts]
  );

  const infoAlerts = useMemo(
    () => filteredAlerts.filter((a) => a.severity === 'info'),
    [filteredAlerts]
  );

  return {
    alerts: filteredAlerts,
    urgentAlerts,
    warningAlerts,
    infoAlerts,
    alertCount: filteredAlerts.length,
    hasUrgentAlerts: urgentAlerts.length > 0,
  };
}
