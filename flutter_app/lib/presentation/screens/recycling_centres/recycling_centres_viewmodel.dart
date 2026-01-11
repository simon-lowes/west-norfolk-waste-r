import 'dart:math' as math;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';

import '../../../data/models/recycling_centre.dart';
import '../../providers/recycling_centres_provider.dart';

class RecyclingCentresState {
  const RecyclingCentresState({
    required this.centres,
    this.userLocation,
    this.locationError,
    this.isLoadingLocation = false,
    this.sortByDistance = false,
  });

  final AsyncValue<List<RecyclingCentre>> centres;
  final Position? userLocation;
  final String? locationError;
  final bool isLoadingLocation;
  final bool sortByDistance;

  RecyclingCentresState copyWith({
    AsyncValue<List<RecyclingCentre>>? centres,
    Position? userLocation,
    String? locationError,
    bool? isLoadingLocation,
    bool? sortByDistance,
    bool clearLocationError = false,
    bool clearUserLocation = false,
  }) {
    return RecyclingCentresState(
      centres: centres ?? this.centres,
      userLocation: clearUserLocation ? null : (userLocation ?? this.userLocation),
      locationError: clearLocationError ? null : (locationError ?? this.locationError),
      isLoadingLocation: isLoadingLocation ?? this.isLoadingLocation,
      sortByDistance: sortByDistance ?? this.sortByDistance,
    );
  }

  /// Get centres sorted by distance if user location is available and sorting enabled.
  List<RecyclingCentre> getSortedCentres(List<RecyclingCentre> centres) {
    if (userLocation == null || !sortByDistance) {
      return centres;
    }

    final sorted = List<RecyclingCentre>.from(centres);
    sorted.sort((a, b) {
      final distA = _calculateDistance(
        userLocation!.latitude,
        userLocation!.longitude,
        a.latitude,
        a.longitude,
      );
      final distB = _calculateDistance(
        userLocation!.latitude,
        userLocation!.longitude,
        b.latitude,
        b.longitude,
      );
      return distA.compareTo(distB);
    });
    return sorted;
  }

  /// Calculate distance in kilometers using Haversine formula.
  double _calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    const earthRadiusKm = 6371.0;
    final dLat = _toRadians(lat2 - lat1);
    final dLon = _toRadians(lon2 - lon1);
    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(lat1)) *
            math.cos(_toRadians(lat2)) *
            math.sin(dLon / 2) *
            math.sin(dLon / 2);
    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  double _toRadians(double degrees) => degrees * math.pi / 180;

  /// Get distance from user to a centre in kilometers.
  double? getDistanceTocentre(RecyclingCentre centre) {
    if (userLocation == null) return null;
    return _calculateDistance(
      userLocation!.latitude,
      userLocation!.longitude,
      centre.latitude,
      centre.longitude,
    );
  }
}

final recyclingCentresViewModelProvider =
    AutoDisposeNotifierProvider<RecyclingCentresViewModel, RecyclingCentresState>(
  RecyclingCentresViewModel.new,
);

class RecyclingCentresViewModel
    extends AutoDisposeNotifier<RecyclingCentresState> {
  @override
  RecyclingCentresState build() {
    final centres = ref.watch(recyclingCentresProvider);
    return RecyclingCentresState(centres: centres);
  }

  Future<void> refreshCentres() async {
    final _ = await ref.refresh(recyclingCentresProvider.future);
  }

  /// Request user location for distance calculation.
  Future<void> requestLocation() async {
    state = state.copyWith(
      isLoadingLocation: true,
      clearLocationError: true,
    );

    try {
      // Check if location services are enabled
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        state = state.copyWith(
          isLoadingLocation: false,
          locationError: 'Location services are disabled. Please enable them in your device settings.',
        );
        return;
      }

      // Check permission status
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied) {
        state = state.copyWith(
          isLoadingLocation: false,
          locationError: 'Location permission denied. Tap to try again.',
        );
        return;
      }

      if (permission == LocationPermission.deniedForever) {
        state = state.copyWith(
          isLoadingLocation: false,
          locationError: 'Location permission permanently denied. Please enable in Settings.',
        );
        return;
      }

      // Get current position
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
      );

      state = state.copyWith(
        userLocation: position,
        isLoadingLocation: false,
        sortByDistance: true,
        clearLocationError: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoadingLocation: false,
        locationError: 'Unable to get your location. Please try again.',
      );
    }
  }

  /// Toggle sorting by distance (only works if location is available).
  void toggleSortByDistance() {
    if (state.userLocation != null) {
      state = state.copyWith(sortByDistance: !state.sortByDistance);
    }
  }

  /// Clear user location and reset to default sorting.
  void clearLocation() {
    state = state.copyWith(
      clearUserLocation: true,
      sortByDistance: false,
      clearLocationError: true,
    );
  }
}
