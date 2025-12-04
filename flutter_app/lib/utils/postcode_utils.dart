final _postcodeRegExp = RegExp(
  r'^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$',
  caseSensitive: false,
);

bool validatePostcode(String value) {
  final normalized = value.trim().toUpperCase();
  return _postcodeRegExp.hasMatch(normalized);
}

String normalizePostcode(String value) {
  final uppercased = value.trim().toUpperCase();
  if (!validatePostcode(uppercased)) {
    return uppercased;
  }
  final compact = uppercased.replaceAll(' ', '');
  final outward = compact.substring(0, compact.length - 3);
  final inward = compact.substring(compact.length - 3);
  return '$outward $inward';
}
