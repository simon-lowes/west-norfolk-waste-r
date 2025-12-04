import 'package:flutter_riverpod/flutter_riverpod.dart';

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
  @override
  HomeState build() {
    final property = ref.watch(propertyProvider);
    final collections = ref.watch(collectionsSortedProvider);
    final alerts = ref.watch(activeAlertsProvider);

    return HomeState(
      property: property,
      collections: collections,
      alerts: alerts,
    );
  }

  Future<void> refreshAlerts() {
    return ref.read(alertsProvider.notifier).refresh();
  }
}
