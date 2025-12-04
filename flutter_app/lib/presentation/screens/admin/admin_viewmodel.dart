import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/service_alert.dart';
import '../../providers/alerts_provider.dart';

class AdminAlertsState {
  const AdminAlertsState({
    required this.alerts,
    required this.title,
    required this.message,
    required this.severity,
    required this.startDate,
    required this.endDate,
    required this.affectedPostcodes,
    this.titleError,
    this.messageError,
    this.startDateError,
    this.endDateError,
    this.affectedPostcodesError,
    this.isSubmitting = false,
    this.submitError,
    this.deletingAlertId,
    this.notificationMessage,
    this.notificationIsError = false,
    this.notificationId = 0,
    this.formResetCounter = 0,
  });

  factory AdminAlertsState.initial(AsyncValue<List<ServiceAlert>> alerts) {
    final now = DateTime.now();
    return AdminAlertsState(
      alerts: alerts,
      title: '',
      message: '',
      severity: AlertSeverity.info,
      startDate: now,
      endDate: now.add(const Duration(days: 7)),
      affectedPostcodes: '',
    );
  }

  final AsyncValue<List<ServiceAlert>> alerts;
  final String title;
  final String message;
  final AlertSeverity severity;
  final DateTime? startDate;
  final DateTime? endDate;
  final String affectedPostcodes;

  final String? titleError;
  final String? messageError;
  final String? startDateError;
  final String? endDateError;
  final String? affectedPostcodesError;

  final bool isSubmitting;
  final String? submitError;

  final String? deletingAlertId;

  final String? notificationMessage;
  final bool notificationIsError;
  final int notificationId;

  final int formResetCounter;

  AdminAlertsState copyWith({
    AsyncValue<List<ServiceAlert>>? alerts,
    String? title,
    String? message,
    AlertSeverity? severity,
    DateTime? startDate,
    DateTime? endDate,
    String? affectedPostcodes,
    Object? titleError = _sentinel,
    Object? messageError = _sentinel,
    Object? startDateError = _sentinel,
    Object? endDateError = _sentinel,
    Object? affectedPostcodesError = _sentinel,
    bool? isSubmitting,
    Object? submitError = _sentinel,
    Object? deletingAlertId = _sentinel,
    Object? notificationMessage = _sentinel,
    bool? notificationIsError,
    int? notificationId,
    int? formResetCounter,
  }) {
    return AdminAlertsState(
      alerts: alerts ?? this.alerts,
      title: title ?? this.title,
      message: message ?? this.message,
      severity: severity ?? this.severity,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      affectedPostcodes: affectedPostcodes ?? this.affectedPostcodes,
      titleError: identical(titleError, _sentinel)
          ? this.titleError
          : titleError as String?,
      messageError: identical(messageError, _sentinel)
          ? this.messageError
          : messageError as String?,
      startDateError: identical(startDateError, _sentinel)
          ? this.startDateError
          : startDateError as String?,
      endDateError: identical(endDateError, _sentinel)
          ? this.endDateError
          : endDateError as String?,
      affectedPostcodesError: identical(affectedPostcodesError, _sentinel)
          ? this.affectedPostcodesError
          : affectedPostcodesError as String?,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      submitError: identical(submitError, _sentinel)
          ? this.submitError
          : submitError as String?,
      deletingAlertId: identical(deletingAlertId, _sentinel)
          ? this.deletingAlertId
          : deletingAlertId as String?,
      notificationMessage: identical(notificationMessage, _sentinel)
          ? this.notificationMessage
          : notificationMessage as String?,
      notificationIsError: notificationIsError ?? this.notificationIsError,
      notificationId: notificationId ?? this.notificationId,
      formResetCounter: formResetCounter ?? this.formResetCounter,
    );
  }
}

const _sentinel = Object();

final adminAlertsViewModelProvider =
    AutoDisposeNotifierProvider<AdminAlertsViewModel, AdminAlertsState>(
      AdminAlertsViewModel.new,
    );

class AdminAlertsViewModel extends AutoDisposeNotifier<AdminAlertsState> {
  @override
  AdminAlertsState build() {
    ref.listen<AsyncValue<List<ServiceAlert>>>(alertsProvider, (
      previous,
      next,
    ) {
      state = state.copyWith(alerts: next);
    });
    return AdminAlertsState.initial(ref.read(alertsProvider));
  }

  void updateTitle(String value) {
    state = state.copyWith(title: value, titleError: null, submitError: null);
  }

  void updateMessage(String value) {
    state = state.copyWith(
      message: value,
      messageError: null,
      submitError: null,
    );
  }

  void updateSeverity(AlertSeverity? severity) {
    state = state.copyWith(
      severity: severity ?? AlertSeverity.info,
      submitError: null,
    );
  }

