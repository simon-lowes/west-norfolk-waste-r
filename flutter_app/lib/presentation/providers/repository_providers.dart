import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/alert_repository.dart';
import '../../data/repositories/property_repository.dart';
import '../../data/repositories/recycling_centre_repository.dart';
import '../../data/repositories/report_repository.dart';
import '../../data/repositories/waste_repository.dart';
import 'shared_preferences_provider.dart';

final propertyRepositoryProvider = Provider<PropertyRepository>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return PropertyRepository(prefs);
});

final wasteRepositoryProvider = Provider<WasteRepository>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return WasteRepository(prefs);
});

final alertRepositoryProvider = Provider<AlertRepository>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return AlertRepository(prefs);
});

final recyclingCentreRepositoryProvider = Provider<RecyclingCentreRepository>((
  ref,
) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return RecyclingCentreRepository(prefs);
});

final reportRepositoryProvider = Provider<ReportRepository>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return ReportRepository(prefs);
});
