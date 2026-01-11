import '../models/enums.dart';
import '../models/service_alert.dart';

List<ServiceAlert> buildMockAlerts() {
  final today = DateTime.now();
  final yesterday = today.subtract(const Duration(days: 1));
  final laterThisWeek = today.add(const Duration(days: 5));
  final nextWeek = today.add(const Duration(days: 12));
  final twoWeeksOut = today.add(const Duration(days: 14));
  final endOfMonth = today.add(const Duration(days: 21));

  return [
    // URGENT: Borough-wide severe weather alert
    ServiceAlert(
      id: 'alert-001',
      title: 'Severe weather warning - Collections suspended',
      message:
          'Due to heavy snow and icy conditions, all waste collections have been suspended across the borough. Collections will resume when conditions improve. Please do not leave bins out as this creates hazards for gritting vehicles. We apologise for any inconvenience and thank you for your patience.',
      affectedPostcodes: const [],
      startDate: yesterday.toIso8601String(),
      endDate: laterThisWeek.toIso8601String(),
      severity: AlertSeverity.urgent,
    ),

    // WARNING: Specific postcodes affected by road works
    ServiceAlert(
      id: 'alert-002',
      title: 'Road works affecting collections',
      message:
          'Major road works on Bridge Street and surrounding areas may cause delays to your collection. Crews will attempt to complete all collections but some may be delayed by up to 24 hours. Please leave your bins out until they are collected.',
      affectedPostcodes: const ['PE33 0RF', 'PE33 9AF'],
      startDate: today.toIso8601String(),
      endDate: nextWeek.toIso8601String(),
      severity: AlertSeverity.warning,
    ),

    // INFO: Bank holiday schedule change
    ServiceAlert(
      id: 'alert-003',
      title: 'Bank holiday collections move back one day',
      message:
          'Due to the upcoming bank holiday on Monday, all collections scheduled for Monday will take place on Tuesday instead. Tuesday collections move to Wednesday, and so on through the week. Friday collections remain unchanged. Normal service resumes the following Monday.',
      affectedPostcodes: const ['PE30 1HQ', 'PE30 1EG', 'PE30 1HL', 'PE32 2AB'],
      startDate: today.toIso8601String(),
      endDate: laterThisWeek.toIso8601String(),
      severity: AlertSeverity.info,
    ),

    // WARNING: Garden waste subscription reminder
    ServiceAlert(
      id: 'alert-004',
      title: 'Garden waste subscription renewal due',
      message:
          'Garden waste collection subscriptions are due for renewal. If you have not renewed your subscription, your garden waste will not be collected from next month. Please renew online or contact customer services to continue receiving this service. Subscription costs £40 per year.',
      affectedPostcodes: const [],
      startDate: today.toIso8601String(),
      endDate: endOfMonth.toIso8601String(),
      severity: AlertSeverity.warning,
    ),

    // INFO: New recycling guidelines
    ServiceAlert(
      id: 'alert-005',
      title: 'Updated recycling guidelines - Soft plastics now accepted',
      message:
          'Great news! We now accept soft plastics in your blue recycling bin. This includes carrier bags, bread bags, crisp packets, and plastic film. Please ensure all items are clean and dry before recycling. Visit our website for the full list of accepted items.',
      affectedPostcodes: const [],
      startDate: yesterday.toIso8601String(),
      endDate: twoWeeksOut.toIso8601String(),
      severity: AlertSeverity.info,
    ),

    // INFO: Coastal area specific
    ServiceAlert(
      id: 'alert-006',
      title: 'High tide collection schedule adjustment',
      message:
          'Due to predicted high tides and coastal flooding warnings, collections in Hunstanton seafront areas may be delayed or rescheduled. Crews will prioritise safety. If your bin is not collected by 6pm, please bring it back in and we will collect on the next scheduled day.',
      affectedPostcodes: const ['PE36 5BB', 'PE36 6EJ'],
      startDate: today.toIso8601String(),
      endDate: laterThisWeek.toIso8601String(),
      severity: AlertSeverity.info,
    ),

    // URGENT: Fly-tipping clearance
    ServiceAlert(
      id: 'alert-007',
      title: 'Fly-tipping clearance operation',
      message:
          'A large fly-tipping incident has been reported in the Dersingham area. Our teams are working to clear the waste but access to some properties may be temporarily restricted. If your collection is missed due to access issues, we will return within 48 hours. Please report any witnesses to the incident.',
      affectedPostcodes: const ['PE31 6HP', 'PE31 6LN'],
      startDate: today.toIso8601String(),
      endDate: laterThisWeek.toIso8601String(),
      severity: AlertSeverity.urgent,
    ),
  ];
}
