import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, areFontsLoaded, typography } from '../theme';
import { useProperty, useCollections } from '../hooks';
import { CollectionCard, EmptyState, Button } from '../components';
import { Calendar } from 'lucide-react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type FindBinDayScreenProps = {
  navigation: BottomTabNavigationProp<any>;
};

export function FindBinDayScreen({ navigation }: FindBinDayScreenProps) {
  const { colors, layout } = useTheme();
  const { width } = useWindowDimensions();
  const { selectedProperty } = useProperty();
  const { collections } = useCollections(selectedProperty);

  // Calculate columns based on screen width
  const isWide = width > 600;
  const numColumns = isWide ? 2 : 1;

  if (!selectedProperty) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: colors.text },
            areFontsLoaded() && { fontFamily: typography.fontFamily.headline }
          ]}>
            Find Your Bin Day
          </Text>
        </View>
        <EmptyState
          icon={<Calendar size={48} color={colors.textTertiary} strokeWidth={1.5} />}
          title="No property selected"
          message="Please select your property to see your collection schedule"
          action={
            <Button
              title="Select Property"
              onPress={() => navigation.navigate('Settings')}
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[
            styles.title,
            { color: colors.text },
            areFontsLoaded() && { fontFamily: typography.fontFamily.headline }
          ]}>
            Find Your Bin Day
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {selectedProperty.address}
          </Text>
        </View>

        {/* Grid of Collections */}
        {isWide ? (
          <View style={styles.grid}>
            {collections.map((collection, index) => (
              <View key={collection.binType} style={styles.gridItem}>
                <CollectionCard
                  binType={collection.binType}
                  date={collection.date}
                  daysUntil={collection.daysUntil}
                  index={index}
                />
              </View>
            ))}
          </View>
        ) : (
          <View>
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.binType}
                binType={collection.binType}
                date={collection.date}
                daysUntil={collection.daysUntil}
                index={index}
              />
            ))}
          </View>
        )}

        {/* Legend */}
        <View style={[styles.legendCard, { backgroundColor: colors.surfaceSecondary, borderRadius: layout.radiusMedium }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>
            Collection Schedule
          </Text>
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Collections are scheduled for the same day each week. Put your bin out by 7am on collection day.
            Garden waste collection requires a subscription.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
  },
  legendCard: {
    marginTop: 16,
    padding: 16,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
