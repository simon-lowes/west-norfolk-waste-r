import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

import 'enums.dart';

part 'service_alert.g.dart';

@immutable
@JsonSerializable()
class ServiceAlert {
  const ServiceAlert({
    required this.id,
    required this.title,
    required this.message,
    required this.affectedPostcodes,
    required this.startDate,
    required this.endDate,
    required this.severity,
  });

  final String id;
  final String title;
  final String message;
  final List<String> affectedPostcodes;
  final String startDate;
  final String endDate;
  final AlertSeverity severity;

  bool get isActive {
    final now = DateTime.now();
    final start = DateTime.parse(startDate);
    final end = DateTime.parse(endDate);
    return now.isAfter(start) && now.isBefore(end.add(const Duration(days: 1)));
  }

  factory ServiceAlert.fromJson(Map<String, dynamic> json) =>
      _$ServiceAlertFromJson(json);

  Map<String, dynamic> toJson() => _$ServiceAlertToJson(this);
}
