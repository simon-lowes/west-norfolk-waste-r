import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/property.dart';
import '../../../data/models/service_alert.dart';
import '../../../data/models/enums.dart';
import '../../providers/alerts_provider.dart';
import '../../providers/property_provider.dart';

class ServiceAlertsState {
  const ServiceAlertsState({
    required this.property,
    required this.allAlerts,
    required this.alerts,
  });

  final Property? property;
  final AsyncValue<List<ServiceAlert>> allAlerts;
  final AsyncValue<List<ServiceAlert>> alerts;

  bool get hasSelectedProperty => property != null;
}

final serviceAlertsViewModelProvider =
    AutoDisposeNotifierProvider<ServiceAlertsViewModel, ServiceAlertsState>(
      ServiceAlertsViewModel.new,
    );

class ServiceAlertsViewModel extends AutoDisposeNotifier<ServiceAlertsState> {
  static const Map<AlertSeverity, int> _severityPriority = {
    AlertSeverity.urgent: 0,
    AlertSeverity.warning: 1,
    AlertSeverity.info: 2,
  };

  @override
  ServiceAlertsState build() {
    final property = ref.watch(propertyProvider);
    final allAlerts = ref.watch(alertsProvider);
    final alerts = ref.watch(activeAlertsProvider).whenData((alerts) {
      return _sortAlerts(alerts);
    });

    return ServiceAlertsState(
      property: property,
      allAlerts: allAlerts,
      alerts: alerts,
    );
  }

  Future<void> refreshAlerts() {
    return ref.read(alertsProvider.notifier).refresh();
  }

  Future<void> retry() => refreshAlerts();

  List<ServiceAlert> _sortAlerts(List<ServiceAlert> alerts) {
    final sorted = [...alerts];
    sorted.sort((a, b) {
      final severityCompare = _severityPriority[a.severity]!.compareTo(
        _severityPriority[b.severity]!,
      );
      if (severityCompare != 0) {
        return severityCompare;
      }
      final aStart = DateTime.parse(a.startDate);
      final bStart = DateTime.parse(b.startDate);
      return aStart.compareTo(bStart);
    });
    return sorted;
  }
}
