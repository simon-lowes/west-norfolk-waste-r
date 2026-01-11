import 'package:intl/intl.dart';

/// UK bank holidays for 2024-2026.
/// Source: https://www.gov.uk/bank-holidays
const List<String> bankHolidays = [
  // 2024
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  // 2025
  '2025-01-01', // New Year's Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-05-05', // Early May bank holiday
  '2025-05-26', // Spring bank holiday
  '2025-08-25', // Summer bank holiday
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
  // 2026
  '2026-01-01', // New Year's Day
  '2026-04-03', // Good Friday
  '2026-04-06', // Easter Monday
  '2026-05-04', // Early May bank holiday
  '2026-05-25', // Spring bank holiday
  '2026-08-31', // Summer bank holiday
  '2026-12-25', // Christmas Day
  '2026-12-28', // Boxing Day (substitute - 26th is Saturday)
];

bool isBankHoliday(DateTime date) {
  final formatted = DateFormat('yyyy-MM-dd').format(date);
  return bankHolidays.contains(formatted);
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
