import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/property.dart';
import '../../../utils/constants.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/forms/address_search_field.dart';
import 'settings_viewmodel.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  static const routeName = 'settings';

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  final _scrollController = ScrollController();
  final GlobalKey _addressSelectorKey = GlobalKey();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(settingsViewModelProvider);
    final viewModel = ref.watch(settingsViewModelProvider.notifier);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Settings',
        subtitle: 'Manage your saved address',
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: RefreshIndicator(
        onRefresh: () => viewModel.refreshProperties(),
        child: ListView(
          controller: _scrollController,
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            _CurrentAddressCard(
              property: state.selectedProperty,
              onChangeAddress: _scrollToAddressSection,
              onClearSelection: state.selectedProperty == null
                  ? null
                  : () => viewModel.clearSelection(),
            ),
            const SizedBox(height: 24),
            KeyedSubtree(
              key: _addressSelectorKey,
              child: _AddressSelectorSection(
                state: state,
                onPropertySelected: (property) {
                  viewModel.selectProperty(property);
                  if (!mounted) {
                    return;
                  }
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Address updated to ${property.address}'),
                    ),
                  );
                },
                onRetry: () => viewModel.refreshProperties(),
              ),
            ),
            const SizedBox(height: 32),
            _AppInfoSection(onOpenLink: _openExternalLink),
          ],
        ),
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: -1, // Settings is not in the nav bar, so no item is selected
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }

  void _scrollToAddressSection() {
    final context = _addressSelectorKey.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _openExternalLink(String url) async {
    final uri = Uri.parse(url);
    try {
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!mounted) {
        return;
      }
      if (!launched) {
        _showLinkError();
      }
    } catch (_) {
      if (!mounted) {
        return;
      }
      _showLinkError();
    }
  }

  void _showLinkError() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Could not open link right now.')),
    );
  }
}

class _CurrentAddressCard extends StatelessWidget {
  const _CurrentAddressCard({
    required this.property,
    required this.onChangeAddress,
    this.onClearSelection,
  });

  final Property? property;
  final VoidCallback onChangeAddress;
  final VoidCallback? onClearSelection;

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
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Add your address so we can show personalised collection dates.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.darkGrey,
                  ),
                ),
                const SizedBox(height: 16),
                PrimaryButton(
                  label: 'Choose address',
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
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    SecondaryButton(
                      label: 'Change address',
                      onPressed: onChangeAddress,
                    ),
                    if (onClearSelection != null)
                      TextButton(
                        onPressed: onClearSelection,
                        child: const Text('Clear selection'),
                      ),
                  ],
                ),
              ],
            ),
    );
  }
}

class _AddressSelectorSection extends StatelessWidget {
  const _AddressSelectorSection({
    required this.state,
    required this.onPropertySelected,
    required this.onRetry,
  });

  final SettingsState state;
  final ValueChanged<Property> onPropertySelected;
  final VoidCallback onRetry;

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
            'Change address',
            style: theme.textTheme.titleMedium?.copyWith(
              color: AppColors.darkText,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          state.properties.when(
            data: (properties) => properties.isEmpty
                ? const EmptyState(
                    title: 'No addresses available',
                    message:
                        'We could not find any addresses. Try refreshing later.',
                    icon: Icons.home_work_outlined,
                  )
                : AddressSearchField(
                    properties: properties,
                    onPropertySelected: onPropertySelected,
                    selectedPropertyId: state.selectedProperty?.id,
                    initialPostcode: state.selectedProperty?.postcode,
                    helperText:
                        'Enter your postcode and pick the correct property.',
                  ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, stackTrace) => AppErrorView(
              message: 'Unable to load addresses right now.',
              onRetry: onRetry,
            ),
          ),
        ],
      ),
    );
  }
}

class _AppInfoSection extends StatelessWidget {
  const _AppInfoSection({required this.onOpenLink});

  final ValueChanged<String> onOpenLink;

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
            'App info',
            style: theme.textTheme.titleMedium?.copyWith(
              color: AppColors.darkText,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          _InfoRow(label: 'Version', value: AppConstants.appVersion),
          const SizedBox(height: 16),
          SecondaryButton(
            label: 'Privacy policy',
            icon: const Icon(Icons.privacy_tip_outlined),
            expand: true,
            onPressed: () => onOpenLink(AppConstants.privacyPolicyUrl),
          ),
          const SizedBox(height: 12),
          SecondaryButton(
            label: 'Contact the council',
            icon: const Icon(Icons.support_agent_outlined),
            expand: true,
            onPressed: () => onOpenLink(AppConstants.contactCouncilUrl),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: AppColors.darkGrey,
            fontWeight: FontWeight.w600,
          ),
        ),
        Text(
          value,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: AppColors.darkText,
          ),
        ),
      ],
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

void _goToAdmin(BuildContext context) {
  context.go(adminRoute);
}
