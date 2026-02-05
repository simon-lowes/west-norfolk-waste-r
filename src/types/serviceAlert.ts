// Service alert type - represents a service notification or disruption

export enum AlertSeverity {
  URGENT = 'urgent',   // Critical - service disruption
  WARNING = 'warning', // Important - action may be required
  INFO = 'info',       // Informational - no action needed
}

export interface ServiceAlert {
  id: string;
  title: string;
  message: string;
  affectedPostcodes: string[]; // Empty array = affects all
  startDate: string; // ISO 8601 date string
  endDate: string;   // ISO 8601 date string
  severity: AlertSeverity;
}

// Helper to check if alert affects a specific postcode
export function alertAffectsPostcode(alert: ServiceAlert, postcode: string): boolean {
  // Empty array means affects all postcodes
  if (alert.affectedPostcodes.length === 0) {
    return true;
  }
  return alert.affectedPostcodes.some(
    (p) => postcode.toUpperCase().startsWith(p.toUpperCase())
  );
}

// Helper to check if alert is currently active
export function isAlertActive(alert: ServiceAlert): boolean {
  const now = new Date();
  const start = new Date(alert.startDate);
  const end = new Date(alert.endDate);
  return now >= start && now <= end;
}
