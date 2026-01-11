import 'package:json_annotation/json_annotation.dart';

@JsonEnum()
enum BinType {
  @JsonValue('general')
  general,
  @JsonValue('recycling')
  recycling,
  @JsonValue('garden')
  garden,
  @JsonValue('food')
  food,
  @JsonValue('recycling-centre')
  recyclingCentre,
}

extension BinTypeExtensions on BinType {
  String get label {
    switch (this) {
      case BinType.general:
        return 'Rubbish';
      case BinType.recycling:
        return 'Recycling';
      case BinType.garden:
        return 'Garden Waste';
      case BinType.food:
        return 'Food Waste';
      case BinType.recyclingCentre:
        return 'Recycling Centre';
    }
  }
}

@JsonEnum()
enum AlertSeverity {
  @JsonValue('info')
  info,
  @JsonValue('warning')
  warning,
  @JsonValue('urgent')
  urgent,
}

extension AlertSeverityExtensions on AlertSeverity {
  String get label {
    switch (this) {
      case AlertSeverity.info:
        return 'Information';
      case AlertSeverity.warning:
        return 'Warning';
      case AlertSeverity.urgent:
        return 'Urgent';
    }
  }
}

@JsonEnum()
enum ReportType {
  @JsonValue('missed-bin')
  missedBin,
  @JsonValue('fly-tipping')
  flyTipping,
  @JsonValue('damaged-bin')
  damagedBin,
  @JsonValue('overflowing-bin')
  overflowingBin,
  @JsonValue('street-lighting')
  streetLighting,
  @JsonValue('other')
  other,
}

extension ReportTypeExtensions on ReportType {
  String get label {
    switch (this) {
      case ReportType.missedBin:
        return 'Missed Collection';
      case ReportType.flyTipping:
        return 'Fly-tipping';
      case ReportType.damagedBin:
        return 'Damaged Bin';
      case ReportType.overflowingBin:
        return 'Overflowing Bin';
      case ReportType.streetLighting:
        return 'Street Lighting';
      case ReportType.other:
        return 'Other Issue';
    }
  }
}
