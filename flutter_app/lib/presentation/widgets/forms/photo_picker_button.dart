import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../../config/theme/colors.dart';
import '../../../utils/constants.dart';

class PhotoPickerButton extends StatefulWidget {
  const PhotoPickerButton({
    super.key,
    this.initialFile,
    this.onImagePicked,
    this.onError,
    this.label = 'Add photo',
  });

  final XFile? initialFile;
  final ValueChanged<XFile>? onImagePicked;
  final ValueChanged<String>? onError;
  final String label;

  @override
  State<PhotoPickerButton> createState() => _PhotoPickerButtonState();
}

class _PhotoPickerButtonState extends State<PhotoPickerButton> {
  final ImagePicker _picker = ImagePicker();
  XFile? _selectedFile;
  bool _isPicking = false;

  @override
  void initState() {
    super.initState();
    _selectedFile = widget.initialFile;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FilledButton.icon(
          onPressed: _isPicking ? null : _pickImage,
          icon: _isPicking
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.photo_camera_outlined),
          label: Text(_isPicking ? 'Opening camera…' : widget.label),
        ),
        if (_selectedFile != null) ...[
          const SizedBox(height: 8),
          _SelectedFileTile(file: _selectedFile!),
        ],
      ],
    );
  }

  Future<void> _pickImage() async {
    setState(() => _isPicking = true);
    try {
      final file = await _picker.pickImage(source: ImageSource.camera);
      if (file == null) {
        return;
      }
      final fileSize = await File(file.path).length();
      if (fileSize > AppConstants.maxPhotoSizeBytes) {
        widget.onError?.call('Photo must be under 5MB.');
        return;
      }
      setState(() => _selectedFile = file);
      widget.onImagePicked?.call(file);
    } catch (error) {
      widget.onError?.call('Unable to capture photo. Please try again.');
    } finally {
      if (mounted) {
        setState(() => _isPicking = false);
      }
    }
  }
}

class _SelectedFileTile extends StatelessWidget {
  const _SelectedFileTile({required this.file});

  final XFile file;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.check_circle_outline, color: AppColors.success),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              file.name,
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
