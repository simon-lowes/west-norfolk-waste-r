import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/models/property.dart';
import '../../data/repositories/property_repository.dart';
import 'repository_providers.dart';
import 'shared_preferences_provider.dart';

const _selectedPropertyKey = 'selected_property_id';

class PropertyNotifier extends StateNotifier<Property?> {
  PropertyNotifier(this._repository, this._preferences) : super(null) {
    unawaited(_restoreSelectedProperty());
  }

  final PropertyRepository _repository;
  final SharedPreferences _preferences;

  Future<void> selectProperty(Property property) async {
    state = property;
    await _preferences.setString(_selectedPropertyKey, property.id);
  }

  Future<void> selectPropertyById(String id) async {
    final property = await _repository.getById(id);
    if (property != null) {
      await selectProperty(property);
    }
  }

  Future<void> clearSelection() async {
    state = null;
    await _preferences.remove(_selectedPropertyKey);
  }

  Future<void> _restoreSelectedProperty() async {
    final savedId = _preferences.getString(_selectedPropertyKey);
    if (savedId == null) {
      return;
    }

    final property = await _repository.getById(savedId);
    if (property != null) {
      state = property;
    } else {
      await _preferences.remove(_selectedPropertyKey);
    }
  }
}

final propertyProvider = StateNotifierProvider<PropertyNotifier, Property?>((
  ref,
) {
  final repository = ref.watch(propertyRepositoryProvider);
  final prefs = ref.watch(sharedPreferencesProvider);
  return PropertyNotifier(repository, prefs);
});
