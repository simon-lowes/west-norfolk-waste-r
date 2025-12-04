// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'report.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Report _$ReportFromJson(Map<String, dynamic> json) => Report(
  id: json['id'] as String,
  type: $enumDecode(_$ReportTypeEnumMap, json['type']),
  description: json['description'] as String,
  location: json['location'] == null
      ? null
      : ReportLocation.fromJson(json['location'] as Map<String, dynamic>),
  photo: json['photo'] as String?,
  postcode: json['postcode'] as String?,
  address: json['address'] as String?,
  createdAt: json['createdAt'] as String,
  referenceNumber: json['referenceNumber'] as String,
);

Map<String, dynamic> _$ReportToJson(Report instance) => <String, dynamic>{
  'id': instance.id,
  'type': _$ReportTypeEnumMap[instance.type]!,
  'description': instance.description,
  'location': instance.location,
  'photo': instance.photo,
  'postcode': instance.postcode,
  'address': instance.address,
  'createdAt': instance.createdAt,
  'referenceNumber': instance.referenceNumber,
};

const _$ReportTypeEnumMap = {
  ReportType.missedBin: 'missed-bin',
  ReportType.flyTipping: 'fly-tipping',
  ReportType.streetLighting: 'street-lighting',
  ReportType.other: 'other',
};

ReportLocation _$ReportLocationFromJson(Map<String, dynamic> json) =>
    ReportLocation(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
    );

Map<String, dynamic> _$ReportLocationToJson(ReportLocation instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };
