// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recycling_centre.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RecyclingCentre _$RecyclingCentreFromJson(Map<String, dynamic> json) =>
    RecyclingCentre(
      id: json['id'] as String,
      name: json['name'] as String,
      address: json['address'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      openingHours: json['openingHours'] as String,
      notes: json['notes'] as String,
    );

Map<String, dynamic> _$RecyclingCentreToJson(RecyclingCentre instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'address': instance.address,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'openingHours': instance.openingHours,
      'notes': instance.notes,
    };
