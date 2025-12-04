import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/recycling_centre.dart';
import 'repository_providers.dart';

final recyclingCentresProvider = FutureProvider<List<RecyclingCentre>>((
  ref,
) async {
  final repository = ref.watch(recyclingCentreRepositoryProvider);
  return repository.getAll();
});
