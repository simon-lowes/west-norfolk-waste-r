import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/service_alert.dart';
import '../../data/repositories/alert_repository.dart';
import 'property_provider.dart';
import 'repository_providers.dart';

class AlertsNotifier extends StateNotifier<AsyncValue<List<ServiceAlert>>> {
  AlertsNotifier(this._repository) : super(const AsyncValue.loading()) {
    unawaited(_loadAlerts());
  }

  final AlertRepository _repository;

  Future<void> refresh() => _loadAlerts();

  Future<void> create(ServiceAlert alert) async {
    try {
      await _repository.create(alert);
      await _loadAlerts();
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  Future<void> delete(String id) async {
    try {
      await _repository.delete(id);
      await _loadAlerts();
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  Future<void> _loadAlerts() async {
    try {
      final alerts = await _repository.getAll();
      state = AsyncValue.data(alerts);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }
}

final alertsProvider =
    StateNotifierProvider<AlertsNotifier, AsyncValue<List<ServiceAlert>>>((
      ref,
    ) {
      final repository = ref.watch(alertRepositoryProvider);
      return AlertsNotifier(repository);
    });

final activeAlertsProvider = Provider<AsyncValue<List<ServiceAlert>>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  final selectedProperty = ref.watch(propertyProvider);
  return alertsState.whenData((alerts) {
    final postcode = selectedProperty?.postcode.trim().toUpperCase();
    return alerts.where((alert) {
      final isActive = alert.isActive;
      if (!isActive) {
        return false;
      }

      if (alert.affectedPostcodes.isEmpty || postcode == null) {
        return alert.affectedPostcodes.isEmpty;
      }

      final normalizedTargets = alert.affectedPostcodes
          .map((code) => code.trim().toUpperCase())
          .toList();
      return normalizedTargets.contains(postcode);
    }).toList();
  });
});
