import { ServiceAlert, AlertSeverity } from '../types';

// Generate alerts with dynamic dates based on current time
function buildMockAlerts(): ServiceAlert[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const laterThisWeek = new Date(today);
  laterThisWeek.setDate(laterThisWeek.getDate() + 5);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 12);
  const twoWeeksOut = new Date(today);
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
  const endOfMonth = new Date(today);
  endOfMonth.setDate(endOfMonth.getDate() + 21);

  return [
    // URGENT: Borough-wide severe weather alert
    {
      id: 'alert-001',
      title: 'Severe weather warning - Collections suspended',
      message:
        'Due to heavy snow and icy conditions, all waste collections have been suspended across the borough. Collections will resume when conditions improve. Please do not leave bins out as this creates hazards for gritting vehicles. We apologise for any inconvenience and thank you for your patience.',
      affectedPostcodes: [],
      startDate: yesterday.toISOString(),
      endDate: laterThisWeek.toISOString(),
      severity: AlertSeverity.URGENT,
    },

    // WARNING: Specific postcodes affected by road works
    {
      id: 'alert-002',
      title: 'Road works affecting collections',
      message:
        'Major road works on Bridge Street and surrounding areas may cause delays to your collection. Crews will attempt to complete all collections but some may be delayed by up to 24 hours. Please leave your bins out until they are collected.',
      affectedPostcodes: ['PE33 0RF', 'PE33 9AF'],
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString(),
      severity: AlertSeverity.WARNING,
    },

    // INFO: Bank holiday schedule change
    {
      id: 'alert-003',
      title: 'Bank holiday collections move back one day',
      message:
        'Due to the upcoming bank holiday on Monday, all collections scheduled for Monday will take place on Tuesday instead. Tuesday collections move to Wednesday, and so on through the week. Friday collections remain unchanged. Normal service resumes the following Monday.',
      affectedPostcodes: ['PE30 1HQ', 'PE30 1EG', 'PE30 1HL', 'PE32 2AB'],
      startDate: today.toISOString(),
      endDate: laterThisWeek.toISOString(),
      severity: AlertSeverity.INFO,
    },

    // WARNING: Garden waste subscription reminder
    {
      id: 'alert-004',
      title: 'Garden waste subscription renewal due',
      message:
        'Garden waste collection subscriptions are due for renewal. If you have not renewed your subscription, your garden waste will not be collected from next month. Please renew online or contact customer services to continue receiving this service. Subscription costs 40 pounds per year.',
      affectedPostcodes: [],
      startDate: today.toISOString(),
      endDate: endOfMonth.toISOString(),
      severity: AlertSeverity.WARNING,
    },

    // INFO: New recycling guidelines
    {
      id: 'alert-005',
      title: 'Updated recycling guidelines - Soft plastics now accepted',
      message:
        'Great news! We now accept soft plastics in your blue recycling bin. This includes carrier bags, bread bags, crisp packets, and plastic film. Please ensure all items are clean and dry before recycling. Visit our website for the full list of accepted items.',
      affectedPostcodes: [],
      startDate: yesterday.toISOString(),
      endDate: twoWeeksOut.toISOString(),
      severity: AlertSeverity.INFO,
    },

    // INFO: Coastal area specific
    {
      id: 'alert-006',
      title: 'High tide collection schedule adjustment',
      message:
        'Due to predicted high tides and coastal flooding warnings, collections in Hunstanton seafront areas may be delayed or rescheduled. Crews will prioritise safety. If your bin is not collected by 6pm, please bring it back in and we will collect on the next scheduled day.',
      affectedPostcodes: ['PE36 5BB', 'PE36 6EJ'],
      startDate: today.toISOString(),
      endDate: laterThisWeek.toISOString(),
      severity: AlertSeverity.INFO,
    },

    // URGENT: Fly-tipping clearance
    {
      id: 'alert-007',
      title: 'Fly-tipping clearance operation',
      message:
        'A large fly-tipping incident has been reported in the Dersingham area. Our teams are working to clear the waste but access to some properties may be temporarily restricted. If your collection is missed due to access issues, we will return within 48 hours. Please report any witnesses to the incident.',
      affectedPostcodes: ['PE31 6HP', 'PE31 6LN'],
      startDate: today.toISOString(),
      endDate: laterThisWeek.toISOString(),
      severity: AlertSeverity.URGENT,
    },
  ];
}

export const mockAlerts = buildMockAlerts();
