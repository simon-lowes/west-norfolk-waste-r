import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/recycling_centre.dart';
import '../sample_data/mock_recycling_centres.dart';

class RecyclingCentreRepository {
  RecyclingCentreRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'recycling_centres';

  Future<List<RecyclingCentre>> getAll() async {
    final stored = _preferences.getString(_storageKey);
    if (stored == null) {
      await _preferences.setString(_storageKey, _encode(mockRecyclingCentres));
      return mockRecyclingCentres;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => RecyclingCentre.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  String _encode(List<RecyclingCentre> centres) =>
      jsonEncode(centres.map((centre) => centre.toJson()).toList());
}
