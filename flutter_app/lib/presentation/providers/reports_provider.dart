import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/report.dart';
import '../../data/repositories/report_repository.dart';
import 'repository_providers.dart';

class ReportsNotifier extends StateNotifier<AsyncValue<List<Report>>> {
  ReportsNotifier(this._repository) : super(const AsyncValue.loading()) {
    unawaited(_loadReports());
  }

  final ReportRepository _repository;

  Future<void> refresh() => _loadReports();

  Future<void> addReport(Report report) async {
    try {
      await _repository.add(report);
      await _loadReports();
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  Future<void> _loadReports() async {
    try {
      final reports = await _repository.getAll();
      state = AsyncValue.data(reports);
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }
}

final reportsProvider =
    StateNotifierProvider<ReportsNotifier, AsyncValue<List<Report>>>((ref) {
      final repository = ref.watch(reportRepositoryProvider);
      return ReportsNotifier(repository);
    });
