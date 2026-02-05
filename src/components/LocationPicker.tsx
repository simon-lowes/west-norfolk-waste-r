import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { MapPin, Check, AlertCircle } from 'lucide-react-native';
import { Button } from './Button';
import { useLocation } from '../hooks';

interface LocationPickerProps {
  location: { latitude: number; longitude: number } | null;
  onLocationSelected: (location: { latitude: number; longitude: number } | null) => void;
}

export function LocationPicker({ location, onLocationSelected }: LocationPickerProps) {
  const { colors, layout } = useTheme();
  const { requestLocation, isLoading, error } = useLocation();

  const handleGetLocation = async () => {
    const coords = await requestLocation();
    if (coords) {
      onLocationSelected(coords);
    }
  };

  const clearLocation = () => {
    onLocationSelected(null);
  };

  if (location) {
    return (
      <View
        style={[
          styles.locationCard,
          {
            backgroundColor: colors.surfaceSecondary,
            borderRadius: layout.radiusMedium,
          },
        ]}
      >
        <View style={styles.locationInfo}>
          <Check size={18} color={colors.success} strokeWidth={2} />
          <View style={styles.locationText}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Location captured
            </Text>
            <Text style={[styles.coordinates, { color: colors.textSecondary }]}>
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          </View>
        </View>
        <Button
          title="Clear"
          variant="ghost"
          size="small"
          onPress={clearLocation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={isLoading ? 'Getting location...' : 'Add Current Location'}
        variant="outline"
        onPress={handleGetLocation}
        loading={isLoading}
        icon={
          !isLoading ? (
            <MapPin size={18} color={colors.text} strokeWidth={2} />
          ) : undefined
        }
      />
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} strokeWidth={2} />
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 10,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 12,
    marginTop: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  error: {
    marginLeft: 6,
    fontSize: 13,
  },
});