  void updateStartDate(DateTime date) {
    state = state.copyWith(
      startDate: date,
      startDateError: null,
      submitError: null,
    );
  }

  void updateEndDate(DateTime date) {
    state = state.copyWith(
      endDate: date,
      endDateError: null,
      submitError: null,
    );
  }

  void updateAffectedPostcodes(String value) {
    state = state.copyWith(
      affectedPostcodes: value,
      affectedPostcodesError: null,
      submitError: null,
    );
  }

  Future<void> submitAlert() async {
    if (state.isSubmitting) {
      return;
    }

    final validation = _validateForm();
    if (validation == null) {
      return;
    }

    final postcodes = validation;

    state = state.copyWith(isSubmitting: true, submitError: null);
    final alert = _buildAlert(postcodes);

    try {
      await ref.read(alertsProvider.notifier).create(alert);
      _resetFormFields();
      state = state.copyWith(
        isSubmitting: false,
        notificationMessage: 'Alert created successfully.',
        notificationIsError: false,
        notificationId: state.notificationId + 1,
      );
    } catch (_) {
      state = state.copyWith(
        isSubmitting: false,
        submitError: 'Unable to create alert. Please try again.',
        notificationMessage: 'Failed to create alert.',
        notificationIsError: true,
        notificationId: state.notificationId + 1,
      );
    }
  }

  Future<void> refreshAlerts() {
    return ref.read(alertsProvider.notifier).refresh();
  }

  Future<void> deleteAlert(String id) async {
    if (state.deletingAlertId == id) {
      return;
    }
    state = state.copyWith(deletingAlertId: id);
    try {
      await ref.read(alertsProvider.notifier).delete(id);
      state = state.copyWith(
        deletingAlertId: null,
        notificationMessage: 'Alert deleted.',
        notificationIsError: false,
        notificationId: state.notificationId + 1,
      );
    } catch (_) {
      state = state.copyWith(
        deletingAlertId: null,
        notificationMessage: 'Failed to delete alert.',
        notificationIsError: true,
        notificationId: state.notificationId + 1,
      );
    }
  }

  void resetForm() {
    _resetFormFields();
  }

  void _resetFormFields() {
    final now = DateTime.now();
    state = state.copyWith(
      title: '',
      message: '',
      severity: AlertSeverity.info,
      startDate: now,
      endDate: now.add(const Duration(days: 7)),
      affectedPostcodes: '',
      titleError: null,
      messageError: null,
      startDateError: null,
      endDateError: null,
      affectedPostcodesError: null,
      submitError: null,
      formResetCounter: state.formResetCounter + 1,
    );
  }

  List<String>? _validateForm() {
    final hasTitle = state.title.trim().isNotEmpty;
    final hasMessage = state.message.trim().isNotEmpty;
    final startDate = state.startDate;
    final endDate = state.endDate;
    final parsedPostcodes = _parsePostcodes(state.affectedPostcodes);

    final hasStart = startDate != null;
    final hasEnd = endDate != null;
    bool hasDateOrder = false;
    if (hasStart && hasEnd) {
      hasDateOrder = endDate.isAfter(startDate);
    }

    state = state.copyWith(
      titleError: hasTitle ? null : 'Enter a title',
      messageError: hasMessage ? null : 'Enter a message',
      startDateError: hasStart ? null : 'Choose a start date',
      endDateError: hasEnd
          ? (hasDateOrder ? null : 'End date must be after start date')
          : 'Choose an end date',
      affectedPostcodesError: parsedPostcodes == null
          ? 'Enter postcodes separated by commas or type ALL'
          : null,
    );

    final isValid =
        hasTitle &&
        hasMessage &&
        hasStart &&
        hasEnd &&
        hasDateOrder &&
        parsedPostcodes != null;

    return isValid ? parsedPostcodes : null;
  }

  ServiceAlert _buildAlert(List<String> postcodes) {
    final now = DateTime.now();
    return ServiceAlert(
      id: 'alert-${now.microsecondsSinceEpoch}',
      title: state.title.trim(),
      message: state.message.trim(),
      affectedPostcodes: postcodes,
      startDate: state.startDate!.toIso8601String(),
      endDate: state.endDate!.toIso8601String(),
      severity: state.severity,
    );
  }

  List<String>? _parsePostcodes(String raw) {
    final normalized = raw.trim();
    if (normalized.isEmpty) {
      return null;
    }
    final lowered = normalized.toLowerCase();
    if (lowered == 'all' || normalized == '*') {
      return <String>[];
    }
    final parts = normalized.split(',');
    final cleaned = parts
        .map((part) => part.trim().toUpperCase())
        .where((part) => part.isNotEmpty)
        .toList();
    return cleaned.isEmpty ? null : cleaned;
  }
}
