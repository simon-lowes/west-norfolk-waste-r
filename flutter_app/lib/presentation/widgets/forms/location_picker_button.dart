import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../../../config/theme/colors.dart';

class LocationPickerButton extends StatefulWidget {
  const LocationPickerButton({
    super.key,
    this.onLocationPicked,
    this.onError,
    this.label = 'Use my location',
  });

  final ValueChanged<Position>? onLocationPicked;
  final ValueChanged<String>? onError;
  final String label;

  @override
  State<LocationPickerButton> createState() => _LocationPickerButtonState();
}

class _LocationPickerButtonState extends State<LocationPickerButton> {
  Position? _lastPosition;
  bool _isFetching = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        OutlinedButton.icon(
          onPressed: _isFetching ? null : _requestLocation,
          icon: _isFetching
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.my_location_outlined),
          label: Text(_isFetching ? 'Locating…' : widget.label),
        ),
        if (_lastPosition != null) ...[
          const SizedBox(height: 8),
          Text(
            'Lat ${_lastPosition!.latitude.toStringAsFixed(5)}, '
            'Lng ${_lastPosition!.longitude.toStringAsFixed(5)}',
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(color: AppColors.darkGrey),
          ),
        ],
      ],
    );
  }

  Future<void> _requestLocation() async {
    setState(() => _isFetching = true);
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        widget.onError?.call('Enable location services to continue.');
        return;
      }

      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        widget.onError?.call('Location permission denied.');
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() => _lastPosition = position);
      widget.onLocationPicked?.call(position);
    } catch (_) {
      widget.onError?.call('Unable to access your location.');
    } finally {
      if (mounted) {
        setState(() => _isFetching = false);
      }
    }
  }
}
