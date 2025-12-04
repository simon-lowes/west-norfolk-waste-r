import '../models/enums.dart';
import '../models/service_alert.dart';

List<ServiceAlert> buildMockAlerts() {
  final today = DateTime.now();
  final laterThisWeek = today.add(const Duration(days: 5));
  final nextWeek = today.add(const Duration(days: 12));

  return [
    ServiceAlert(
      id: 'alert-001',
      title: 'Bank holiday collections move back a day',
      message:
          'All Monday collections will take place on Tuesday due to the bank holiday.',
      affectedPostcodes: const ['PE30 1HQ', 'PE32 2AB'],
      startDate: today.toIso8601String(),
      endDate: laterThisWeek.toIso8601String(),
      severity: AlertSeverity.info,
    ),
    ServiceAlert(
      id: 'alert-002',
      title: 'Severe ice, service delay',
      message: 'Garden waste suspended borough-wide until footpaths are safe.',
      affectedPostcodes: const [],
      startDate: today.toIso8601String(),
      endDate: nextWeek.toIso8601String(),
      severity: AlertSeverity.urgent,
    ),
  ];
}
