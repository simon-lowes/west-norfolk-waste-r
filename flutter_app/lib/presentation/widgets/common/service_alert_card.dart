import 'package:flutter/material.dart';

import '../../../config/theme/colors.dart';
import '../../../data/models/enums.dart';
import '../../../data/models/service_alert.dart';
import '../../../utils/color_utils.dart';
import '../../../utils/date_utils.dart';

class ServiceAlertCard extends StatelessWidget {
  const ServiceAlertCard({super.key, required this.alert, this.onTap});

  final ServiceAlert alert;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final severityColor = alertSeverityColor(alert.severity);
    final background = alertSeverityBackground(alert.severity);
    final borderColor = severityColor.withAlpha((255 * 0.4).round());

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor, width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _SeverityPill(
                  color: severityColor,
                  label: alert.severity.label,
                ),
                Text(
                  _dateRangeLabel(),
                  style: Theme.of(
                    context,
                  ).textTheme.labelLarge?.copyWith(color: AppColors.darkGrey),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              alert.title,
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
            ),
            const SizedBox(height: 8),
            Text(
              alert.message,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppColors.darkText),
            ),
            if (alert.affectedPostcodes.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: alert.affectedPostcodes
                    .map(
                      (postcode) => Chip(
                        label: Text(postcode),
                        visualDensity: VisualDensity.compact,
                        backgroundColor: AppColors.white,
                      ),
                    )
                    .toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _dateRangeLabel() {
    final start = formatDate(DateTime.parse(alert.startDate));
    final end = formatDate(DateTime.parse(alert.endDate));
    return '$start - $end';
  }
}

class _SeverityPill extends StatelessWidget {
  const _SeverityPill({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withAlpha((255 * 0.12).round()),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label.toUpperCase(),
        style: Theme.of(context).textTheme.labelMedium?.copyWith(
          color: color,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
