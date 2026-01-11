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
      data: (centres) {
        final sortedCentres = state.getSortedCentres(centres);
        return buildRefreshableList(
          sortedCentres.isEmpty
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
                  centres: sortedCentres,
                  state: state,
                  onDirections: (centre) => _openDirections(context, centre),
                  onRequestLocation: () => viewModel.requestLocation(),
                ),
        );
      },
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
  const _CentresList({
    required this.centres,
    required this.state,
    required this.onDirections,
    required this.onRequestLocation,
  });

  final List<RecyclingCentre> centres;
  final RecyclingCentresState state;
  final ValueChanged<RecyclingCentre> onDirections;
  final VoidCallback onRequestLocation;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 120),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: centres.length + 1, // +1 for the location header
      itemBuilder: (context, index) {
        if (index == 0) {
          return _LocationHeader(
            state: state,
            onRequestLocation: onRequestLocation,
          );
        }
        final centre = centres[index - 1];
        return _RecyclingCentreCard(
          centre: centre,
          distance: state.getDistanceTocentre(centre),
          onDirections: () => onDirections(centre),
        );
      },
      separatorBuilder: (context, index) => const SizedBox(height: 16),
    );
  }
}

class _LocationHeader extends StatelessWidget {
  const _LocationHeader({
    required this.state,
    required this.onRequestLocation,
  });

  final RecyclingCentresState state;
  final VoidCallback onRequestLocation;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (state.userLocation != null) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.success.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.success.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.my_location, color: AppColors.success, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                state.sortByDistance
                    ? 'Showing nearest centres first'
                    : 'Location available',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: AppColors.success,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (state.isLoadingLocation) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.lightGrey,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Getting your location...',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: AppColors.darkGrey,
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (state.locationError != null) {
      return GestureDetector(
        onTap: onRequestLocation,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.warning.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.warning.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.warning_amber_outlined,
                  color: AppColors.warning, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  state.locationError!,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.warning,
                  ),
                ),
              ),
              const Icon(Icons.refresh, color: AppColors.warning, size: 20),
            ],
          ),
        ),
      );
    }

    // Default: show button to enable location
    return GestureDetector(
      onTap: onRequestLocation,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.my_location_outlined,
                color: AppColors.primary, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Use my location to find nearest centres',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.primary, size: 20),
          ],
        ),
      ),
    );
  }
}

class _RecyclingCentreCard extends StatefulWidget {
  const _RecyclingCentreCard({
    required this.centre,
    required this.onDirections,
    this.distance,
  });

  final RecyclingCentre centre;
  final VoidCallback onDirections;
  final double? distance;

  @override
  State<_RecyclingCentreCard> createState() => _RecyclingCentreCardState();
}

class _RecyclingCentreCardState extends State<_RecyclingCentreCard> {
  bool _showMaterials = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final centre = widget.centre;

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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  centre.name,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: AppColors.darkText,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              if (widget.distance != null) ...[
                const SizedBox(width: 8),
                _DistanceBadge(distance: widget.distance!),
              ],
            ],
          ),
          const SizedBox(height: 12),
          _DetailRow(icon: Icons.place_outlined, label: centre.address),
          const SizedBox(height: 8),
          _DetailRow(icon: Icons.schedule_outlined, label: centre.openingHours),
          if (centre.phoneNumber != null && centre.phoneNumber!.isNotEmpty) ...[
            const SizedBox(height: 8),
            GestureDetector(
              onTap: () => _callPhone(centre.phoneNumber!),
              child: _DetailRow(
                icon: Icons.phone_outlined,
                label: centre.phoneNumber!,
                isLink: true,
              ),
            ),
          ],
          if (centre.notes.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(
              centre.notes,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: AppColors.darkGrey,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
          if (centre.materialsAccepted.isNotEmpty) ...[
            const SizedBox(height: 12),
            _MaterialsSection(
              materials: centre.materialsAccepted,
              isExpanded: _showMaterials,
              onToggle: () => setState(() => _showMaterials = !_showMaterials),
            ),
          ],
          const SizedBox(height: 16),
          SecondaryButton(
            label: 'Get directions',
            onPressed: widget.onDirections,
            icon: const Icon(Icons.directions_outlined),
          ),
        ],
      ),
    );
  }

  Future<void> _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    try {
      await launchUrl(uri);
    } catch (_) {
      // Silently fail if phone call can't be made
    }
  }
}

class _DistanceBadge extends StatelessWidget {
  const _DistanceBadge({required this.distance});

  final double distance;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    String distanceText;

    if (distance < 1) {
      distanceText = '${(distance * 1000).round()} m';
    } else if (distance < 10) {
      distanceText = '${distance.toStringAsFixed(1)} km';
    } else {
      distanceText = '${distance.round()} km';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.directions_walk,
            size: 14,
            color: AppColors.primary,
          ),
          const SizedBox(width: 4),
          Text(
            distanceText,
            style: theme.textTheme.bodySmall?.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _MaterialsSection extends StatelessWidget {
  const _MaterialsSection({
    required this.materials,
    required this.isExpanded,
    required this.onToggle,
  });

  final List<String> materials;
  final bool isExpanded;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: onToggle,
          child: Row(
            children: [
              Icon(
                isExpanded ? Icons.expand_less : Icons.expand_more,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 4),
              Text(
                isExpanded
                    ? 'Hide materials accepted'
                    : 'Show materials accepted (${materials.length})',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        if (isExpanded) ...[
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: materials.map((material) {
              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.lightGrey,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.border),
                ),
                child: Text(
                  material,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppColors.darkText,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  const _DetailRow({
    required this.icon,
    required this.label,
    this.isLink = false,
  });

  final IconData icon;
  final String label;
  final bool isLink;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: isLink ? AppColors.primary : AppColors.darkGrey),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: isLink ? AppColors.primary : AppColors.darkText,
                  decoration: isLink ? TextDecoration.underline : null,
                ),
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
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 120),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: 4, // 1 header + 3 cards
      itemBuilder: (context, index) {
        if (index == 0) {
          return Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: AppColors.lightGrey,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: const LoadingSkeleton(height: 20, width: double.infinity),
          );
        }
        return const _CentreLoadingCard();
      },
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
