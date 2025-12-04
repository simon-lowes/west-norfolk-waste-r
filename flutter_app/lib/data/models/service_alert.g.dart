// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_alert.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServiceAlert _$ServiceAlertFromJson(Map<String, dynamic> json) => ServiceAlert(
  id: json['id'] as String,
  title: json['title'] as String,
  message: json['message'] as String,
  affectedPostcodes: (json['affectedPostcodes'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  startDate: json['startDate'] as String,
  endDate: json['endDate'] as String,
  severity: $enumDecode(_$AlertSeverityEnumMap, json['severity']),
);

Map<String, dynamic> _$ServiceAlertToJson(ServiceAlert instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'message': instance.message,
      'affectedPostcodes': instance.affectedPostcodes,
      'startDate': instance.startDate,
      'endDate': instance.endDate,
      'severity': _$AlertSeverityEnumMap[instance.severity]!,
    };

const _$AlertSeverityEnumMap = {
  AlertSeverity.info: 'info',
  AlertSeverity.warning: 'warning',
  AlertSeverity.urgent: 'urgent',
};
