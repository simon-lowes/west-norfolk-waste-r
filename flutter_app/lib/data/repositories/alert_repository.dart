import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/service_alert.dart';
import '../sample_data/mock_alerts.dart';

class AlertRepository {
  AlertRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'service_alerts';

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

  Future<void> delete(String id) async {
    final alerts = await getAll();
    alerts.removeWhere((alert) => alert.id == id);
    await _preferences.setString(_storageKey, _encode(alerts));
  }

  String _encode(List<ServiceAlert> alerts) =>
      jsonEncode(alerts.map((alert) => alert.toJson()).toList());
}
