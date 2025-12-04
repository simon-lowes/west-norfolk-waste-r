import 'dart:convert';
import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';

import '../../../data/models/enums.dart';
import '../../../data/models/report.dart';
import '../../../utils/constants.dart';
import '../../../utils/postcode_utils.dart';
import '../../providers/property_provider.dart';
import '../../providers/reports_provider.dart';

const _sentinel = Object();

class ReportIssueState {
  ReportIssueState({
    this.type,
    this.description = '',
    this.descriptionError,
    this.typeError,
    this.postcode,
    this.postcodeError,
    this.address,
    this.photoFile,
    this.photoError,
    this.location,
    this.locationError,
    this.isSubmitting = false,
    this.submitError,
    this.successReference,
    this.formResetCounter = 0,
  });

  final ReportType? type;
  final String description;
  final String? descriptionError;
  final String? typeError;
  final String? postcode;
  final String? postcodeError;
  final String? address;
  final XFile? photoFile;
  final String? photoError;
  final ReportLocation? location;
  final String? locationError;
  final bool isSubmitting;
  final String? submitError;
  final String? successReference;
  final int formResetCounter;

  bool get hasSuccess => successReference != null;

  ReportIssueState copyWith({
    Object? type = _sentinel,
    String? description,
    Object? descriptionError = _sentinel,
    Object? typeError = _sentinel,
    Object? postcode = _sentinel,
    Object? postcodeError = _sentinel,
    Object? address = _sentinel,
    Object? photoFile = _sentinel,
    Object? photoError = _sentinel,
    Object? location = _sentinel,
    Object? locationError = _sentinel,
    bool? isSubmitting,
    Object? submitError = _sentinel,
    Object? successReference = _sentinel,
    int? formResetCounter,
  }) {
    return ReportIssueState(
      type: identical(type, _sentinel) ? this.type : type as ReportType?,
      description: description ?? this.description,
      descriptionError: identical(descriptionError, _sentinel)
          ? this.descriptionError
          : descriptionError as String?,
      typeError: identical(typeError, _sentinel)
          ? this.typeError
          : typeError as String?,
      postcode: identical(postcode, _sentinel)
          ? this.postcode
          : postcode as String?,
      postcodeError: identical(postcodeError, _sentinel)
          ? this.postcodeError
          : postcodeError as String?,
      address: identical(address, _sentinel)
          ? this.address
          : address as String?,
      photoFile: identical(photoFile, _sentinel)
          ? this.photoFile
          : photoFile as XFile?,
      photoError: identical(photoError, _sentinel)
          ? this.photoError
          : photoError as String?,
      location: identical(location, _sentinel)
          ? this.location
          : location as ReportLocation?,
      locationError: identical(locationError, _sentinel)
          ? this.locationError
          : locationError as String?,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      submitError: identical(submitError, _sentinel)
          ? this.submitError
          : submitError as String?,
      successReference: identical(successReference, _sentinel)
          ? this.successReference
          : successReference as String?,
      formResetCounter: formResetCounter ?? this.formResetCounter,
    );
  }
}

final reportIssueViewModelProvider =
    AutoDisposeNotifierProvider<ReportIssueViewModel, ReportIssueState>(
      ReportIssueViewModel.new,
    );

class ReportIssueViewModel extends AutoDisposeNotifier<ReportIssueState> {
  @override
  ReportIssueState build() {
    final property = ref.read(propertyProvider);
    return ReportIssueState(
      postcode: property?.postcode,
      address: property?.address,
    );
  }

  void updateType(ReportType? type) {
    state = state.copyWith(type: type, typeError: null, submitError: null);
  }

  void updateDescription(String value) {
    state = state.copyWith(
      description: value,
      descriptionError: null,
      submitError: null,
    );
  }

  void updatePostcode(String value) {
    state = state.copyWith(
      postcode: value,
      postcodeError: null,
      submitError: null,
    );
  }

  void updateAddress(String value) {
    state = state.copyWith(address: value, submitError: null);
  }

