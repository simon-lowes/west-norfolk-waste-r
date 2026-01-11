import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

import 'enums.dart';

part 'waste_item.g.dart';

@immutable
@JsonSerializable()
class WasteItem {
  const WasteItem({
    required this.id,
    required this.name,
    required this.binType,
    required this.notes,
    this.keywords = const [],
  });

  final String id;
  final String name;
  final BinType binType;
  final String notes;

  /// Alternative search terms/aliases for this item
  final List<String> keywords;

  factory WasteItem.fromJson(Map<String, dynamic> json) =>
      _$WasteItemFromJson(json);

  Map<String, dynamic> toJson() => _$WasteItemToJson(this);
}
