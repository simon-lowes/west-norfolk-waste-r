import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

import 'enums.dart';

part 'report.g.dart';

@immutable
@JsonSerializable()
class Report {
  const Report({
    required this.id,
    required this.type,
    required this.description,
    this.location,
    this.photo,
    this.postcode,
    this.address,
    required this.createdAt,
    required this.referenceNumber,
  });

  final String id;
  final ReportType type;
  final String description;
  final ReportLocation? location;
  final String? photo;
  final String? postcode;
  final String? address;
  final String createdAt;
  final String referenceNumber;

  factory Report.fromJson(Map<String, dynamic> json) => _$ReportFromJson(json);

  Map<String, dynamic> toJson() => _$ReportToJson(this);
}

@immutable
@JsonSerializable()
class ReportLocation {
  const ReportLocation({required this.latitude, required this.longitude});

  final double latitude;
  final double longitude;

  factory ReportLocation.fromJson(Map<String, dynamic> json) =>
      _$ReportLocationFromJson(json);

  Map<String, dynamic> toJson() => _$ReportLocationToJson(this);
}
