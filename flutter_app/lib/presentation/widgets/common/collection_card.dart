import 'package:flutter/material.dart';

import '../../../config/theme/colors.dart';
import '../../../data/models/enums.dart';
import '../../../utils/color_utils.dart';
import '../../../utils/date_utils.dart';
import 'bin_badge.dart';

class CollectionCard extends StatelessWidget {
  const CollectionCard({
    super.key,
    required this.binType,
    this.nextCollection,
    this.daysUntil,
    this.onTap,
  });

  final BinType binType;
  final DateTime? nextCollection;
  final int? daysUntil;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final color = binTypeColor(binType);
    final titleStyle = Theme.of(
      context,
    ).textTheme.titleMedium?.copyWith(color: AppColors.darkText);

    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                BinBadge(type: binType),
                if (daysUntil != null)
                  _DaysUntilPill(days: daysUntil!, color: color),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              nextCollection != null
                  ? formatDate(nextCollection!)
                  : 'No date scheduled',
              style: titleStyle,
            ),
            const SizedBox(height: 4),
            Text(
              _buildSubtitle(),
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppColors.darkGrey),
            ),
          ],
        ),
      ),
    );
  }

  String _buildSubtitle() {
    if (daysUntil == null || nextCollection == null) {
      return 'Select an address to view collection dates.';
    }
    if (daysUntil == 0) {
      return 'Collection is today';
    }
    if (daysUntil == 1) {
      return 'Collection is tomorrow';
    }
    return 'In $daysUntil days';
  }
}

class _DaysUntilPill extends StatelessWidget {
  const _DaysUntilPill({required this.days, required this.color});

  final int days;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withAlpha((255 * 0.15).round()),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        days == 0 ? 'Today' : '${days}d',
        style: Theme.of(context).textTheme.labelLarge?.copyWith(color: color),
      ),
    );
  }
}
