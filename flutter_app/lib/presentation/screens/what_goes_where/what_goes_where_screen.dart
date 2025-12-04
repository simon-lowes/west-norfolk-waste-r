import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/waste_item.dart';
import '../../providers/waste_items_provider.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/loading_skeleton.dart';
import '../../widgets/common/bin_badge.dart';
import 'what_goes_where_viewmodel.dart';

class WhatGoesWhereScreen extends ConsumerStatefulWidget {
  const WhatGoesWhereScreen({super.key});

  static const routeName = 'whatGoesWhere';

  @override
  ConsumerState<WhatGoesWhereScreen> createState() =>
      _WhatGoesWhereScreenState();
}

class _WhatGoesWhereScreenState extends ConsumerState<WhatGoesWhereScreen> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    final initialQuery = ref.read(whatGoesWhereViewModelProvider).searchQuery;
    _controller = TextEditingController(text: initialQuery);
    ref.listen<WhatGoesWhereState>(whatGoesWhereViewModelProvider, (
      previous,
      next,
    ) {
      if (next.searchQuery != _controller.text) {
        _controller.value = TextEditingValue(
          text: next.searchQuery,
          selection: TextSelection.collapsed(offset: next.searchQuery.length),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(whatGoesWhereViewModelProvider);
    final viewModel = ref.watch(whatGoesWhereViewModelProvider.notifier);

    return Scaffold(
      appBar: CustomAppBar(
        title: 'What goes where',
        subtitle: 'Search for items and bin types',
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
        children: [
          _SearchField(
            controller: _controller,
            query: state.searchQuery,
            onChanged: viewModel.updateSearchQuery,
            onClear: viewModel.clearSearch,
          ),
          const SizedBox(height: 20),
          _ResultsSection(state: state),
        ],
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: 2,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _SearchField extends StatelessWidget {
  const _SearchField({
    required this.controller,
    required this.query,
    required this.onChanged,
    required this.onClear,
  });

  final TextEditingController controller;
  final String query;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      textInputAction: TextInputAction.search,
      decoration: InputDecoration(
        labelText: 'Search waste items',
        hintText: 'e.g. glass, batteries, textiles',
        prefixIcon: const Icon(Icons.search),
        suffixIcon: query.isEmpty
            ? null
            : IconButton(
                tooltip: 'Clear search',
                onPressed: onClear,
                icon: const Icon(Icons.clear),
              ),
      ),
    );
  }
}

class _ResultsSection extends ConsumerWidget {
  const _ResultsSection({required this.state});

  final WhatGoesWhereState state;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return state.items.when(
      data: (items) => items.isEmpty
          ? EmptyState(
              title: state.searchQuery.isEmpty
                  ? 'No waste items found'
                  : 'No matches for "${state.searchQuery}"',
              message: state.searchQuery.isEmpty
                  ? 'Try refreshing data later.'
                  : 'Check spelling or try another search term.',
              icon: Icons.search_off,
            )
          : _WasteItemsList(items: items),
      loading: () => const _LoadingResultsPlaceholder(),
      error: (error, stackTrace) => AppErrorView(
        message: 'We couldn\'t load waste items right now.',
        onRetry: () {
          ref.invalidate(wasteItemsProvider);
          ref.invalidate(filteredWasteItemsProvider);
        },
      ),
    );
  }
}

class _WasteItemsList extends StatelessWidget {
  const _WasteItemsList({required this.items});

  final List<WasteItem> items;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemBuilder: (context, index) {
        final item = items[index];
        return _WasteItemTile(item: item);
      },
      separatorBuilder: (context, _) => const SizedBox(height: 16),
      itemCount: items.length,
    );
  }
}

class _WasteItemTile extends StatelessWidget {
  const _WasteItemTile({required this.item});

  final WasteItem item;

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
          Row(
            children: [
              Expanded(
                child: Text(
                  item.name,
                  style: theme.textTheme.titleMedium?.copyWith(
                    color: AppColors.darkText,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              BinBadge(type: item.binType),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            item.notes,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: AppColors.darkGrey,
            ),
          ),
        ],
      ),
    );
  }
}

class _LoadingResultsPlaceholder extends StatelessWidget {
  const _LoadingResultsPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(4, (index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LoadingSkeleton(height: 18, width: 160),
                SizedBox(height: 12),
                LoadingSkeleton(height: 16, width: double.infinity),
                SizedBox(height: 8),
                LoadingSkeleton(height: 16, width: 240),
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
