import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/enums.dart';
import '../../../data/models/service_alert.dart';
import '../../../utils/color_utils.dart';
import '../../../utils/date_utils.dart';
import '../../providers/alerts_provider.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/common/loading_skeleton.dart';

class AlertDetailScreen extends ConsumerWidget {
  const AlertDetailScreen({super.key, required this.alertId});

  final String alertId;

  static const routeName = 'alertDetail';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alertAsync = ref.watch(alertByIdProvider(alertId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Alert Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => _goBack(context),
        ),
      ),
      body: alertAsync.when(
        data: (alert) {
          if (alert == null) {
            return _AlertNotFound(onBack: () => _goBack(context));
          }
          return _AlertDetailContent(
            alert: alert,
            onDismiss: () => _dismissAlert(context, ref, alert),
          );
        },
        loading: () => const _AlertDetailLoading(),
        error: (error, stackTrace) => _AlertError(
          onRetry: () => ref.invalidate(alertByIdProvider(alertId)),
        ),
      ),
    );
  }

  void _goBack(BuildContext context) {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go(homeRoute);
    }
  }

  Future<void> _dismissAlert(
    BuildContext context,
    WidgetRef ref,
    ServiceAlert alert,
  ) async {
    await ref.read(dismissedAlertsProvider.notifier).dismiss(
          alert.id,
          alert.endDate,
        );

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Alert dismissed'),
          action: SnackBarAction(
            label: 'Undo',
            onPressed: () {
              ref.read(dismissedAlertsProvider.notifier).restore(alert.id);
            },
          ),
        ),
      );
      _goBack(context);
    }
  }
}

class _AlertDetailContent extends StatelessWidget {
  const _AlertDetailContent({
    required this.alert,
    required this.onDismiss,
  });

  final ServiceAlert alert;
  final VoidCallback onDismiss;

  @override
  Widget build(BuildContext context) {
    final severityColor = alertSeverityColor(alert.severity);
    final background = alertSeverityBackground(alert.severity);
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        // Severity and status header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: background,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: severityColor.withAlpha((255 * 0.4).round()),
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  _SeverityBadge(
                    color: severityColor,
                    label: alert.severity.label,
                  ),
                  const Spacer(),
                  _StatusIndicator(isActive: alert.isActive),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                alert.title,
                style: theme.textTheme.headlineSmall?.copyWith(
                  color: AppColors.darkText,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Message section
        _DetailSection(
          title: 'Details',
          icon: Icons.info_outline,
          child: Text(
            alert.message,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: AppColors.darkText,
              height: 1.5,
            ),
          ),
        ),

        const SizedBox(height: 20),

        // Date range section
        _DetailSection(
          title: 'Active Period',
          icon: Icons.calendar_today_outlined,
          child: Row(
            children: [
              Expanded(
                child: _DateCard(
                  label: 'Start',
                  date: DateTime.parse(alert.startDate),
                ),
              ),
              const SizedBox(width: 16),
              const Icon(
                Icons.arrow_forward,
                color: AppColors.darkGrey,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _DateCard(
                  label: 'End',
                  date: DateTime.parse(alert.endDate),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Affected areas section
        _DetailSection(
          title: 'Affected Areas',
          icon: Icons.location_on_outlined,
          child: alert.affectedPostcodes.isEmpty
              ? Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withAlpha((255 * 0.08).round()),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.public,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'This alert affects all areas in the borough',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: alert.affectedPostcodes
                      .map(
                        (postcode) => Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Text(
                            postcode,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: AppColors.darkText,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
        ),

        const SizedBox(height: 32),

        // Dismiss button
        if (alert.isActive)
          SecondaryButton(
            label: 'Dismiss this alert',
            icon: const Icon(Icons.visibility_off_outlined),
            onPressed: onDismiss,
            expand: true,
          ),

        const SizedBox(height: 12),

        Text(
          alert.isActive
              ? 'Dismissed alerts will reappear if the alert is updated or when you restart the app.'
              : 'This alert has expired and is no longer active.',
          style: theme.textTheme.bodySmall?.copyWith(
            color: AppColors.darkGrey,
          ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: 24),
      ],
    );
  }
}

class _SeverityBadge extends StatelessWidget {
  const _SeverityBadge({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: color.withAlpha((255 * 0.15).round()),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withAlpha((255 * 0.3).round())),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _severityIcon(label),
            color: color,
            size: 18,
          ),
          const SizedBox(width: 8),
          Text(
            label.toUpperCase(),
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
          ),
        ],
      ),
    );
  }

  IconData _severityIcon(String label) {
    switch (label.toLowerCase()) {
      case 'urgent':
        return Icons.warning_amber_rounded;
      case 'warning':
        return Icons.error_outline;
      default:
        return Icons.info_outline;
    }
  }
}

class _StatusIndicator extends StatelessWidget {
  const _StatusIndicator({required this.isActive});

  final bool isActive;

  @override
  Widget build(BuildContext context) {
    final color = isActive ? AppColors.success : AppColors.darkGrey;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withAlpha((255 * 0.1).round()),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            isActive ? 'Active' : 'Expired',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}

class _DetailSection extends StatelessWidget {
  const _DetailSection({
    required this.title,
    required this.icon,
    required this.child,
  });

  final String title;
  final IconData icon;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.primary, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.darkText,
                      fontWeight: FontWeight.w600,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}

class _DateCard extends StatelessWidget {
  const _DateCard({required this.label, required this.date});

  final String label;
  final DateTime date;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppColors.darkGrey,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            formatDate(date),
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: AppColors.darkText,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}

class _AlertNotFound extends StatelessWidget {
  const _AlertNotFound({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.search_off_outlined,
              size: 64,
              color: AppColors.darkGrey,
            ),
            const SizedBox(height: 24),
            Text(
              'Alert not found',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: AppColors.darkText,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'This alert may have been deleted or is no longer available.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGrey,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              label: 'Go back',
              onPressed: onBack,
            ),
          ],
        ),
      ),
    );
  }
}

class _AlertDetailLoading extends StatelessWidget {
  const _AlertDetailLoading();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LoadingSkeleton(height: 32, width: 120),
                SizedBox(height: 16),
                LoadingSkeleton(height: 28, width: double.infinity),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LoadingSkeleton(height: 20, width: 100),
                SizedBox(height: 16),
                LoadingSkeleton(height: 16, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: 200),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AlertError extends StatelessWidget {
  const _AlertError({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: AppColors.error,
            ),
            const SizedBox(height: 24),
            Text(
              'Unable to load alert',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: AppColors.darkText,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'Something went wrong while loading this alert.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGrey,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              label: 'Try again',
              onPressed: onRetry,
            ),
          ],
        ),
      ),
    );
  }
}
