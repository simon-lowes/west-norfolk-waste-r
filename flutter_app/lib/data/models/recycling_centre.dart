import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'recycling_centre.g.dart';

@immutable
@JsonSerializable()
class RecyclingCentre {
  const RecyclingCentre({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.openingHours,
    required this.notes,
    this.materialsAccepted = const [],
    this.phoneNumber,
  });

  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final String openingHours;
  final String notes;
  final List<String> materialsAccepted;
  final String? phoneNumber;

  factory RecyclingCentre.fromJson(Map<String, dynamic> json) =>
      _$RecyclingCentreFromJson(json);

  Map<String, dynamic> toJson() => _$RecyclingCentreToJson(this);
}
