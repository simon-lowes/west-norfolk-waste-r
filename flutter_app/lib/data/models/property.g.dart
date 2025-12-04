// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Property _$PropertyFromJson(Map<String, dynamic> json) => Property(
  id: json['id'] as String,
  postcode: json['postcode'] as String,
  address: json['address'] as String,
  rubbishDayOfWeek: (json['rubbishDayOfWeek'] as num).toInt(),
  recyclingDayOfWeek: (json['recyclingDayOfWeek'] as num).toInt(),
  gardenDayOfWeek: (json['gardenDayOfWeek'] as num).toInt(),
  foodDayOfWeek: (json['foodDayOfWeek'] as num).toInt(),
  nextRubbishDate: json['nextRubbishDate'] as String?,
  nextRecyclingDate: json['nextRecyclingDate'] as String?,
  nextGardenDate: json['nextGardenDate'] as String?,
  nextFoodDate: json['nextFoodDate'] as String?,
);

Map<String, dynamic> _$PropertyToJson(Property instance) => <String, dynamic>{
  'id': instance.id,
  'postcode': instance.postcode,
  'address': instance.address,
  'rubbishDayOfWeek': instance.rubbishDayOfWeek,
  'recyclingDayOfWeek': instance.recyclingDayOfWeek,
  'gardenDayOfWeek': instance.gardenDayOfWeek,
  'foodDayOfWeek': instance.foodDayOfWeek,
  'nextRubbishDate': instance.nextRubbishDate,
  'nextRecyclingDate': instance.nextRecyclingDate,
  'nextGardenDate': instance.nextGardenDate,
  'nextFoodDate': instance.nextFoodDate,
};
