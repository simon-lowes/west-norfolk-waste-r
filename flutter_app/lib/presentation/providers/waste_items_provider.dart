import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/waste_item.dart';
import 'repository_providers.dart';

final wasteItemsProvider = FutureProvider<List<WasteItem>>((ref) async {
  final repository = ref.watch(wasteRepositoryProvider);
  return repository.getAll();
});

final wasteSearchQueryProvider = StateProvider<String>((ref) => '');

final filteredWasteItemsProvider = FutureProvider<List<WasteItem>>((ref) async {
  final query = ref.watch(wasteSearchQueryProvider);
  final items = await ref.watch(wasteItemsProvider.future);
  if (query.isEmpty) {
    return items;
  }

  final lowerQuery = query.toLowerCase();
  return items
      .where((item) => item.name.toLowerCase().contains(lowerQuery))
      .toList();
});
