import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/property.dart';
import 'repository_providers.dart';

final propertiesProvider = FutureProvider<List<Property>>((ref) async {
  final repository = ref.watch(propertyRepositoryProvider);
  return repository.getAll();
});

final propertySearchQueryProvider = StateProvider<String>((ref) => '');

final filteredPropertiesProvider = FutureProvider<List<Property>>((ref) async {
  final query = ref.watch(propertySearchQueryProvider);
  final properties = await ref.watch(propertiesProvider.future);
  if (query.isEmpty) {
    return properties;
  }
  final lowerQuery = query.toLowerCase();
  return properties
      .where(
        (property) =>
            property.address.toLowerCase().contains(lowerQuery) ||
            property.postcode.toLowerCase().contains(lowerQuery),
      )
      .toList();
});
