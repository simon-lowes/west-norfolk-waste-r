import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/report.dart';
import '../sample_data/mock_reports.dart';

class ReportRepository {
  ReportRepository(this._preferences);

  final SharedPreferences _preferences;

  static const _storageKey = 'reports';

  Future<List<Report>> getAll() async {
    final stored = _preferences.getString(_storageKey);
    if (stored == null) {
      await _preferences.setString(_storageKey, _encode(mockReports));
      return mockReports;
    }

    final List<dynamic> jsonList = jsonDecode(stored) as List<dynamic>;
    return jsonList
        .map((json) => Report.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<void> add(Report report) async {
    final reports = await getAll();
    reports.add(report);
    await _preferences.setString(_storageKey, _encode(reports));
  }

  String _encode(List<Report> reports) =>
      jsonEncode(reports.map((report) => report.toJson()).toList());
}
