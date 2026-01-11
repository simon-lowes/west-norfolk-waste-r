import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/property.dart';
import '../../../data/models/service_alert.dart';
import '../../providers/alerts_provider.dart';
import '../../providers/collections_provider.dart';
import '../../providers/property_provider.dart';

class HomeState {
  const HomeState({
    required this.property,
    required this.collections,
    required this.alerts,
  });

  final Property? property;
  final List<CollectionSchedule> collections;
  final AsyncValue<List<ServiceAlert>> alerts;

  bool get hasSelectedProperty => property != null;
}

final homeViewModelProvider =
    AutoDisposeNotifierProvider<HomeViewModel, HomeState>(HomeViewModel.new);

class HomeViewModel extends AutoDisposeNotifier<HomeState> {
  static const Map<AlertSeverity, int> _severityPriority = {
    AlertSeverity.urgent: 0,
    AlertSeverity.warning: 1,
    AlertSeverity.info: 2,
  };

  @override
  HomeState build() {
    final property = ref.watch(propertyProvider);
    final collections = ref.watch(collectionsSortedProvider);
    final alerts = ref.watch(activeAlertsProvider).whenData((alerts) {
      return _sortAlerts(alerts);
    });

    return HomeState(
      property: property,
      collections: collections,
      alerts: alerts,
    );
  }

  Future<void> refreshAlerts() {
    return ref.read(alertsProvider.notifier).refresh();
  }

  Future<void> dismissAlert(ServiceAlert alert) async {
    await ref.read(dismissedAlertsProvider.notifier).dismiss(
          alert.id,
          alert.endDate,
        );
  }

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
