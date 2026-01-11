import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../config/routing/app_router.dart';
import '../../../config/theme/colors.dart';
import '../../../data/models/property.dart';
import '../../providers/property_provider.dart';
import '../../widgets/common/app_navigation.dart';
import '../../widgets/common/buttons.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/forms/issue_type_dropdown.dart';
import '../../widgets/forms/location_picker_button.dart';
import '../../widgets/forms/photo_picker_button.dart';
import 'report_issue_viewmodel.dart';

class ReportIssueScreen extends ConsumerWidget {
  const ReportIssueScreen({super.key});

  static const routeName = 'reportIssue';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(reportIssueViewModelProvider);
    final viewModel = ref.watch(reportIssueViewModelProvider.notifier);
    final property = ref.watch(propertyProvider);

    final subtitle = property != null
        ? property.address
        : 'Share details so we can help quickly';

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Report an issue',
        subtitle: subtitle,
        onChangeAddress: () => _goToSettings(context),
        onAdminPressed: () => _goToAdmin(context),
      ),
      body: SafeArea(
        child: ListView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 120),
          children: [
            _InfoBanner(property: property),
            const SizedBox(height: 24),
            if (state.submitError != null && !state.hasSuccess) ...[
              _InlineErrorBanner(message: state.submitError!),
              const SizedBox(height: 16),
            ],
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: state.hasSuccess
                  ? _ReportSuccessCard(
                      key: const ValueKey('report-success'),
                      reference: state.successReference!,
                      onReportAnother: viewModel.resetForm,
                      onBackToHome: () => _goHome(context),
                    )
                  : _ReportForm(
                      key: ValueKey('report-form-${state.formResetCounter}'),
                      state: state,
                      viewModel: viewModel,
                      property: property,
                      onSubmit: () {
                        FocusScope.of(context).unfocus();
                        viewModel.submitReport();
                      },
                    ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: AppNavigation(
        currentIndex: 5,
        onDestinationSelected: (index) =>
            _onDestinationSelected(context, index),
      ),
    );
  }
}

class _ReportForm extends StatelessWidget {
  const _ReportForm({
    super.key,
    required this.state,
    required this.viewModel,
    required this.property,
    required this.onSubmit,
  });

