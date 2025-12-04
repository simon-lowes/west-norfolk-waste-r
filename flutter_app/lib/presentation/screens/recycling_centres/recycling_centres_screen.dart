import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/recycling_centre.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/loading_skeleton.dart';
import '../../widgets/common/buttons.dart';
import 'recycling_centres_viewmodel.dart';

class RecyclingCentresScreen extends ConsumerWidget {
  const RecyclingCentresScreen({super.key});

  static const routeName = 'recyclingCentres';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(recyclingCentresViewModelProvider);
    final viewModel = ref.watch(recyclingCentresViewModelProvider.notifier);

    Widget buildRefreshableList(Widget child) {
      return RefreshIndicator(
        onRefresh: () => viewModel.refreshCentres(),
        child: child,
      );
    }

    final content = state.centres.when(
      data: (centres) => buildRefreshableList(
        centres.isEmpty
            ? ListView(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
                physics: const AlwaysScrollableScrollPhysics(),
                children: const [
                  EmptyState(
                    title: 'No recycling centres found',
                    message:
                        'We could not find any centres right now. Pull to refresh later.',
                    icon: Icons.location_off_outlined,
                  ),
                ],
              )
            : _CentresList(
                centres: centres,
                onDirections: (centre) => _openDirections(context, centre),
              ),
      ),
      loading: () => buildRefreshableList(const _CentresLoadingList()),
      error: (error, stackTrace) => buildRefreshableList(
        ListView(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            AppErrorView(
              message: 'Unable to load recycling centres.',
              onRetry: () => viewModel.refreshCentres(),
            ),
          ],
        ),
      ),
    );

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Recycling centres',
        subtitle: 'Find your nearest HWRC',
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: content,
      bottomNavigationBar: AppNavigation(
        currentIndex: 3,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _CentresList extends StatelessWidget {
  const _CentresList({required this.centres, required this.onDirections});

  final List<RecyclingCentre> centres;
  final ValueChanged<RecyclingCentre> onDirections;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: centres.length,
      itemBuilder: (context, index) {
        final centre = centres[index];
        return _RecyclingCentreCard(
          centre: centre,
          onDirections: () => onDirections(centre),
        );
      },
      separatorBuilder: (context, _) => const SizedBox(height: 16),
    );
  }
}

class _RecyclingCentreCard extends StatelessWidget {
  const _RecyclingCentreCard({
    required this.centre,
    required this.onDirections,
  });

  final RecyclingCentre centre;
  final VoidCallback onDirections;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            centre.name,
            style: theme.textTheme.titleMedium?.copyWith(
              color: AppColors.darkText,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          _DetailRow(icon: Icons.place_outlined, label: centre.address),
          const SizedBox(height: 8),
          _DetailRow(icon: Icons.schedule_outlined, label: centre.openingHours),
          if (centre.notes.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              centre.notes,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: AppColors.darkGrey,
              ),
            ),
          ],
          const SizedBox(height: 16),
          SecondaryButton(
            label: 'Get directions',
            onPressed: onDirections,
            icon: const Icon(Icons.directions_outlined),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.darkGrey),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: AppColors.darkText),
          ),
        ),
      ],
    );
  }
}

class _CentresLoadingList extends StatelessWidget {
  const _CentresLoadingList();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: 3,
      itemBuilder: (context, index) => const _CentreLoadingCard(),
    );
  }
}

class _CentreLoadingCard extends StatelessWidget {
  const _CentreLoadingCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LoadingSkeleton(height: 18, width: 200),
          SizedBox(height: 12),
          LoadingSkeleton(height: 16, width: double.infinity),
          SizedBox(height: 8),
          LoadingSkeleton(height: 16, width: 180),
          SizedBox(height: 8),
          LoadingSkeleton(height: 16, width: double.infinity),
          SizedBox(height: 12),
          LoadingSkeleton(height: 16, width: 140),
        ],
      ),
    );
  }
}

Future<void> _openDirections(
  BuildContext context,
  RecyclingCentre centre,
) async {
  final uri = _buildMapsUri(centre);

  try {
    final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!context.mounted) {
      return;
    }
    if (!launched) {
      _showLaunchError(context);
    }
  } catch (_) {
    if (!context.mounted) {
      return;
    }
    _showLaunchError(context);
  }
}

Uri _buildMapsUri(RecyclingCentre centre) {
  if (centre.latitude != 0 && centre.longitude != 0) {
    return Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${centre.latitude},${centre.longitude}',
    );
  }

  final query = Uri.encodeComponent('${centre.name} ${centre.address}');
  return Uri.parse('https://www.google.com/maps/search/?api=1&query=$query');
}

void _showLaunchError(BuildContext context) {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('Could not open maps right now.')),
  );
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
