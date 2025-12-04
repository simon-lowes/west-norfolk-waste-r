import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/property.dart';
import '../../providers/properties_provider.dart';
import '../../providers/property_provider.dart';

class SettingsState {
  const SettingsState({
    required this.selectedProperty,
    required this.properties,
  });

  final Property? selectedProperty;
  final AsyncValue<List<Property>> properties;
}

final settingsViewModelProvider =
    AutoDisposeNotifierProvider<SettingsViewModel, SettingsState>(
      SettingsViewModel.new,
    );

class SettingsViewModel extends AutoDisposeNotifier<SettingsState> {
  @override
  SettingsState build() {
    final selectedProperty = ref.watch(propertyProvider);
    final properties = ref.watch(propertiesProvider);

    return SettingsState(
      selectedProperty: selectedProperty,
      properties: properties,
    );
  }

  Future<void> selectProperty(Property property) {
    return ref.read(propertyProvider.notifier).selectProperty(property);
  }

  Future<void> clearSelection() {
    return ref.read(propertyProvider.notifier).clearSelection();
  }

  Future<void> refreshProperties() async {
    final _ = await ref.refresh(propertiesProvider.future);
  }
}