  final ReportIssueState state;
  final ReportIssueViewModel viewModel;
  final Property? property;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        IssueTypeDropdown(
          key: ValueKey('issue-type-${state.formResetCounter}'),
          value: state.type,
          onChanged: viewModel.updateType,
          errorText: state.typeError,
        ),
        const SizedBox(height: 20),
        TextFormField(
          key: ValueKey('description-${state.formResetCounter}'),
          initialValue: state.description,
          minLines: 4,
          maxLines: 6,
          decoration: InputDecoration(
            labelText: 'Describe the issue',
            alignLabelWithHint: true,
            prefixIcon: const Icon(Icons.edit_outlined),
            errorText: state.descriptionError,
          ),
          textCapitalization: TextCapitalization.sentences,
          keyboardType: TextInputType.multiline,
          onChanged: viewModel.updateDescription,
        ),
        const SizedBox(height: 20),
        TextFormField(
          key: ValueKey('postcode-${state.formResetCounter}'),
          initialValue: state.postcode ?? '',
          decoration: InputDecoration(
            labelText: 'Postcode (optional)',
            helperText: 'e.g. PE30 1AA',
            prefixIcon: const Icon(Icons.location_searching_outlined),
            errorText: state.postcodeError,
          ),
          textCapitalization: TextCapitalization.characters,
          keyboardType: TextInputType.text,
          onChanged: viewModel.updatePostcode,
        ),
        const SizedBox(height: 20),
        TextFormField(
          key: ValueKey('address-${state.formResetCounter}'),
          initialValue: state.address ?? property?.address ?? '',
          decoration: const InputDecoration(
            labelText: 'Address (optional)',
            alignLabelWithHint: true,
            prefixIcon: Icon(Icons.home_work_outlined),
          ),
          minLines: 2,
          maxLines: 3,
          textCapitalization: TextCapitalization.sentences,
          onChanged: viewModel.updateAddress,
        ),
        const SizedBox(height: 24),
        Text(
          'Photo (optional)',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            color: AppColors.darkText,
          ),
        ),
        const SizedBox(height: 8),
        PhotoPickerButton(
          key: ValueKey('photo-${state.formResetCounter}'),
          initialFile: state.photoFile,
          onImagePicked: viewModel.setPhoto,
          onError: viewModel.setPhotoError,
        ),
        if (state.photoError != null) ...[
          const SizedBox(height: 8),
          _InputErrorText(state.photoError!),
        ],
        const SizedBox(height: 24),
        Text(
          'Location (optional)',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            color: AppColors.darkText,
          ),
        ),
        const SizedBox(height: 8),
        LocationPickerButton(
          key: ValueKey('location-${state.formResetCounter}'),
          onLocationPicked: viewModel.updateLocation,
          onError: viewModel.setLocationError,
          label: state.location == null
              ? 'Use my location'
              : 'Update location',
        ),
        if (state.location != null) ...[
          const SizedBox(height: 8),
          Text(
            'Lat ${state.location!.latitude.toStringAsFixed(5)}, '
            'Lng ${state.location!.longitude.toStringAsFixed(5)}',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: AppColors.darkGrey),
          ),
        ],
        if (state.locationError != null) ...[
          const SizedBox(height: 8),
          _InputErrorText(state.locationError!),
        ],
        const SizedBox(height: 32),
        PrimaryButton(
          label: 'Submit report',
          icon: const Icon(Icons.send_outlined),
          onPressed: state.isSubmitting ? null : onSubmit,
          isLoading: state.isSubmitting,
        ),
        const SizedBox(height: 12),
        Text(
          'Your report goes straight to the waste team. We\'ll share '
          'your reference number after submission.',
          style: Theme.of(
            context,
          ).textTheme.bodySmall?.copyWith(color: AppColors.darkGrey),
        ),
      ],
    );
  }
}

class _ReportSuccessCard extends StatelessWidget {
  const _ReportSuccessCard({
    super.key,
    required this.reference,
    required this.onReportAnother,
    required this.onBackToHome,
  });

  final String reference;
  final VoidCallback onReportAnother;
  final VoidCallback onBackToHome;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.success),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.check_circle_outline, color: AppColors.success),
              const SizedBox(width: 12),
              Text(
                'Report submitted',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Reference number',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: AppColors.darkGrey),
          ),
          const SizedBox(height: 4),
          Text(
            reference,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.darkText,
            ),
          ),
          const SizedBox(height: 24),
          PrimaryButton(
            label: 'Report another issue',
            icon: const Icon(Icons.add_outlined),
            onPressed: onReportAnother,
          ),
          const SizedBox(height: 12),
          SecondaryButton(
            label: 'Back to home',
            icon: const Icon(Icons.home_outlined),
            onPressed: onBackToHome,
            expand: true,
          ),
        ],
      ),
    );
  }
}

class _InfoBanner extends StatelessWidget {
  const _InfoBanner({required this.property});

  final Property? property;

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
                  'Give us as much detail as you can.',
                  style: Theme.of(
                    context,
                  ).textTheme.titleMedium?.copyWith(color: AppColors.darkText),
                ),
                const SizedBox(height: 4),
                Text(
                  property != null
                      ? 'We\'ll include ${property!.address} (${property!.postcode}) '
                            'with your report. Update the fields below if the '
                            'issue is elsewhere.'
                      : 'Add a postcode or address below so our crews know '
                            'where to look.',
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.error),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
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

class _InputErrorText extends StatelessWidget {
  const _InputErrorText(this.message);

  final String message;

  @override
  Widget build(BuildContext context) {
    return Text(
      message,
      style: Theme.of(context).textTheme.bodySmall?.copyWith(
        color: AppColors.error,
        fontWeight: FontWeight.w600,
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

void _goToAdmin(BuildContext context) {
  context.go(adminRoute);
}

void _goHome(BuildContext context) {
  context.go(homeRoute);
}
