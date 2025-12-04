import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/service_alert.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/loading_skeleton.dart';
import '../../widgets/common/service_alert_card.dart';
import '../../widgets/common/buttons.dart';
import 'service_alerts_viewmodel.dart';

class ServiceAlertsScreen extends ConsumerWidget {
  const ServiceAlertsScreen({super.key});

  static const routeName = 'serviceAlerts';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(serviceAlertsViewModelProvider);
    final viewModel = ref.watch(serviceAlertsViewModelProvider.notifier);

    final subtitle = state.hasSelectedProperty
        ? 'Alerts for ${state.property!.postcode}'
        : 'Select your address to view local alerts';

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Service alerts',
        subtitle: subtitle,
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: RefreshIndicator(
        onRefresh: () => viewModel.refreshAlerts(),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            state.hasSelectedProperty
                ? _AlertsContent(
                    alerts: state.alerts,
                    onRetry: () => viewModel.retry(),
                  )
                : _NoAddressSelected(
                    onChangeAddress: () => _goToSettings(context),
                  ),
          ],
        ),
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: 4,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _AlertsContent extends StatelessWidget {
  const _AlertsContent({required this.alerts, required this.onRetry});

  final AsyncValue<List<ServiceAlert>> alerts;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return alerts.when(
      data: (alerts) {
        if (alerts.isEmpty) {
          return const EmptyState(
            title: 'No service alerts',
            message: 'Everything is running smoothly in your area right now.',
            icon: Icons.celebration_outlined,
          );
        }

        return Column(
          children: alerts.map((alert) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: ServiceAlertCard(alert: alert),
            );
          }).toList(),
        );
      },
      loading: () => const _AlertsLoadingList(),
      error: (error, stackTrace) => AppErrorView(
        message: 'We couldn\'t load service alerts right now.',
        onRetry: onRetry,
      ),
    );
  }
}

class _NoAddressSelected extends StatelessWidget {
  const _NoAddressSelected({required this.onChangeAddress});

  final VoidCallback onChangeAddress;

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      title: 'Add your address',
      message:
          'Choose your property so we can show service alerts for your area.',
      action: PrimaryButton(
        label: 'Choose address',
        onPressed: onChangeAddress,
      ),
      icon: Icons.home_work_outlined,
    );
  }
}

class _AlertsLoadingList extends StatelessWidget {
  const _AlertsLoadingList();

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
                LoadingSkeleton(height: 16, width: 120),
                SizedBox(height: 12),
                LoadingSkeleton(height: 20, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: 160),
              ],
            ),
          ),
        );
      }),
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
  context.go(_navRoutes[index]);
}

void _goToSettings(BuildContext context) {
  context.go(settingsRoute);
}

void _goToAdmin(BuildContext context) {
  context.go(adminRoute);
}
