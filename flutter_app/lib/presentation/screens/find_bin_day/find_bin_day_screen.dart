import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/common/collection_card.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import 'find_bin_day_viewmodel.dart';

class FindBinDayScreen extends ConsumerWidget {
  const FindBinDayScreen({super.key});

  static const routeName = 'findBinDay';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(findBinDayViewModelProvider);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Find bin day',
        subtitle: state.property != null
            ? '${state.property!.address}\n${state.property!.postcode}'
            : 'Add your address to see collection dates',
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (!state.hasSelectedProperty) {
            return _NoAddressView(
              onChangeAddress: () => _goToSettings(context),
            );
          }

          final crossAxisCount = constraints.maxWidth < 420 ? 1 : 2;
          final childAspectRatio = crossAxisCount == 1 ? 1.35 : 1.1;

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'See when each bin will be collected and plan ahead.',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: AppColors.darkGrey),
                ),
                const SizedBox(height: 20),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: state.collections.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: childAspectRatio,
                  ),
                  itemBuilder: (context, index) {
                    final schedule = state.collections[index];
                    return CollectionCard(
                      binType: schedule.binType,
                      nextCollection: schedule.nextCollectionDate,
                      daysUntil: schedule.daysUntil,
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: 1,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _NoAddressView extends StatelessWidget {
  const _NoAddressView({required this.onChangeAddress});

  final VoidCallback onChangeAddress;

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      title: 'Choose an address first',
      message: 'Add your home address to see the next collection days.',
      action: PrimaryButton(
        label: 'Change address',
        onPressed: onChangeAddress,
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
