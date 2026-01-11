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
        Row(
          children: [
            FilledButton.icon(
              onPressed: _isPicking ? null : () => _pickImage(ImageSource.camera),
              icon: _isPicking
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.photo_camera_outlined),
              label: Text(_isPicking ? 'Loading…' : 'Camera'),
            ),
            const SizedBox(width: 12),
            OutlinedButton.icon(
              onPressed: _isPicking ? null : () => _pickImage(ImageSource.gallery),
              icon: const Icon(Icons.photo_library_outlined),
              label: const Text('Gallery'),
            ),
          ],
        ),
        if (_selectedFile != null) ...[
          const SizedBox(height: 12),
          _SelectedFileTile(
            file: _selectedFile!,
            onRemove: _removePhoto,
          ),
        ],
      ],
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    setState(() => _isPicking = true);
    try {
      final file = await _picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );
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
      final sourceLabel = source == ImageSource.camera ? 'capture' : 'select';
      widget.onError?.call('Unable to $sourceLabel photo. Please try again.');
    } finally {
      if (mounted) {
        setState(() => _isPicking = false);
      }
    }
  }

  void _removePhoto() {
    setState(() => _selectedFile = null);
  }
}

class _SelectedFileTile extends StatelessWidget {
  const _SelectedFileTile({
    required this.file,
    this.onRemove,
  });

  final XFile file;
  final VoidCallback? onRemove;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.success.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(
              File(file.path),
              width: 48,
              height: 48,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 48,
                height: 48,
                color: AppColors.lightGrey,
                child: const Icon(Icons.image, color: AppColors.darkGrey),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.check_circle,
                      color: AppColors.success,
                      size: 16,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Photo attached',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.darkText,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  file.name,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.darkGrey,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (onRemove != null)
            IconButton(
              onPressed: onRemove,
              icon: const Icon(Icons.close, size: 20),
              tooltip: 'Remove photo',
              style: IconButton.styleFrom(
                foregroundColor: AppColors.darkGrey,
              ),
            ),
        ],
      ),
    );
  }
}
