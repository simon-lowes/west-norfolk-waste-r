import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/enums.dart';
import '../../../data/models/service_alert.dart';
import '../../../utils/date_utils.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/common/empty_state.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/loading_skeleton.dart';
import '../../widgets/common/service_alert_card.dart';
import 'admin_viewmodel.dart';

class AdminScreen extends ConsumerWidget {
  const AdminScreen({super.key});

  static const routeName = 'admin';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(adminAlertsViewModelProvider);
    final viewModel = ref.watch(adminAlertsViewModelProvider.notifier);

    ref.listen<AdminAlertsState>(adminAlertsViewModelProvider, (
      previous,
      next,
    ) {
      if (previous?.notificationId != next.notificationId &&
          next.notificationMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.notificationMessage!),
            backgroundColor: next.notificationIsError
                ? AppColors.error
                : AppColors.success,
          ),
        );
      }
    });

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Admin',
        subtitle: 'Create and manage service alerts',
        onSettingsPressed: () => _goToSettings(context),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          children: [
            const _AdminInfoCard(),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  state.isEditing ? 'Edit alert' : 'Create alert',
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
                ),
                if (state.isEditing)
                  TextButton.icon(
                    onPressed: viewModel.cancelEdit,
                    icon: const Icon(Icons.close, size: 18),
                    label: const Text('Cancel'),
                    style: TextButton.styleFrom(
                      foregroundColor: AppColors.darkGrey,
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            if (state.submitError != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _InlineErrorBanner(message: state.submitError!),
              ),
            _CreateAlertForm(state: state, viewModel: viewModel),
            const SizedBox(height: 32),
            Text(
              'Existing alerts',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
            ),
            const SizedBox(height: 12),
            _AlertsSection(state: state, viewModel: viewModel),
          ],
        ),
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: -1, // Admin is not in the nav bar, so no item is selected
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _CreateAlertForm extends StatelessWidget {
  const _CreateAlertForm({required this.state, required this.viewModel});

  final AdminAlertsState state;
  final AdminAlertsViewModel viewModel;

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
          TextFormField(
            key: ValueKey('admin-title-${state.formResetCounter}'),
            initialValue: state.title,
            decoration: InputDecoration(
              labelText: 'Title',
              prefixIcon: const Icon(Icons.title_outlined),
              errorText: state.titleError,
            ),
            onChanged: viewModel.updateTitle,
          ),
          const SizedBox(height: 16),
          TextFormField(
            key: ValueKey('admin-message-${state.formResetCounter}'),
            initialValue: state.message,
            decoration: InputDecoration(
              labelText: 'Message',
              alignLabelWithHint: true,
              prefixIcon: const Icon(Icons.notes_outlined),
              errorText: state.messageError,
            ),
            minLines: 3,
            maxLines: 5,
            onChanged: viewModel.updateMessage,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<AlertSeverity>(
            key: ValueKey('admin-severity-${state.formResetCounter}'),
            initialValue: state.severity,
            decoration: const InputDecoration(
              labelText: 'Severity',
              prefixIcon: Icon(Icons.warning_amber_outlined),
            ),
            items: AlertSeverity.values
                .map(
                  (severity) => DropdownMenuItem(
                    value: severity,
                    child: Text(severity.label),
                  ),
                )
                .toList(),
            onChanged: viewModel.updateSeverity,
          ),
          const SizedBox(height: 16),
          _DatePickerField(
            label: 'Start date',
            value: state.startDate,
            errorText: state.startDateError,
            onSelect: viewModel.updateStartDate,
          ),
          const SizedBox(height: 16),
          _DatePickerField(
            label: 'End date',
            value: state.endDate,
            errorText: state.endDateError,
            onSelect: viewModel.updateEndDate,
          ),
          const SizedBox(height: 16),
          TextFormField(
            key: ValueKey('admin-postcodes-${state.formResetCounter}'),
            initialValue: state.affectedPostcodes,
            decoration: InputDecoration(
              labelText: 'Affected postcodes',
              helperText:
                  'Separate with commas (PE30 1AA, PE32 2AB) or type ALL for borough wide alerts.',
              prefixIcon: const Icon(Icons.location_searching_outlined),
              errorText: state.affectedPostcodesError,
            ),
            onChanged: viewModel.updateAffectedPostcodes,
            textCapitalization: TextCapitalization.characters,
          ),
          const SizedBox(height: 24),
          PrimaryButton(
            label: state.isEditing ? 'Update alert' : 'Create alert',
            icon: Icon(state.isEditing ? Icons.save_outlined : Icons.add_alert_outlined),
            onPressed: state.isSubmitting ? null : viewModel.submitAlert,
            isLoading: state.isSubmitting,
          ),
          const SizedBox(height: 12),
          SecondaryButton(
            label: state.isEditing ? 'Cancel edit' : 'Reset form',
            icon: Icon(state.isEditing ? Icons.close : Icons.refresh_outlined),
            onPressed: state.isSubmitting ? null : viewModel.resetForm,
            expand: true,
          ),
        ],
      ),
    );
  }
}

