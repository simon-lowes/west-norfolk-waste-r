import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/property.dart';
import '../sample_data/mock_properties.dart';

class PropertyRepository {
  PropertyRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'properties';

  Future<List<Property>> getAll() async {
    final stored = _preferences.getString(_storageKey);
    if (stored == null) {
      await _preferences.setString(_storageKey, _encode(mockProperties));
      return mockProperties;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => Property.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<Property?> getById(String id) async {
    final items = await getAll();
    try {
      return items.firstWhere((property) => property.id == id);
    } catch (_) {
      return null;
    }
  }

  Future<void> upsert(Property property) async {
    final items = await getAll();
    final updated = [
      for (final existing in items)
        if (existing.id == property.id) property else existing,
    ];
    if (!updated.any((p) => p.id == property.id)) {
      updated.add(property);
    }
    await _preferences.setString(_storageKey, _encode(updated));
  }

  Future<void> delete(String id) async {
    final items = await getAll();
    final filtered = items.where((property) => property.id != id).toList();
    await _preferences.setString(_storageKey, _encode(filtered));
  }

  Future<void> saveAll(List<Property> properties) async {
    await _preferences.setString(_storageKey, _encode(properties));
  }

  String _encode(List<Property> properties) =>
      jsonEncode(properties.map((property) => property.toJson()).toList());
}
