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

  Future<void> update(ServiceAlert alert) async {
    try {
      await _repository.update(alert);
      await _loadAlerts();
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  Future<ServiceAlert?> getById(String id) async {
    return _repository.getById(id);
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

/// Tracks dismissed alerts - map of alertId -> endDate
class DismissedAlertsNotifier extends StateNotifier<Map<String, String>> {
  DismissedAlertsNotifier(this._repository) : super({}) {
    unawaited(_loadDismissed());
  }

  final AlertRepository _repository;

  Future<void> _loadDismissed() async {
    try {
      await _repository.cleanupDismissedAlerts();
      final dismissed = await _repository.getDismissedAlerts();
      state = dismissed;
    } catch (_) {
      state = {};
    }
  }

  Future<void> dismiss(String alertId, String endDate) async {
    await _repository.dismissAlert(alertId, endDate);
    state = {...state, alertId: endDate};
  }

  Future<void> restore(String alertId) async {
    await _repository.restoreAlert(alertId);
    final newState = {...state};
    newState.remove(alertId);
    state = newState;
  }

  bool isDismissed(String alertId, String endDate) {
    return state[alertId] == endDate;
  }

  Future<void> refresh() => _loadDismissed();
}

final dismissedAlertsProvider =
    StateNotifierProvider<DismissedAlertsNotifier, Map<String, String>>((ref) {
  final repository = ref.watch(alertRepositoryProvider);
  return DismissedAlertsNotifier(repository);
});

final activeAlertsProvider = Provider<AsyncValue<List<ServiceAlert>>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  final selectedProperty = ref.watch(propertyProvider);
  final dismissedAlerts = ref.watch(dismissedAlertsProvider);

  return alertsState.whenData((alerts) {
    final postcode = selectedProperty?.postcode.trim().toUpperCase();
    return alerts.where((alert) {
      final isActive = alert.isActive;
      if (!isActive) {
        return false;
      }

      // Check if alert is dismissed
      if (dismissedAlerts[alert.id] == alert.endDate) {
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

/// Provider for a single alert by ID
final alertByIdProvider = FutureProvider.family<ServiceAlert?, String>((ref, id) async {
  final notifier = ref.watch(alertsProvider.notifier);
  return notifier.getById(id);
});
