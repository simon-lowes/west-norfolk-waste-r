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

  final lowerQuery = query.toLowerCase().trim();

  // Split query into words for multi-word fuzzy matching
  final queryWords = lowerQuery.split(RegExp(r'\s+'));

  // Score items based on match quality
  final scoredItems = <(WasteItem, int)>[];

  for (final item in items) {
    final nameLower = item.name.toLowerCase();
    final notesLower = item.notes.toLowerCase();
    final keywordsLower = item.keywords.map((k) => k.toLowerCase()).toList();
    int score = 0;

    // Exact name match (highest priority)
    if (nameLower == lowerQuery) {
      score = 100;
    }
    // Name starts with query
    else if (nameLower.startsWith(lowerQuery)) {
      score = 90;
    }
    // Exact keyword match
    else if (keywordsLower.any((k) => k == lowerQuery)) {
      score = 85;
    }
    // Name contains exact query
    else if (nameLower.contains(lowerQuery)) {
      score = 80;
    }
    // Keyword contains exact query
    else if (keywordsLower.any((k) => k.contains(lowerQuery))) {
      score = 75;
    }
    // All query words found in name
    else if (queryWords.every((word) => nameLower.contains(word))) {
      score = 70;
    }
    // All query words found in keywords
    else if (queryWords.every((word) => keywordsLower.any((k) => k.contains(word)))) {
      score = 65;
    }
    // Any query word found in name
    else if (queryWords.any((word) => word.length >= 3 && nameLower.contains(word))) {
      score = 50;
    }
    // Any query word found in keywords
    else if (queryWords.any((word) => word.length >= 3 && keywordsLower.any((k) => k.contains(word)))) {
      score = 45;
    }
    // Query found in notes
    else if (notesLower.contains(lowerQuery)) {
      score = 30;
    }
    // Any query word found in notes
    else if (queryWords.any((word) => word.length >= 3 && notesLower.contains(word))) {
      score = 20;
    }

    if (score > 0) {
      scoredItems.add((item, score));
    }
  }

  // Sort by score (highest first), then alphabetically by name
  scoredItems.sort((a, b) {
    final scoreCompare = b.$2.compareTo(a.$2);
    if (scoreCompare != 0) return scoreCompare;
    return a.$1.name.compareTo(b.$1.name);
  });

  return scoredItems.map((e) => e.$1).toList();
});
