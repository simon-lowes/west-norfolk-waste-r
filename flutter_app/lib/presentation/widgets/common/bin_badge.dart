import 'package:flutter/material.dart';

import '../../../data/models/enums.dart';
import '../../../utils/color_utils.dart';

class BinBadge extends StatelessWidget {
  const BinBadge({super.key, required this.type});

  final BinType type;

  @override
  Widget build(BuildContext context) {
    final color = binTypeColor(type);
    final backgroundColor = color.withAlpha((255 * 0.15).round());
    final borderColor = color.withAlpha((255 * 0.4).round());

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Text(
        type.label,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(color: color),
      ),
    );
  }
}
