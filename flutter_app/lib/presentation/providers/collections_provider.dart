import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/enums.dart';
import 'property_provider.dart';

@immutable
class CollectionSchedule {
  const CollectionSchedule({
    required this.binType,
    required this.nextCollectionDate,
    required this.daysUntil,
  });

  final BinType binType;
  final DateTime? nextCollectionDate;
  final int? daysUntil;
}

final nextCollectionDatesProvider = Provider<Map<BinType, DateTime?>>((ref) {
  final property = ref.watch(propertyProvider);
  if (property == null) {
    return const <BinType, DateTime?>{};
  }

  final now = DateTime.now();
  DateTime? resolve(String? isoDate, int dayOfWeek) {
    return _parseIsoDate(isoDate) ?? _calculateNextDate(dayOfWeek, now);
  }

  return {
    BinType.general: resolve(
      property.nextRubbishDate,
      property.rubbishDayOfWeek,
    ),
    BinType.recycling: resolve(
      property.nextRecyclingDate,
      property.recyclingDayOfWeek,
    ),
    BinType.garden: resolve(property.nextGardenDate, property.gardenDayOfWeek),
    BinType.food: resolve(property.nextFoodDate, property.foodDayOfWeek),
  };
});

final daysUntilCollectionsProvider = Provider<Map<BinType, int?>>((ref) {
  final nextDates = ref.watch(nextCollectionDatesProvider);
  if (nextDates.isEmpty) {
    return const <BinType, int?>{};
  }

  final now = DateTime.now();
  final startOfToday = DateTime(now.year, now.month, now.day);

  return nextDates.map((binType, date) {
    if (date == null) {
      return MapEntry(binType, null);
    }
    final difference = date.difference(startOfToday).inDays;
    return MapEntry(binType, difference < 0 ? 0 : difference);
  });
});

final collectionsSortedProvider = Provider<List<CollectionSchedule>>((ref) {
  final nextDates = ref.watch(nextCollectionDatesProvider);
  if (nextDates.isEmpty) {
    return const <CollectionSchedule>[];
  }

  final daysUntilMap = ref.watch(daysUntilCollectionsProvider);

  final schedules =
      nextDates.entries
          .map(
            (entry) => CollectionSchedule(
              binType: entry.key,
              nextCollectionDate: entry.value,
              daysUntil: daysUntilMap[entry.key],
            ),
          )
          .toList()
        ..removeWhere((schedule) => schedule.binType == BinType.recyclingCentre)
        ..sort((a, b) {
          final aDate = a.nextCollectionDate;
          final bDate = b.nextCollectionDate;
          if (aDate == null && bDate == null) {
            return a.binType.index.compareTo(b.binType.index);
          }
          if (aDate == null) {
            return 1;
          }
          if (bDate == null) {
            return -1;
          }
          return aDate.compareTo(bDate);
        });

  return schedules;
});

DateTime? _parseIsoDate(String? value) {
  if (value == null || value.isEmpty) {
    return null;
  }
  return DateTime.tryParse(value);
}

DateTime _calculateNextDate(int sparkDayOfWeek, DateTime reference) {
  final weekday = _mapSparkDayToDartWeekday(sparkDayOfWeek);
  final today = DateTime(reference.year, reference.month, reference.day);
  var delta = weekday - today.weekday;
  if (delta <= 0) {
    delta += 7;
  }
  return today.add(Duration(days: delta));
}

int _mapSparkDayToDartWeekday(int sparkDayOfWeek) {
  if (sparkDayOfWeek == 0) {
    return DateTime.sunday;
  }
  final normalized = sparkDayOfWeek % 7;
  if (normalized == 0) {
    return DateTime.sunday;
  }
  return normalized;
}
