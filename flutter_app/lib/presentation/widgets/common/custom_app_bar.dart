import 'package:flutter/material.dart';

import '../../../config/theme/colors.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({
    super.key,
    required this.title,
    this.subtitle,
    this.onSettingsPressed,
    this.onAdminPressed,
    this.onChangeAddress,
    this.actions,
  });

  final String title;
  final String? subtitle;
  final VoidCallback? onSettingsPressed;
  final VoidCallback? onAdminPressed;
  final VoidCallback? onChangeAddress;
  final List<Widget>? actions;

  @override
  Size get preferredSize => const Size.fromHeight(84);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.surface,
      elevation: 0,
      titleSpacing: 0,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(color: AppColors.darkText),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 4),
            Text(
              subtitle!,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppColors.darkGrey),
            ),
          ],
          if (onChangeAddress != null) ...[
            const SizedBox(height: 8),
            TextButton.icon(
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                textStyle: Theme.of(
                  context,
                ).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
              ),
              onPressed: onChangeAddress,
              icon: const Icon(Icons.swap_horiz, size: 18),
              label: const Text('Change address'),
            ),
          ],
        ],
      ),
      actions: [
        if (onSettingsPressed != null)
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Settings',
            onPressed: onSettingsPressed,
          ),
        if (onAdminPressed != null)
          IconButton(
            icon: const Icon(Icons.admin_panel_settings_outlined),
            tooltip: 'Admin',
            onPressed: onAdminPressed,
          ),
        ...?actions,
        const SizedBox(width: 8),
      ],
    );
  }
}
