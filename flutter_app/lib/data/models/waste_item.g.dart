// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'waste_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WasteItem _$WasteItemFromJson(Map<String, dynamic> json) => WasteItem(
  id: json['id'] as String,
  name: json['name'] as String,
  binType: $enumDecode(_$BinTypeEnumMap, json['binType']),
  notes: json['notes'] as String,
);

Map<String, dynamic> _$WasteItemToJson(WasteItem instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'binType': _$BinTypeEnumMap[instance.binType]!,
  'notes': instance.notes,
};

const _$BinTypeEnumMap = {
  BinType.general: 'general',
  BinType.recycling: 'recycling',
  BinType.garden: 'garden',
  BinType.food: 'food',
  BinType.recyclingCentre: 'recycling-centre',
};
