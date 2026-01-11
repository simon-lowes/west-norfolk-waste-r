import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/service_alert.dart';
import '../sample_data/mock_alerts.dart';

class AlertRepository {
  AlertRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'service_alerts';
  static const _dismissedKey = 'dismissed_alerts';

  Future<List<ServiceAlert>> getAll() async {
    final stored = _preferences.getString(_storageKey);
    if (stored == null) {
      final seeded = buildMockAlerts();
      await _preferences.setString(_storageKey, _encode(seeded));
      return seeded;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => ServiceAlert.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<ServiceAlert>> filterActive(String? postcode) async {
    final alerts = await getAll();
    final now = DateTime.now();
    return alerts.where((alert) {
      final start = DateTime.parse(alert.startDate);
      final end = DateTime.parse(alert.endDate);
      final withinDates = !now.isBefore(start) && !now.isAfter(end);
      final matchesPostcode =
          alert.affectedPostcodes.isEmpty ||
          (postcode != null && alert.affectedPostcodes.contains(postcode));
      return withinDates && matchesPostcode;
    }).toList();
  }

  Future<void> create(ServiceAlert alert) async {
    final alerts = await getAll();
    alerts.add(alert);
    await _preferences.setString(_storageKey, _encode(alerts));
  }

  Future<void> update(ServiceAlert alert) async {
    final alerts = await getAll();
    final index = alerts.indexWhere((a) => a.id == alert.id);
    if (index != -1) {
      alerts[index] = alert;
      await _preferences.setString(_storageKey, _encode(alerts));
    }
  }

  Future<ServiceAlert?> getById(String id) async {
    final alerts = await getAll();
    final matches = alerts.where((a) => a.id == id);
    return matches.isNotEmpty ? matches.first : null;
  }

  Future<void> delete(String id) async {
    final alerts = await getAll();
    alerts.removeWhere((alert) => alert.id == id);
    await _preferences.setString(_storageKey, _encode(alerts));
  }

  /// Dismiss an alert for the current session. Dismissal is stored with the
  /// alert's end date so that the alert will reappear if it's still active
  /// after a new app session.
  Future<void> dismissAlert(String alertId, String endDate) async {
    final dismissed = await getDismissedAlerts();
    dismissed[alertId] = endDate;
    await _preferences.setString(_dismissedKey, jsonEncode(dismissed));
  }

  /// Check if an alert is dismissed. Returns false if the alert's end date
  /// has passed since dismissal (meaning it should reappear for new alerts
  /// with the same ID).
  Future<bool> isAlertDismissed(String alertId, String currentEndDate) async {
    final dismissed = await getDismissedAlerts();
    if (!dismissed.containsKey(alertId)) {
      return false;
    }
    // Alert was dismissed - check if end date matches
    // If the end date changed, the alert should reappear
    return dismissed[alertId] == currentEndDate;
  }

  /// Get all dismissed alerts as a map of alertId -> endDate
  Future<Map<String, String>> getDismissedAlerts() async {
    final stored = _preferences.getString(_dismissedKey);
    if (stored == null) {
      return {};
    }
    final Map<String, dynamic> decoded = jsonDecode(stored);
    return decoded.map((key, value) => MapEntry(key, value as String));
  }

  /// Clear expired dismissals (where the alert's end date has passed)
  Future<void> cleanupDismissedAlerts() async {
    final dismissed = await getDismissedAlerts();
    final now = DateTime.now();
    final cleaned = <String, String>{};

    for (final entry in dismissed.entries) {
      try {
        final endDate = DateTime.parse(entry.value);
        if (endDate.isAfter(now)) {
          cleaned[entry.key] = entry.value;
        }
      } catch (_) {
        // Invalid date, skip
      }
    }

    await _preferences.setString(_dismissedKey, jsonEncode(cleaned));
  }

  /// Restore a dismissed alert (make it visible again)
  Future<void> restoreAlert(String alertId) async {
    final dismissed = await getDismissedAlerts();
    dismissed.remove(alertId);
    await _preferences.setString(_dismissedKey, jsonEncode(dismissed));
  }

  String _encode(List<ServiceAlert> alerts) =>
      jsonEncode(alerts.map((alert) => alert.toJson()).toList());
}