  void setPhoto(XFile file) {
    try {
      final fileSize = File(file.path).lengthSync();
      if (fileSize > AppConstants.maxPhotoSizeBytes) {
        state = state.copyWith(
          photoFile: null,
          photoError: 'Photo must be under 5MB.',
        );
        return;
      }
      state = state.copyWith(
        photoFile: file,
        photoError: null,
        submitError: null,
      );
    } catch (_) {
      state = state.copyWith(
        photoFile: null,
        photoError: 'Unable to read the selected photo.',
      );
    }
  }

  void setPhotoError(String message) {
    state = state.copyWith(
      photoError: message,
      photoFile: null,
      submitError: null,
    );
  }

  void updateLocation(Position position) {
    state = state.copyWith(
      location: ReportLocation(
        latitude: position.latitude,
        longitude: position.longitude,
      ),
      locationError: null,
      submitError: null,
    );
  }

  void setLocationError(String message) {
    state = state.copyWith(locationError: message, submitError: null);
  }

  Future<void> submitReport() async {
    if (state.isSubmitting) {
      return;
    }

    final isValid = _validate();
    if (!isValid) {
      return;
    }

    state = state.copyWith(isSubmitting: true, submitError: null);

    try {
      final report = await _buildReport();
      await ref.read(reportsProvider.notifier).addReport(report);
      state = state.copyWith(
        isSubmitting: false,
        successReference: report.referenceNumber,
      );
    } catch (_) {
      state = state.copyWith(
        isSubmitting: false,
        submitError: 'Unable to submit your report. Please try again.',
      );
    }
  }

  void resetForm() {
    final property = ref.read(propertyProvider);
    state = ReportIssueState(
      postcode: property?.postcode,
      address: property?.address,
      formResetCounter: state.formResetCounter + 1,
    );
  }

  bool _validate() {
    final hasType = state.type != null;
    final hasDescription = state.description.trim().isNotEmpty;
    final postcodeValue = state.postcode?.trim();
    final hasPostcodeError =
        postcodeValue != null &&
        postcodeValue.isNotEmpty &&
        !validatePostcode(postcodeValue);

    state = state.copyWith(
      typeError: hasType ? null : 'Choose an issue type',
      descriptionError: hasDescription
          ? null
          : 'Add a short description of the issue',
      postcodeError: hasPostcodeError
          ? 'Enter a valid postcode like PE30 1AA'
          : null,
    );

    return hasType && hasDescription && !hasPostcodeError;
  }

  Future<Report> _buildReport() async {
    final now = DateTime.now().toUtc();
    final id = now.microsecondsSinceEpoch.toString();
    final reference = _generateReferenceNumber(now);
    final photo = await _encodePhoto(state.photoFile);

    return Report(
      id: id,
      type: state.type!,
      description: state.description.trim(),
      location: state.location,
      photo: photo,
      postcode: _normalizedPostcode(),
      address: _sanitizedAddress(),
      createdAt: now.toIso8601String(),
      referenceNumber: reference,
    );
  }

  String _generateReferenceNumber(DateTime timestamp) {
    final millis = timestamp.millisecondsSinceEpoch.toString();
    final padded = millis.padLeft(8, '0');
    final suffix = padded.substring(padded.length - 8);
    return 'WN$suffix';
  }

  String? _normalizedPostcode() {
    final value = state.postcode?.trim();
    if (value == null || value.isEmpty) {
      return null;
    }
    return validatePostcode(value)
        ? normalizePostcode(value)
        : value.toUpperCase();
  }

  String? _sanitizedAddress() {
    final value = state.address?.trim();
    if (value == null || value.isEmpty) {
      return null;
    }
    return value;
  }

  Future<String?> _encodePhoto(XFile? file) async {
    if (file == null) {
      return null;
    }
    final bytes = await file.readAsBytes();
    if (bytes.length > AppConstants.maxPhotoSizeBytes) {
      throw Exception('Photo too large');
    }
    return base64Encode(bytes);
  }
}