class _DatePickerField extends StatelessWidget {
  const _DatePickerField({
    required this.label,
    required this.value,
    required this.onSelect,
    this.errorText,
  });

  final String label;
  final DateTime? value;
  final ValueChanged<DateTime> onSelect;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    final displayValue = value != null ? formatDate(value!) : 'Select date';
    return InkWell(
      onTap: () => _pickDate(context),
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: const Icon(Icons.event_outlined),
          errorText: errorText,
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Text(
            displayValue,
            style: Theme.of(
              context,
            ).textTheme.bodyLarge?.copyWith(color: AppColors.darkText),
          ),
        ),
      ),
    );
  }

  Future<void> _pickDate(BuildContext context) async {
    final now = DateTime.now();
    final selected = await showDatePicker(
      context: context,
      initialDate: value ?? now,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 2),
    );
    if (selected != null) {
      onSelect(selected);
    }
  }
}

class _AlertsSection extends StatelessWidget {
  const _AlertsSection({required this.state, required this.viewModel});

  final AdminAlertsState state;
  final AdminAlertsViewModel viewModel;

  @override
  Widget build(BuildContext context) {
    return state.alerts.when(
      data: (alerts) {
        if (alerts.isEmpty) {
          return const EmptyState(
            title: 'No alerts yet',
            message: 'Create your first alert to notify residents.',
            icon: Icons.inbox_outlined,
          );
        }
        return Column(
          children: [
            for (final alert in alerts)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _AlertListTile(
                  alert: alert,
                  isDeleting: state.deletingAlertId == alert.id,
                  onEdit: () => viewModel.editAlert(alert),
                  onDelete: () => viewModel.deleteAlert(alert.id),
                ),
              ),
          ],
        );
      },
      loading: () => const _AlertsLoadingPlaceholder(),
      error: (error, stackTrace) => AppErrorView(
        message: 'Unable to load alerts right now.',
        onRetry: viewModel.refreshAlerts,
        retryLabel: 'Reload alerts',
      ),
    );
  }
}

class _AlertListTile extends StatelessWidget {
  const _AlertListTile({
    required this.alert,
    required this.isDeleting,
    required this.onEdit,
    required this.onDelete,
  });

  final ServiceAlert alert;
  final bool isDeleting;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ServiceAlertCard(alert: alert),
        Positioned(
          top: 8,
          right: 8,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                tooltip: 'Edit alert',
                onPressed: isDeleting ? null : onEdit,
                style: IconButton.styleFrom(
                  foregroundColor: AppColors.primary,
                  backgroundColor: AppColors.white.withAlpha((255 * 0.9).round()),
                ),
                icon: const Icon(Icons.edit_outlined, size: 20),
              ),
              const SizedBox(width: 4),
              IconButton(
                tooltip: 'Delete alert',
                onPressed: isDeleting ? null : onDelete,
                style: IconButton.styleFrom(
                  foregroundColor: AppColors.error,
                  backgroundColor: AppColors.white.withAlpha((255 * 0.9).round()),
                ),
                icon: isDeleting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.delete_forever_outlined, size: 20),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _AlertsLoadingPlaceholder extends StatelessWidget {
  const _AlertsLoadingPlaceholder();

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
                LoadingSkeleton(height: 18, width: double.infinity),
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

class _AdminInfoCard extends StatelessWidget {
  const _AdminInfoCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, color: AppColors.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Admin tools',
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
                ),
                const SizedBox(height: 6),
                Text(
                  'Share borough-wide news or target specific streets by '
                  'listing multiple postcodes. Alerts appear instantly '
                  'across the app.',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(color: AppColors.darkGrey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InlineErrorBanner extends StatelessWidget {
  const _InlineErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.error),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.error),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppColors.darkText),
            ),
          ),
        ],
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
  context.go(_navRoutes[index]);
}

void _goToSettings(BuildContext context) {
  context.go(settingsRoute);
}
