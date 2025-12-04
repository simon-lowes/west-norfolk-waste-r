import 'package:intl/intl.dart';

const List<String> bankHolidays2024to2025 = [
  '2024-12-25',
  '2024-12-26',
  '2025-01-01',
  '2025-04-18',
  '2025-04-21',
  '2025-05-05',
  '2025-05-26',
  '2025-08-25',
  '2025-12-25',
  '2025-12-26',
];

bool isBankHoliday(DateTime date) {
  final formatted = DateFormat('yyyy-MM-dd').format(date);
  return bankHolidays2024to2025.contains(formatted);
}

DateTime getNextCollectionDate(int sparkDayOfWeek, {DateTime? fromDate}) {
  final anchor = fromDate ?? DateTime.now();
  final normalizedAnchor = DateTime(anchor.year, anchor.month, anchor.day);
  final targetWeekday = _mapSparkDayOfWeek(sparkDayOfWeek);

  var delta = targetWeekday - normalizedAnchor.weekday;
  if (delta <= 0) {
    delta += 7;
  }

  var candidate = normalizedAnchor.add(Duration(days: delta));
  while (isBankHoliday(candidate)) {
    candidate = candidate.add(const Duration(days: 1));
  }
  return candidate;
}

String formatDate(DateTime date) {
  final formatter = DateFormat('EEEE d MMMM');
  return formatter.format(date);
}

String getDayName(int sparkDayOfWeek) {
  final weekday = _mapSparkDayOfWeek(sparkDayOfWeek);
  const names = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return names[(weekday - 1).clamp(0, names.length - 1)];
}

int getDaysUntil(DateTime date, {DateTime? fromDate}) {
  final anchor = fromDate ?? DateTime.now();
  final startOfAnchor = DateTime(anchor.year, anchor.month, anchor.day);
  final startOfDate = DateTime(date.year, date.month, date.day);
  final diff = startOfDate.difference(startOfAnchor).inDays;
  return diff < 0 ? 0 : diff;
}

int _mapSparkDayOfWeek(int value) {
  if (value == 0) {
    return DateTime.sunday;
  }
  final adjusted = value % 7;
  return adjusted == 0 ? DateTime.sunday : adjusted;
}
