import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/property.dart';
import '../../providers/collections_provider.dart';
import '../../providers/property_provider.dart';

class FindBinDayState {
  const FindBinDayState({required this.property, required this.collections});

  final Property? property;
  final List<CollectionSchedule> collections;

  bool get hasSelectedProperty => property != null;
}

final findBinDayViewModelProvider =
    AutoDisposeNotifierProvider<FindBinDayViewModel, FindBinDayState>(
      FindBinDayViewModel.new,
    );

class FindBinDayViewModel extends AutoDisposeNotifier<FindBinDayState> {
  @override
  FindBinDayState build() {
    final property = ref.watch(propertyProvider);
    final schedules = ref.watch(collectionsSortedProvider);
    final orderedCollections = _orderCollections(schedules);

    return FindBinDayState(property: property, collections: orderedCollections);
  }

  List<CollectionSchedule> _orderCollections(
    List<CollectionSchedule> schedules,
  ) {
    final lookup = <BinType, CollectionSchedule>{
      for (final schedule in schedules) schedule.binType: schedule,
    };

    return _binOrder
        .map(
          (type) =>
              lookup[type] ??
              CollectionSchedule(
                binType: type,
                nextCollectionDate: null,
                daysUntil: null,
              ),
        )
        .toList();
  }
}

const _binOrder = [
  BinType.general,
  BinType.recycling,
  BinType.garden,
  BinType.food,
];
