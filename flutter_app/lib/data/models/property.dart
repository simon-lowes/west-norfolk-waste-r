import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'property.g.dart';

@immutable
@JsonSerializable()
class Property {
  const Property({
    required this.id,
    required this.postcode,
    required this.address,
    required this.rubbishDayOfWeek,
    required this.recyclingDayOfWeek,
    required this.gardenDayOfWeek,
    required this.foodDayOfWeek,
    this.nextRubbishDate,
    this.nextRecyclingDate,
    this.nextGardenDate,
    this.nextFoodDate,
  });

  final String id;
  final String postcode;
  final String address;
  final int rubbishDayOfWeek;
  final int recyclingDayOfWeek;
  final int gardenDayOfWeek;
  final int foodDayOfWeek;
  final String? nextRubbishDate;
  final String? nextRecyclingDate;
  final String? nextGardenDate;
  final String? nextFoodDate;

  Property copyWith({
    String? id,
    String? postcode,
    String? address,
    int? rubbishDayOfWeek,
    int? recyclingDayOfWeek,
    int? gardenDayOfWeek,
    int? foodDayOfWeek,
    String? nextRubbishDate,
    String? nextRecyclingDate,
    String? nextGardenDate,
    String? nextFoodDate,
  }) {
    return Property(
      id: id ?? this.id,
      postcode: postcode ?? this.postcode,
      address: address ?? this.address,
      rubbishDayOfWeek: rubbishDayOfWeek ?? this.rubbishDayOfWeek,
      recyclingDayOfWeek: recyclingDayOfWeek ?? this.recyclingDayOfWeek,
      gardenDayOfWeek: gardenDayOfWeek ?? this.gardenDayOfWeek,
      foodDayOfWeek: foodDayOfWeek ?? this.foodDayOfWeek,
      nextRubbishDate: nextRubbishDate ?? this.nextRubbishDate,
      nextRecyclingDate: nextRecyclingDate ?? this.nextRecyclingDate,
      nextGardenDate: nextGardenDate ?? this.nextGardenDate,
      nextFoodDate: nextFoodDate ?? this.nextFoodDate,
    );
  }

  factory Property.fromJson(Map<String, dynamic> json) =>
      _$PropertyFromJson(json);

  Map<String, dynamic> toJson() => _$PropertyToJson(this);

  @override
  String toString() => 'Property($address, $postcode)';
}
