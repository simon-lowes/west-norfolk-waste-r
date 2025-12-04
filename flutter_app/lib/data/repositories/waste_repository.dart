import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/waste_item.dart';
import '../sample_data/mock_waste_items.dart';

class WasteRepository {
  WasteRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'waste_items';

  Future<List<WasteItem>> getAll() async {
    final stored = _preferences.getString(_storageKey);
    if (stored == null) {
      await _preferences.setString(_storageKey, _encode(mockWasteItems));
      return mockWasteItems;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => WasteItem.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<WasteItem>> search(String query) async {
    final items = await getAll();
    if (query.isEmpty) {
      return items;
    }
    final lowerQuery = query.toLowerCase();
    return items
        .where((item) => item.name.toLowerCase().contains(lowerQuery))
        .toList();
  }

  String _encode(List<WasteItem> items) =>
      jsonEncode(items.map((item) => item.toJson()).toList());
}
