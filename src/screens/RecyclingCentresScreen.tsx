import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, areFontsLoaded, typography } from '../theme';
import { useLocation } from '../hooks';
import { mockRecyclingCentres } from '../data';
import { RecyclingCentre } from '../types';
import { formatDistanceMiles, sortByDistance } from '../utils';
import { Card, Button, EmptyState } from '../components';
import { MapPin, Clock, Phone, Navigation, Building2 } from 'lucide-react-native';

export function RecyclingCentresScreen() {
  const { colors, layout } = useTheme();
  const { location, requestLocation, isLoading } = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Sort centres by distance if location available
  const sortedCentres = useMemo(() => {
    if (location) {
      return sortByDistance(mockRecyclingCentres, location.latitude, location.longitude);
    }
    return mockRecyclingCentres.map((c) => ({ ...c, distance: null as number | null }));
  }, [location]);

  const openDirections = (centre: RecyclingCentre) => {
    const url = `https://maps.apple.com/?daddr=${centre.latitude},${centre.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps');
    });
  };

  const callCentre = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Could not make call');
    });
  };

  const renderCentre = ({ item }: { item: typeof sortedCentres[0] }) => {
    const isExpanded = expanded === item.id;

    return (
      <Card
        style={styles.centreCard}
        onPress={() => setExpanded(isExpanded ? null : item.id)}
      >
        <View style={styles.centreHeader}>
          <View style={[styles.centreIcon, { backgroundColor: colors.centre + '15' }]}>
            <Building2 size={20} color={colors.centre} strokeWidth={2} />
          </View>
          <View style={styles.centreInfo}>
            <Text style={[styles.centreName, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.distance !== null && (
              <Text style={[styles.centreDistance, { color: colors.primary }]}>
                {formatDistanceMiles(item.distance)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.centreDetails}>
          <View style={styles.detailRow}>
            <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.address}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.openingHours}
            </Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
              {item.notes}
            </Text>

            <Text style={[styles.materialsTitle, { color: colors.text }]}>
              Materials Accepted
            </Text>
            <View style={styles.materialsGrid}>
              {item.materialsAccepted.slice(0, 9).map((material, index) => (
                <View
                  key={index}
                  style={[styles.materialBadge, { backgroundColor: colors.surfaceSecondary }]}
                >
                  <Text style={[styles.materialText, { color: colors.textSecondary }]}>
                    {material}
                  </Text>
                </View>
              ))}
              {item.materialsAccepted.length > 9 && (
                <View style={[styles.materialBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.materialText, { color: colors.textTertiary }]}>
                    +{item.materialsAccepted.length - 9} more
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <Button
                title="Get Directions"
                variant="primary"
                size="small"
                onPress={() => openDirections(item)}
                icon={<Navigation size={16} color="#FFFFFF" strokeWidth={2} />}
                style={styles.actionButton}
              />
              <Button
                title="Call"
                variant="outline"
                size="small"
                onPress={() => callCentre(item.phoneNumber)}
                icon={<Phone size={16} color={colors.text} strokeWidth={2} />}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: colors.text },
          areFontsLoaded() && { fontFamily: typography.fontFamily.headline }
        ]}>
          Recycling Centres
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Household Waste Recycling Centres
        </Text>
      </View>

      {/* Location Button */}
      {!location && (
        <View style={styles.locationPrompt}>
          <Button
            title="Sort by distance"
            variant="outline"
            size="small"
            onPress={requestLocation}
            loading={isLoading}
            icon={<MapPin size={16} color={colors.text} strokeWidth={2} />}
          />
        </View>
      )}

      {/* Centres List */}
      <FlatList
        data={sortedCentres}
        renderItem={renderCentre}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  locationPrompt: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  centreCard: {
    marginBottom: 12,
  },
  centreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  centreIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  centreInfo: {
    flex: 1,
  },
  centreName: {
    fontSize: 16,
    fontWeight: '600',
  },
  centreDistance: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  centreDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  materialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  materialBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  materialText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
