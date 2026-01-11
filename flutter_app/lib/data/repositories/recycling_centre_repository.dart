import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/recycling_centre.dart';
import '../sample_data/mock_recycling_centres.dart';

class RecyclingCentreRepository {
  RecyclingCentreRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'recycling_centres';
  static const _versionKey = 'recycling_centres_version';

  // Increment this version to force a refresh of cached data
  static const _currentVersion = 2;

  Future<List<RecyclingCentre>> getAll() async {
    final storedVersion = _preferences.getInt(_versionKey) ?? 0;
    final stored = _preferences.getString(_storageKey);

    // If no data or version mismatch, refresh from mock data
    if (stored == null || storedVersion < _currentVersion) {
      await _preferences.setString(_storageKey, _encode(mockRecyclingCentres));
      await _preferences.setInt(_versionKey, _currentVersion);
      return mockRecyclingCentres;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => RecyclingCentre.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  /// Force refresh from mock data (useful for development or data updates).
  Future<List<RecyclingCentre>> refresh() async {
    await _preferences.setString(_storageKey, _encode(mockRecyclingCentres));
    await _preferences.setInt(_versionKey, _currentVersion);
    return mockRecyclingCentres;
  }

  String _encode(List<RecyclingCentre> centres) =>
      jsonEncode(centres.map((centre) => centre.toJson()).toList());
}
