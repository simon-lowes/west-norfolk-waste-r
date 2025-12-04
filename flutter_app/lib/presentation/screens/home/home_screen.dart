import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/property.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/common/collection_card.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/loading_skeleton.dart';
import '../../widgets/common/service_alert_card.dart';
import 'home_viewmodel.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  static const routeName = 'home';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(homeViewModelProvider);
    final viewModel = ref.watch(homeViewModelProvider.notifier);

    return Scaffold(
      appBar: CustomAppBar(
        title: state.property?.address ?? 'Welcome',
        subtitle:
            state.property?.postcode ?? 'Add your address to personalize info',
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: RefreshIndicator(
        onRefresh: () => viewModel.refreshAlerts(),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            _PropertySummaryCard(
              property: state.property,
              onChangeAddress: () => _goToSettings(context),
            ),
            const SizedBox(height: 24),
            const _SectionHeading(title: 'Next collections'),
            const SizedBox(height: 12),
            if (state.collections.isEmpty)
              EmptyState(
                title: state.hasSelectedProperty
                    ? 'No upcoming collections'
                    : 'Add an address to view collections',
                message: state.hasSelectedProperty
                    ? 'We could not find any dates right now.'
                    : 'Use Change address to pick where you live.',
                action: state.hasSelectedProperty
                    ? null
                    : PrimaryButton(
                        label: 'Choose address',
                        onPressed: () => _goToSettings(context),
                      ),
              )
            else
              Column(
                children: state.collections.take(4).map((schedule) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: CollectionCard(
                      binType: schedule.binType,
                      nextCollection: schedule.nextCollectionDate,
                      daysUntil: schedule.daysUntil,
                    ),
                  );
                }).toList(),
              ),
            const SizedBox(height: 32),
            const _SectionHeading(title: 'Service alerts'),
            const SizedBox(height: 12),
            state.alerts.when(
              data: (alerts) => alerts.isEmpty
                  ? const EmptyState(
                      title: 'No alerts in your area',
                      message: 'We will let you know if something changes.',
                      icon: Icons.celebration_outlined,
                    )
                  : Column(
                      children: alerts.map((alert) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: ServiceAlertCard(alert: alert),
                        );
                      }).toList(),
                    ),
              loading: () => const _AlertsPlaceholderList(),
              error: (error, stackTrace) => AppErrorView(
                message: 'Unable to load service alerts.',
                onRetry: () => viewModel.refreshAlerts(),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: 0,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

const _navRoutes = [
  homeRoute,
  findBinDayRoute,
  whatGoesWhereRoute,
  recyclingCentresRoute,
  serviceAlertsRoute,
  reportIssueRoute,
];

void _onDestinationSelected(BuildContext context, int index) {
  if (index < 0 || index >= _navRoutes.length) {
    return;
  }
  final target = _navRoutes[index];
  context.go(target);
}

void _goToSettings(BuildContext context) {
  context.go(settingsRoute);
}

void _goToAdmin(BuildContext context) {
  context.go(adminRoute);
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleLarge?.copyWith(
        color: AppColors.darkText,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class _PropertySummaryCard extends StatelessWidget {
  const _PropertySummaryCard({
    required this.property,
    required this.onChangeAddress,
  });

  final Property? property;
  final VoidCallback onChangeAddress;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final surface = AppColors.surface;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: property == null
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'No address selected',
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: AppColors.darkText,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Choose an address to see personalised collection dates.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGrey,
                  ),
                ),
                const SizedBox(height: 16),
                PrimaryButton(
                  label: 'Change address',
                  onPressed: onChangeAddress,
                ),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  property!.address,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: AppColors.darkText,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  property!.postcode,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGrey,
                  ),
                ),
              ],
            ),
    );
  }
}

class _AlertsPlaceholderList extends StatelessWidget {
  const _AlertsPlaceholderList();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(2, (index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LoadingSkeleton(height: 18, width: 140),
                SizedBox(height: 12),
                LoadingSkeleton(height: 20, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: 200),
              ],
            ),
          ),
        );
      }),
    );
  }
}
